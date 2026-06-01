'use client';

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-2.5 justify-start">
      <div className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 border border-white/10 flex items-center justify-center">
        <span className="text-white/60 text-xs">✦</span>
      </div>
      <div className="bubble-ai px-4 py-3.5 rounded-2xl rounded-bl-sm">
        <div className="flex gap-1.5 items-center h-3">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-white/40"
              style={{
                animation: 'typingDot 1.4s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes typingDot {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
