'use client';

import { useEffect, useRef, useState } from 'react';
import { useChat } from '@/app/frontend/hooks/useChat';
import type { EraRevealPayload } from '@/app/frontend/hooks/useChat';

// ─── TYPES ───────────────────────────────────────────────────────────────────
type Screen = 'landing' | 'chat' | 'reveal' | 'recs' | 'share';

// ─── LOOKUP TABLES ───────────────────────────────────────────────────────────
// Product images/URLs keyed by the exact names the API system prompt uses
const PRODUCT_ASSETS: Record<string, { imageUrl: string; productUrl: string }> = {
  'Dell XPS 16': {
    imageUrl: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/16-9640/media-gallery/silver/touch/notebook-laptop-xps-16-9640-t-silver-gallery-2.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=612&qlt=100,1&resMode=sharp2&size=612,402&chrss=full',
    productUrl: 'https://www.dell.com/en-us/shop/dell-laptops/xps-16-laptop/spd/xps-16-9640-laptop',
  },
  'Dell UltraSharp 27 4K Monitor': {
    imageUrl: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/peripherals/monitors/u-series/u2725qe/media-gallery/monitor-ultrasharp-u2725qe-gy-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=804&wid=906&qlt=100,1&resMode=sharp2&size=906,804&chrss=full',
    productUrl: 'https://www.dell.com/en-us/shop/dell-ultrasharp-27-4k-thunderbolt-hub-monitor-u2725qe/apd/210-bqhr/monitors-monitor-accessories',
  },
  'Dell Canvas 27': {
    imageUrl: 'https://i.dell.com/is/image/DellContent/content/dam/images/products/workstations/dell-canvas/kv2718d/canvas-kv2718d-bk-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=527&qlt=100,1&resMode=sharp2&size=527,402&chrss=full',
    productUrl: 'https://www.dell.com/en-us/shop/cty/dell-canvas/spd/dell-canvas-kv2718d',
  },
  'Dell XPS 15 Developer Edition': {
    imageUrl: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/silver/touch/notebook-xps-15-9530-t-silver-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=527&qlt=100,1&resMode=sharp2&size=527,402&chrss=full',
    productUrl: 'https://www.dell.com/en-us/shop/dell-laptops/xps-15-laptop/spd/xps-15-9530-laptop',
  },
  'Dell UltraSharp 32 4K USB-C Monitor': {
    imageUrl: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/peripherals/monitors/u-series/u3224kb/media-gallery/monitor-ultrasharp-u3224kb-gy-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=804&wid=906&qlt=100,1&resMode=sharp2&size=906,804&chrss=full',
    productUrl: 'https://www.dell.com/en-us/shop/dell-ultrasharp-32-4k-thunderbolt-hub-monitor-u3224kb/apd/210-bcfo/monitors-monitor-accessories',
  },
  'Dell Precision 5690': {
    imageUrl: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/workstations/precision-workstations/precision-16-5690/media-gallery/silver/touch/workstation-precision-16-5690-t-silver-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=527&qlt=100,1&resMode=sharp2&size=527,402&chrss=full',
    productUrl: 'https://www.dell.com/en-us/shop/workstations/precision-5690-workstation/spd/precision-16-5690-workstation',
  },
  'Dell Latitude 9550': {
    imageUrl: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/latitude-notebooks/latitude-14-9450-laptop-2-in-1/mg/notebook-latitude-14-9450-t-wlan-gray-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=527&qlt=100,1&resMode=sharp2&size=527,402&chrss=full',
    productUrl: 'https://www.dell.com/en-us/shop/dell-laptops/latitude-9450-2-in-1/spd/latitude-14-9450-2-in-1-laptop',
  },
  'Dell Thunderbolt Dock WD22TB4': {
    imageUrl: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/peripherals/docks/dell-thunderbolt-4-dock-wd22tb4/spi/ng/dock-wd22tb4-black-campaign-hero-504x350-ng.psd?qlt=95&fmt=jpg',
    productUrl: 'https://www.dell.com/en-us/shop/dell-thunderbolt-dock-wd22tb4/apd/210-bdqh/docks',
  },
  'Dell 27 Monitor P2725HE': {
    imageUrl: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/peripherals/monitors/p-series/p2725he/media-gallery/monitor-pseries-p2725he-bk-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=804&wid=907&qlt=100,1&resMode=sharp2&size=907,804&chrss=full',
    productUrl: 'https://www.dell.com/en-us/shop/dell-pro-27-plus-usb-c-hub-monitor-p2725he/apd/210-bmfq/monitors-monitor-accessories',
  },
  'Dell XPS 13': {
    imageUrl: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/9345/media-gallery/touch/silver/xps-13-9345-laptop-silver-copilot-pc-mg.png?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=612&qlt=100,1&resMode=sharp2&size=612,402&chrss=full',
    productUrl: 'https://www.dell.com/en-us/shop/dell-laptops/xps-13-laptop/spd/xps-13-9345-laptop',
  },
  'Dell Pro Wireless Headset WL5022': {
    imageUrl: 'https://i.dell.com/is/image/DellContent/content/dam/images/products/electronics-and-accessories/dell/headphones/wl5022/wl5022-xau-02-bk.psd?fmt=jpg&wid=527&hei=527',
    productUrl: 'https://www.dell.com/en-us/shop/dell-pro-wireless-headset-wl5022/apd/520-aatb/pc-accessories',
  },
  'Dell Power Companion PW7018LC': {
    imageUrl: 'https://i.dell.com/is/image/DellContent/content/dam/images/products/electronics-and-accessories/dell/power-adapters-batteries/pw7018lc/pw7018lc-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=527&qlt=100,1&resMode=sharp2&size=527,402&chrss=full',
    productUrl: 'https://www.dell.com/en-us/shop/dell-notebook-power-bank-plus-usb-c-65wh-pw7018lc/apd/451-bcev/pc-accessories',
  },
  'Dell 40 Curved Conference Monitor': {
    imageUrl: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/peripherals/monitors/u-series/u4025qw/media-gallery/monitor-ultrasharp-u4025qw-gray-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=804&wid=1242&qlt=100,1&resMode=sharp2&size=1242,804&chrss=full',
    productUrl: 'https://www.dell.com/en-us/shop/dell-ultrasharp-40-curved-thunderbolt-hub-monitor-u4025qw/apd/210-bmdp/monitors-monitor-accessories',
  },
  'Dell Premier Wireless KM7321W': {
    imageUrl: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/peripherals/input-devices/dell/keyboards/km7321w/global-spi/ng/dell-keyboard-mouse-km7321w-pdp-relsize-500-ng.psd?fmt=png-alpha',
    productUrl: 'https://www.dell.com/en-us/shop/dell-premier-multi-device-wireless-keyboard-and-mouse-km7321w/apd/580-ajix/pc-accessories',
  },
  'Alienware m18 R2': {
    imageUrl: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/alienware/notebooks/alienware-m18/media-gallery/dark/notebook-alienware-m18-r2-dark-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=612&qlt=100,1&resMode=sharp2&size=612,402&chrss=full',
    productUrl: 'https://www.dell.com/en-us/shop/gaming-laptops/alienware-m18-r2-gaming-laptop/spd/alienware-m18-r2-laptop',
  },
  'Alienware 34 QD-OLED AW3423DWF': {
    imageUrl: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/alienware/monitors/aw3423dwf/media-gallery/monitor-alienware-aw3423dwf-dark-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=804&wid=906&qlt=100,1&resMode=sharp2&size=906,804&chrss=full',
    productUrl: 'https://www.dell.com/en-us/shop/alienware-34-curved-qd-oled-gaming-monitor-aw3423dwf/apd/210-bfrq/monitors-monitor-accessories',
  },
  'Alienware Pro Wireless Gaming Mouse AW920M': {
    imageUrl: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/alienware/accessories/aw920m/media-gallery/dark/mouse-alienware-aw920m-dark-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=527&qlt=100,1&resMode=sharp2&size=527,402&chrss=full',
    productUrl: 'https://www.dell.com/en-us/shop/alienware-pro-wireless-gaming-mouse-aw920m/apd/570-bbdp/pc-accessories',
  },
};

