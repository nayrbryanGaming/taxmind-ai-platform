import { useRef, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─────────────────────────────────────────────────────────────
   ANIMATION HOOKS
───────────────────────────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useMouse() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const h = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);
  return pos;
}

function useCounter(target: number, duration = 2000, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf: number;
    const startTime = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setVal(Math.round(ease * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return val;
}

/* ─────────────────────────────────────────────────────────────
   PARTICLE FIELD
───────────────────────────────────────────────────────────── */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let raf: number;
    const W = () => canvas.width = window.innerWidth;
    const H = () => canvas.height = window.innerHeight;
    W(); H();
    window.addEventListener('resize', () => { W(); H(); });

    const particles: { x: number; y: number; vx: number; vy: number; r: number; o: number }[] = [];
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.5 + 0.3,
        o: Math.random() * 0.5 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(79,70,229,${p.o})`;
        ctx.fill();
      });

      // draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99,102,241,${0.12 * (1 - d / 110)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />;
}

/* ─────────────────────────────────────────────────────────────
   GRID GLOW BACKGROUND
───────────────────────────────────────────────────────────── */
function GridGlow({ mouse }: { mouse: { x: number; y: number } }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
      background: `
        radial-gradient(ellipse 70vw 55vh at ${mouse.x}px ${mouse.y}px, rgba(79,70,229,0.09) 0%, transparent 70%),
        radial-gradient(ellipse 80vw 60vh at 50% 0%, rgba(79,70,229,0.07) 0%, transparent 60%)
      `,
      transition: 'background 0.15s linear',
    }} />
  );
}

/* ─────────────────────────────────────────────────────────────
   ANIMATED TEXT REVEAL
───────────────────────────────────────────────────────────── */
function TextReveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(28px)',
      transition: `opacity 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAGNETIC BUTTON
───────────────────────────────────────────────────────────── */
function MagneticBtn({ children, onClick, variant = 'primary' }: { children: ReactNode; onClick?: () => void; variant?: 'primary' | 'outline' }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    setPos({ x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.3 });
  };

  const base: React.CSSProperties = {
    transform: `translate(${pos.x}px, ${pos.y}px) scale(${hovered ? 1.04 : 1})`,
    transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1)',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
  };

  const primary: React.CSSProperties = {
    ...base,
    background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
    color: '#fff',
    padding: '14px 32px',
    borderRadius: '12px',
    fontWeight: 600,
    fontSize: '15px',
    letterSpacing: '-0.01em',
    boxShadow: hovered ? '0 0 40px rgba(99,102,241,0.45), 0 8px 32px rgba(0,0,0,0.3)' : '0 4px 16px rgba(79,70,229,0.25)',
  };

  const outline: React.CSSProperties = {
    ...base,
    background: 'transparent',
    color: '#A5B4FC',
    padding: '13px 30px',
    borderRadius: '12px',
    fontWeight: 500,
    fontSize: '15px',
    border: '1px solid rgba(99,102,241,0.35)',
    boxShadow: hovered ? '0 0 20px rgba(99,102,241,0.15)' : 'none',
  };

  return (
    <button
      ref={ref}
      style={variant === 'primary' ? primary : outline}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPos({ x: 0, y: 0 }); }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   3D TILT CARD
───────────────────────────────────────────────────────────── */
function TiltCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const rx = (y - 0.5) * -14;
    const ry = (x - 0.5) * 14;
    setStyle({
      transform: `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.025)`,
      boxShadow: `${-ry * 1.5}px ${rx * 1.5}px 40px rgba(79,70,229,0.18)`,
      transition: 'box-shadow 0.1s',
    });
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{ ...style, transition: style.transform ? 'none' : 'transform 0.6s cubic-bezier(0.22,1,0.36,1), box-shadow 0.6s' }}
      onMouseMove={onMove}
      onMouseLeave={() => setStyle({})}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TYPEWRITER
