'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChat } from '@/app/frontend/hooks/useChat';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import EraReveal from './EraReveal';

export default function ChatInterface() {
  const router = useRouter();
  const { messages, state, eraReveal, error, sendMessage, startConversation, reset } = useChat();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [started, setStarted] = useState(false);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, state, eraReveal]);

  // Auto-focus input
  useEffect(() => {
    if (state === 'idle' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [state]);

  const handleStart = async () => {
    setStarted(true);
    await startConversation();
  };

  const handleSend = async () => {
    const val = input.trim();
    if (!val || state === 'loading') return;
    setInput('');
    await sendMessage(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    reset();
    setStarted(false);
    setInput('');
  };

  const totalMessages = messages.length;
  const progress = Math.min(totalMessages / 11, 1); // ~11 messages for full convo

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0A0A0F]/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="text-white/30 hover:text-white/70 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="w-6 h-6 bg-[#007DB8] rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">D</span>
          </div>
          <span className="text-white/50 text-sm tracking-widest uppercase">Find Your Next Era</span>
        </div>

        {/* Progress bar */}
        {started && (
          <div className="flex items-center gap-3">
            <div className="w-24 h-0.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-700"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <span className="text-white/25 text-xs">{state === 'era_revealed' ? 'Complete' : 'Discovering...'}</span>
          </div>
        )}

        {started && (
          <button
            onClick={handleReset}
            className="text-white/20 hover:text-white/50 text-xs transition-colors"
          >
            Start over
          </button>
        )}
      </header>

      {/* Chat area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 md:px-8 py-8 max-w-2xl mx-auto w-full"
      >
        {!started ? (
          /* Pre-start state */
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-8">
            <div>
              <p className="text-white/30 text-xs tracking-widest uppercase mb-3">Dell Technologies × Black Friday</p>
              <h2 className="text-3xl md:text-4xl font-light text-white mb-3">
                Something is shifting for you.
              </h2>
              <p className="text-white/40 text-base max-w-sm mx-auto leading-relaxed">
                I can feel it. This isn't about deals —<br /> it's about what you're becoming.
              </p>
            </div>
            <button
              onClick={handleStart}
              className="group flex items-center gap-2 bg-white text-[#0A0A0F] font-semibold px-7 py-3.5 rounded-full transition-all duration-200 hover:bg-white/90 hover:scale-105 active:scale-95"
            >
              I'm ready
              <svg
                className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        ) : (
          /* Messages */
          <div className="space-y-4">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {state === 'loading' && <TypingIndicator />}

            {error && (
              <div className="flex justify-center">
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl max-w-sm text-center">
                  {error}
                  <button
                    onClick={() => window.location.reload()}
                    className="block mx-auto mt-2 text-red-300 underline text-xs"
                  >
                    Refresh page
                  </button>
                </div>
              </div>
            )}

            {eraReveal && <EraReveal data={eraReveal} />}

            {state === 'era_revealed' && (
              <div className="flex justify-center pt-4 pb-8">
                <button
                  onClick={handleReset}
                  className="text-white/30 hover:text-white/60 text-sm underline underline-offset-4 transition-colors"
                >
                  Discover another era
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input area */}
      {started && state !== 'era_revealed' && (
        <div className="sticky bottom-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F] to-transparent pt-6 pb-6 px-4 md:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-end gap-3 bg-[#12121A] border border-white/8 rounded-2xl px-4 py-3 focus-within:border-white/20 transition-colors">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={state === 'loading' ? 'Listening...' : 'Share your thoughts...'}
                disabled={state === 'loading'}
                rows={1}
                className="flex-1 bg-transparent text-white placeholder-white/25 text-sm resize-none outline-none leading-relaxed max-h-32 disabled:opacity-50"
                style={{ scrollbarWidth: 'none' }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || state === 'loading'}
                className="shrink-0 w-8 h-8 rounded-xl bg-[#007DB8] disabled:bg-white/10 disabled:text-white/20 text-white flex items-center justify-center transition-all hover:bg-[#0090D4] active:scale-95 disabled:cursor-not-allowed"
              >
                <svg className="w-3.5 h-3.5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19V5m-7 7l7-7 7 7" />
                </svg>
              </button>
            </div>
            <p className="text-center text-white/15 text-xs mt-2">
              Press Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
