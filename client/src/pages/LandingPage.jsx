import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || '';

/* ─── Animated star field with shooting stars ─── */
function StarField({ count = 100 }) {
  const stars = useRef(
    Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.8 + 0.4,
      opacity: Math.random() * 0.7 + 0.1,
      delay: Math.random() * 5,
      duration: Math.random() * 2 + 2,
    }))
  );
  const shooters = useRef(
    Array.from({ length: 4 }, (_, i) => ({
      delay: i * 4 + Math.random() * 3,
      duration: 1.2 + Math.random() * 0.8,
      top: 5 + Math.random() * 40,
      angle: 15 + Math.random() * 20,
    }))
  );

  return (
    <>
      {stars.current.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-pulse-glow"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
      {shooters.current.map((sh, i) => (
        <div
          key={`shoot-${i}`}
          className="absolute h-px pointer-events-none"
          style={{
            top: `${sh.top}%`,
            right: '-10%',
            width: '15%',
            background: 'linear-gradient(270deg, rgba(0,255,65,0.8), rgba(0,255,65,0.3), transparent)',
            transform: `rotate(${sh.angle}deg)`,
            animation: `trail ${sh.duration}s ease-in-out ${sh.delay}s infinite`,
          }}
        />
      ))}
    </>
  );
}

/* ─── Floating glowing orbs ─── */
function FloatingOrbs() {
  const orbs = [
    { size: 200, x: '10%', y: '20%', color: 'rgba(0,255,65,0.06)', anim: 'animate-float' },
    { size: 300, x: '80%', y: '60%', color: 'rgba(138,43,226,0.06)', anim: 'animate-float-delayed' },
    { size: 150, x: '60%', y: '15%', color: 'rgba(0,255,65,0.04)', anim: 'animate-float' },
    { size: 250, x: '25%', y: '75%', color: 'rgba(138,43,226,0.05)', anim: 'animate-float-delayed' },
  ];

  return (
    <>
      {orbs.map((o, i) => (
        <div
          key={i}
          className={`orb ${o.anim}`}
          style={{
            width: o.size,
            height: o.size,
            left: o.x,
            top: o.y,
            background: `radial-gradient(circle, ${o.color} 0%, transparent 70%)`,
            animationDelay: `${i * 1.5}s`,
          }}
        />
      ))}
    </>
  );
}

/* ─── Rotating orbital rings ─── */
function OrbitalRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="relative">
        {/* Inner ring */}
        <div className="absolute w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 animate-orbit">
          <svg viewBox="0 0 500 500" className="w-full h-full">
            <circle cx="250" cy="250" r="240" fill="none" stroke="rgba(0,255,65,0.06)" strokeWidth="0.5" strokeDasharray="8 12" className="animate-dash-move" />
          </svg>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-neon-green/40 shadow-[0_0_10px_rgba(0,255,65,0.6)]" />
        </div>
        {/* Outer ring */}
        <div className="absolute w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 animate-orbit-reverse">
          <svg viewBox="0 0 800 800" className="w-full h-full">
            <circle cx="400" cy="400" r="390" fill="none" stroke="rgba(138,43,226,0.04)" strokeWidth="0.5" strokeDasharray="4 20" />
          </svg>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-nebula-violet/40 shadow-[0_0_8px_rgba(138,43,226,0.5)]" />
        </div>
      </div>
    </div>
  );
}

/* ─── Horizontal scanner line ─── */
function ScannerLine() {
  return (
    <div className="scan-line animate-scanner" style={{ top: 0 }} />
  );
}

/* ─── Mouse-tracking spotlight ─── */
function useMouseGlow(ref) {
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const handleMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, [ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener('mousemove', handleMove);
    return () => el.removeEventListener('mousemove', handleMove);
  }, [ref, handleMove]);

  return pos;
}

