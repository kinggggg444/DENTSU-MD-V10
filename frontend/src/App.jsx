import { useState, useEffect, useRef, useCallback } from 'react';

const API_URL = '/api';
const BOT_NAME = import.meta.env.VITE_BOT_NAME || 'DENTSU MD V10';
const DEV_NAME = import.meta.env.VITE_DEV_NAME || "NatsuTech's 🇨🇬";
const BOT_IMAGE = import.meta.env.VITE_BOT_IMAGE || 'https://raw.githubusercontent.com/kinggggg444/DENTSU-MD-V10/main/assets/dentsu-md-v10-banner.jpg';
const CHANNEL_LINK = import.meta.env.VITE_CHANNEL_LINK || 'https://whatsapp.com/channel/0029VbC1s7fFnSz1YhZYc01h';
const GROUP_LINK = import.meta.env.VITE_GROUP_LINK || 'https://chat.whatsapp.com/GtXASqDdchAFvEJ95cQQ0F';
const TELEGRAM = import.meta.env.VITE_TELEGRAM || 'https://t.me/Natsu_or_Dentsu';
const YOUTUBE = import.meta.env.VITE_YOUTUBE || 'https://youtube.com/@Natsu-ras';

const FEATURES = [
  {
    icon: '🧠', title: 'Artificial Intelligence',
    color: '#a78bfa',
    desc: 'GPT-4, Gemini, DeepSeek and more AI models at your fingertips.',
    commands: ['.gpt', '.gemini', '.deepseek', '.imagine']
  },
  {
    icon: '📥', title: 'Downloader',
    color: '#34d399',
    desc: 'Download videos and audio from any major platform instantly.',
    commands: ['.ytmp3', '.tiktok', '.insta', '.fb']
  },
  {
    icon: '👥', title: 'Group Management',
    color: '#60a5fa',
    desc: 'Full control over your groups — kick, promote, tag, and more.',
    commands: ['.tagall', '.kick', '.promote', '.mute']
  },
  {
    icon: '🎮', title: 'Games',
    color: '#f59e0b',
    desc: 'Keep your group entertained with fun interactive games.',
    commands: ['.rps', '.hangman', '.math', '.rpsls']
  },
  {
    icon: '🎉', title: 'Fun & Social',
    color: '#f472b6',
    desc: 'Truth or dare, ship meter, roasts and social fun commands.',
    commands: ['.truth', '.dare', '.ship', '.roast']
  },
  {
    icon: '🎵', title: 'Audio & Voice',
    color: '#fb923c',
    desc: 'Text-to-speech, bass boost and audio effects in seconds.',
    commands: ['.tts', '.say', '.bass', '.pitch']
  },
  {
    icon: '📸', title: 'Media & Stickers',
    color: '#22d3ee',
    desc: 'Create stickers, enhance images and apply cool effects.',
    commands: ['.sticker', '.remini', '.blur', '.enhance']
  },
  {
    icon: '🔍', title: 'Search',
    color: '#4ade80',
    desc: 'Search images, YouTube, GitHub and the web instantly.',
    commands: ['.img', '.yts', '.github', '.wiki']
  },
  {
    icon: '🖼️', title: 'Random Images',
    color: '#e879f9',
    desc: 'Anime waifus, car images, memes and random content.',
    commands: ['.waifu', '.neko', '.carimage', '.meme']
  },
  {
    icon: '🎌', title: 'Anime',
    color: '#f43f5e',
    desc: 'Anime info, manga search, lyrics and fan art content.',
    commands: ['.manga', '.lyrics', '.anime', '.neko']
  },
  {
    icon: '🔧', title: 'Utilities',
    color: '#94a3b8',
    desc: 'Weather, wiki, calculator and dozens of useful tools.',
    commands: ['.weather', '.wiki', '.calc', '.translate']
  },
  {
    icon: '👑', title: 'Owner / Admin',
    color: '#fbbf24',
    desc: 'Broadcast messages, set modes, block users and admin tools.',
    commands: ['.broadcast', '.mode', '.block', '.restart']
  },
];

