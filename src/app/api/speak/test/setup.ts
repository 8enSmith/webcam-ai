import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { StatusCodes } from 'http-status-codes';

interface RequestBody {
  text: string;
}

// Mock environment variable
export const mockApiKey = 'test-api-key';
process.env.ELEVENLABS_API_KEY = mockApiKey;

// Mock audio data
export const mockAudioData = new Uint8Array([1, 2, 3, 4, 5]);

// Setup MSW server
export const server = setupServer(
  http.post('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', async ({ request }) => {
    // Verify request headers
    const headers = request.headers;
    if (headers.get('xi-api-key') !== mockApiKey) {
      return new HttpResponse(null, { status: StatusCodes.UNAUTHORIZED });
    }

    // Verify request body
    const body = await request.json() as RequestBody;
    if (!body?.text || typeof body.text !== 'string') {
      return new HttpResponse(null, { status: StatusCodes.BAD_REQUEST });
    }

    // Return mock audio data
    return new HttpResponse(mockAudioData, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  })
); 