"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ── Character pools for the text decode scramble ── */
const AR_CHARS = "ابتثجحخدذرزسشصضطظعغفقكلمنهوي";
const EN_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const SCRAMBLE = AR_CHARS + EN_CHARS;

/* ── Particle system config ── */
const PARTICLE_COUNT = 55;
const CONNECT_DIST = 130;
const MOUSE_REPEL_DIST = 120;
const MOUSE_REPEL_FORCE = 3;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phaseOffset: number;
}

function createParticles(w: number, h: number): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    size: Math.random() * 2 + 1,
    alpha: Math.random() * 0.5 + 0.2,
    phaseOffset: Math.random() * Math.PI * 2,
  }));
}

/** Decode text character by character with a bilingual scramble effect. */
function useTextDecode(text: string, active: boolean): string {
  const [output, setOutput] = useState(text);

  useEffect(() => {
    if (!active) return;

    const chars = text.split("");
    const len = chars.length;
    let frame = 0;
    const framesPerChar = 4;
    const totalFrames = len * framesPerChar;

    const interval = setInterval(() => {
      frame++;
      const locked = Math.min(Math.floor(frame / framesPerChar), len);
      const result = chars
        .map((ch, i) => {
          if (ch === " ") return " ";
          if (i < locked) return ch;
          return SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
        })
        .join("");
      setOutput(result);
      if (frame >= totalFrames) {
        clearInterval(interval);
        setOutput(text);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [text, active]);

  return output;
}

/** Detect user's preferred locale from localStorage or browser. */
function detectLocale(): string {
  try {
    const saved = localStorage.getItem("yy-locale");
    if (saved === "ar" || saved === "en") return saved;
  } catch {}
  const lang = (navigator.language || "").toLowerCase();
  return lang.startsWith("ar") ? "ar" : "en";
}

/* ── Floating chevron fragment ── */
function ChevronFragment({
  size, x, y, opacity, driftX, driftY, driftRot, duration, delay,
}: {
  size: number; x: string; y: string; opacity: number;
  driftX: string; driftY: string; driftRot: string;
  duration: number; delay: number;
}) {
  return (
    <svg
      viewBox="0 0 24 20"
      width={size}
      height={size * 0.83}
      className="intro-chevron"
      style={{
        left: x, top: y, opacity,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        "--drift-x": driftX, "--drift-y": driftY, "--drift-rot": driftRot,
      } as React.CSSProperties}
      aria-hidden="true"
    >
      <path d="M2 2 L12 17 L22 2" fill="none" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Transition objects — themed icons that scatter on exit ──
   Represent the studio's domain: code, Arabic, Latin, bidirectional, design. */
function TransitionObjects({ active }: { active: boolean }) {
  if (!active) return null;

  const objects = [
    { label: "code", angle: 30, delay: 0, content: "</>" },
    { label: "arabic", angle: 90, delay: 60, content: "ع" },
    { label: "latin", angle: 150, delay: 30, content: "A" },
    { label: "bidi", angle: 210, delay: 90, content: "↔" },
    { label: "design", angle: 270, delay: 45, content: "◇" },
    { label: "globe", angle: 330, delay: 75, content: "◎" },
  ];

  return (
    <div className="intro-transition-objects" aria-hidden="true">
      {objects.map((obj) => (
        <span
          key={obj.label}
          className="intro-transition-obj"
          style={{
            "--obj-angle": `${obj.angle}deg`,
            animationDelay: `${obj.delay}ms`,
          } as React.CSSProperties}
        >
          {obj.content}
        </span>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   IntroPage — the "/" cinematic experience.
   Layers: video → noise → particles → glow → chevrons → scanline →
   content (logo + text + CTA) → transition objects → vignette → wipe.
   ═══════════════════════════════════════════════════════════════════════ */
type Phase = "init" | "glow" | "logo" | "text" | "button" | "exit";

export default function IntroPage() {
  const [phase, setPhase] = useState<Phase>("init");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [glowPos, setGlowPos] = useState({ x: 0.7, y: 0.8 });
  const [buttonOffset, setButtonOffset] = useState({ x: 0, y: 0 });
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [glowRadius, setGlowRadius] = useState(400);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mouseTarget = useRef({ x: 0.7, y: 0.8 });
  const mouseAbs = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef(0);
  const timeRef = useRef(0);
  const exitRef = useRef(false);

  /* ── Phase ordering helper ── */
  const atLeast = (target: Phase) => {
    const order: Phase[] = ["init", "glow", "logo", "text", "button", "exit"];
    return order.indexOf(phase) >= order.indexOf(target);
  };

  /* ── Mount: check preferences and start sequence ── */
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setReducedMotion(prefersReduced);
    setGlowRadius(window.innerWidth > 768 ? 600 : 350);

    let skipToButton = false;
    try {
      skipToButton = localStorage.getItem("yy-intro-seen") === "1";
    } catch {}

    if (skipToButton || prefersReduced) {
      setPhase("button");
    } else {
      setPhase("glow");
    }
  }, []);

  /* ── Start video playback when glow phase begins ── */
  useEffect(() => {
    if (phase === "glow" && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [phase]);

  /* ── Initialize particle system ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (particlesRef.current.length === 0) {
        particlesRef.current = createParticles(canvas.width, canvas.height);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ── Animation sequence timers ── */
  useEffect(() => {
    if (phase !== "glow") return;
    const t1 = setTimeout(() => setPhase("logo"), 1200);
    const t2 = setTimeout(() => setPhase("text"), 2800);
    const t3 = setTimeout(() => setPhase("button"), 5200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [phase]);

  /* ── Mark intro as seen once button appears ── */
  useEffect(() => {
    if (phase === "button") {
      try { localStorage.setItem("yy-intro-seen", "1"); } catch {}
    }
  }, [phase]);

  /* ── Track exit for particle explosion ── */
  useEffect(() => {
    exitRef.current = phase === "exit";
  }, [phase]);

  /* ── Main animation loop ── */
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseTarget.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
      mouseAbs.current = { x: e.clientX, y: e.clientY };
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    let cx = 0.7, cy = 0.8;

    const tick = () => {
      timeRef.current += 0.016;

      /* ── Smooth glow position ── */
      cx = lerp(cx, mouseTarget.current.x, 0.035);
      cy = lerp(cy, mouseTarget.current.y, 0.035);
      setGlowPos({ x: cx, y: cy });

      /* ── Parallax offset ── */
      const px = (mouseTarget.current.x - 0.5) * 2;
      const py = (mouseTarget.current.y - 0.5) * 2;
      setParallax({ x: px, y: py });

      /* ── Magnetic button pull ── */
      if (buttonRef.current && phase === "button") {
        const rect = buttonRef.current.getBoundingClientRect();
        const bx = rect.left + rect.width / 2;
        const by = rect.top + rect.height / 2;
        const mx = mouseAbs.current.x;
        const my = mouseAbs.current.y;
        const dx = mx - bx;
        const dy = my - by;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150 && dist > 0) {
          const pull = (1 - dist / 150) * 8;
          setButtonOffset({ x: (dx / dist) * pull, y: (dy / dist) * pull });
        } else {
          setButtonOffset((prev) => ({
            x: prev.x * 0.85,
            y: prev.y * 0.85,
          }));
        }
      }

      /* ── Particle system ── */
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx && particlesRef.current.length > 0) {
        const w = canvas.width;
        const h = canvas.height;
        const t = timeRef.current;
        const isExiting = exitRef.current;

        ctx.clearRect(0, 0, w, h);
        const particles = particlesRef.current;

        for (const p of particles) {
          if (isExiting) {
            /* On exit: particles accelerate outward from center */
            const dcx = p.x - w / 2;
            const dcy = p.y - h / 2;
            const dd = Math.sqrt(dcx * dcx + dcy * dcy) || 1;
            p.vx += (dcx / dd) * 0.8;
            p.vy += (dcy / dd) * 0.8;
          } else {
            /* Normal: mouse repulsion */
            const dmx = p.x - mouseAbs.current.x;
            const dmy = p.y - mouseAbs.current.y;
            const dmd = Math.sqrt(dmx * dmx + dmy * dmy);
            if (dmd < MOUSE_REPEL_DIST && dmd > 0) {
              const force = (1 - dmd / MOUSE_REPEL_DIST) * MOUSE_REPEL_FORCE;
              p.vx += (dmx / dmd) * force * 0.1;
              p.vy += (dmy / dmd) * force * 0.1;
            }
          }

          p.vx *= isExiting ? 0.98 : 0.99;
          p.vy *= isExiting ? 0.98 : 0.99;
          p.x += p.vx;
          p.y += p.vy;

          if (!isExiting) {
            if (p.x < -10) p.x = w + 10;
            if (p.x > w + 10) p.x = -10;
            if (p.y < -10) p.y = h + 10;
            if (p.y > h + 10) p.y = -10;
          }
        }

        /* Draw connecting lines */
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i];
            const b = particles[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < CONNECT_DIST) {
              const lineAlpha = (1 - d / CONNECT_DIST) * 0.15;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = `rgba(229, 72, 77, ${lineAlpha})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }

        /* Draw particles */
        for (const p of particles) {
          const twinkle = Math.sin(t * 1.5 + p.phaseOffset) * 0.15 + 0.85;
          const a = p.alpha * twinkle;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(229, 72, 77, ${a})`;
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMouseMove);
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [phase]);

  /* ── Text decode hooks ── */
  const textActive = atLeast("text") && phase !== "init";
  const brandAr = useTextDecode("يمين", textActive);
  const brandEn = useTextDecode("Yasar", textActive);

  /* ── Navigation ── */
  const navigate = useCallback(
    (withWipe: boolean) => {
      try { localStorage.setItem("yy-intro-seen", "1"); } catch {}
      const locale = detectLocale();

      if (withWipe && !reducedMotion) {
        setPhase("exit");
        /* Extended exit: objects scatter → flash → wipe → navigate */
        setTimeout(() => {
          window.location.href = `/${locale}/`;
        }, 1400);
      } else {
        window.location.href = `/${locale}/`;
      }
    },
    [reducedMotion]
  );

  const handleClick = useCallback(() => {
    if (phase === "exit") return;
    navigate(true);
  }, [phase, navigate]);

  const handleSkip = useCallback(() => {
    navigate(!reducedMotion);
  }, [navigate, reducedMotion]);

  return (
    <div className="intro-root">
      {/* ── Layer 0: Higgsfield video background ── */}
      <video
        ref={videoRef}
        className={`intro-video ${atLeast("glow") && phase !== "init" ? "active" : ""}`}
        src="/images/intro-glow.mp4"
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        style={{
          transform: `translate(${parallax.x * -4}px, ${parallax.y * -4}px) scale(1.1)`,
        }}
      />

      {/* ── Layer 1: Noise texture ── */}
      <svg className="intro-noise" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" opacity="0.035" />
      </svg>

      {/* ── Layer 2: Particle canvas ── */}
      <canvas
        ref={canvasRef}
        className={`intro-particles ${atLeast("glow") && phase !== "init" ? "active" : ""}`}
        aria-hidden="true"
      />

      {/* ── Layer 3: Cursor-reactive crimson glow ── */}
      <div
        className={`intro-glow ${atLeast("glow") && phase !== "init" ? "active" : ""}`}
        style={{
          background: `radial-gradient(${glowRadius}px circle at ${glowPos.x * 100}% ${glowPos.y * 100}%, rgba(139, 13, 26, 0.22), transparent 70%)`,
          transform: `translate(${parallax.x * -8}px, ${parallax.y * -8}px)`,
        }}
        aria-hidden="true"
      />

      {/* ── Layer 4: Floating chevron fragments ── */}
      <div
        className="intro-chevrons"
        aria-hidden="true"
        style={{ transform: `translate(${parallax.x * -12}px, ${parallax.y * -12}px)` }}
      >
        <ChevronFragment size={20} x="12%" y="18%" opacity={0.08}
          driftX="35px" driftY="-70px" driftRot="15deg" duration={42} delay={0} />
        <ChevronFragment size={32} x="78%" y="12%" opacity={0.05}
          driftX="-45px" driftY="60px" driftRot="-10deg" duration={55} delay={3} />
        <ChevronFragment size={14} x="55%" y="72%" opacity={0.09}
          driftX="25px" driftY="-50px" driftRot="20deg" duration={38} delay={1} />
        <ChevronFragment size={26} x="22%" y="62%" opacity={0.06}
          driftX="-30px" driftY="-80px" driftRot="-12deg" duration={48} delay={5} />
        <ChevronFragment size={18} x="88%" y="48%" opacity={0.06}
          driftX="40px" driftY="45px" driftRot="8deg" duration={44} delay={2} />
        <ChevronFragment size={24} x="40%" y="85%" opacity={0.04}
          driftX="-20px" driftY="-60px" driftRot="18deg" duration={50} delay={4} />
        <ChevronFragment size={16} x="65%" y="30%" opacity={0.07}
          driftX="50px" driftY="30px" driftRot="-15deg" duration={36} delay={6} />
      </div>

      {/* ── Scan line ── */}
      <div className={`intro-scanline ${phase === "text" ? "active" : ""}`} aria-hidden="true" />

      {/* ── Skip button ── */}
      <button onClick={handleSkip} className="intro-skip" type="button">
        <span lang="en">Skip</span>{" / "}<span lang="ar">تخطّي</span>
      </button>

      {/* ── Main content ── */}
      <div
        className="intro-content"
        style={{ transform: `translate(${parallax.x * -6}px, ${parallax.y * -6}px)` }}
      >
        {/* Logo mark — animated circle reveal + halo burst */}
        <div className={`intro-logo ${atLeast("logo") ? "visible" : ""} ${phase === "exit" ? "exit" : ""}`}>
          <div className={`intro-logo-halo ${atLeast("logo") ? "active" : ""}`} />
          {/* Logo image with circle-reveal clip-path animation */}
          <div className={`intro-logo-reveal ${atLeast("logo") ? "active" : ""}`}>
            <img src="/brand/yy-mark-intro.svg" alt="" width={80} height={60} />
          </div>
          {/* Gleam sweep over the logo after reveal */}
          <span className={`intro-logo-gleam ${atLeast("text") ? "active" : ""}`} />
        </div>

        {/* Brand text */}
        <div className={`intro-brand ${atLeast("text") ? "visible" : ""} ${phase === "exit" ? "exit" : ""}`}>
          <span className="intro-brand-ar font-heading" lang="ar" dir="rtl">{brandAr}</span>
          <span className="intro-brand-divider" aria-hidden="true" />
          <span className="intro-brand-en font-heading" lang="en" dir="ltr">{brandEn}</span>
        </div>

        {/* CTA button with rotating border */}
        <button
          ref={buttonRef}
          onClick={handleClick}
          className={`intro-cta ${atLeast("button") ? "visible" : ""} ${phase === "exit" ? "exit" : ""}`}
          style={
            phase === "button"
              ? { transform: `translate(${buttonOffset.x}px, ${buttonOffset.y}px)` }
              : undefined
          }
          type="button"
        >
          <span className="intro-cta-border" aria-hidden="true" />
          <span className="intro-cta-inner">
            <span className="intro-cta-ar" lang="ar" dir="rtl">
              هل موقعك يتحدث العربية فعلاً، أم يكتفي بالترجمة؟
            </span>
            <span className="intro-cta-en" lang="en" dir="ltr">
              Does your website speak Arabic, or just translate it?
            </span>
          </span>
        </button>
      </div>

      {/* ── Transition objects — scatter outward on exit ── */}
      <TransitionObjects active={phase === "exit"} />

      {/* ── Edge vignette ── */}
      <div className="intro-vignette" aria-hidden="true" />

      {/* ── Exit flash — brief bright pulse before wipe ── */}
      {phase === "exit" && <div className="intro-flash" />}

      {/* ── Exit wipe — crimson circle expanding from center ── */}
      {phase === "exit" && <div className="intro-wipe" />}
    </div>
  );
}
