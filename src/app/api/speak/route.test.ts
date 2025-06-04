import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextResponse } from 'next/server';
import { POST } from './route';

// Mock the environment variable
vi.mock('process', async () => {
  const actual = await vi.importActual('process');
  return {
    ...actual,
    env: {
      ...actual.env,
      ELEVENLABS_API_KEY: 'mock-elevenlabs-api-key',
    },
  };
});

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock Blob and ArrayBuffer
global.Blob = vi.fn().mockImplementation((content, options) => ({
  arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
  type: options?.type || '',
}));

// Create NextResponse mock
vi.mock('next/server', async () => {
  const actual = await vi.importActual('next/server');
  return {
    ...actual,
    NextResponse: {
      json: vi.fn((data, options) => ({ data, options })),
      ...actual.NextResponse,
    },
  };
});

describe('POST API Route', () => {
  const mockRequest = (body: any) => {
    return {
      json: vi.fn().mockResolvedValue(body),
    } as unknown as Request;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return 400 when no text is provided', async () => {
    const request = mockRequest({ text: '' });
    
    const response = await POST(request);
    
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'No text provided' },
      { status: 400 }
    );
  });

  it('should return 500 when ElevenLabs API call fails', async () => {
    const request = mockRequest({ text: 'Hello, world!' });
    
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Internal Server Error',
    });
    
    const response = await POST(request);
    
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Failed to convert text to speech' },
      { status: 500 }
    );
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should return audio response when successful', async () => {
    const request = mockRequest({ text: 'Hello, world!' });
    const mockAudioBuffer = new ArrayBuffer(8);
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      blob: vi.fn().mockResolvedValue({
        arrayBuffer: vi.fn().mockResolvedValue(mockAudioBuffer),
      }),
    });
    
    const response = await POST(request);
    
    expect(response).toBeInstanceOf(NextResponse);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': 'mock-elevenlabs-api-key',
        },
        body: JSON.stringify({
          text: 'Hello, world!',
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );
  });

  it('should handle exceptions during request processing', async () => {
    const request = mockRequest({});
    request.json.mockRejectedValueOnce(new Error('Failed to parse JSON'));
    
    const response = await POST(request);
    
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Failed to convert text to speech' },
      { status: 500 }
    );
  });
});
