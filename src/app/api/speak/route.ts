import { NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM'; // Using Rachel voice

export async function POST(request: Request) {
  try {
    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
    if (!ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: 'Missing ELEVENLABS_API_KEY environment variable' },
        { status: StatusCodes.INTERNAL_SERVER_ERROR }
      );
    }

    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'No text provided' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const response = await fetch(`${ELEVENLABS_API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    const audioBlob = await response.blob();
    const audioBuffer = await audioBlob.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('Error converting text to speech:', error);
    return NextResponse.json(
      { error: 'Failed to convert text to speech' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}