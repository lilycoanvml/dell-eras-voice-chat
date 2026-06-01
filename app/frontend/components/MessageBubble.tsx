'use client';

import { useEffect, useRef, useState } from 'react';
import type { ChatMessage } from '@/app/frontend/hooks/useChat';

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const isUser = message.role === 'user';

  return (
    <div
      ref={ref}
      className={`flex transition-all duration-500 ${isUser ? 'justify-end' : 'justify-start'}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(10px)',
      }}
    >
      {/* AI avatar */}
      {!isUser && (
        <div className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 border border-white/10 flex items-center justify-center mr-2.5 mt-0.5">
          <span className="text-white/60 text-xs">✦</span>
        </div>
      )}

      <div
        className={`max-w-[80%] md:max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bubble-user text-white/90 rounded-br-sm'
            : 'bubble-ai text-white/80 rounded-bl-sm'
        }`}
      >
        {message.content.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            {i < message.content.split('\n').length - 1 && <br />}
          </span>
        ))}
      </div>
    </div>
  );
}