const STEPS = [
  { n: '01', icon: '🌐', title: 'Open this site', desc: 'You\'re already here! Scroll up or click "Connect Now".' },
  { n: '02', icon: '📱', title: 'Enter your number', desc: 'Type your WhatsApp number with country code (no + sign).' },
  { n: '03', icon: '🔑', title: 'Get your code', desc: 'Receive your unique 8-character pairing code instantly.' },
  { n: '04', icon: '✅', title: 'Link in WhatsApp', desc: 'Go to Menu → Linked Devices → Link with phone number → Enter code.' },
];

const STATS = [
  { value: '200+', label: 'Commands' },
  { value: '50', label: 'Max Sessions' },
  { value: '24/7', label: 'Online' },
  { value: 'V10', label: 'Latest Version' },
];

// ── Scroll reveal hook ──
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); } }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ── Icons ──
function WaIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="currentColor">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.474 2.027 7.773L0 32l8.476-2.003A15.94 15.94 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 01-6.773-1.853l-.487-.29-5.027 1.187 1.253-4.893-.32-.507A13.267 13.267 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667c7.363 0 13.333 5.97 13.333 13.333 0 7.363-5.97 13.333-13.333 13.333zm7.307-9.947c-.4-.2-2.367-1.167-2.733-1.3-.367-.133-.633-.2-.9.2-.267.4-1.033 1.3-1.267 1.567-.233.267-.467.3-.867.1-.4-.2-1.687-.623-3.213-1.98-1.187-1.057-1.987-2.363-2.22-2.763-.233-.4-.025-.617.175-.817.18-.18.4-.467.6-.7.2-.233.267-.4.4-.667.133-.267.067-.5-.033-.7-.1-.2-.9-2.167-1.233-2.967-.325-.78-.655-.673-.9-.685-.233-.012-.5-.015-.767-.015s-.7.1-1.067.5c-.367.4-1.4 1.367-1.4 3.333s1.433 3.867 1.633 4.133c.2.267 2.82 4.307 6.833 6.04 4.013 1.733 4.013 1.155 4.733 1.083.72-.073 2.367-.967 2.7-1.9.333-.933.333-1.733.233-1.9-.1-.167-.367-.267-.767-.467z"/>
    </svg>
  );
}

function TgIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="currentColor">
      <path d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0zm7.9 10.933l-2.693 12.694c-.2.893-.727 1.113-1.473.693l-4.08-3.007-1.967 1.893c-.22.22-.4.4-.813.4l.287-4.147 7.507-6.78c.327-.293-.073-.453-.507-.16L9.22 17.4l-4-1.253c-.867-.273-.88-.867.187-1.287l15.6-6.013c.72-.267 1.353.16 1.12 1.087h-.227z"/>
    </svg>
  );
}

function YtIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="currentColor">
      <path d="M31.33 8.37a4.01 4.01 0 00-2.82-2.84C26.04 5 16 5 16 5s-10.04 0-12.51.53A4.01 4.01 0 00.67 8.37 42.1 42.1 0 000 16a42.1 42.1 0 00.67 7.63 4.01 4.01 0 002.82 2.84C5.96 27 16 27 16 27s10.04 0 12.51-.53a4.01 4.01 0 002.82-2.84A42.1 42.1 0 0032 16a42.1 42.1 0 00-.67-7.63zM13 20.5v-9l8 4.5-8 4.5z"/>
    </svg>
  );
}