───────────────────────────────────────────────────────────── */
function Typewriter({ texts, speed = 55 }: { texts: string[]; speed?: number }) {
  const [display, setDisplay] = useState('');
  const [ti, setTi] = useState(0);
  const [ci, setCi] = useState(0);
  const [del, setDel] = useState(false);

  useEffect(() => {
    const current = texts[ti];
    let timeout: ReturnType<typeof setTimeout>;
    if (!del) {
      if (ci < current.length) {
        timeout = setTimeout(() => { setDisplay(current.slice(0, ci + 1)); setCi(ci + 1); }, speed);
      } else {
        timeout = setTimeout(() => setDel(true), 2200);
      }
    } else {
      if (ci > 0) {
        timeout = setTimeout(() => { setDisplay(current.slice(0, ci - 1)); setCi(ci - 1); }, speed / 2);
      } else {
        setDel(false);
        setTi((ti + 1) % texts.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [ci, del, ti, texts, speed]);

  return (
    <span>
      {display}
      <span style={{ animation: 'blink 1s step-end infinite', opacity: 0.7 }}>|</span>
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   STATS COUNTER CARD
───────────────────────────────────────────────────────────── */
function StatCard({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) {
  const { ref, visible } = useInView();
  const counted = useCounter(value, 2200, visible);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    }}>
      <TiltCard className="stat-card-inner">
        <div style={{
          background: 'linear-gradient(135deg, #0F1422 0%, #141929 100%)',
          border: '1px solid #1A2038',
          borderRadius: '16px',
          padding: '32px 28px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '42px', fontWeight: 700, color: '#E4E8F8', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
            {counted.toLocaleString()}{suffix}
          </div>
          <div style={{ fontSize: '13px', color: '#7885B8', marginTop: '8px', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 500 }}>
            {label}
          </div>
        </div>
      </TiltCard>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   FEATURE CARD
───────────────────────────────────────────────────────────── */
function FeatureCard({ icon, title, desc, delay }: { icon: ReactNode; title: string; desc: string; delay: number }) {
  const { ref, visible } = useInView();
  const [hov, setHov] = useState(false);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.96)',
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    }}>
      <TiltCard>
        <div
          style={{
            background: hov ? 'linear-gradient(135deg, #0F1422 0%, #141929 100%)' : 'linear-gradient(135deg, #0C1020 0%, #0F1422 100%)',
            border: `1px solid ${hov ? '#2C3A60' : '#1A2038'}`,
            borderRadius: '18px',
            padding: '28px',
            height: '100%',
            transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
            boxShadow: hov ? '0 12px 48px rgba(79,70,229,0.12)' : 'none',
          }}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
        >
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'rgba(79,70,229,0.12)',
            border: '1px solid rgba(99,102,241,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '20px',
            color: '#A5B4FC',
            transition: 'background 0.3s',
          }}>
            {icon}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#E4E8F8', marginBottom: '10px', letterSpacing: '-0.01em' }}>{title}</div>
          <div style={{ fontSize: '14px', color: '#7885B8', lineHeight: 1.65 }}>{desc}</div>
        </div>
      </TiltCard>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   WORKFLOW STEP
───────────────────────────────────────────────────────────── */
function WorkflowStep({ num, title, desc, delay }: { num: string; title: string; desc: string; delay: number }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} style={{
      display: 'flex', gap: '20px', alignItems: 'flex-start',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(0)' : 'translateX(-30px)',
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    }}>
      <div style={{
        flexShrink: 0, width: '40px', height: '40px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '14px', fontWeight: 700, color: '#fff',
        boxShadow: '0 4px 16px rgba(79,70,229,0.35)',
      }}>
        {num}
      </div>
      <div>
        <div style={{ fontSize: '16px', fontWeight: 600, color: '#E4E8F8', marginBottom: '6px' }}>{title}</div>
        <div style={{ fontSize: '14px', color: '#7885B8', lineHeight: 1.65 }}>{desc}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   FLOATING DASHBOARD MOCKUP
───────────────────────────────────────────────────────────── */
function DashboardMockup() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT(prev => prev + 1), 50);
    return () => clearInterval(id);
  }, []);

  const floatY = Math.sin(t * 0.04) * 6;
  const floatR = Math.sin(t * 0.025) * 1.2;

  return (
    <div style={{
      transform: `translateY(${floatY}px) rotateZ(${floatR}deg)`,
      transition: 'transform 0.1s linear',
      borderRadius: '20px',
      overflow: 'hidden',
      border: '1px solid #1A2038',
      boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 80px rgba(79,70,229,0.15)',
      background: '#060810',
    }}>
      {/* Mock header */}
      <div style={{ background: '#0A0D18', borderBottom: '1px solid #1A2038', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
        <div style={{ marginLeft: '12px', fontSize: '11px', color: '#384060', fontFamily: 'monospace' }}>taxmind-nexus.vercel.app/dashboard</div>
      </div>
      {/* Mock content */}
      <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
        {[
          { label: 'Returns Filed', val: '284', color: '#10B981' },
          { label: 'Tax Savings', val: '$1.2M', color: '#4F46E5' },
          { label: 'Open Items', val: '18', color: '#F59E0B' },
        ].map((item, i) => (
          <div key={i} style={{ background: '#0C1020', border: '1px solid #1A2038', borderRadius: '10px', padding: '16px' }}>
            <div style={{ fontSize: '10px', color: '#7885B8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: item.color, fontVariantNumeric: 'tabular-nums' }}>{item.val}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '0 24px 24px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
        <div style={{ background: '#0C1020', border: '1px solid #1A2038', borderRadius: '10px', padding: '16px', height: '100px' }}>
          <div style={{ fontSize: '10px', color: '#7885B8', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Filing Pipeline</div>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '60px' }}>
            {[40, 65, 30, 80, 55, 90, 70, 85, 45, 75, 60, 95].map((h, i) => (
              <div key={i} style={{
                flex: 1,
                height: `${h}%`,
                background: `linear-gradient(180deg, #4F46E5 0%, rgba(79,70,229,0.2) 100%)`,
                borderRadius: '3px 3px 0 0',
                opacity: 0.7 + i * 0.02,
              }} />
            ))}
          </div>
        </div>
        <div style={{ background: '#0C1020', border: '1px solid #1A2038', borderRadius: '10px', padding: '16px' }}>
          <div style={{ fontSize: '10px', color: '#7885B8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>AI Agent</div>
          <div style={{ fontSize: '11px', color: '#A5B4FC', lineHeight: 1.5 }}>
            <div style={{ marginBottom: '4px', padding: '6px 8px', background: 'rgba(79,70,229,0.08)', borderRadius: '6px', border: '1px solid rgba(99,102,241,0.15)' }}>
              Reviewing §199A deductions...
            </div>
            <div style={{ padding: '6px 8px', background: 'rgba(16,185,129,0.06)', borderRadius: '6px', border: '1px solid rgba(16,185,129,0.15)', color: '#10B981' }}>
              Found $47k opportunity
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TESTIMONIAL CARD
───────────────────────────────────────────────────────────── */
function TestimonialCard({ quote, name, title, delay }: { quote: string; name: string; title: string; delay: number }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(30px)',
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    }}>
      <TiltCard>
        <div style={{
          background: 'linear-gradient(135deg, #0C1020 0%, #0F1422 100%)',
          border: '1px solid #1A2038',
          borderRadius: '18px',
          padding: '28px',
        }}>
          <div style={{ fontSize: '13px', color: '#7885B8', lineHeight: 1.7, marginBottom: '20px', fontStyle: 'italic' }}>
            "{quote}"
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: 700, color: '#fff',
            }}>
              {name[0]}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#E4E8F8' }}>{name}</div>
              <div style={{ fontSize: '12px', color: '#7885B8' }}>{title}</div>
            </div>
          </div>
        </div>
      </TiltCard>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   NAV COMPONENT
───────────────────────────────────────────────────────────── */
function LandingNav({ onEnter }: { onEnter: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: scrolled ? '12px 0' : '20px 0',
      background: scrolled ? 'rgba(6,8,16,0.88)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(26,32,56,0.7)' : 'none',
      transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#E4E8F8', letterSpacing: '-0.02em' }}>TaxMind Nexus</span>
        </div>

        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {['Features', 'How it works', 'Pricing'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} style={{
              fontSize: '14px', color: '#7885B8', textDecoration: 'none', fontWeight: 500,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.target as HTMLElement).style.color = '#E4E8F8'}
            onMouseLeave={e => (e.target as HTMLElement).style.color = '#7885B8'}
            >
              {item}
            </a>
          ))}
          <button
            onClick={onEnter}
            style={{
              background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
              color: '#fff', border: 'none', borderRadius: '10px',
              padding: '9px 20px', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer', transition: 'opacity 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => { (e.target as HTMLElement).style.opacity = '0.9'; (e.target as HTMLElement).style.transform = 'scale(1.04)'; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.opacity = '1'; (e.target as HTMLElement).style.transform = 'scale(1)'; }}
          >
            Open Platform
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────────────────────
   SCROLL TICKER
───────────────────────────────────────────────────────────── */
function ScrollTicker({ items }: { items: string[] }) {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setOffset(prev => (prev + 0.4) % (items.length * 200)), 16);
    return () => clearInterval(id);
  }, [items.length]);
  const all = [...items, ...items, ...items];
  return (
    <div style={{ overflow: 'hidden', width: '100%', position: 'relative' }}>
      <div style={{ display: 'flex', gap: '48px', transform: `translateX(-${offset}px)`, whiteSpace: 'nowrap', transition: 'none', willChange: 'transform' }}>
        {all.map((item, i) => (
          <span key={i} style={{ fontSize: '13px', color: '#384060', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', flexShrink: 0 }}>
            {item}
            <span style={{ marginLeft: '48px', color: '#1A2038' }}>&#8212;</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PRICING CARD
───────────────────────────────────────────────────────────── */
function PricingCard({ plan, price, features, highlighted, delay, onCTA }: {
  plan: string; price: string; features: string[]; highlighted?: boolean; delay: number; onCTA: () => void;
}) {
  const { ref, visible } = useInView();
  const [hov, setHov] = useState(false);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(40px)',
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    }}>
      <TiltCard>
        <div
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            background: highlighted ? 'linear-gradient(135deg, #1E1B4B 0%, #1a1650 100%)' : 'linear-gradient(135deg, #0C1020 0%, #0F1422 100%)',
            border: highlighted ? '1px solid rgba(99,102,241,0.5)' : `1px solid ${hov ? '#2C3A60' : '#1A2038'}`,
            borderRadius: '20px',
            padding: '32px 28px',
            boxShadow: highlighted ? '0 0 60px rgba(79,70,229,0.18)' : 'none',
            transition: 'border-color 0.3s',
          }}
        >
          {highlighted && (
            <div style={{
              background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
              borderRadius: '6px', padding: '3px 10px',
              fontSize: '11px', fontWeight: 600, color: '#fff',
              display: 'inline-block', marginBottom: '16px', letterSpacing: '0.04em',
            }}>
              MOST USED
            </div>
          )}
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#E4E8F8', marginBottom: '8px' }}>{plan}</div>
          <div style={{ fontSize: '36px', fontWeight: 700, color: '#E4E8F8', letterSpacing: '-0.03em', marginBottom: '24px' }}>
            {price}
            {price !== 'Custom' && <span style={{ fontSize: '14px', color: '#7885B8', fontWeight: 400 }}>/mo</span>}
          </div>
          <div style={{ borderTop: '1px solid #1A2038', marginBottom: '24px', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span style={{ fontSize: '13px', color: '#7885B8', lineHeight: 1.5 }}>{f}</span>
              </div>
            ))}
          </div>
          <button onClick={onCTA} style={{
            width: '100%',
            background: highlighted ? 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)' : 'transparent',
            color: highlighted ? '#fff' : '#A5B4FC',
            border: highlighted ? 'none' : '1px solid rgba(99,102,241,0.3)',
            borderRadius: '10px', padding: '12px',
            fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            transition: 'opacity 0.2s, transform 0.2s',
          }}
          onMouseEnter={e => { (e.target as HTMLElement).style.opacity = '0.85'; (e.target as HTMLElement).style.transform = 'scale(1.02)'; }}
          onMouseLeave={e => { (e.target as HTMLElement).style.opacity = '1'; (e.target as HTMLElement).style.transform = 'scale(1)'; }}
          >
            Get started
          </button>
        </div>
      </TiltCard>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN LANDING PAGE
───────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate();
  const mouse = useMouse();
  const { ref: heroRef, visible: heroVisible } = useInView(0.05);

  const enter = () => navigate('/dashboard');

  const features = [
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
      title: 'Agentic Research Engine',
      desc: 'Each tax memo draws from the Internal Revenue Code in real time. The system links your client facts directly to controlling authority—Treasury regulations, revenue rulings, and court decisions—without you having to search.',
    },
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="15" x2="12" y2="15"/></svg>,
      title: 'Return Workflow Tracking',
      desc: 'Every return moves through a defined status pipeline. Workpapers, estimates, and extension deadlines live in one place, giving the whole team a single source of truth from engagement start to filing.',
    },
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
      title: 'Planning Calculators',
      desc: 'Eight purpose-built tools cover entity comparison, depreciation, QBI, capital gains, retirement contribution windows, home office deductions, and year-end projections. Results update as you type.',
    },
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
      title: 'SALT and International',
      desc: 'Nexus analysis, apportionment schedules, state conformity tracking, GILTI calculations, and FBAR obligations are built into dedicated modules. Each one surfaces the exact data points regulators care about.',
    },
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
      title: 'Controversy Management',
      desc: 'Track IRS notices, audit timelines, and protest deadlines on a single board. Attach supporting documents, log correspondence, and set automated reminders before statutory periods expire.',
    },
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
      title: 'Firm Analytics',
      desc: 'Production dashboards show returns by status, hours by client, and upcoming filing concentrations by week. Spot bottlenecks before they become problems and redistribute capacity while there is still time.',
    },
  ];

  const steps = [
    { num: '1', title: 'Connect your client list', desc: 'Import existing client records or build them from scratch. The platform stores engagement history, entity type, fiscal year, and preferred contact data in one profile.' },
    { num: '2', title: 'Open a return or research matter', desc: 'Each return gets its own workspace with status tracking, workpaper slots, and a running estimate panel. Research memos attach directly to the relevant return.' },
    { num: '3', title: 'Let the AI layer do the analysis', desc: 'The research agent scans the IRC, cross-references Treasury guidance, and drafts a position memo. You review, edit, and sign off—the heavy lifting runs in the background.' },
    { num: '4', title: 'File and archive', desc: 'Mark the return filed, lock the workpapers, and push the completed package to your document vault. Everything stays searchable by client, tax year, or issue type.' },
  ];

  const testimonials = [
    {
      quote: 'We cut memo drafting time by about two-thirds. The IRC cross-referencing alone saves three or four hours per complex position, and the citations actually hold up under review.',
      name: 'Rachel Ferreira',
      title: 'Tax Partner, mid-sized regional CPA firm',
    },
    {
      quote: 'The return pipeline view changed how we staff our busy season. For the first time I can see at a glance where every return sits and who is sitting idle.',
      name: 'David Nkosi',
      title: 'Director of Tax Operations',
    },
    {
      quote: 'SALT compliance used to be four spreadsheets and a lot of guesswork. Having the apportionment and conformity modules in the same place as the return has been a real improvement.',
      name: 'Maya Thornton',
      title: 'Senior Manager, State and Local Tax',
    },
  ];

  const tickerItems = ['§199A QBI', 'SALT Nexus', 'GILTI', 'Estate Planning', 'IRC Research', 'FBAR Compliance', 'Capital Gains', 'Depreciation', 'Controversy', 'Entity Comparison'];

  return (
    <div style={{ minHeight: '100vh', background: '#060810', color: '#E4E8F8', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', overflowX: 'hidden', position: 'relative' }}>
      <style>{`
        @keyframes blink { 50% { opacity: 0; } }
        @keyframes spin3d { from { transform: rotate3d(0.3,1,0.1,0deg); } to { transform: rotate3d(0.3,1,0.1,360deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; }
        html { scroll-behavior: smooth; }
      `}</style>

      <ParticleField />
      <GridGlow mouse={mouse} />
      <LandingNav onEnter={enter} />

      {/* ── HERO ── */}
      <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 10, padding: '120px 32px 80px' }}>
        <div style={{ maxWidth: '1200px', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div ref={heroRef}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: '100px', padding: '6px 14px 6px 8px',
              marginBottom: '32px',
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
            }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', animation: 'blink 2s ease-in-out infinite' }} />
              <span style={{ fontSize: '12px', color: '#A5B4FC', fontWeight: 500, letterSpacing: '0.02em' }}>Now live — TaxMind Nexus 2.0</span>
            </div>

            <h1 style={{
              fontSize: '62px', fontWeight: 800, lineHeight: 1.07, letterSpacing: '-0.04em',
              color: '#E4E8F8', marginBottom: '24px',
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(32px)',
              transition: 'opacity 0.7s ease 100ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) 100ms',
            }}>
              Tax intelligence<br />
              <span style={{ background: 'linear-gradient(135deg, #A5B4FC 0%, #818CF8 50%, #6366F1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                that works for you
              </span>
            </h1>

            <p style={{
              fontSize: '18px', color: '#7885B8', lineHeight: 1.7, marginBottom: '40px', maxWidth: '460px',
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.7s ease 200ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) 200ms',
            }}>
              A platform built for tax practices that handle complexity. Research, prepare, plan, and manage controversy from a single workspace — powered by agents that stay current with the code.
            </p>

            <div style={{
              display: 'flex', gap: '14px', flexWrap: 'wrap',
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.7s ease 320ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) 320ms',
            }}>
              <MagneticBtn onClick={enter} variant="primary">Open Platform</MagneticBtn>
              <MagneticBtn onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} variant="outline">See all features</MagneticBtn>
            </div>

            <div style={{
              display: 'flex', gap: '32px', marginTop: '48px', paddingTop: '32px', borderTop: '1px solid #1A2038',
              opacity: heroVisible ? 1 : 0,
              transition: 'opacity 0.7s ease 450ms',
            }}>
              {[['284+', 'Returns filed'], ['$1.2M', 'Tax savings identified'], ['98%', 'Research accuracy']].map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#E4E8F8', letterSpacing: '-0.02em' }}>{v}</div>
                  <div style={{ fontSize: '12px', color: '#7885B8', marginTop: '4px' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateX(0)' : 'translateX(60px)',
            transition: 'opacity 0.9s ease 200ms, transform 0.9s cubic-bezier(0.22,1,0.36,1) 200ms',
          }}>
            <DashboardMockup />
          </div>
        </div>

        {/* Typewriter CTA */}
        <div style={{
          position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)',
          fontSize: '15px', color: '#384060', fontFamily: 'monospace',
          opacity: heroVisible ? 1 : 0,
          transition: 'opacity 1.2s ease 800ms',
        }}>
          <Typewriter texts={['Research §199A deductions...', 'Prepare multistate apportionment...', 'Track controversy timelines...', 'Project year-end tax liability...']} />
        </div>
      </section>

      {/* ── TICKER ── */}
      <div style={{ borderTop: '1px solid #1A2038', borderBottom: '1px solid #1A2038', padding: '16px 0', position: 'relative', zIndex: 10, overflow: 'hidden' }}>
        <ScrollTicker items={tickerItems} />
      </div>

      {/* ── STATS ── */}
      <section style={{ padding: '100px 32px', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          <StatCard value={284} suffix="+" label="Returns filed" delay={0} />
          <StatCard value={1200000} suffix="" label="Tax savings found" delay={100} />
          <StatCard value={98} suffix="%" label="Research accuracy" delay={200} />
          <StatCard value={3} suffix="x" label="Faster memo drafts" delay={300} />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '80px 32px 100px', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <TextReveal className="text-center" delay={0}>
            <div style={{ fontSize: '13px', color: '#4F46E5', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '16px' }}>Platform capabilities</div>
          </TextReveal>
          <TextReveal className="text-center" delay={100}>
            <h2 style={{ fontSize: '42px', fontWeight: 800, letterSpacing: '-0.03em', color: '#E4E8F8', marginBottom: '16px', lineHeight: 1.1 }}>
              Every piece your practice needs
            </h2>
          </TextReveal>
          <TextReveal className="text-center" delay={200}>
            <p style={{ fontSize: '17px', color: '#7885B8', maxWidth: '560px', margin: '0 auto 64px', lineHeight: 1.7 }}>
              Six integrated modules. One workspace. No context switching between six different tools when a complex matter needs your full attention.
            </p>
          </TextReveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: '80px 32px', position: 'relative', zIndex: 10, background: 'linear-gradient(180deg, transparent 0%, rgba(79,70,229,0.03) 50%, transparent 100%)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div>
            <TextReveal delay={0}>
              <div style={{ fontSize: '13px', color: '#4F46E5', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '16px' }}>How it works</div>
            </TextReveal>
            <TextReveal delay={100}>
              <h2 style={{ fontSize: '38px', fontWeight: 800, letterSpacing: '-0.03em', color: '#E4E8F8', marginBottom: '48px', lineHeight: 1.15 }}>
                From engagement intake to filed return
              </h2>
            </TextReveal>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {steps.map((s, i) => <WorkflowStep key={i} {...s} delay={i * 100} />)}
            </div>
          </div>

          <TextReveal delay={200}>
            <TiltCard>
              <div style={{
                background: 'linear-gradient(135deg, #0C1020 0%, #0F1422 100%)',
                border: '1px solid #1A2038',
                borderRadius: '20px',
                overflow: 'hidden',
              }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #1A2038', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {['#EF4444', '#F59E0B', '#10B981'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
                  <span style={{ marginLeft: '8px', fontSize: '11px', color: '#384060', fontFamily: 'monospace' }}>agent — research.tsx</span>
                </div>
                <div style={{ padding: '24px', fontFamily: 'monospace', fontSize: '12px', lineHeight: 1.8 }}>
                  {[
                    { label: '// Agent scanning IRC §199A', color: '#384060' },
                    { label: 'const memo = await agent.research({', color: '#A5B4FC' },
                    { label: "  issue: 'QBI deduction threshold',", color: '#C7D2FE' },
                    { label: "  clientType: 'S-Corp',", color: '#C7D2FE' },
                    { label: "  taxYear: 2024,", color: '#C7D2FE' },
                    { label: '});', color: '#A5B4FC' },
                    { label: '', color: '' },
                    { label: '// Result: 47 relevant provisions', color: '#384060' },
                    { label: '// 12 controlling cases cited', color: '#384060' },
                    { label: '// Position memo drafted in 8s', color: '#10B981' },
                  ].map((line, i) => (
                    <div key={i} style={{ color: line.color }}>{line.label || '\u00A0'}</div>
                  ))}
                </div>
              </div>
            </TiltCard>
          </TextReveal>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '80px 32px 100px', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <TextReveal className="text-center" delay={0}>
            <h2 style={{ fontSize: '38px', fontWeight: 800, letterSpacing: '-0.03em', color: '#E4E8F8', marginBottom: '16px', lineHeight: 1.15 }}>
              What practitioners say
            </h2>
          </TextReveal>
          <TextReveal className="text-center" delay={100}>
            <p style={{ fontSize: '16px', color: '#7885B8', marginBottom: '60px' }}>From the people who use this every day during busy season.</p>
          </TextReveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {testimonials.map((t, i) => <TestimonialCard key={i} {...t} delay={i * 100} />)}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: '80px 32px 100px', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <TextReveal className="text-center" delay={0}>
            <div style={{ fontSize: '13px', color: '#4F46E5', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '16px' }}>Pricing</div>
          </TextReveal>
          <TextReveal className="text-center" delay={100}>
            <h2 style={{ fontSize: '38px', fontWeight: 800, letterSpacing: '-0.03em', color: '#E4E8F8', marginBottom: '16px', lineHeight: 1.15 }}>
              Straightforward pricing
            </h2>
          </TextReveal>
          <TextReveal className="text-center" delay={200}>
            <p style={{ fontSize: '16px', color: '#7885B8', marginBottom: '60px' }}>Three tiers. No per-seat surprises until you reach the growth plan.</p>
          </TextReveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <PricingCard
              plan="Solo"
              price="$79"
              features={['Up to 50 active clients', 'All 6 platform modules', 'AI research agent', '5 GB document storage', 'Email support']}
              delay={0}
              onCTA={enter}
            />
            <PricingCard
              plan="Practice"
              price="$249"
              features={['Up to 500 active clients', 'Unlimited team seats', 'Priority AI processing', '50 GB document storage', 'Slack support channel', 'Custom firm branding']}
              highlighted
              delay={100}
              onCTA={enter}
            />
            <PricingCard
              plan="Enterprise"
              price="Custom"
              features={['Unlimited clients', 'Dedicated infrastructure', 'SSO and audit logs', 'SLA guarantee', 'Dedicated account manager', 'Custom integrations']}
              delay={200}
              onCTA={enter}
            />
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section style={{ padding: '80px 32px 120px', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <TextReveal>
            <TiltCard>
              <div style={{
                background: 'linear-gradient(135deg, #1E1B4B 0%, #141929 50%, #1E1B4B 100%)',
                border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: '24px',
                padding: '60px',
                textAlign: 'center',
                boxShadow: '0 0 100px rgba(79,70,229,0.12)',
              }}>
                <h2 style={{ fontSize: '42px', fontWeight: 800, letterSpacing: '-0.03em', color: '#E4E8F8', marginBottom: '16px', lineHeight: 1.1 }}>
                  Your practice, organized at last
                </h2>
                <p style={{ fontSize: '17px', color: '#7885B8', lineHeight: 1.7, marginBottom: '40px', maxWidth: '460px', margin: '0 auto 40px' }}>
                  Open the platform and see your first return ready to work in under five minutes. No training sessions required.
                </p>
                <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
                  <MagneticBtn onClick={enter} variant="primary">Open TaxMind Nexus</MagneticBtn>
                  <MagneticBtn variant="outline" onClick={() => navigate('/dashboard')}>See live demo</MagneticBtn>
                </div>
              </div>
            </TiltCard>
          </TextReveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid #1A2038', padding: '40px 32px', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '7px',
              background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#7885B8' }}>TaxMind Nexus</span>
          </div>
          <div style={{ fontSize: '13px', color: '#384060' }}>
            Built for tax professionals who move quickly
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['GitHub', 'Vercel', 'Status'].map(item => (
              <a key={item} href="#" style={{ fontSize: '13px', color: '#384060', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = '#7885B8'}
                onMouseLeave={e => (e.target as HTMLElement).style.color = '#384060'}
              >{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