export default function LandingPage() {
  const { user } = useAuth();
  const sectionRefs = useRef([]);
  const heroRef = useRef(null);
  const mousePos = useMouseGlow(heroRef);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('opacity-100', 'translate-y-0');
        });
      },
      { threshold: 0.12 }
    );
    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addRef = (el) => {
    if (el && !sectionRefs.current.includes(el)) sectionRefs.current.push(el);
  };

  const features = [
    {
      icon: 'psychology',
      label: 'AI_ANALYSIS',
      desc: 'Deep content intelligence powered by Gemini 1.5. Niche detection, tone analysis, and audience profiling in seconds.',
    },
    {
      icon: 'speed',
      label: 'GROWTH_SCORE',
      desc: 'A 0-100 composite metric across consistency, niche clarity, CTA usage, and engagement quality.',
    },
    {
      icon: 'calendar_month',
      label: '7_DAY_PLAN',
      desc: 'Personalized daily playbook with post ideas, hooks, CTAs, and engagement tasks calibrated to your niche.',
    },
    {
      icon: 'bolt',
      label: 'INSTANT_OPS',
      desc: 'Paste 5 posts. Get a full growth audit in under 30 seconds. No setup, no onboarding friction.',
    },
  ];

  const stats = [
    { value: '<30s', label: 'ANALYSIS_TIME' },
    { value: '4', label: 'SCORE_DIMENSIONS' },
    { value: '7', label: 'DAY_PLAN_DEPTH' },
    { value: '∞', label: 'GROWTH_POTENTIAL' },
  ];

  return (
    <div className="relative min-h-screen bg-void-black text-white overflow-x-hidden selection:bg-neon-green selection:text-black">
      {/* ── Background layers ── */}
      <div className="fixed inset-0 bg-nebula-texture z-0 pointer-events-none" />

      {/* Aurora blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="aurora-blob w-[600px] h-[600px] -top-[10%] -left-[10%] bg-neon-green/[0.03] animate-aurora" />
        <div className="aurora-blob w-[500px] h-[500px] top-[40%] -right-[15%] bg-nebula-violet/[0.05] animate-aurora-alt" />
        <div className="aurora-blob w-[400px] h-[400px] -bottom-[5%] left-[20%] bg-neon-green/[0.02] animate-aurora" style={{ animationDelay: '5s' }} />
      </div>

      {/* Geo + grid + stars */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 grid-overlay opacity-40" />
        <div className="geo-circle w-[800px] h-[800px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin-slow opacity-20" />
        <div className="geo-circle w-[1200px] h-[1200px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-dashed opacity-10" style={{ animation: 'orbit 40s linear infinite reverse' }} />

        {/* Diagonal gradient lines */}
        <div className="absolute top-0 left-0 w-[300px] h-px bg-gradient-to-r from-transparent to-neon-green/10 rotate-45 origin-top-left translate-y-20 animate-flicker" />
        <div className="absolute bottom-0 right-0 w-[400px] h-px bg-gradient-to-l from-transparent to-nebula-violet/10 -rotate-45 origin-bottom-right -translate-y-20 animate-flicker" style={{ animationDelay: '2s' }} />

        {/* Floating orbs */}
        <FloatingOrbs />

        {/* Orbital rings */}
        <OrbitalRings />

        {/* Scanner */}
        <ScannerLine />

        {/* Star field */}
        <StarField count={120} />

        {/* Particle trails */}
        <div className="particle-trail animate-trail w-[200px]" style={{ top: '30%', left: 0, animationDelay: '0s' }} />
        <div className="particle-trail animate-trail w-[150px]" style={{ top: '55%', left: 0, animationDelay: '1.5s' }} />
        <div className="particle-trail animate-trail w-[180px]" style={{ top: '75%', left: 0, animationDelay: '3s' }} />
      </div>

      {/* ── HUD Corner Nav ── */}
      <nav className="fixed inset-0 z-40 pointer-events-none p-6 md:p-10 font-mono text-[10px] md:text-xs text-gray-500 tracking-widest uppercase mix-blend-screen flex flex-col justify-between">
        <div className="flex justify-between w-full">
          <div className="pointer-events-auto hover:text-neon-green cursor-pointer transition-colors duration-300">
            <span className="material-symbols-outlined align-middle text-[14px] mr-1">radar</span>
            SEC: 01 // HOME
          </div>
          <div className="pointer-events-auto hover:text-neon-green cursor-pointer transition-colors duration-300 text-right">
            LAT: 44.91 // LONG: -92.32
            <span className="block mt-1 text-neon-green/50 animate-flicker">SYS.ONLINE</span>
          </div>
        </div>
        <div className="flex justify-between w-full items-end">
          <div className="pointer-events-auto hover:text-neon-green cursor-pointer transition-colors duration-300">
            <span className="block mb-1 text-white/20">FLOWBASE_VER_2.0</span>
            STATUS: <span className="text-neon-green/60 animate-pulse-glow">OPTIMAL</span>
          </div>
          <div className="pointer-events-auto hover:text-neon-green cursor-pointer transition-colors duration-300 text-right">
            <span className="material-symbols-outlined align-middle text-[14px] ml-1">menu</span>
            MENU_ACCESS
          </div>
        </div>
      </nav>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section ref={heroRef} className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 w-full max-w-7xl mx-auto">
        {/* Mouse-following spotlight */}
        <div
          className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-1000"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, rgba(0,255,65,0.03), transparent 60%)`,
          }}
        />

        <div className="relative flex flex-col items-center text-center space-y-12 max-w-5xl">
          {/* Status pill */}
          <div className="flex items-center space-x-2 border border-neon-green/20 rounded-full px-4 py-1.5 bg-black/50 backdrop-blur-md animate-glow-breathe">
            <div className="w-1.5 h-1.5 bg-neon-green rounded-full shadow-[0_0_8px_#00FF41] animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.2em] text-gray-300 uppercase">
              System Initialized
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display-serif font-medium text-5xl md:text-7xl lg:text-9xl text-white tracking-widest leading-tight select-none relative group cursor-default">
            <span className="block md:inline relative text-glow-green-strong animate-flicker">
              FLOWBASE
              {/* Underline glow */}
              <span className="absolute -bottom-4 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-green to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* Moving shimmer */}
              <span className="absolute -bottom-4 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-neon-green/60 to-transparent animate-trail" />
            </span>
            <span className="block text-2xl md:text-3xl lg:text-4xl mt-6 text-white/50 tracking-[0.8em] font-light animate-pulse-slow">
              THE GROWTH ENGINE
            </span>
          </h1>

          {/* Tagline */}
          <p className="font-mono text-xs md:text-sm text-gray-400 max-w-xl leading-loose tracking-wide text-center mx-auto border-l border-neon-green/20 pl-6 border-r border-neon-green/20 pr-6">
            Navigate the infinite expanse of LinkedIn growth.
            <br />
            Optimized for velocity. Built for creators.
          </p>

          {/* CTA */}
          <div className="pt-8 flex flex-col sm:flex-row items-center gap-4">
            {user ? (
              <Link
                to="/dashboard"
                className="group relative px-10 py-4 overflow-hidden rounded-full bg-transparent transition-all duration-300 hover:bg-neon-green/10 border border-neon-green/60 hover:border-neon-green border-glow-green-strong animate-glow-breathe"
              >
                <div className="absolute inset-0 w-0 bg-neon-green transition-all duration-[250ms] ease-out group-hover:w-full opacity-10" />
                <span className="relative font-mono text-neon-green font-bold tracking-widest text-sm text-glow-green">
                  [ ENTER_DASHBOARD ]
                </span>
              </Link>
            ) : (
              <a
                href={`${API}/api/auth/linkedin`}
                className="group relative px-10 py-4 overflow-hidden rounded-full bg-transparent transition-all duration-300 hover:bg-neon-green/10 border border-neon-green/60 hover:border-neon-green border-glow-green-strong animate-glow-breathe"
              >
                <div className="absolute inset-0 w-0 bg-neon-green transition-all duration-[250ms] ease-out group-hover:w-full opacity-10" />
                <span className="relative font-mono text-neon-green font-bold tracking-widest text-sm text-glow-green">
                  [ INITIATE_SESSION ]
                </span>
              </a>
            )}
          </div>

          {/* Tech stack badges below CTA */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {['Gemini 1.5', 'LinkedIn API', 'Real-time Analysis'].map((t) => (
              <span key={t} className="font-mono text-[9px] tracking-widest text-gray-600 border border-white/[0.06] rounded-full px-3 py-1 bg-white/[0.02]">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Decorative axis labels */}
        <div className="absolute top-1/3 left-10 hidden lg:block opacity-40">
          <div className="w-px h-32 bg-gradient-to-b from-transparent via-neon-green/30 to-transparent animate-line-scan" />
          <div className="font-mono text-[9px] text-white/50 -rotate-90 origin-top-left translate-y-32 translate-x-2 tracking-[0.3em]">
            COORD_Y_AXIS
          </div>
        </div>
        <div className="absolute bottom-1/4 right-10 hidden lg:block opacity-40 text-right">
          <div className="font-mono text-[9px] text-white/50 tracking-[0.3em] mb-2">VELOCITY_CHECK</div>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-neon-green/30 to-transparent ml-auto animate-line-scan" style={{ animationDelay: '1.5s' }} />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 opacity-50 animate-drift-up">
          <div className="w-px h-12 bg-gradient-to-b from-neon-green to-transparent" />
          <span className="font-mono text-[10px] text-neon-green tracking-widest uppercase animate-pulse-glow">Scroll</span>
        </div>
      </section>

      {/* ═══════════════════ STATS BAR ═══════════════════ */}
      <section
        ref={addRef}
        className="relative z-10 border-y border-neon-green/[0.08] bg-black/60 backdrop-blur-md opacity-0 translate-y-6 transition-all duration-700"
      >
        <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.06]">
          {stats.map((s, i) => (
            <div key={s.label} className="group flex flex-col items-center py-10 px-4 transition-all hover:bg-neon-green/[0.02]">
              <span
                className="font-display-serif text-3xl md:text-4xl font-semibold text-glow-green text-neon-green animate-flicker"
                style={{ animationDelay: `${i * 0.7}s` }}
              >
                {s.value}
              </span>
              <span className="mt-2 font-mono text-[10px] tracking-widest-plus text-gray-500 uppercase group-hover:text-gray-400 transition-colors">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════ FEATURES ═══════════════════ */}
      <section className="relative z-10 py-32 px-6">
        <div className="mx-auto max-w-6xl">
          <div
            ref={addRef}
            className="mb-20 text-center opacity-0 translate-y-6 transition-all duration-700"
          >
            <span className="font-mono text-[10px] text-neon-green/60 tracking-extreme uppercase animate-pulse-glow">
              Modules
            </span>
            <h2 className="mt-4 font-display-serif text-3xl md:text-5xl tracking-widest text-white text-glow-green">
              SYSTEM_CORE
            </h2>
            <div className="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-neon-green to-transparent animate-trail" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {features.map((f, i) => (
              <div
                key={f.label}
                ref={addRef}
                className="group relative border border-white/[0.06] rounded-2xl p-8 bg-black/40 backdrop-blur-sm transition-all duration-500 hover:border-neon-green/30 hover:bg-neon-green/[0.02] hover:shadow-[0_0_40px_-15px_rgba(0,255,65,0.15)] opacity-0 translate-y-6"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Corner dots with glow on hover */}
                <div className="absolute top-3 left-3 w-1 h-1 bg-white/20 rounded-full group-hover:bg-neon-green/50 group-hover:shadow-[0_0_6px_rgba(0,255,65,0.5)] transition-all" />
                <div className="absolute top-3 right-3 w-1 h-1 bg-white/20 rounded-full group-hover:bg-neon-green/50 group-hover:shadow-[0_0_6px_rgba(0,255,65,0.5)] transition-all" />
                <div className="absolute bottom-3 left-3 w-1 h-1 bg-white/20 rounded-full group-hover:bg-neon-green/50 group-hover:shadow-[0_0_6px_rgba(0,255,65,0.5)] transition-all" />
                <div className="absolute bottom-3 right-3 w-1 h-1 bg-white/20 rounded-full group-hover:bg-neon-green/50 group-hover:shadow-[0_0_6px_rgba(0,255,65,0.5)] transition-all" />

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] group-hover:border-neon-green/30 group-hover:shadow-[0_0_15px_-5px_rgba(0,255,65,0.3)] transition-all">
                    <span className="material-symbols-outlined text-xl text-neon-green/80 group-hover:text-neon-green transition-colors">{f.icon}</span>
                  </div>
                  <h3 className="font-mono text-sm tracking-widest text-white/80 group-hover:text-neon-green group-hover:text-glow-green transition-all">
                    {f.label}
                  </h3>
                </div>
                <p className="font-sans text-sm leading-relaxed text-gray-500 group-hover:text-gray-400 transition-colors">
                  {f.desc}
                </p>

                {/* Animated scan line at bottom */}
                <div className="absolute bottom-0 left-0 w-full h-px overflow-hidden rounded-b-2xl">
                  <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-neon-green/40 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-trail transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section className="relative z-10 py-32 px-6 border-t border-white/[0.04] overflow-hidden">
        <div className="mx-auto max-w-4xl">
          <div
            ref={addRef}
            className="mb-20 text-center opacity-0 translate-y-6 transition-all duration-700"
          >
            <span className="font-mono text-[10px] text-neon-green/60 tracking-extreme uppercase animate-pulse-glow">
              Protocol
            </span>
            <h2 className="mt-4 font-display-serif text-3xl md:text-5xl tracking-widest text-white text-glow-green">
              EXEC_FLOW
            </h2>
            <div className="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-neon-green to-transparent animate-trail" />
          </div>

          <div className="relative" style={{ minHeight: 700 }}>
            {/* ─── GLOWING FLOW LINE (SVG) ─── */}
            <div className="absolute left-6 md:left-1/2 md:-translate-x-[1px] top-0 bottom-0 w-[3px] pointer-events-none z-0">
              {/* Base dim line */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-neon-green/20 via-neon-green/10 to-neon-green/5" />

              {/* Core glow line */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-neon-green/50 via-neon-green/30 to-transparent shadow-[0_0_12px_rgba(0,255,65,0.4),0_0_30px_rgba(0,255,65,0.15)]" />

              {/* Energy pulse 1 — fast */}
              <div
                className="absolute left-0 w-full rounded-full"
                style={{
                  height: 60,
                  background: 'linear-gradient(180deg, transparent 0%, rgba(0,255,65,0.8) 40%, rgba(0,255,65,1) 50%, rgba(0,255,65,0.8) 60%, transparent 100%)',
                  boxShadow: '0 0 20px 4px rgba(0,255,65,0.5), 0 0 50px 8px rgba(0,255,65,0.2)',
                  animation: 'flowPulse 3s ease-in-out infinite',
                }}
              />

              {/* Energy pulse 2 — slower, offset */}
              <div
                className="absolute left-0 w-full rounded-full"
                style={{
                  height: 40,
                  background: 'linear-gradient(180deg, transparent 0%, rgba(0,255,65,0.5) 40%, rgba(0,255,65,0.7) 50%, rgba(0,255,65,0.5) 60%, transparent 100%)',
                  boxShadow: '0 0 15px 3px rgba(0,255,65,0.3)',
                  animation: 'flowPulse 4.5s ease-in-out 1.5s infinite',
                }}
              />

              {/* Energy pulse 3 — tiny spark */}
              <div
                className="absolute left-0 w-full rounded-full"
                style={{
                  height: 20,
                  background: 'linear-gradient(180deg, transparent, rgba(0,255,65,0.9), transparent)',
                  boxShadow: '0 0 10px 2px rgba(0,255,65,0.6)',
                  animation: 'flowPulse 2s linear 0.8s infinite',
                }}
              />
            </div>

            {/* ─── TIMELINE STEPS ─── */}
            {[
              { step: '01', title: 'AUTHENTICATE', desc: 'Connect your LinkedIn identity via OAuth 2.0. One click. Zero friction.', icon: 'key' },
              { step: '02', title: 'PASTE_CONTENT', desc: 'Submit your last 5 LinkedIn posts. Raw text. The AI handles the rest.', icon: 'content_paste' },
              { step: '03', title: 'AI_PROCESS', desc: 'Gemini 1.5 Flash runs deep analysis — niche, tone, audience, strengths, gaps.', icon: 'neurology' },
              { step: '04', title: 'RECEIVE_INTEL', desc: 'Growth Score + Full Analysis + 7-Day Plan delivered in under 30 seconds.', icon: 'rocket_launch' },
            ].map((item, i) => (
              <div
                key={item.step}
                ref={addRef}
                className={`relative flex items-start gap-8 mb-20 last:mb-0 opacity-0 translate-y-6 transition-all duration-700 ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
                style={{ transitionDelay: `${i * 180}ms` }}
              >
                {/* ── Node point with rings ── */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-20">
                  {/* Outer pulse ring */}
                  <div
                    className="absolute -inset-4 rounded-full border border-neon-green/30"
                    style={{ animation: 'nodeRipple 3s ease-out infinite', animationDelay: `${i * 0.6}s` }}
                  />
                  {/* Second pulse ring */}
                  <div
                    className="absolute -inset-2 rounded-full border border-neon-green/20"
                    style={{ animation: 'nodeRipple 3s ease-out 0.5s infinite', animationDelay: `${i * 0.6 + 0.5}s` }}
                  />
                  {/* Core node */}
                  <div className="relative w-5 h-5 rounded-full border-2 border-neon-green/80 bg-void-black shadow-[0_0_15px_rgba(0,255,65,0.5),0_0_30px_rgba(0,255,65,0.2)] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-neon-green shadow-[0_0_8px_rgba(0,255,65,0.8)] animate-pulse" />
                  </div>
                </div>

                {/* ── Horizontal connector branch (desktop only) ── */}
                <div
                  className={`hidden md:block absolute top-[10px] h-px z-10 ${
                    i % 2 === 0 ? 'right-1/2 mr-[12px]' : 'left-1/2 ml-[12px]'
                  }`}
                  style={{ width: 60 }}
                >
                  <div
                    className={`h-full ${
                      i % 2 === 0
                        ? 'bg-gradient-to-l from-neon-green/60 to-transparent'
                        : 'bg-gradient-to-r from-neon-green/60 to-transparent'
                    }`}
                    style={{ boxShadow: '0 0 8px rgba(0,255,65,0.3)' }}
                  />
                  {/* Connector endpoint dot */}
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-neon-green/60 shadow-[0_0_6px_rgba(0,255,65,0.4)] ${
                      i % 2 === 0 ? 'left-0' : 'right-0'
                    }`}
                  />
                </div>

                {/* ── Content card ── */}
                <div
                  className={`ml-16 md:ml-0 md:w-[calc(50%-3.5rem)] group ${
                    i % 2 === 0 ? 'md:text-right md:pr-4' : 'md:text-left md:pl-4'
                  }`}
                >
                  <div className={`relative border border-white/[0.06] rounded-xl p-5 bg-black/30 backdrop-blur-sm transition-all duration-500 hover:border-neon-green/20 hover:shadow-[0_0_25px_-10px_rgba(0,255,65,0.15)]`}>
                    {/* Step number + icon */}
                    <div className={`inline-flex items-center gap-2 mb-2 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                      <span className="material-symbols-outlined text-base text-neon-green/50 group-hover:text-neon-green transition-colors">{item.icon}</span>
                      <span className="font-mono text-[10px] text-neon-green/50 tracking-widest">{item.step}</span>
                    </div>
                    <h3 className="font-mono text-sm tracking-widest text-white group-hover:text-glow-green transition-all">{item.title}</h3>
                    <p className="mt-2 font-sans text-sm text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors">{item.desc}</p>

                    {/* Bottom scan line on hover */}
                    <div className="absolute bottom-0 left-0 w-full h-px overflow-hidden rounded-b-xl">
                      <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-neon-green/40 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-trail transition-opacity" />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* ── Terminal endpoint ── */}
            <div className="absolute left-6 md:left-1/2 -translate-x-1/2 bottom-0 z-20">
              <div className="w-3 h-3 rounded-full bg-neon-green/20 border border-neon-green/40 shadow-[0_0_12px_rgba(0,255,65,0.3)]">
                <div className="absolute inset-0 rounded-full bg-neon-green/30 animate-ping" style={{ animationDuration: '2s' }} />
              </div>
            </div>
          </div>
        </div>

        {/* CSS for the flow pulse & ripple — scoped inline */}
        <style>{`
          @keyframes flowPulse {
            0% { top: -80px; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: calc(100% + 20px); opacity: 0; }
          }
          @keyframes nodeRipple {
            0% { transform: scale(1); opacity: 0.5; }
            100% { transform: scale(2.5); opacity: 0; }
          }
        `}</style>
      </section>

      {/* ═══════════════════ FINAL CTA ═══════════════════ */}
      <section
        ref={addRef}
        className="relative z-10 py-32 px-6 opacity-0 translate-y-6 transition-all duration-700"
      >
        <div className="relative mx-auto max-w-3xl text-center">
          {/* Background glow behind CTA */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[400px] h-[400px] rounded-full bg-neon-green/[0.03] blur-[100px] animate-pulse-slow" />
          </div>

          <h2 className="relative font-display-serif text-3xl md:text-5xl tracking-widest text-white mb-6 text-glow-green">
            LAUNCH_SEQUENCE
          </h2>
          <p className="relative font-mono text-xs text-gray-500 max-w-md mx-auto leading-loose tracking-wide mb-10">
            Your LinkedIn growth trajectory recalculated.
            <br />
            Connect. Analyze. Dominate.
          </p>
          {user ? (
            <Link
              to="/dashboard"
              className="group relative inline-flex px-12 py-5 overflow-hidden rounded-full bg-transparent transition-all duration-300 hover:bg-neon-green/10 border border-neon-green/60 hover:border-neon-green border-glow-green-strong animate-glow-breathe"
            >
              <div className="absolute inset-0 w-0 bg-neon-green transition-all duration-[250ms] ease-out group-hover:w-full opacity-10" />
              <span className="relative font-mono text-neon-green font-bold tracking-widest text-sm text-glow-green">
                [ ENTER_DASHBOARD ]
              </span>
            </Link>
          ) : (
            <a
              href={`${API}/api/auth/linkedin`}
              className="group relative inline-flex px-12 py-5 overflow-hidden rounded-full bg-transparent transition-all duration-300 hover:bg-neon-green/10 border border-neon-green/60 hover:border-neon-green border-glow-green-strong animate-glow-breathe"
            >
              <div className="absolute inset-0 w-0 bg-neon-green transition-all duration-[250ms] ease-out group-hover:w-full opacity-10" />
              <span className="relative font-mono text-neon-green font-bold tracking-widest text-sm text-glow-green">
                [ INITIATE_SESSION ]
              </span>
            </a>
          )}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/[0.04] py-8 text-center">
        <span className="font-mono text-[10px] text-gray-600 tracking-widest uppercase">
          &copy; {new Date().getFullYear()} Flowbase // All Systems Nominal
        </span>
      </footer>
    </div>
  );
}