// ── Pairing form component ──
function PairForm({ sessions }) {
  const [step, setStep] = useState('form');
  const [number, setNumber] = useState('');
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);

  const handlePair = async (e) => {
    e.preventDefault();
    const sanitized = number.replace(/[^0-9]/g, '');
    if (sanitized.length < 7 || sanitized.length > 15) {
      setErrorMsg('Invalid number. Example: 242053323191');
      setStep('error');
      return;
    }
    setStep('loading');
    try {
      const res = await fetch(`${API_URL}/pair`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number: sanitized }),
      });
      const data = await res.json();
      if (data.success && data.code) {
        setCode(data.code);
        setStep('success');
      } else if (data.success && !data.code) {
        setErrorMsg('This number is already connected to the bot!');
        setStep('error');
      } else {
        setErrorMsg(data.error || 'Unknown error occurred.');
        setStep('error');
      }
    } catch {
      setErrorMsg('Network error. Check your connection and try again.');
      setStep('error');
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const reset = () => { setStep('form'); setNumber(''); setCode(''); setErrorMsg(''); };

  return (
    <div className="pair-card">
      {step === 'form' && (
        <form onSubmit={handlePair} className="pair-form">
          <div className="pair-sessions">
            <span className="sessions-dot" />
            <span>{sessions} / 50 active sessions</span>
          </div>
          <h2 className="pair-title">Connect Your WhatsApp</h2>
          <p className="pair-sub">Enter your number with country code to get your 8-character pairing code</p>
          <div className="pair-input-wrap">
            <span className="pair-flag">🌍</span>
            <input
              ref={inputRef}
              type="tel"
              value={number}
              onChange={e => setNumber(e.target.value)}
              placeholder="e.g. 242053323191"
              className="pair-input"
              maxLength={15}
              inputMode="numeric"
              required
            />
          </div>
          <p className="pair-hint">⚠️ Country code without + &nbsp;·&nbsp; Example: <strong>242</strong>XXXXXXXXX</p>
          <button type="submit" className="btn-connect">
            <WaIcon size={20} /> Get Pairing Code
          </button>
        </form>
      )}

      {step === 'loading' && (
        <div className="pair-loading">
          <div className="spinner" />
          <p>Generating your pairing code…</p>
        </div>
      )}

      {step === 'success' && (
        <div className="pair-success">
          <div className="success-icon">🔑</div>
          <h2>Your Pairing Code</h2>
          <p className="success-sub">Enter this code in WhatsApp → Linked Devices</p>
          <div className="code-display">{code}</div>
          <button className="btn-copy" onClick={copy}>
            {copied ? '✅ Copied!' : '📋 Copy Code'}
          </button>
          <div className="success-steps">
            {['Open WhatsApp on your phone', 'Menu (⋮) → Linked Devices', 'Link a Device → Link with phone number', 'Enter the code above'].map((s, i) => (
              <div key={i} className="sstep"><span className="sstep-n">{i + 1}</span><span>{s}</span></div>
            ))}
          </div>
          <div className="code-warning">⏱️ Code expires in <strong>60 seconds</strong> — enter it quickly!</div>
          <button className="btn-outline" onClick={reset}>Try another number</button>
        </div>
      )}

      {step === 'error' && (
        <div className="pair-error">
          <div className="error-icon">⚠️</div>
          <h2>Oops!</h2>
          <p className="error-msg">{errorMsg}</p>
          <button className="btn-connect" onClick={reset}><WaIcon size={18} /> Try Again</button>
        </div>
      )}
    </div>
  );
}

