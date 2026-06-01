'use client';

import { useEffect, useState } from 'react';

const ROTS   = ['-1.3deg', '0.9deg', '0.5deg', '-0.8deg'];
const DELAYS = ['0.04s',   '0.11s',  '0.18s',  '0.25s'];
const PROTS  = ['-2deg', '1.8deg', '-1.1deg'];

const QUESTIONS = [
  {
    label: 'Moment 01',
    text:  "What's pulling your <em>attention</em> right now?",
    sub:   'Choose what feels most true.',
    answers: [
      { text: "A project I want to <em>make</em> — something that hasn't existed before.", era: 'creator'   },
      { text: "Building something that could actually <em>change</em> an industry.",        era: 'visionary' },
      { text: "Hitting the <em>goals</em> I set for myself — and setting bigger ones.",     era: 'achiever'  },
      { text: "Finding more <em>freedom</em> in how and where I spend my time.",            era: 'explorer'  },
    ],
  },
  {
    label: 'Moment 02',
    text:  "Where do your best <em>ideas</em> come from?",
    sub:   'Trust your instinct here.',
    answers: [
      { text: "A blank page, a new playlist, and space to <em>wander</em>.",                   era: 'creator'   },
      { text: "Challenging the <em>premise</em> — asking why it has to be this way at all.",   era: 'visionary' },
      { text: "A clear goal, a deadline, and the drive to <em>outperform</em>.",               era: 'achiever'  },
      { text: "New places, new people — <em>movement</em> unlocks everything.",                era: 'explorer'  },
    ],
  },
  {
    label: 'Moment 03',
    text:  "What does a <em>good day</em> look like for you?",
    sub:   'Paint the picture.',
    answers: [
      { text: "I made something <em>beautiful</em> and people felt it.",                       era: 'creator'   },
      { text: "I moved something forward that matters — at <em>scale</em>.",                   era: 'visionary' },
      { text: "I crossed every item off the list and still had <em>energy</em> left.",         era: 'achiever'  },
      { text: "I was somewhere I'd never been, doing something <em>unexpected</em>.",          era: 'explorer'  },
    ],
  },
  {
    label: 'Moment 04',
    text:  "What are you <em>ready</em> to do more of?",
    sub:   'No wrong answer.',
    answers: [
      { text: "Releasing work into the world — more <em>boldly</em>.",             era: 'creator'   },
      { text: "Taking the big <em>swing</em>, not just the safe one.",             era: 'visionary' },
      { text: "Leading — stepping into rooms where <em>decisions</em> are made.", era: 'achiever'  },
      { text: "Saying yes to things that <em>scare</em> me a little.",             era: 'explorer'  },
    ],
  },
  {
    label: 'Moment 05',
    text:  "Which word feels most like your <em>next chapter</em>?",
    sub:   'The last one. Make it count.',
    answers: [
      { text: "<em>Expression.</em> My voice, my vision, my mark on the world.",          era: 'creator'   },
      { text: "<em>Impact.</em> Something I built that outlasts the moment.",             era: 'visionary' },
      { text: "<em>Momentum.</em> Forward, always — with intention behind every step.",  era: 'achiever'  },
      { text: "<em>Freedom.</em> The open road, the open tab, the open question.",        era: 'explorer'  },
    ],
  },
];

type Product = { name: string; price: string; orig: string; save: string; caption: string; imageUrl: string; productUrl: string };
type Era     = { name: string; tagline: string; description: string; primaryColor: string; products: Product[] };

