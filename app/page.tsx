'use client';

import { useEffect, useRef, useState } from 'react';
import { useChat } from '@/app/frontend/hooks/useChat';
import type { EraRevealPayload } from '@/app/frontend/hooks/useChat';

// ─── TYPES ───────────────────────────────────────────────────────────────────
type Screen = 'landing' | 'intro' | 'chat' | 'reveal' | 'recs' | 'share';

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
  'Dell Creative Labs Pebble Nova': {
    imageUrl: 'https://snpi.dell.com/snp/images/products/large/en-us~AD384558/AD384558.jpg',
    productUrl: 'https://www.dell.com/en-us/shop/creative-labs-pebble-nova-white/apd/ad384558/audio',
  },
  'Dell XPS 15 Developer Edition': {
    imageUrl: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/dell/dell-15-intel-3530/media-gallery/laptop-dell-dc15250nt-sl-metal-usbc-full-function-fpr-gallery-2.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=686&qlt=100,1&resMode=sharp2&size=686,402&chrss=full',
    productUrl: 'https://www.dell.com/en-us/shop/dell-laptops/dell-15-laptop/spd/dell-dc15250-laptop/usedc15250hbtshxhl_q1',
  },
  'Dell UltraSharp 32 4K USB-C Monitor': {
    imageUrl: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/peripherals/monitors/u-series/u4323qe/media-gallery/gray/monitor-u4323qe-gray-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=804&wid=816&qlt=100,1&resMode=sharp2&size=816,804&chrss=full',
    productUrl: 'https://www.dell.com/en-us/shop/dell-ultrasharp-43-4k-usb-c-hub-monitor-u4323qe/apd/210-bfpo/monitors-monitor-accessories',
  },
  'Dell Precision 5690': {
    imageUrl: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/workstations/mobile-workstations/precision/5690/media-gallery/workstation-precision-16-5690-black-gallery-2.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=660&qlt=100,1&resMode=sharp2&size=660,402&chrss=full',
    productUrl: 'https://www.dell.com/en-us/shop/dell-laptops/precision-5690-workstation/spd/precision-16-5690-laptop/xctop5690usvp',
  },
  'Dell Latitude 9550': {
    imageUrl: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/latitude-notebooks/latitude-14-9450-laptop-2-in-1/mg/notebook-latitude-14-9450-t-wlan-gray-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=527&qlt=100,1&resMode=sharp2&size=527,402&chrss=full',
    productUrl: 'https://www.dell.com/en-us/shop/dell-laptops/latitude-9450-2-in-1/spd/latitude-14-9450-2-in-1-laptop',
  },
  'Dell Thunderbolt Dock WD22TB4': {
    imageUrl: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/peripherals/docks/dell-thunderbolt-4-dock-wd22tb4/spi/ng/dock-wd22tb4-black-campaign-hero-504x350-ng.psd?qlt=95&fmt=jpg',
    productUrl: 'https://www.dell.com/en-us/shop/dell-pro-thunderbolt-4-dock-wd25tb4/apd/210-btmr/docks',
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
    imageUrl: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/peripherals/headphones/wl5024/media-gallery/headset-dell-wl5024-bk-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=804&wid=516&qlt=100,1&resMode=sharp2&size=516,804&chrss=full',
    productUrl: 'https://www.dell.com/en-us/shop/dell-pro-plus-wireless-anc-headset-wl5024/apd/520-bbgr/pc-accessories',
  },
  'Dell Aluratek Wireless Charging Power Bank': {
    imageUrl: 'https://snpi.dell.com/snp/images/products/large/en-us~AB139636/AB139636.jpg',
    productUrl: 'https://www.dell.com/en-us/shop/aluratek-wireless-charging-power-bank/apd/ab139636/pc-accessories',
  },
  'Dell 40 Curved Conference Monitor': {
    imageUrl: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/peripherals/monitors/u-series/u4025qw/media-gallery/monitor-ultrasharp-u4025qw-gray-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=804&wid=1242&qlt=100,1&resMode=sharp2&size=1242,804&chrss=full',
    productUrl: 'https://www.dell.com/en-us/shop/dell-ultrasharp-40-curved-thunderbolt-hub-monitor-u4025qw/apd/210-bmdp/monitors-monitor-accessories',
  },
  'Dell Pro Keyboard and Mouse KM5221W': {
    imageUrl: 'https://i.dell.com/is/image/DellContent/content/dam/images/products/electronics-and-accessories/dell/keyboards/km5221w-wth/windows-11/km5221w-xkb-10060rf-wh.psd?fmt=png-alpha&pscan=auto&scl=1&hei=804&wid=1304&qlt=100,1&resMode=sharp2&size=1304,804&chrss=full',
    productUrl: 'https://www.dell.com/en-us/shop/dell-pro-keyboard-and-mouse-km5221w-us-english-white/apd/580-akbm/pc-accessories',
  },
  // Alienware entries intentionally omitted — CDN paths unverified.
  // Products without an entry here show a styled era-color placeholder.
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

