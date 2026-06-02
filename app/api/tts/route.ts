import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { NextRequest, NextResponse } from 'next/server';

const client = new TextToSpeechClient();

// Strip markdown formatting so Journey-F doesn't read symbols out loud
function cleanForSpeech(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')   // **bold**
    .replace(/\*(.+?)\*/g, '$1')       // *italic* / *emphasis*
    .replace(/__(.+?)__/g, '$1')       // __bold__
    .replace(/_(.+?)_/g, '$1')         // _italic_
    .replace(/`(.+?)`/g, '$1')         // `code`
    .replace(/^\s*[-*+]\s+/gm, '')     // leading bullet markers
    .replace(/\s+\*\s+/g, ' ')         // stray inline asterisks
    .replace(/[*_`#]/g, '')            // any remaining stragglers
    .replace(/\s{2,}/g, ' ')           // collapse extra spaces
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text?.trim()) return NextResponse.json({ error: 'No text' }, { status: 400 });

    const spoken = cleanForSpeech(text);

    const [response] = await client.synthesizeSpeech({
      input: { text: spoken },
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
