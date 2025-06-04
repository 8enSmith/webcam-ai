import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { POST } from '../route';
import { server } from './setup';
import { http, HttpResponse } from 'msw';
import { StatusCodes } from 'http-status-codes';

// Set up environment variables before tests
beforeEach(() => {
  process.env.OPENROUTER_API_KEY = 'test-api-key';
  process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
});

// Clean up environment variables after tests
afterEach(() => {
  delete process.env.OPENROUTER_API_KEY;
  delete process.env.NEXT_PUBLIC_APP_URL;
});

describe('POST /api/analyze', () => {
  it('should return 400 if no image is provided', async () => {
    const request = new Request('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect(data).toEqual({ error: 'No image provided' });
  });

  it('should successfully analyze an image', async () => {
    const mockImage = 'data:image/jpeg;base64,test-image-data';
    const mockAnalysis = 'Oh fairest Queen, I see before me...';

    // Override the default handler for this test
    server.use(
      http.post('https://openrouter.ai/api/v1/chat/completions', () => {
        return HttpResponse.json({
          choices: [{ message: { content: mockAnalysis } }],
        });
      })
    );

    const request = new Request('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ image: mockImage }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(StatusCodes.OK);
    expect(data).toEqual({ analysis: mockAnalysis });
  });

  it('should handle OpenRouter API errors', async () => {
    const mockImage = 'data:image/jpeg;base64,test-image-data';

    // Override the default handler to simulate an API error
    server.use(
      http.post('https://openrouter.ai/api/v1/chat/completions', () => {
        return new HttpResponse(null, { status: StatusCodes.INTERNAL_SERVER_ERROR, statusText: 'API Error' });
      })
    );

    const request = new Request('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ image: mockImage }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(data).toEqual({ error: 'Failed to analyze image' });
  });

  it('should handle missing analysis in API response', async () => {
    const mockImage = 'data:image/jpeg;base64,test-image-data';

    // Override the default handler to return empty choices
    server.use(
      http.post('https://openrouter.ai/api/v1/chat/completions', () => {
        return HttpResponse.json({ choices: [] });
      })
    );

    const request = new Request('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ image: mockImage }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(data).toEqual({ error: 'Failed to analyze image' });
  });

  it('should throw error if OPENROUTER_API_KEY is not set', async () => {
    // Temporarily remove the API key
    delete process.env.OPENROUTER_API_KEY;

    const request = new Request('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ image: 'test-image' }),
    });

    const response = await POST(request);
    const data = await response.json();
    expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(data).toEqual({ error: 'Failed to analyze image' });

    // Restore the API key
    process.env.OPENROUTER_API_KEY = 'test-api-key';
  });
}); 