const ERAS: Record<string, Era> = {
  creator: {
    name:         'The Creator Era',
    tagline:      "You don't follow trends. You set them.",
    description:  "Your next chapter is defined by what you make — the art, the content, the work that only you could bring into the world. This era belongs to the ones who build beautiful things and dare to share them.",
    primaryColor: '#8B5CF6',
    products: [
      {
        name: 'Dell XPS 16', price: '$1,799', orig: '$2,199', save: '$400',
        caption:    'Your work deserves a canvas this beautiful.',
        imageUrl:   'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/16-9640/media-gallery/silver/touch/notebook-laptop-xps-16-9640-t-silver-gallery-2.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=612&qlt=100,1&resMode=sharp2&size=612,402&chrss=full',
        productUrl: 'https://www.dell.com/en-us/shop/dell-laptops/xps-16-laptop/spd/xps-16-9640-laptop',
      },
      {
        name: 'Dell UltraSharp 27 4K Monitor', price: '$449', orig: '$699', save: '$250',
        caption:    'Every pixel of your vision, rendered faithfully.',
        imageUrl:   'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/peripherals/monitors/u-series/u2725qe/media-gallery/monitor-ultrasharp-u2725qe-gy-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=804&wid=906&qlt=100,1&resMode=sharp2&size=906,804&chrss=full',
        productUrl: 'https://www.dell.com/en-us/shop/dell-ultrasharp-27-4k-thunderbolt-hub-monitor-u2725qe/apd/210-bqhr/monitors-monitor-accessories',
      },
      {
        name: 'Dell Canvas 27', price: '$1,299', orig: '$1,799', save: '$500',
        caption:    'Draw, design, and create right on your screen.',
        imageUrl:   'https://i.dell.com/is/image/DellContent/content/dam/images/products/workstations/dell-canvas/kv2718d/canvas-kv2718d-bk-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=527&qlt=100,1&resMode=sharp2&size=527,402&chrss=full',
        productUrl: 'https://www.dell.com/en-us/shop/cty/dell-canvas/spd/dell-canvas-kv2718d',
      },
    ],
  },
  achiever: {
    name:         'The Achiever Era',
    tagline:      "You don't aim for the bar. You raise it.",
    description:  "Strategy, execution, and relentless forward motion — this era is for the ones who turn ambition into outcomes. You lead rooms, hit goals, and immediately set bigger ones.",
    primaryColor: '#F59E0B',
    products: [
      {
        name: 'Dell Latitude 9550', price: '$1,899', orig: '$2,399', save: '$500',
        caption:    'Business-grade speed, security, and stamina.',
        imageUrl:   'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/latitude-notebooks/latitude-14-9450-laptop-2-in-1/mg/notebook-latitude-14-9450-t-wlan-gray-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=527&qlt=100,1&resMode=sharp2&size=527,402&chrss=full',
        productUrl: 'https://www.dell.com/en-us/shop/dell-laptops/latitude-9450-2-in-1/spd/latitude-14-9450-2-in-1-laptop',
      },
      {
        name: 'Dell Thunderbolt Dock WD22TB4', price: '$249', orig: '$349', save: '$100',
        caption:    'One cable. Every device. Zero friction.',
        imageUrl:   'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/peripherals/docks/dell-thunderbolt-4-dock-wd22tb4/spi/ng/dock-wd22tb4-black-campaign-hero-504x350-ng.psd?qlt=95&fmt=jpg',
        productUrl: 'https://www.dell.com/en-us/shop/dell-thunderbolt-dock-wd22tb4/apd/210-bdqh/docks',
      },
      {
        name: 'Dell 27 Monitor P2725HE', price: '$299', orig: '$449', save: '$150',
        caption:    'Clear display for the decisions that matter.',
        imageUrl:   'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/peripherals/monitors/p-series/p2725he/media-gallery/monitor-pseries-p2725he-bk-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=804&wid=907&qlt=100,1&resMode=sharp2&size=907,804&chrss=full',
        productUrl: 'https://www.dell.com/en-us/shop/dell-pro-27-plus-usb-c-hub-monitor-p2725he/apd/210-bmfq/monitors-monitor-accessories',
      },
    ],
  },
  explorer: {
    name:         'The Explorer Era',
    tagline:      "The whole world is your workspace.",
    description:  "You don't need a desk to do your best work. This era belongs to the ones who thrive in motion — trading the commute for curiosity and building a life that moves as fast as you do.",
    primaryColor: '#10B981',
    products: [
      {
        name: 'Dell XPS 13', price: '$1,099', orig: '$1,399', save: '$300',
        caption:    'The whole world is your office.',
        imageUrl:   'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/9345/media-gallery/touch/silver/xps-13-9345-laptop-silver-copilot-pc-mg.png?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=612&qlt=100,1&resMode=sharp2&size=612,402&chrss=full',
        productUrl: 'https://www.dell.com/en-us/shop/dell-laptops/xps-13-laptop/spd/xps-13-9345-laptop',
      },
      {
        name: 'Dell Pro Wireless Headset WL5022', price: '$149', orig: '$229', save: '$80',
        caption:    'Crystal-clear calls from wherever you roam.',
        imageUrl:   'https://i.dell.com/is/image/DellContent/content/dam/images/products/electronics-and-accessories/dell/headphones/wl5022/wl5022-xau-02-bk.psd?fmt=jpg&wid=527&hei=527',
        productUrl: 'https://www.dell.com/en-us/shop/dell-pro-wireless-headset-wl5022/apd/520-aatb/pc-accessories',
      },
      {
        name: 'Dell Power Companion PW7018LC', price: '$129', orig: '$179', save: '$50',
        caption:    'Keep going long after the outlet runs out.',
        imageUrl:   'https://i.dell.com/is/image/DellContent/content/dam/images/products/electronics-and-accessories/dell/power-adapters-batteries/pw7018lc/pw7018lc-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=527&qlt=100,1&resMode=sharp2&size=527,402&chrss=full',
        productUrl: 'https://www.dell.com/en-us/shop/dell-notebook-power-bank-plus-usb-c-65wh-pw7018lc/apd/451-bcev/pc-accessories',
      },
    ],
  },
  visionary: {
    name:         'The Visionary Era',
    tagline:      "You're not disrupting the industry. You're building the next one.",
    description:  "Legacy-level thinking, mission-driven work, and the courage to bet on ideas that haven't been proven yet. This era is for the ones who don't just see what's coming — they build it.",
    primaryColor: '#7C3AED',
    products: [
      {
        name: 'Dell XPS 16', price: '$1,799', orig: '$2,199', save: '$400',
        caption:    'Power that matches the scale of your ambition.',
        imageUrl:   'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/16-9640/media-gallery/silver/touch/notebook-laptop-xps-16-9640-t-silver-gallery-2.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=612&qlt=100,1&resMode=sharp2&size=612,402&chrss=full',
        productUrl: 'https://www.dell.com/en-us/shop/dell-laptops/xps-16-laptop/spd/xps-16-9640-laptop',
      },
      {
        name: 'Dell 40 Curved Conference Monitor', price: '$999', orig: '$1,399', save: '$400',
        caption:    'A panoramic view for people thinking at that scale.',
        imageUrl:   'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/peripherals/monitors/u-series/u4025qw/media-gallery/monitor-ultrasharp-u4025qw-gray-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=804&wid=1242&qlt=100,1&resMode=sharp2&size=1242,804&chrss=full',
        productUrl: 'https://www.dell.com/en-us/shop/dell-ultrasharp-40-curved-thunderbolt-hub-monitor-u4025qw/apd/210-bmdp/monitors-monitor-accessories',
      },
      {
        name: 'Dell Premier Wireless KM7321W', price: '$249', orig: '$349', save: '$100',
        caption:    'A workspace as polished as your pitch.',
        imageUrl:   'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/peripherals/input-devices/dell/keyboards/km7321w/global-spi/ng/dell-keyboard-mouse-km7321w-pdp-relsize-500-ng.psd?fmt=png-alpha',
        productUrl: 'https://www.dell.com/en-us/shop/dell-premier-multi-device-wireless-keyboard-and-mouse-km7321w/apd/580-ajix/pc-accessories',
      },
    ],
  },
};