// Fuzzy product lookup — handles slight name variations Gemini sometimes uses
// (e.g. "Dell XPS 15" instead of "Dell XPS 15 Developer Edition")
function getAsset(name: string) {
  if (PRODUCT_ASSETS[name]) return PRODUCT_ASSETS[name];
  const n = name.toLowerCase().trim();
  const key = Object.keys(PRODUCT_ASSETS).find(k => {
    const k2 = k.toLowerCase().trim();
    return k2.includes(n) || n.includes(k2) ||
      n.split(' ').slice(0, 3).join(' ') === k2.split(' ').slice(0, 3).join(' ');
  });
  return key ? PRODUCT_ASSETS[key] : null;
}

// ─── TTS ─────────────────────────────────────────────────────────────────────
let voiceCache: SpeechSynthesisVoice[] = [];
let currentAudio: HTMLAudioElement | null = null;

function primeVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const load = () => { voiceCache = window.speechSynthesis.getVoices(); };
  load();
  window.speechSynthesis.addEventListener('voiceschanged', load);
}

// Warm up the TTS endpoint so the first real call isn't slowed by:
//  - cold Next.js route / Cloud Run container
//  - GCP TextToSpeechClient first-call init (~500-1500ms)
//  - TLS handshake to googleapis.com
// We fire this on landing AND chat mount — connections go idle quickly.
async function prewarmTTS() {
  if (typeof window === 'undefined') return;
  try {
    fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'hi' }),
      keepalive: true,
    });
  } catch { /* silent — best-effort */ }
}

// Web Speech API fallback (used when GCP TTS route is unavailable locally)
function speakFallback(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.02; utterance.pitch = 1.28; utterance.volume = 1;
  const voices = voiceCache.length > 0 ? voiceCache : window.speechSynthesis.getVoices();
  const preferred =
    voices.find(v => v.name === 'Google UK English Female') ||
    voices.find(v => v.name === 'Google US English')        ||
    voices.find(v => v.name === 'Karen')                    ||
    voices.find(v => v.name === 'Samantha')                 ||
    voices.find(v => v.name.includes('Aria'))               ||
    voices.find(v => v.lang.startsWith('en') && !v.name.toLowerCase().includes('male'));
  if (preferred) utterance.voice = preferred;
  window.speechSynthesis.speak(utterance);
}

// Module-level callbacks so ChatScreen can show speaking state on the orb
let _onSpeakStart: (() => void) | null = null;
let _onSpeakEnd: (() => void) | null = null;

// Sanitize closingMessage — Gemini occasionally returns template text instead of
// actual content (square-bracket instructions). Strip it to a safe fallback.
function sanitizeClosingMsg(msg: string): string {
  if (!msg || msg.startsWith('[') || msg.length > 350) {
    return "Based on everything you've shared with me, I know exactly which era this is. Let me show you.";
  }
  return msg.replace(/\[.*?\]/g, '').trim() || "Let me show you your era.";
}