// ── Main App ──
export default function App() {
  const [sessions, setSessions] = useState(0);
  const connectRef = useRef(null);

  useScrollReveal();

  useEffect(() => {
    fetch(`${API_URL}/status`)
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setSessions(d.count || 0))
      .catch(() => {});
  }, []);

  const scrollToConnect = () => {
    connectRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="site">

      {/* ── Ambient background ── */}
      <div className="ambient">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="grid-overlay" />
      </div>

      {/* ══════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════ */}
      <section className="hero">
        <nav className="nav">
          <div className="nav-logo">
            <span className="nav-dot" />
            {BOT_NAME}
          </div>
          <button className="nav-cta" onClick={scrollToConnect}>Connect Now</button>
        </nav>

        <div className="hero-inner">
          <div className="hero-badge">🤖 WhatsApp Bot · V10.0 · Multi-Session</div>
          <h1 className="hero-title">
            <span className="hero-dentsu">DENTSU</span>
            <span className="hero-md">MD</span>
            <span className="hero-v10">V10</span>
          </h1>
          <p className="hero-sub">
            The next-generation WhatsApp bot with <strong>200+ commands</strong> — AI, downloads, games, group management and much more. Built by <strong>{DEV_NAME}</strong>.
          </p>
          <div className="hero-actions">
            <button className="btn-hero-primary" onClick={scrollToConnect}>
              <WaIcon size={22} /> Connect My WhatsApp
            </button>
            <a className="btn-hero-secondary" href={CHANNEL_LINK} target="_blank" rel="noopener noreferrer">
              View Channel
            </a>
          </div>
          <div className="hero-banner-wrap">
            <img src={BOT_IMAGE} alt={BOT_NAME} className="hero-banner" />
            <div className="hero-banner-glow" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          STATS
      ══════════════════════════════════════════════ */}
      <section className="stats-section">
        <div className="stats-grid">
          {STATS.map((s, i) => (
            <div key={i} className="stat-card" data-reveal data-delay={i * 80}>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CONNECT
      ══════════════════════════════════════════════ */}
      <section className="connect-section" ref={connectRef}>
        <div className="section-header" data-reveal>
          <span className="section-tag">⚡ Quick Connect</span>
          <h2 className="section-title">Start Using The Bot</h2>
          <p className="section-desc">No QR code needed. Get your pairing code in seconds and link your WhatsApp instantly.</p>
        </div>
        <div data-reveal>
          <PairForm sessions={sessions} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════ */}
      <section className="how-section">
        <div className="section-header" data-reveal>
          <span className="section-tag">📋 Setup Guide</span>
          <h2 className="section-title">How It Works</h2>
          <p className="section-desc">Connect in under a minute — no technical skills required.</p>
        </div>
        <div className="steps-grid">
          {STEPS.map((s, i) => (
            <div key={i} className="step-card" data-reveal data-delay={i * 100}>
              <div className="step-number">{s.n}</div>
              <div className="step-icon">{s.icon}</div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
              {i < STEPS.length - 1 && <div className="step-arrow">→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════ */}
      <section className="features-section">
        <div className="section-header" data-reveal>
          <span className="section-tag">🚀 Capabilities</span>
          <h2 className="section-title">200+ Commands Across 12 Categories</h2>
          <p className="section-desc">Everything your group needs — powered by cutting-edge APIs and AI models.</p>
        </div>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="feature-card"
              data-reveal
              data-delay={((i % 4) * 80).toString()}
              style={{ '--accent': f.color }}
            >
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
              <div className="feature-commands">
                {f.commands.map(cmd => (
                  <code key={cmd} className="cmd-chip">{cmd}</code>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          COMMUNITY
      ══════════════════════════════════════════════ */}
      <section className="community-section">
        <div className="community-inner" data-reveal>
          <h2 className="community-title">Join the Community</h2>
          <p className="community-sub">Stay updated with the latest features, tutorials and bot news.</p>
          <div className="community-links">
            <a href={CHANNEL_LINK} target="_blank" rel="noopener noreferrer" className="social-card wa">
              <WaIcon size={28} />
              <div><strong>WhatsApp Channel</strong><span>Official announcements</span></div>
            </a>
            <a href={GROUP_LINK} target="_blank" rel="noopener noreferrer" className="social-card wa">
              <WaIcon size={28} />
              <div><strong>WhatsApp Group</strong><span>Community support</span></div>
            </a>
            <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="social-card tg">
              <TgIcon size={28} />
              <div><strong>Telegram</strong><span>Contact developer</span></div>
            </a>
            <a href={YOUTUBE} target="_blank" rel="noopener noreferrer" className="social-card yt">
              <YtIcon size={28} />
              <div><strong>YouTube</strong><span>Video tutorials</span></div>
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════ */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo">🤖 {BOT_NAME}</div>
          <p className="footer-made">
            Made with ❤️ by{' '}
            <a href={TELEGRAM} target="_blank" rel="noopener noreferrer">{DEV_NAME}</a>
          </p>
          <div className="footer-socials">
            <a href={`https://wa.me/242053323191`} target="_blank" rel="noopener noreferrer"><WaIcon size={18} /></a>
            <a href={TELEGRAM} target="_blank" rel="noopener noreferrer"><TgIcon size={18} /></a>
            <a href={YOUTUBE} target="_blank" rel="noopener noreferrer"><YtIcon size={18} /></a>
          </div>
          <p className="footer-copy">© 2025 {BOT_NAME} · All rights reserved</p>
        </div>
      </footer>

    </div>
  );
}