// Traits by era name (from API system prompt eras)
const ERA_TRAITS: Record<string, string[]> = {
  'The Creator Era':    ['Maker', 'Visual', 'Bold'],
  'The Innovator Era':  ['Builder', 'Technical', 'Systematic'],
  'The Achiever Era':   ['Strategic', 'Driven', 'Decisive'],
  'The Explorer Era':   ['Nomadic', 'Curious', 'Adaptive'],
  'The Visionary Era':  ['Ambitious', 'Forward', 'Disruptive'],
  'The Performer Era':  ['Competitive', 'Live', 'Entertaining'],
};

const PROTS: [string, string, string] = ['-2deg', '1.8deg', '-1.1deg'];

// ─── TTS ─────────────────────────────────────────────────────────────────────
// Voice priority: Chrome's Google neural voices first (noticeably better than OS defaults),
// then macOS Australian/UK accents which tend to sound less robotic than US Samantha.
function speak(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  // Peppy but not frantic — slightly higher pitch lifts the energy considerably.
  utterance.rate  = 1.02;
  utterance.pitch = 1.28;
  utterance.volume = 1;

  const voices = window.speechSynthesis.getVoices();

  // Sorted by how "natural and fun" each sounds in practice.
  const preferred =
    voices.find(v => v.name === 'Google UK English Female') || // Chrome: best free neural voice
    voices.find(v => v.name === 'Google US English')          || // Chrome: solid fallback
    voices.find(v => v.name === 'Karen')                       || // macOS: Australian — warm & bright
    voices.find(v => v.name === 'Veena')                       || // macOS: Indian-English — distinctively fun
    voices.find(v => v.name === 'Samantha')                    || // macOS: standard US female
    voices.find(v => v.name.includes('Aria'))                  || // Windows Neural
    voices.find(v => v.lang === 'en-GB' && !v.name.toLowerCase().includes('male')) ||
    voices.find(v => v.lang.startsWith('en') && !v.name.toLowerCase().includes('male'));

  if (preferred) utterance.voice = preferred;
  window.speechSynthesis.speak(utterance);
}