// Primary: Google Cloud TTS Journey-F (natural, energetic female voice)
// Falls back to Web Speech API if the /api/tts route is unavailable
async function speak(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined') return;
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  window.speechSynthesis?.cancel();
  _onSpeakStart?.();
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error('TTS unavailable');
    const { audio } = await res.json();
    currentAudio = new Audio(`data:audio/ogg;base64,${audio}`);
    currentAudio.addEventListener('ended', () => { _onSpeakEnd?.(); if (onEnd) setTimeout(onEnd, 700); }, { once: true });
    await currentAudio.play();
  } catch {
    _onSpeakEnd?.();
    speakFallback(text);
    if (onEnd) setTimeout(onEnd, Math.max(2800, text.split(' ').length * 380));
  }
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
function KeyboardIcon({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2.5" y="6" width="19" height="13" rx="2.2" stroke={color} strokeWidth="1.8" />
      <path d="M6 10h0.5M9 10h0.5M12 10h0.5M15 10h0.5M18 10h0.5M6 13h0.5M9 13h0.5M12 13h0.5M15 13h0.5M18 13h0.5M8 16h8" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function SendIcon({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 12L20 4L13 20L11 13L4 12Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
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

// ─── INTRO SCREEN ────────────────────────────────────────────────────────────
const INTRO_SPEECH = "Hey — I'm Ali. I'm here to help you discover your next era through Dell. Just tell me a little about yourself, and I'll match you with tech that actually fits who you're becoming.";

function IntroScreen({ onDone }: { onDone: () => void }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Wait for orb entrance animation, then speak
    const t = setTimeout(() => {
      speak(INTRO_SPEECH, () => {
        setExiting(true);
        setTimeout(onDone, 520);
      });
    }, 1000);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`intro-screen${exiting ? ' exiting' : ''}`}>
      {/* Pulsing rings */}
      <div className="intro-ring intro-ring-1" />
      <div className="intro-ring intro-ring-2" />
      <div className="intro-ring intro-ring-3" />

      {/* Orbiting dots */}
      <div className="intro-dot intro-dot-1" />
      <div className="intro-dot intro-dot-2" />

      {/* Main orb */}
      <div className="intro-orb-wrap">
        <AliOrb size={220} state="speaking" />
      </div>

      {/* Text */}
      <div className="intro-text-area">
        <div className="intro-greeting">Hi, I&apos;m <em>Ali</em></div>
        <div className="intro-tagline">Your guide to the next era</div>
      </div>
    </div>
  );
}

// ─── LANDING SCREEN ──────────────────────────────────────────────────────────
function LandingScreen({ mood, onToggleMood, mobileFrame, onToggleFrame, onStart }: {
  mood: string;
  onToggleMood: () => void;
  mobileFrame: boolean;
  onToggleFrame: () => void;
  onStart: () => void;
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button className="era-mood-toggle" onClick={onToggleFrame} aria-label="Toggle mobile frame">
            {mobileFrame ? (
              <svg width="11" height="14" viewBox="0 0 11 14" fill="none">
                <rect x="0.6" y="0.6" width="9.8" height="12.8" rx="1.8" stroke="currentColor" strokeWidth="1.2" />
                <rect x="4.3" y="11" width="2.4" height="0.6" rx="0.3" fill="currentColor" />
              </svg>
            ) : (
              <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
                <rect x="0.6" y="0.6" width="12.8" height="8.8" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
                <rect x="4.5" y="10.4" width="5" height="0.8" rx="0.4" fill="currentColor" />
              </svg>
            )}
            <span>{mobileFrame ? 'Mobile' : 'Desktop'}</span>
          </button>
          <button className="era-mood-toggle" onClick={onToggleMood}>
            <div className="era-mood-dot" />
            <span>{mood === 'sage' ? 'Light' : 'Dark'}</span>
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
          Talk with Ali and discover the tech for who you&apos;re becoming.
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
  onComplete: (era: EraRevealPayload, discoveryMsgs: { role: 'user' | 'assistant'; content: string }[]) => void;
  onBack: () => void;
}) {
  const { messages, state, eraReveal, error, sendMessage, startConversation } = useChat();
  const [isListening, setIsListening]   = useState(false);
  const [interimText, setInterimText]   = useState('');
  const [closingMsg,  setClosingMsg]    = useState<string | null>(null);
  const [hasSpeech,   setHasSpeech]     = useState(true);
  const [isSpeaking,  setIsSpeaking]    = useState(false);
  const [textInput,   setTextInput]     = useState('');
  const [inputMode,   setInputMode]     = useState<'voice' | 'text'>('voice');
  const [userPaused,  setUserPaused]    = useState(false); // true when user manually stopped the mic
  const userPausedRef = useRef(false);
  useEffect(() => { userPausedRef.current = userPaused; }, [userPaused]);
  const recognitionRef = useRef<EventTarget & { start(): void; stop(): void } | null>(null);
  const spokenIds      = useRef<Set<string>>(new Set());
  const scrollRef      = useRef<HTMLDivElement>(null);
  const started        = useRef(false);

  // Register speaking state callbacks so the orb animates during TTS load/play
  useEffect(() => {
    _onSpeakStart = () => setIsSpeaking(true);
    _onSpeakEnd   = () => setIsSpeaking(false);
    return () => { _onSpeakStart = null; _onSpeakEnd = null; };
  }, []);

  // Kick off conversation once
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    prewarmTTS(); // keep the TTS route warm right before Ali's first reply
    startConversation();
    const SRA = (window as typeof window & { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition
             || (window as typeof window & { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;
    if (!SRA) { setHasSpeech(false); setInputMode('text'); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Speak new Ali messages as they arrive
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!last || last.role !== 'assistant') return;
    if (spokenIds.current.has(last.id)) return;
    spokenIds.current.add(last.id);
    speak(last.content, () => maybeAutoListen());
  }, [messages]);

  // Handle era reveal
  useEffect(() => {
    if (!eraReveal) return;
    const msg = sanitizeClosingMsg(eraReveal.closingMessage);
    setClosingMsg(msg);
    speak(msg, () => onComplete(eraReveal, messages.map(m => ({ role: m.role, content: m.content }))));
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
    setUserPaused(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rec = new (SRA as any)();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';
    let final = '';
    let silenceTimer: ReturnType<typeof setTimeout> | null = null;
    let speechStarted = false;

    const stopTimer = () => { if (silenceTimer) { clearTimeout(silenceTimer); silenceTimer = null; } };
    // Generous timeout before user starts speaking (gives time to think),
    // tighter once they've started (natural pause = 2.5s = "I'm done")
    const setTimer = (ms: number) => { stopTimer(); silenceTimer = setTimeout(() => rec.stop(), ms); };

    rec.onstart = () => setIsListening(true);
    rec.onspeechstart = () => { speechStarted = true; setTimer(2500); };
    rec.onresult = (e: { resultIndex: number; results: SpeechRecognitionResultList }) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setInterimText(final || interim);
      if (speechStarted) setTimer(2500); // reset on every new word
    };
    rec.onspeechend = () => setTimer(2500);
    rec.onerror = () => { stopTimer(); setIsListening(false); setInterimText(''); };
    rec.onend = () => {
      stopTimer();
      setIsListening(false);
      setInterimText('');
      if (final.trim()) sendMessage(final.trim());
    };
    recognitionRef.current = rec;
    rec.start();
    setTimer(15000); // 15s grace before any speech detected — plenty of time to think
  };

  // User manually pauses → don't auto-resume after Ali's next message
  const stopListening = () => {
    setUserPaused(true);
    recognitionRef.current?.stop();
  };

  // Auto-listen after Ali finishes speaking (unless user manually paused or typing)
  const maybeAutoListen = () => {
    if (userPausedRef.current) return;
    if (inputMode !== 'voice') return;
    if (!hasSpeech) return;
    // small delay so the mic doesn't catch the tail of Ali's audio
    setTimeout(() => {
      if (!userPausedRef.current && inputMode === 'voice') startListening();
    }, 250);
  };

  const handleTextSend = () => {
    if (!textInput.trim() || state !== 'idle') return;
    sendMessage(textInput.trim());
    setTextInput('');
  };

  // Hide the auto-generated kickoff user message (index 0)
  const visibleMsgs = messages.filter((m, i) => !(m.role === 'user' && i === 0));
  // Subtract 1 to exclude the hidden kickoff message; 5 dots = name + 4 questions
  const progressCount = Math.max(0, messages.filter(m => m.role === 'user').length - 1);
  const isBusy = state === 'loading' || state === 'era_revealed';

  return (
    <div className="era-screen" style={{ overflow: 'hidden' }}>
      {/* Header */}
      <div className="chat-header">
        <button className="era-icon-btn" onClick={onBack} aria-label="Back">
          <ChevronLeft size={16} />
        </button>
        <AliOrb size={32} state={
          state === 'loading' ? 'thinking'
          : isListening ? 'listening'
          : isSpeaking ? 'speaking'
          : 'idle'
        } />
        <div style={{ flex: 1 }}>
          <div className="chat-ali-label">Ali</div>
          <div className="chat-ali-sub">
            {state === 'loading' ? 'Thinking…'
             : isListening ? 'Listening…'
             : isSpeaking ? 'Speaking…'
             : 'AI shopping companion'}
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

      {/* Input dock */}
      <div className="chat-dock" style={{ paddingBottom: 28 }}>
        {isListening && inputMode === 'voice' && <Waveform />}

        {/* Voice / Text toggle (only when speech is available) */}
        {hasSpeech && (
          <div className="input-mode-toggle">
            <button
              className={`input-mode-btn${inputMode === 'voice' ? ' active' : ''}`}
              onClick={() => { setInputMode('voice'); setUserPaused(false); }}
              disabled={isBusy || isListening}
              aria-label="Use voice"
            >
              <MicIcon size={14} color="currentColor" />
              Voice
            </button>
            <button
              className={`input-mode-btn${inputMode === 'text' ? ' active' : ''}`}
              onClick={() => { setInputMode('text'); if (isListening) stopListening(); }}
              disabled={isBusy}
              aria-label="Type your response"
            >
              <KeyboardIcon size={14} color="currentColor" />
              Type
            </button>
          </div>
        )}

        {inputMode === 'voice' && hasSpeech ? (
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
                ? 'Listening… tap to pause'
                : isSpeaking
                ? 'Ali is talking…'
                : state === 'loading'
                ? 'Ali is thinking…'
                : state === 'era_revealed'
                ? 'Finding your era…'
                : userPaused
                ? 'Tap to resume'
                : visibleMsgs.length > 0
                ? 'Listening will start automatically…'
                : ''}
            </div>
          </>
        ) : (
          <div className="chat-text-input">
            <input
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleTextSend()}
              placeholder={isBusy ? 'Ali is thinking…' : 'Type your answer…'}
              disabled={isBusy}
              autoFocus={inputMode === 'text'}
            />
            <button
              onClick={handleTextSend}
              disabled={!textInput.trim() || isBusy}
              aria-label="Send message"
            >
              <SendIcon size={18} color="#fff" />
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
                <img src={heroAsset.imageUrl} alt={hero.name} onError={e => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }} />
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
                      <img src={asset.imageUrl} alt={p.name} className="polaroid-img" onError={e => { const el = e.target as HTMLImageElement; el.style.display = 'none'; el.parentElement!.style.background = `${era.primaryColor}18`; }} />
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
  const cardRef   = useRef<HTMLDivElement>(null);
  const [copied,  setCopied]  = useState(false);
  const [saving,  setSaving]  = useState(false);

  const captureCard = async () => {
    if (!cardRef.current) return null;
    const { default: html2canvas } = await import('html2canvas');
    return html2canvas(cardRef.current, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
    });
  };

  const handleStories = async () => {
    const canvas = await captureCard();
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `${shortName}-era.png`, { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: `I'm in my ${shortName} Era` }).catch(() => {});
      } else {
        // Desktop fallback: download the image
        const a = Object.assign(document.createElement('a'), { href: canvas.toDataURL('image/png'), download: `${shortName}-era.png` });
        a.click();
      }
    }, 'image/png');
  };

  const handleCopy = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = Object.assign(document.createElement('input'), { value: url });
      document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSave = async () => {
    setSaving(true);
    const canvas = await captureCard();
    if (canvas) {
      const a = Object.assign(document.createElement('a'), {
        href: canvas.toDataURL('image/png'),
        download: `my-${shortName.toLowerCase().replace(/\s+/g, '-')}-era.png`,
      });
      a.click();
    }
    setSaving(false);
  };

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
          ref={cardRef}
          className="share-card-outer"
          style={{
            background: `linear-gradient(155deg, ${era.primaryColor} 0%, ${era.secondaryColor} 48%, #0C1A2E 130%)`,
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
              {products.slice(0, 3).map((p, i) => {
                const asset = PRODUCT_ASSETS[p.name] ?? null;
                return (
                  <div key={i} className="share-tile" style={asset ? { background: 'rgba(255,255,255,0.92)', padding: 3 } : {}}>
                    {asset ? (
                      <img
                        src={asset.imageUrl} alt={p.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 9, mixBlendMode: 'multiply' }}
                        onError={e => {
                          const el = e.target as HTMLImageElement;
                          const tile = el.parentElement!;
                          tile.style.cssText = '';
                          tile.className = 'share-tile';
                          tile.innerHTML = `<span class="share-tile-text">${p.category}</span>`;
                        }}
                      />
                    ) : (
                      <span className="share-tile-text">{p.category}</span>
                    )}
                  </div>
                );
              })}
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
        <button className="share-action-btn share-action-fill" onClick={handleStories}>
          Stories
        </button>
        <button className="share-action-btn share-action-outline" onClick={handleCopy}>
          {copied ? 'Copied ✓' : 'Copy link'}
        </button>
        <button className="share-action-btn share-action-outline" onClick={handleSave} disabled={saving}>
          {saving ? '…' : 'Save'}
        </button>
      </div>

      <button className="share-discover" onClick={onRestart}>Discover another era</button>
    </div>
  );
}

