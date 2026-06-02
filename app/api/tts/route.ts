import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { NextRequest, NextResponse } from 'next/server';

const client = new TextToSpeechClient();

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text?.trim()) return NextResponse.json({ error: 'No text' }, { status: 400 });

    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: {
        languageCode: 'en-US',
        name: 'en-US-Journey-F',  // Google's most natural conversational female voice
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1.08,
        volumeGainDb: 1.0,
      },
    });

    const audio = Buffer.from(response.audioContent as Uint8Array).toString('base64');
    return NextResponse.json({ audio });
  } catch (err) {
    console.error('TTS error:', err);
    return NextResponse.json({ error: 'TTS unavailable' }, { status: 500 });
  }
}
