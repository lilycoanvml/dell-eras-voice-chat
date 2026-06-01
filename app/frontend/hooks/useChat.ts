'use client';

import { useState, useCallback, useRef } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface EraProduct {
  name: string;
  tagline: string;
  price: string;
  originalPrice: string;
  savings: string;
  description: string;
  category: string;
  badge: string;
}

export interface EraData {
  name: string;
  tagline: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface EraRevealPayload {
  type: 'era_reveal';
  era: EraData;
  products: EraProduct[];
  closingMessage: string;
}

export type ChatState = 'idle' | 'loading' | 'era_revealed' | 'error';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [state, setState] = useState<ChatState>('idle');
  const [eraReveal, setEraReveal] = useState<EraRevealPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const questionCount = useRef(0);

  const addMessage = useCallback((role: 'user' | 'assistant', content: string): ChatMessage => {
    const msg: ChatMessage = {
      id: `${Date.now()}-${Math.random()}`,
      role,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, msg]);
    return msg;
  }, []);

  const sendMessage = useCallback(
    async (userInput: string) => {
      if (!userInput.trim() || state === 'loading' || state === 'era_revealed') return;

      setError(null);
      setState('loading');

      const userMsg = addMessage('user', userInput.trim());
      if (userMsg.role === 'user') questionCount.current += 1;

      const conversationHistory = [
        ...messages,
        { role: 'user' as const, content: userInput.trim() },
      ].map((m) => ({ role: m.role, content: m.content }));

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: conversationHistory }),
        });

        if (!res.ok) throw new Error('API error');

        const data = await res.json();

        if (data.type === 'era_reveal') {
          setEraReveal(data.data);
          setState('era_revealed');
        } else {
          addMessage('assistant', data.content);
          setState('idle');
        }
      } catch (err) {
        console.error(err);
        setError('Something went wrong. Please try again.');
        setState('error');
      }
    },
    [messages, state, addMessage]
  );

  const startConversation = useCallback(async () => {
    if (messages.length > 0) return;
    setState('loading');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: 'Hi, I want to find my next era.' }] }),
      });

      if (!res.ok) throw new Error('API error');
      const data = await res.json();

      addMessage('user', 'Hi, I want to find my next era.');
      addMessage('assistant', data.content || data.data?.closingMessage || 'Welcome.');
      setState('idle');
    } catch {
      setError('Could not connect. Please refresh and try again.');
      setState('error');
    }
  }, [messages.length, addMessage]);

  const reset = useCallback(() => {
    setMessages([]);
    setState('idle');
    setEraReveal(null);
    setError(null);
    questionCount.current = 0;
  }, []);

  return {
    messages,
    state,
    eraReveal,
    error,
    questionCount: questionCount.current,
    sendMessage,
    startConversation,
    reset,
  };
}