// ─── ASK ALI PANEL ───────────────────────────────────────────────────────────
type AskMsg = { id: number; role: 'user' | 'assistant'; content: string };

function AskAliPanel({ eraReveal, userName, discoverySummary, onClose }: {
  eraReveal: EraRevealPayload;
  userName?: string;
  discoverySummary?: string;
  onClose: () => void;
}) {
  const { era, products } = eraReveal;
  const [msgs,       setMsgs]       = useState<AskMsg[]>([]);
  const [loading,    setLoading]    = useState(false);
  const [textInput,  setTextInput]  = useState('');
  const [mode,       setMode]       = useState<'voice' | 'text'>('text');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking,  setIsSpeaking] = useState(false);
  const [interim,    setInterim]    = useState('');
  const scrollRef    = useRef<HTMLDivElement>(null);
  const recRef       = useRef<EventTarget & { start(): void; stop(): void } | null>(null);
  const nextId       = useRef(0);

  // Friendly opener — different vibe from intro because the era is already revealed
  useEffect(() => {
    const opener = userName
      ? `Hey ${userName} — I'm here if you want to dig into your setup. Specs, comparisons, what each piece is best for. What's on your mind?`
      : `Hey — I'm sticking around in case you have questions about your setup. Specs, comparisons, what each piece does best. Ask away.`;
    setMsgs([{ id: nextId.current++, role: 'assistant', content: opener }]);
    setIsSpeaking(true);
    speak(opener, () => setIsSpeaking(false));
    return () => {
      window.speechSynthesis?.cancel();
      if (currentAudio) { currentAudio.pause(); currentAudio = null; }
      recRef.current?.stop();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight + 400;
  }, [msgs, loading, interim]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg = { id: nextId.current++, role: 'user' as const, content: text.trim() };
    const next    = [...msgs, userMsg];
    setMsgs(next);
    setTextInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ask-ali', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.map(m => ({ role: m.role, content: m.content })),
          context: {
            userName,
            eraName: era.name,
            eraTagline: era.tagline,
            eraDescription: era.description,
            discoverySummary,
            products: products.map(p => ({
              name: p.name,
              category: p.category,
              price: p.price,
              originalPrice: p.originalPrice,
              savings: p.savings,
              description: p.description,
              productUrl: getAsset(p.name)?.productUrl,
            })),
          },
        }),
      });
      const data = await res.json();
      const reply = data.content || data.error || "Hmm — try asking that again?";
      const aliMsg = { id: nextId.current++, role: 'assistant' as const, content: reply };
      setMsgs(m => [...m, aliMsg]);
      setIsSpeaking(true);
      speak(reply, () => setIsSpeaking(false));
    } catch {
      setMsgs(m => [...m, { id: nextId.current++, role: 'assistant', content: "Something glitched. Try again?" }]);
    } finally {
      setLoading(false);
    }
  };

  const startVoice = () => {
    if (isListening || loading) return;
    const SRA = (window as typeof window & { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition
             || (window as typeof window & { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;
    if (!SRA) return;
    window.speechSynthesis?.cancel();
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rec = new (SRA as any)();
    rec.continuous = true; rec.interimResults = true; rec.lang = 'en-US';
    let finalText = '';
    let timer: ReturnType<typeof setTimeout> | null = null;
    const setTimer = (ms: number) => { if (timer) clearTimeout(timer); timer = setTimeout(() => rec.stop(), ms); };

    rec.onstart = () => setIsListening(true);
    rec.onspeechstart = () => setTimer(2500);
    rec.onresult = (e: { resultIndex: number; results: SpeechRecognitionResultList }) => {
      let int = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalText += e.results[i][0].transcript;
        else int += e.results[i][0].transcript;
      }
      setInterim(finalText || int);
      setTimer(2500);
    };
    rec.onspeechend = () => setTimer(2500);
    rec.onend = () => { if (timer) clearTimeout(timer); setIsListening(false); setInterim(''); if (finalText.trim()) send(finalText.trim()); };
    rec.onerror = () => { if (timer) clearTimeout(timer); setIsListening(false); setInterim(''); };
    recRef.current = rec;
    rec.start();
    setTimer(12000);
  };

  return (
    <div className="ask-ali-overlay" onClick={onClose}>
      <div className="ask-ali-panel" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="ask-ali-header">
          <AliOrb size={36} state={isSpeaking ? 'speaking' : isListening ? 'listening' : loading ? 'thinking' : 'idle'} />
          <div style={{ flex: 1 }}>
            <div className="chat-ali-label">Ali</div>
            <div className="chat-ali-sub">
              {loading ? 'Thinking…' : isListening ? 'Listening…' : isSpeaking ? 'Speaking…' : 'Ask about your setup'}
            </div>
          </div>
          <button className="era-icon-btn" onClick={onClose} aria-label="Close">
            <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
              <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="ask-ali-messages">
          {msgs.map(m => (
            <div key={m.id} className={`chat-bubble-wrap ${m.role === 'assistant' ? 'ali' : 'user'}`}>
              <div className={`chat-bubble ${m.role === 'assistant' ? 'ali' : 'user'}`}>{m.content}</div>
            </div>
          ))}
          {isListening && interim && (
            <div className="chat-bubble-wrap user" style={{ opacity: 0.55 }}>
              <div className="chat-bubble user">{interim}</div>
            </div>
          )}
          {loading && (
            <div className="chat-thinking">
              {[0, 1, 2].map(i => (
                <div key={i} className="chat-thinking-dot" style={{ animation: `blink 1.2s ${i * 0.18}s ease-in-out infinite` }} />
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="ask-ali-dock">
          <div className="input-mode-toggle">
            <button
              className={`input-mode-btn${mode === 'voice' ? ' active' : ''}`}
              onClick={() => setMode('voice')}
              disabled={loading || isListening}
            >
              <MicIcon size={14} color="currentColor" /> Voice
            </button>
            <button
              className={`input-mode-btn${mode === 'text' ? ' active' : ''}`}
              onClick={() => { setMode('text'); recRef.current?.stop(); }}
              disabled={loading}
            >
              <KeyboardIcon size={14} color="currentColor" /> Type
            </button>
          </div>

          {mode === 'text' ? (
            <div className="chat-text-input">
              <input
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send(textInput)}
                placeholder={loading ? 'Ali is thinking…' : 'Ask about your setup…'}
                disabled={loading}
                autoFocus
              />
              <button onClick={() => send(textInput)} disabled={!textInput.trim() || loading} aria-label="Send">
                <SendIcon size={18} color="#fff" />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <button
                onClick={isListening ? () => recRef.current?.stop() : startVoice}
                disabled={loading || isSpeaking}
                aria-label={isListening ? 'Stop listening' : 'Start speaking'}
                style={{
                  width: 62, height: 62, borderRadius: '50%', border: 'none',
                  background: isListening ? 'var(--accent)' : 'var(--ink)', color: '#fff',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: !isListening ? '0 6px 20px var(--shadow)' : 'none',
                  transition: 'all 0.3s', opacity: loading || isSpeaking ? 0.5 : 1,
                }}
              >
                <MicIcon size={24} color="#fff" />
              </button>
              <div className="chat-dock-hint">
                {isListening ? 'Listening… tap to stop' : isSpeaking ? 'Ali is talking…' : 'Tap to speak'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ────────────────────────────────────────────────────────────────────
export default function EraApp() {
  const [screen,     setScreen]     = useState<Screen>('landing');
  const [flowKey,    setFlowKey]    = useState(0);
  const [eraReveal,  setEraReveal]  = useState<EraRevealPayload | null>(null);
  const [discoveryCtx, setDiscoveryCtx] = useState<{ userName?: string; summary?: string } | null>(null);
  const [askAliOpen,    setAskAliOpen]    = useState(false);
  const [hintShown,     setHintShown]     = useState(false); // has Ali introduced Ask Ali yet?
  const [showHint,      setShowHint]      = useState(false); // is the arrow + label currently visible?
  const [mood,          setMood]          = useState('sage');
  const [mobileFrame,   setMobileFrame]   = useState(false); // demo wrapper to simulate phone view

  useEffect(() => {
    const saved = localStorage.getItem('era-mood') || 'sage';
    setMood(saved);
    setMobileFrame(localStorage.getItem('era-mobile-frame') === '1');
    primeVoices(); // load Google voices before Ali speaks for the first time
    prewarmTTS();  // wake up the GCP TTS client + route so first message is faster
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-mood', mood);
  }, [mood]);

  const toggleMood = () => {
    const next = mood === 'sage' ? 'sand' : 'sage';
    setMood(next);
    localStorage.setItem('era-mood', next);
  };

  const toggleMobileFrame = () => {
    setMobileFrame(prev => {
      const next = !prev;
      localStorage.setItem('era-mobile-frame', next ? '1' : '0');
      return next;
    });
  };

  const go = (s: Screen) => setScreen(s);

  const restart = () => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis?.cancel();
      if (currentAudio) { currentAudio.pause(); currentAudio = null; }
    }
    setFlowKey(k => k + 1);
    setEraReveal(null);
    setDiscoveryCtx(null);
    setAskAliOpen(false);
    setHintShown(false);
    setShowHint(false);
    go('landing');
  };

  // First time the user lands on the Recs screen, Ali introduces the Ask Ali
  // button with a spoken line + an arrow that points to the floating pill.
  useEffect(() => {
    if (screen !== 'recs' || hintShown || !eraReveal) return;
    setHintShown(true);

    const intro = discoveryCtx?.userName
      ? `Oh — and ${discoveryCtx.userName}, if you have any questions about your era or the gear I picked out, just tap Ask Ali. I'll be right here.`
      : `Oh — and if you have any questions about your era or the gear I picked out, just tap Ask Ali. I'll be right here.`;

    // Let the recs screen settle before Ali speaks
    const introTimer = setTimeout(() => {
      setShowHint(true);
      speak(intro, () => {
        // Keep the hint visible for a moment after speech ends, then fade
        setTimeout(() => setShowHint(false), 4000);
      });
    }, 1400);

    return () => clearTimeout(introTimer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, eraReveal]);

  // Dismiss the hint instantly if user opens the panel
  useEffect(() => { if (askAliOpen) setShowHint(false); }, [askAliOpen]);

  // Extract name and discovery summary from the chat history
  const handleChatComplete = (reveal: EraRevealPayload, msgs: { role: 'user' | 'assistant'; content: string }[]) => {
    const userMsgs = msgs.filter(m => m.role === 'user').slice(1); // drop hidden kickoff
    // First visible user reply is their name; clean up trailing punctuation/articles
    const firstReply = userMsgs[0]?.content.trim() || '';
    const nameMatch = firstReply.match(/(?:^|i'?m |i am |it'?s |this is |call me |my name is )?([A-Za-z][A-Za-z\-']{1,24})/i);
    const userName = nameMatch ? nameMatch[1].replace(/[.!?,]$/, '') : undefined;
    // Summarize: skip the name reply, join the rest
    const summary = userMsgs.slice(1).map((m, i) => `Q${i + 1}: ${m.content}`).join('\n');
    setDiscoveryCtx({ userName, summary });
    setEraReveal(reveal);
    go('reveal');
  };

  return (
    <div id="era-app" className={mobileFrame ? 'mobile-frame' : ''}>
      <div key={screen} style={{ position: 'absolute', inset: 0 }}>
        {screen === 'landing' && (
          <LandingScreen
            mood={mood}
            onToggleMood={toggleMood}
            mobileFrame={mobileFrame}
            onToggleFrame={toggleMobileFrame}
            onStart={() => go('intro')}
          />
        )}
        {screen === 'intro' && (
          <IntroScreen onDone={() => go('chat')} />
        )}
        {screen === 'chat' && (
          <ChatScreen
            key={flowKey}
            onComplete={handleChatComplete}
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

      {/* Persistent "Ask Ali" floating button on recs and share screens */}
      {eraReveal && (screen === 'recs' || screen === 'share') && !askAliOpen && (
        <>
          {/* First-time hint pointing at the Ask Ali pill */}
          {showHint && (
            <div className="ask-ali-hint">
              <div className="ask-ali-hint-note">
                Right here whenever<br />you need me <span style={{ fontSize: 18 }}>✦</span>
              </div>
              <svg className="ask-ali-hint-arrow" width="24" height="56" viewBox="0 0 24 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 4 L 12 46"
                  stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none"
                />
                <path
                  d="M4 38 L 12 50 L 20 38"
                  stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none"
                />
              </svg>
            </div>
          )}
          <button
            className={`ask-ali-fab${showHint ? ' pulsing' : ''}`}
            onClick={() => setAskAliOpen(true)}
            aria-label="Ask Ali"
          >
            <AliOrb size={36} state={showHint ? 'speaking' : 'idle'} />
            <span className="ask-ali-fab-label">Ask Ali</span>
          </button>
        </>
      )}

      {askAliOpen && eraReveal && (
        <AskAliPanel
          eraReveal={eraReveal}
          userName={discoveryCtx?.userName}
          discoverySummary={discoveryCtx?.summary}
          onClose={() => setAskAliOpen(false)}
        />
      )}
    </div>
  );
}
