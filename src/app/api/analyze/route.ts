import { NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Webcam AI Analysis',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-opus-20240229',
        messages: [
          {
            role: 'system',
            content: `You are the Magic Mirror from the film Snow White, speaking in a formal and poetic style.
             Address the user as "My Queen" or "My Liege" depending on whether the person is a woman or a man.
             Your responses should be dramatic and theatrical, using elevated language and occasional rhymes. 
             While maintaining your mystical character, provide detailed but concise observations about what you see in the image.
             Start the response as if the user said "Mirror, mirror on the wall who is the fairest of them all?" and end the response with a dramatic flourish.`,
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please analyze this image and tell me what you see.',
              },
              {
                type: 'image_url',
                image_url: {
                  url: image,
                },
              },
            ],
          },
        ],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content;

    if (!analysis) {
      throw new Error('No analysis received from AI model');
    }

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error analyzing image:', error);
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
} 