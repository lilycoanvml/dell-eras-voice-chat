import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

type FollowUpProduct = {
  name: string;
  category: string;
  price: string;
  originalPrice: string;
  savings: string;
  description: string;
  productUrl?: string;
};

type FollowUpContext = {
  userName?: string;
  eraName: string;
  eraTagline: string;
  eraDescription?: string;
  discoverySummary?: string; // brief summary of what user said during discovery
  products: FollowUpProduct[];
};

function buildSystemPrompt(ctx: FollowUpContext) {
  const lines = ctx.products.map(p =>
    `- ${p.name} (${p.category}) — ${p.price} (was ${p.originalPrice}, save ${p.savings}). Why: ${p.description}${p.productUrl ? `\n  Dell.com: ${p.productUrl}` : ''}`
  ).join('\n');

  return `You are Ali — the same warm, witty friend who just helped ${ctx.userName ? ctx.userName : 'this person'} discover their **${ctx.eraName}**. The era reveal is done. Now you're hanging out to answer any follow-up questions they have about their setup.

## CONTEXT
Their era: ${ctx.eraName} — "${ctx.eraTagline}"
${ctx.eraDescription ? `Era description: ${ctx.eraDescription}` : ''}
${ctx.userName ? `Their name: ${ctx.userName}` : ''}
${ctx.discoverySummary ? `What they shared during discovery:\n${ctx.discoverySummary}` : ''}

Their recommended setup:
${lines}

## HOW TO RESPOND
- Answer questions about the products: specs, what they're good for, comparisons, why one might suit them better than another, what to consider.
- Use what you know about Dell laptops, monitors, docks, accessories from general knowledge. Be specific where you can (CPU families, panel types, port counts, weight, battery life).
- If they ask about exact current pricing, stock, configurations, or recent revisions — be honest: "I'd check the Dell.com page for the latest on that" and reference the product link.
- If they ask about something you genuinely don't know, say so plainly. Don't make up specs.
- Stay in character: warm, conversational, occasionally funny. 2-4 sentences per answer unless they ask something complex.
- Use their name occasionally (not every message). Reference their era when it adds context.
- Never use markdown formatting (no *, _, bullets, bold). Your messages may be spoken out loud.
- Never push other Dell products outside their setup unless they ask. This is their era, not a catalog.

## IF THEY GO OFF-TOPIC
If they ask about something unrelated to their setup or Dell tech, gently bring it back: "I'm here for your ${ctx.eraName} setup specifically — what would you like to know about your gear?"

## FORMAT
Plain conversational text. No JSON. No lists with bullet symbols.`;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json() as {
      messages: { role: 'user' | 'assistant'; content: string }[];
      context: FollowUpContext;
    };

    if (!messages?.length || !context?.eraName) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      systemInstruction: buildSystemPrompt(context),
    });

    // Gemini's startChat requires history to start with a 'user' message.
    // Drop any leading assistant messages (e.g. the panel's local greeting).
    const trimmed = [...messages];
    while (trimmed.length > 0 && trimmed[0].role === 'assistant') trimmed.shift();
    if (trimmed.length === 0) return NextResponse.json({ error: 'No user message' }, { status: 400 });

    const history = trimmed.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
    const last = trimmed[trimmed.length - 1];

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(last.content);
    const content = result.response.text().trim();

    return NextResponse.json({ content });
  } catch (err) {
    console.error('ask-ali error:', err);
    return NextResponse.json({ error: 'Ali is having a moment — try again?' }, { status: 500 });
  }
}
