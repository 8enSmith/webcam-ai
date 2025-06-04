import { http, HttpResponse } from 'msw';

interface OpenRouterRequest {
  messages: Array<{
    content: string;
  }>;
}

export const handlers = [
  http.post('https://openrouter.ai/api/v1/chat/completions', async ({ request }) => {
    const body = await request.json() as OpenRouterRequest;
    
    // Check if the request contains an image
    if (!body?.messages?.[0]?.content?.includes('data:image/jpeg;base64')) {
      return new HttpResponse(null, { status: 400 });
    }

    // Return a successful response with mock analysis
    return HttpResponse.json({
      choices: [{ message: { content: 'Oh fairest Queen, I see before me...' } }],
    });
  }),
]; 