"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ── Character pools for the text decode scramble ──
   Mix of Arabic and Latin gives the bilingual brand feel. */
const AR_CHARS = "ابتثجحخدذرزسشصضطظعغفقكلمنهوي";
const EN_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const SCRAMBLE = AR_CHARS + EN_CHARS;

/** Decode text character by character with a bilingual scramble effect.
 *  Characters resolve from the start of the string (which is the
 *  reading-direction start for both LTR and RTL text). */
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

/* ── Floating chevron fragment ──
   A simplified V from the brand mark, drifting on a slow diagonal path. */
function ChevronFragment({
  size,
  x,
  y,
  opacity,
  driftX,
  driftY,
  driftRot,
  duration,
  delay,
}: {
  size: number;
  x: string;
  y: string;
  opacity: number;
  driftX: string;
  driftY: string;
  driftRot: string;
  duration: number;
  delay: number;
}) {
  return (
    <svg
      viewBox="0 0 24 20"
      width={size}
      height={size * 0.83}
      className="intro-chevron"
      style={{
        left: x,
        top: y,
        opacity,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        "--drift-x": driftX,
        "--drift-y": driftY,
        "--drift-rot": driftRot,
      } as React.CSSProperties}
      aria-hidden="true"
    >
      <path
        d="M2 2 L12 17 L22 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   IntroPage — the "/" experience.
   Sequence: glow bloom → logo mark → brand text decode → question button.
   Click the button → exit wipe → navigate to /ar/ or /en/.
   ═══════════════════════════════════════════════════════════════════════ */
type Phase = "init" | "glow" | "logo" | "text" | "button" | "exit";

export default function IntroPage() {
  const [phase, setPhase] = useState<Phase>("init");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [glowPos, setGlowPos] = useState({ x: 0.7, y: 0.8 });
  const [buttonOffset, setButtonOffset] = useState({ x: 0, y: 0 });
  const [glowRadius, setGlowRadius] = useState(400);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mouseTarget = useRef({ x: 0.7, y: 0.8 });
  const rafRef = useRef(0);

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

  /* ── Animation sequence timers ── */
  useEffect(() => {
    if (phase !== "glow") return;
    const t1 = setTimeout(() => setPhase("logo"), 1200);
    const t2 = setTimeout(() => setPhase("text"), 2600);
    const t3 = setTimeout(() => setPhase("button"), 4800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [phase]);

  /* ── Mark intro as seen once button appears ── */
  useEffect(() => {
    if (phase === "button") {
      try {
        localStorage.setItem("yy-intro-seen", "1");
      } catch {}
    }
  }, [phase]);

  /* ── Mouse tracking: smooth glow + magnetic button ── */
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseTarget.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    let cx = 0.7,
      cy = 0.8;

    const tick = () => {
      // Smooth glow position with heavy damping
      cx = lerp(cx, mouseTarget.current.x, 0.035);
      cy = lerp(cy, mouseTarget.current.y, 0.035);
      setGlowPos({ x: cx, y: cy });

      // Magnetic button pull
      if (buttonRef.current && phase === "button") {
        const rect = buttonRef.current.getBoundingClientRect();
        const bx = rect.left + rect.width / 2;
        const by = rect.top + rect.height / 2;
        const mx = mouseTarget.current.x * window.innerWidth;
        const my = mouseTarget.current.y * window.innerHeight;
        const dx = mx - bx;
        const dy = my - by;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120 && dist > 0) {
          const pull = (1 - dist / 120) * 6;
          setButtonOffset({ x: (dx / dist) * pull, y: (dy / dist) * pull });
        } else {
          setButtonOffset((prev) => ({
            x: prev.x * 0.85,
            y: prev.y * 0.85,
          }));
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

  /* ── Navigation helpers ── */
  const navigate = useCallback(
    (withWipe: boolean) => {
      try {
        localStorage.setItem("yy-intro-seen", "1");
      } catch {}
      const locale = detectLocale();

      if (withWipe && !reducedMotion) {
        setPhase("exit");
        setTimeout(() => {
          window.location.href = `/${locale}/`;
        }, 900);
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
      {/* ── Noise texture via SVG feTurbulence ── */}
      <svg
        className="intro-noise"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" opacity="0.035" />
      </svg>

      {/* ── Cursor-reactive crimson glow ── */}
      <div
        className={`intro-glow ${atLeast("glow") && phase !== "init" ? "active" : ""}`}
        style={{
          background: `radial-gradient(${glowRadius}px circle at ${glowPos.x * 100}% ${glowPos.y * 100}%, rgba(139, 13, 26, 0.18), transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* ── Floating chevron fragments ── */}
      <div className="intro-chevrons" aria-hidden="true">
        <ChevronFragment
          size={20} x="12%" y="18%" opacity={0.06}
          driftX="35px" driftY="-70px" driftRot="15deg"
          duration={42} delay={0}
        />
        <ChevronFragment
          size={32} x="78%" y="12%" opacity={0.04}
          driftX="-45px" driftY="60px" driftRot="-10deg"
          duration={55} delay={3}
        />
        <ChevronFragment
          size={14} x="55%" y="72%" opacity={0.07}
          driftX="25px" driftY="-50px" driftRot="20deg"
          duration={38} delay={1}
        />
        <ChevronFragment
          size={26} x="22%" y="62%" opacity={0.05}
          driftX="-30px" driftY="-80px" driftRot="-12deg"
          duration={48} delay={5}
        />
        <ChevronFragment
          size={18} x="88%" y="48%" opacity={0.05}
          driftX="40px" driftY="45px" driftRot="8deg"
          duration={44} delay={2}
        />
      </div>

      {/* ── Skip button — visible from first frame, keyboard reachable ── */}
      <button onClick={handleSkip} className="intro-skip" type="button">
        <span lang="en">Skip intro</span>
        {" / "}
        <span lang="ar">تخطي</span>
      </button>

      {/* ── Main content ── */}
      <div className="intro-content">
        {/* Logo mark — off-white + crimson */}
        <div
          className={`intro-logo ${atLeast("logo") ? "visible" : ""} ${phase === "exit" ? "exit" : ""}`}
        >
          <img
            src="/brand/yy-mark-intro.svg"
            alt=""
            width={80}
            height={60}
          />
        </div>

        {/* Brand text: يمين from right, Yasar from left */}
        <div
          className={`intro-brand ${atLeast("text") ? "visible" : ""} ${phase === "exit" ? "exit" : ""}`}
        >
          <span className="intro-brand-ar font-heading" lang="ar" dir="rtl">
            {brandAr}
          </span>
          <span className="intro-brand-en font-heading" lang="en" dir="ltr">
            {brandEn}
          </span>
        </div>

        {/* Question button — the punchline */}
        <button
          ref={buttonRef}
          onClick={handleClick}
          className={`intro-cta ${atLeast("button") ? "visible" : ""} ${phase === "exit" ? "exit" : ""}`}
          style={
            phase === "button"
              ? {
                  transform: `translate(${buttonOffset.x}px, ${buttonOffset.y}px)`,
                }
              : undefined
          }
          type="button"
        >
          <span className="intro-cta-ar" lang="ar" dir="rtl">
            موقعك بيحكي عربي، ولا بس مترجم؟
          </span>
          <span className="intro-cta-en" lang="en" dir="ltr">
            Does your website speak Arabic, or just translate it?
          </span>
        </button>
      </div>

      {/* ── Exit wipe — crimson circle expanding from center ── */}
      {phase === "exit" && <div className="intro-wipe" />}
    </div>
  );
}
