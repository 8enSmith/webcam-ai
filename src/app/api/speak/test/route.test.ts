import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { StatusCodes } from 'http-status-codes';
import { POST } from '../route';
import { server, mockAudioData } from './setup';

interface RequestBody {
  text: string;
}

describe('POST /api/speak', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('should return audio data when valid text is provided', async () => {
    const request = new Request('http://localhost:3000/api/speak', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: 'Hello, world!' }),
    });

    const response = await POST(request);
    const responseData = await response.arrayBuffer();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('audio/mpeg');
    expect(new Uint8Array(responseData)).toEqual(mockAudioData);
  });

  it('should return 400 when no text is provided', async () => {
    const request = new Request('http://localhost:3000/api/speak', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect(data).toEqual({ error: 'No text provided' });
  });

  it('should return 500 when API key is missing', async () => {
    // Temporarily remove API key
    const originalApiKey = process.env.ELEVENLABS_API_KEY;
    delete process.env.ELEVENLABS_API_KEY;

    const request = new Request('http://localhost:3000/api/speak', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: 'Hello, world!' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(data).toEqual({ error: 'Missing ELEVENLABS_API_KEY environment variable' });

    // Restore API key
    process.env.ELEVENLABS_API_KEY = originalApiKey;
  });

  it('should return 500 when ElevenLabs API returns an error', async () => {
    // Override the default handler for this test
    server.use(
      http.post('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', () => {
        return new HttpResponse(null, { status: StatusCodes.INTERNAL_SERVER_ERROR });
      })
    );

    const request = new Request('http://localhost:3000/api/speak', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: 'Hello, world!' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(data).toEqual({ error: 'Failed to convert text to speech' });
  });
}); 