export default function EraQuiz() {
  const [showStart, setShowStart]   = useState(true);
  const [startOut,  setStartOut]    = useState(false);
  const [screen,    setScreen]      = useState<'quiz' | 'result'>('quiz');
  const [currentQ,  setCurrentQ]    = useState(0);
  const [answers,   setAnswers]     = useState<string[]>([]);
  const [mood,      setMood]        = useState('sage');
  const [answering, setAnswering]   = useState(false);
  const [selIdx,    setSelIdx]      = useState<number | null>(null);
  const [cardKey,   setCardKey]     = useState(0);
  const [fading,    setFading]      = useState(false);
  const [resultEra, setResultEra]   = useState<string | null>(null);

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

  const handleStart = () => {
    setStartOut(true);
    setTimeout(() => setShowStart(false), 360);
  };

  const pickAnswer = (idx: number, era: string) => {
    if (answering) return;
    setAnswering(true);
    setSelIdx(idx);
    const newAnswers = [...answers, era];

    setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        if (currentQ < QUESTIONS.length - 1) {
          setAnswers(newAnswers);
          setCurrentQ(q => q + 1);
          setSelIdx(null);
          setAnswering(false);
          setCardKey(k => k + 1);
          setFading(false);
        } else {
          const scores: Record<string, number> = { creator: 0, achiever: 0, explorer: 0, visionary: 0 };
          newAnswers.forEach(e => { scores[e] = (scores[e] || 0) + 1; });
          const top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
          localStorage.setItem('era-result', top);
          setResultEra(top);
          setScreen('result');
          setFading(false);
        }
      }, 220);
    }, 520);
  };

  const restart = () => {
    setAnswers([]);
    setCurrentQ(0);
    setSelIdx(null);
    setAnswering(false);
    setResultEra(null);
    setCardKey(k => k + 1);
    setScreen('quiz');
    localStorage.removeItem('era-result');
  };

  const q        = QUESTIONS[currentQ];
  const era      = resultEra ? ERAS[resultEra] : null;
  const progress = screen === 'result' ? 100 : (currentQ / 5) * 100;
  const counter  = screen === 'result' ? 'Era Revealed' : `Question ${currentQ + 1} of 5`;

  return (
    <>
      {/* Sticky notes */}
      <div className="sticky sticky-1">discover<br />your next<br />chapter ✦</div>
      <div className="sticky sticky-2">black friday<br />is here</div>
      <div className="sticky sticky-3">find your<br />era →</div>

      {/* Start overlay */}
      {showStart && (
        <div id="start-screen" className={startOut ? 'out' : ''}>
          <div className="s-label">Dell Technologies — Black Friday 2026</div>
          <div className="s-title">
            The Next<br /><em>Era Event</em>
          </div>
          <div className="s-byline">Five questions. One era. Your next chapter starts here.</div>
          <button className="s-btn" onClick={handleStart}>Begin Your Era</button>
        </div>
      )}

      {/* App shell — always in DOM so it appears the instant the overlay lifts */}
      <div id="app">
        {/* Metadata bar */}
        <div id="meta-bar">
          <div className="meta-left">
            <div className="brand-lockup">
              <strong>Dell Technologies</strong><br />Black Friday 2026
            </div>
            <div className="divider-dot" />
            <div className="event-name">The Next Era Event</div>
          </div>
          <div className="meta-right">
            <div id="q-counter">{counter}</div>
            <button id="mood-toggle" onClick={toggleMood}>
              <div className="mood-dot" />
              <span>{mood === 'sage' ? 'Sage' : 'Sand'}</span>
            </button>
          </div>
        </div>

        {/* Progress track */}
        <div id="progress-track">
          <div id="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Content area */}
        <div id="content-area">

          {/* Quiz view */}
          {screen === 'quiz' && (
            <div id="quiz-view" style={{ opacity: fading ? 0 : 1 }}>
              <div id="question-zone">
                <div className="q-top">
                  <div className="q-label">{q.label}</div>
                  <h2 className="q-text" dangerouslySetInnerHTML={{ __html: q.text }} />
                  <p className="q-sub">{q.sub}</p>
                </div>
                <div className="q-bottom">
                  <p className="nav-hint">tap a card to choose your answer</p>
                </div>
              </div>
              <div id="answer-zone">
                <div className="cards-grid" key={cardKey}>
                  {q.answers.map((ans, i) => (
                    <div
                      key={i}
                      className={`answer-card${selIdx === i ? ' selected' : ''}`}
                      style={{ '--rot': ROTS[i], animationDelay: DELAYS[i] } as React.CSSProperties}
                      onClick={() => pickAnswer(i, ans.era)}
                    >
                      <div className="card-letter">{'ABCD'[i]}</div>
                      <div className="card-text" dangerouslySetInnerHTML={{ __html: ans.text }} />
                      <div className="card-check">✓</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Result view */}
          {screen === 'result' && era && (
            <div
              id="result-screen"
              className="visible"
              style={{ '--era-primary': era.primaryColor } as React.CSSProperties}
            >
              <div id="result-left">
                <div className="r-label">Your Era Has Been Revealed</div>
                <div id="r-era-name">{era.name}</div>
                <div id="r-tagline">{era.tagline}</div>
                <div id="r-description">{era.description}</div>
                <div className="r-shop-cta">Shop your era at Dell.com &rarr; black friday deals live now</div>
                <button className="retry-btn" onClick={restart}>Start Over</button>
              </div>
              <div id="result-right">
                <div className="polaroids-row">
                  {era.products.map((p, i) => (
                    <div
                      key={i}
                      className="polaroid"
                      style={{ '--prot': PROTS[i], '--era-primary': era.primaryColor } as React.CSSProperties}
                    >
                      <div className="polaroid-photo">
                        <img src={p.imageUrl} alt={p.name} className="polaroid-img" />
                      </div>
                      <div className="polaroid-name">{p.name}</div>
                      <div className="polaroid-prices">
                        <span className="polaroid-price">{p.price}</span>
                        <span className="polaroid-original">{p.orig}</span>
                      </div>
                      <div className="polaroid-caption">{p.caption}<br /><em>Save {p.save}</em></div>
                      <a href={p.productUrl} target="_blank" rel="noopener noreferrer" className="polaroid-link">
                        Shop on Dell.com →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div id="footer-bar">
          <div className="footer-copy">&copy; 2026 Dell Technologies &middot; Black Friday</div>
          <div className="footer-cta">Dell.com/blackfriday</div>
        </div>
      </div>
    </>
  );
}