// ─── ICONS ───────────────────────────────────────────────────────────────────
function ChevronLeft({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path d="M11 4l-5 5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronRight({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function MicIcon({ size = 22, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="9" y="2.5" width="6" height="12" rx="3" fill={color} />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M12 17.5V21M8.5 21h7" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function ExtLinkIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M3 11L11 3M5 3h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── ALI ORB ─────────────────────────────────────────────────────────────────
function AliOrb({ size, state = 'idle' }: { size: number; state?: 'idle' | 'listening' | 'thinking' | 'speaking' }) {
  const anim =
    state === 'listening' ? 'orbListen 1.3s ease-in-out infinite'
    : state === 'thinking' ? 'orbThink 2.4s ease-in-out infinite'
    : 'orbIdle 4.5s ease-in-out infinite';
  const haloSize = size * 1.9;
  const haloOffset = -(haloSize - size) / 2;
  return (
    <div className="ali-orb" style={{ width: size, height: size }}>
      <div className="ali-orb-halo" style={{ width: haloSize, height: haloSize, top: haloOffset, left: haloOffset, animation: anim }} />
      <div className="ali-orb-core" style={{ animation: anim }} />
      <div className="ali-orb-shine" style={{ inset: size * 0.14 }} />
    </div>
  );
}

// ─── WAVEFORM ────────────────────────────────────────────────────────────────
function Waveform() {
  const bars = 22;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, height: 26, width: 160, flexShrink: 0 }}>
      {Array.from({ length: bars }).map((_, i) => {
        const d = Math.abs(i - bars / 2);
        return (
          <div key={i} style={{
            width: 3, borderRadius: 3,
            background: 'var(--ink)',
            height: '100%',
            opacity: 0.55 + (1 - d / (bars / 2)) * 0.45,
            transformOrigin: 'center',
            animation: `wave 0.9s ease-in-out ${i * 0.045}s infinite`,
            transform: 'scaleY(0.22)',
          }} />
        );
      })}
    </div>
  );
}

// ─── LANDING SCREEN ──────────────────────────────────────────────────────────
function LandingScreen({ mood, onToggleMood, onStart }: {
  mood: string; onToggleMood: () => void; onStart: () => void;
}) {
  return (
    <div className="era-screen">
      <div className="sticky sticky-1">discover<br />your next<br />chapter ✦</div>
      <div className="sticky sticky-2">black friday<br />is here</div>
      <div className="sticky sticky-3">find your<br />era →</div>

      <div className="era-topbar">
        <div className="era-brand">
          <strong>Dell Technologies</strong><br />Black Friday 2026
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="era-mood-toggle" onClick={onToggleMood}>
            <div className="era-mood-dot" />
            <span>{mood === 'sage' ? 'Sage' : 'Sand'}</span>
          </button>
          <div className="era-bf-tag"><div className="era-bf-dot" />Up to 35% off</div>
        </div>
      </div>

      <div className="landing-hero">
        <AliOrb size={160} state="idle" />
        <h1 className="landing-headline">
          Find Your<br /><em>Next Era</em>
        </h1>
        <p className="landing-sub">
          Talk with Ali and discover the tech built for who you&apos;re becoming — not just what you&apos;d buy.
        </p>
      </div>

      <div className="landing-cta-area">
        <button className="landing-cta" onClick={onStart}>
          <MicIcon size={18} color="currentColor" />
          Begin Your Era
        </button>
        <div className="landing-status">
          <div className="live-dot" />
          Five questions · about 60 seconds
        </div>
      </div>
    </div>
  );
}

// ─── CHAT SCREEN ─────────────────────────────────────────────────────────────
function ChatScreen({ onComplete, onBack }: {
  onComplete: (era: EraRevealPayload) => void;
  onBack: () => void;
}) {
  const { messages, state, eraReveal, error, sendMessage, startConversation } = useChat();
  const [isListening, setIsListening]   = useState(false);
  const [interimText, setInterimText]   = useState('');
  const [closingMsg,  setClosingMsg]    = useState<string | null>(null);
  const [hasSpeech,   setHasSpeech]     = useState(true);
  const [textInput,   setTextInput]     = useState('');
  const recognitionRef = useRef<EventTarget & { start(): void; stop(): void } | null>(null);
  const spokenIds      = useRef<Set<string>>(new Set());
  const scrollRef      = useRef<HTMLDivElement>(null);
  const started        = useRef(false);

  // Kick off conversation once
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    startConversation();
    const SRA = (window as typeof window & { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition
             || (window as typeof window & { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;
    if (!SRA) setHasSpeech(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Speak new Ali messages as they arrive
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!last || last.role !== 'assistant') return;
    if (spokenIds.current.has(last.id)) return;
    spokenIds.current.add(last.id);
    speak(last.content);
  }, [messages]);

  // Handle era reveal
  useEffect(() => {
    if (!eraReveal) return;
    setClosingMsg(eraReveal.closingMessage);
    speak(eraReveal.closingMessage);
    const t = setTimeout(() => onComplete(eraReveal), 3200);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eraReveal]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight + 400;
  }, [messages, state, isListening, interimText, closingMsg]);

  const startListening = () => {
    if (state !== 'idle' || isListening) return;
    const SRA = (window as typeof window & { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition
             || (window as typeof window & { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;
    if (!SRA) return;
    window.speechSynthesis?.cancel();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rec = new (SRA as any)();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = 'en-US';
    let final = '';

    rec.onstart = () => setIsListening(true);
    rec.onresult = (e: { resultIndex: number; results: SpeechRecognitionResultList }) => {
      final = '';
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setInterimText(final || interim);
    };
    rec.onerror = () => { setIsListening(false); setInterimText(''); };
    rec.onend = () => {
      setIsListening(false);
      setInterimText('');
      if (final.trim()) sendMessage(final.trim());
    };
    recognitionRef.current = rec;
    rec.start();
  };

  const stopListening = () => recognitionRef.current?.stop();

  const handleTextSend = () => {
    if (!textInput.trim() || state !== 'idle') return;
    sendMessage(textInput.trim());
    setTextInput('');
  };

  // Hide the auto-generated kickoff user message (index 0)
  const visibleMsgs = messages.filter((m, i) => !(m.role === 'user' && i === 0));
  const progressCount = messages.filter(m => m.role === 'user').length;
  const isBusy = state === 'loading' || state === 'era_revealed';

  return (
    <div className="era-screen" style={{ overflow: 'hidden' }}>
      {/* Header */}
      <div className="chat-header">
        <button className="era-icon-btn" onClick={onBack} aria-label="Back">
          <ChevronLeft size={16} />
        </button>
        <AliOrb size={32} state={state === 'loading' ? 'thinking' : isListening ? 'listening' : 'idle'} />
        <div style={{ flex: 1 }}>
          <div className="chat-ali-label">Ali</div>
          <div className="chat-ali-sub">
            {state === 'loading' ? 'Thinking…' : isListening ? 'Listening…' : 'AI shopping companion'}
          </div>
        </div>
        <div className="chat-progress">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`chat-progress-dot ${i < progressCount ? 'done' : i === progressCount ? 'active' : 'inactive'}`} />
          ))}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="chat-messages">
        {visibleMsgs.map(m => (
          <div key={m.id} className={`chat-bubble-wrap ${m.role === 'assistant' ? 'ali' : 'user'}`}>
            <div className={`chat-bubble ${m.role === 'assistant' ? 'ali' : 'user'}`}>{m.content}</div>
          </div>
        ))}

        {/* Interim speech */}
        {isListening && interimText && (
          <div className="chat-bubble-wrap user" style={{ opacity: 0.55 }}>
            <div className="chat-bubble user">{interimText}</div>
          </div>
        )}

        {/* Thinking dots */}
        {state === 'loading' && (
          <div className="chat-thinking">
            {[0, 1, 2].map(i => (
              <div key={i} className="chat-thinking-dot" style={{ animation: `blink 1.2s ${i * 0.18}s ease-in-out infinite` }} />
            ))}
          </div>
        )}

        {/* Closing message from era reveal */}
        {closingMsg && (
          <div className="chat-bubble-wrap ali">
            <div className="chat-bubble ali">{closingMsg}</div>
          </div>
        )}

        {error && (
          <div className="chat-bubble-wrap ali">
            <div className="chat-bubble ali" style={{ fontSize: 13, opacity: 0.7 }}>
              Something went wrong — tap the mic and try again.
            </div>
          </div>
        )}
      </div>

      {/* Mic dock */}
      <div className="chat-dock" style={{ paddingBottom: 32 }}>
        {isListening && <Waveform />}

        {hasSpeech ? (
          <>
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isBusy}
              aria-label={isListening ? 'Stop listening' : 'Start speaking'}
              style={{
                width: 74, height: 74, borderRadius: '50%', border: 'none',
                cursor: isBusy ? 'default' : 'pointer',
                background: isListening ? 'var(--accent)' : isBusy ? 'var(--card)' : 'var(--ink)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                boxShadow: !isListening && !isBusy ? '0 6px 24px var(--shadow)' : 'none',
                transform: isListening ? 'scale(0.94)' : 'scale(1)',
                transition: 'all 0.3s',
                opacity: isBusy ? 0.45 : 1,
                flexShrink: 0,
              }}
            >
              {!isListening && !isBusy && (
                <span style={{ position: 'absolute', inset: -7, borderRadius: '50%', border: '2px solid var(--accent)', opacity: 0.4, animation: 'ring 2s ease-out infinite' }} />
              )}
              <MicIcon size={28} color={isBusy ? 'var(--ink-soft)' : '#fff'} />
            </button>
            <div className="chat-dock-hint">
              {isListening
                ? 'Listening… tap to stop'
                : state === 'loading'
                ? 'Ali is thinking…'
                : state === 'era_revealed'
                ? 'Finding your era…'
                : visibleMsgs.length > 0
                ? 'Tap to speak'
                : ''}
            </div>
          </>
        ) : (
          /* Text fallback for browsers without SpeechRecognition */
          <div style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 540 }}>
            <input
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleTextSend()}
              placeholder="Type your answer…"
              disabled={isBusy}
              style={{
                flex: 1, padding: '11px 16px', borderRadius: 3,
                border: '1.5px solid var(--divider)', background: 'var(--card)',
                color: 'var(--ink)', fontFamily: "'Fraunces', serif", fontSize: 15,
                outline: 'none',
              }}
            />
            <button
              onClick={handleTextSend}
              disabled={!textInput.trim() || isBusy}
              style={{
                padding: '11px 18px', borderRadius: 3, border: 'none',
                background: 'var(--ink)', color: 'var(--card)', cursor: 'pointer',
                fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
                opacity: !textInput.trim() || isBusy ? 0.45 : 1,
              }}
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── REVEAL SCREEN ───────────────────────────────────────────────────────────
function RevealScreen({ eraReveal, onSetup, onRestart }: {
  eraReveal: EraRevealPayload; onSetup: () => void; onRestart: () => void;
}) {
  const { era } = eraReveal;
  const traits = ERA_TRAITS[era.name] ?? [];

  return (
    <div className="era-screen">
      <div className="reveal-inner">
        <div className="reveal-ambient" style={{ background: `radial-gradient(circle, ${era.primaryColor}, transparent 60%)` }} />

        <AliOrb size={108} state="speaking" />

        <div className="reveal-label">Ali found your era</div>

        <div className="reveal-era-name" style={{ color: era.primaryColor }}>
          {era.name}
        </div>

        <p className="reveal-tagline">{era.tagline}</p>
        <p className="reveal-blurb">{era.description}</p>

        {traits.length > 0 && (
          <div className="reveal-traits">
            {traits.map(t => (
              <span
                key={t}
                className="reveal-trait-chip"
                style={{ color: era.primaryColor, background: `${era.primaryColor}1a`, border: `1px solid ${era.primaryColor}33` }}
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="reveal-ctas">
          <button className="btn-primary-era" onClick={onSetup}>
            See the setup Ali picked <ChevronRight size={14} />
          </button>
          <button className="btn-ghost-era" onClick={onRestart}>
            Not quite me — retake
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── RECS SCREEN ─────────────────────────────────────────────────────────────
function RecsScreen({ eraReveal, onShare, onBack }: {
  eraReveal: EraRevealPayload; onShare: () => void; onBack: () => void;
}) {
  const { era, products } = eraReveal;
  const hero = products[0];
  const rest = products.slice(1, 4); // max 3 polaroids

  const getAsset = (name: string) => PRODUCT_ASSETS[name] ?? null;
  const heroAsset = hero ? getAsset(hero.name) : null;

  const totalSave = products.reduce((sum, p) => {
    const n = parseInt(p.savings.replace(/[^0-9]/g, ''), 10);
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  return (
    <div className="era-screen" style={{ overflow: 'hidden' }}>
      <div className="chat-header">
        <button className="era-icon-btn" onClick={onBack} aria-label="Back">
          <ChevronLeft size={16} />
        </button>
        <div style={{ flex: 1 }}>
          <div className="era-bf-tag" style={{ fontSize: 9 }}>
            <div className="era-bf-dot" />Black Friday pricing
          </div>
        </div>
      </div>

      <div className="recs-title-area">
        <div className="recs-title">
          Your{' '}
          <span style={{ color: era.primaryColor, fontStyle: 'italic' }}>
            {era.name.replace('The ', '').replace(' Era', '')}
          </span>{' '}
          setup
        </div>
        <p className="recs-intro">Ali chose these to match your era — and why each earns its place.</p>
      </div>

      <div className="recs-scroll">
        {/* Hero card */}
        {hero && (
          <div className="recs-hero-card">
            {heroAsset && (
              <div className="recs-hero-photo">
                <img src={heroAsset.imageUrl} alt={hero.name} />
              </div>
            )}
            <div className="recs-hero-body">
              <div className="recs-hero-type">
                <span>{hero.category}</span>
                <span className="recs-save-chip">Save {hero.savings}</span>
              </div>
              <div className="recs-hero-name">{hero.name}</div>
              <p className="recs-hero-why">
                <em style={{ color: era.primaryColor }}>Why this: </em>
                {hero.description}
              </p>
              <div className="recs-price-row">
                <span className="recs-price-sale" style={{ color: era.primaryColor }}>{hero.price}</span>
                <span className="recs-price-orig">{hero.originalPrice}</span>
              </div>
              {heroAsset && (
                <a href={heroAsset.productUrl} target="_blank" rel="noopener noreferrer" className="recs-dell-link">
                  View on Dell.com <ExtLinkIcon />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Polaroids */}
        {rest.length > 0 && (
          <div className="recs-polaroids">
            {rest.map((p, i) => {
              const asset = getAsset(p.name);
              return (
                <div
                  key={p.name}
                  className="polaroid"
                  style={{ '--prot': PROTS[i], '--era-primary': era.primaryColor } as React.CSSProperties}
                >
                  <div className="polaroid-photo">
                    {asset ? (
                      <img src={asset.imageUrl} alt={p.name} className="polaroid-img" />
                    ) : (
                      <div style={{
                        width: '100%', height: '100%', background: `${era.primaryColor}18`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: era.primaryColor, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center', padding: 4 }}>
                          {p.category}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="polaroid-name">{p.name}</div>
                  <div className="polaroid-prices">
                    <span className="polaroid-price">{p.price}</span>
                    <span className="polaroid-original">{p.originalPrice}</span>
                  </div>
                  <div className="polaroid-caption">
                    {p.description}<br /><em>Save {p.savings}</em>
                  </div>
                  {asset && (
                    <a href={asset.productUrl} target="_blank" rel="noopener noreferrer" className="polaroid-link">
                      Shop on Dell.com →
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Savings */}
        {totalSave > 0 && (
          <div className="recs-savings-panel">
            <div>
              <div className="recs-savings-label">Black Friday saving on this setup</div>
              <div className="recs-savings-amount">${totalSave.toLocaleString()}</div>
            </div>
            <MicIcon size={22} color="var(--accent)" />
          </div>
        )}

        <button className="recs-share-btn" onClick={onShare}>
          Share your era <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── SHARE SCREEN ────────────────────────────────────────────────────────────
function ShareScreen({ eraReveal, onRestart, onBack }: {
  eraReveal: EraRevealPayload; onRestart: () => void; onBack: () => void;
}) {
  const { era, products } = eraReveal;
  const shortName = era.name.replace('The ', '').replace(' Era', '');

  return (
    <div className="era-screen">
      <div className="chat-header">
        <button className="era-icon-btn" onClick={onBack} aria-label="Back">
          <ChevronLeft size={16} />
        </button>
        <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, fontSize: 15, color: 'var(--ink)' }}>
          Share your era
        </div>
      </div>

      <div className="share-card-area">
        <div
          className="share-card-outer"
          style={{
            background: `linear-gradient(155deg, ${era.primaryColor} 0%, ${era.secondaryColor} 48%, #1a1412 130%)`,
            boxShadow: `0 24px 60px ${era.primaryColor}55`,
          }}
        >
          <div className="share-card-glow" />

          <div className="share-card-top">
            <div className="share-card-wordmark">DELL</div>
            <div className="share-card-bf">BLACK FRIDAY &#x2019;26</div>
          </div>

          <div className="share-card-body">
            <div className="share-card-pre">I&apos;m in my</div>
            <div className="share-card-name">{shortName}<br />Era</div>
            <div className="share-card-tagline">{era.tagline}</div>
            <div className="share-card-tiles">
              {products.slice(0, 3).map((p, i) => (
                <div key={i} className="share-tile">
                  <span className="share-tile-text">{p.category}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="share-card-footer">
            <span style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(255,255,255,0.22)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9 }}>
              ✦
            </span>
            Found by Ali · dell.com
          </div>
        </div>
      </div>

      <div className="share-actions">
        <button className="share-action-btn share-action-fill">Stories</button>
        <button
          className="share-action-btn share-action-outline"
          onClick={() => navigator.clipboard.writeText('https://dell.com/blackfriday').catch(() => {})}
        >
          Copy link
        </button>
        <button className="share-action-btn share-action-outline">Save</button>
      </div>

      <button className="share-discover" onClick={onRestart}>Discover another era</button>
    </div>
  );
}

// ─── ROOT ────────────────────────────────────────────────────────────────────
export default function EraApp() {
  const [screen,     setScreen]     = useState<Screen>('landing');
  const [flowKey,    setFlowKey]    = useState(0);
  const [eraReveal,  setEraReveal]  = useState<EraRevealPayload | null>(null);
  const [mood,       setMood]       = useState('sage');

  useEffect(() => {
    const saved = localStorage.getItem('era-mood') || 'sage';
    setMood(saved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-mood', mood);
  }, [mood]);

  const toggleMood = () => {
    const next = mood === 'sage' ? 'sand' : 'sage';
    setMood(next);
    localStorage.setItem('era-mood', next);
  };

  const go = (s: Screen) => setScreen(s);

  const restart = () => {
    if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
    setFlowKey(k => k + 1);
    setEraReveal(null);
    go('landing');
  };

  return (
    <div id="era-app">
      <div key={screen} style={{ position: 'absolute', inset: 0 }}>
        {screen === 'landing' && (
          <LandingScreen mood={mood} onToggleMood={toggleMood} onStart={() => go('chat')} />
        )}
        {screen === 'chat' && (
          <ChatScreen
            key={flowKey}
            onComplete={(reveal) => { setEraReveal(reveal); go('reveal'); }}
            onBack={() => go('landing')}
          />
        )}
        {screen === 'reveal' && eraReveal && (
          <RevealScreen eraReveal={eraReveal} onSetup={() => go('recs')} onRestart={restart} />
        )}
        {screen === 'recs' && eraReveal && (
          <RecsScreen eraReveal={eraReveal} onShare={() => go('share')} onBack={() => go('reveal')} />
        )}
        {screen === 'share' && eraReveal && (
          <ShareScreen eraReveal={eraReveal} onRestart={restart} onBack={() => go('recs')} />
        )}
      </div>
    </div>
  );
}
