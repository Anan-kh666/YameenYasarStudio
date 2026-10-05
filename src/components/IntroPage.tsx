"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ── Matrix config ── */
const MATRIX_CHARS = "01٠١٢٣٤٥٦٧٨٩<>/{}[]#=+-*&%$@!?;:";
const COL_WIDTH = 22;
const FALL_SPEED_MIN = 0.3;
const FALL_SPEED_MAX = 1.2;
const MOUSE_GLOW_DIST = 160;

/* ── Text decode ── */
const AR_CHARS = "ابتثجحخدذرزسشصضطظعغفقكلمنهوي";
const EN_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const SCRAMBLE = AR_CHARS + EN_CHARS;

interface MatrixCol {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  length: number;
}

function createMatrixCols(w: number, h: number): MatrixCol[] {
  const cols: MatrixCol[] = [];
  const count = Math.ceil(w / COL_WIDTH);
  for (let i = 0; i < count; i++) {
    const length = Math.floor(Math.random() * 15) + 5;
    const chars: string[] = [];
    for (let j = 0; j < length; j++) {
      chars.push(MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]);
    }
    cols.push({
      x: i * COL_WIDTH + COL_WIDTH / 2,
      y: Math.random() * h * 1.5 - h * 0.5,
      speed: FALL_SPEED_MIN + Math.random() * (FALL_SPEED_MAX - FALL_SPEED_MIN),
      chars,
      length,
    });
  }
  return cols;
}

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
      if (frame >= totalFrames) { clearInterval(interval); setOutput(text); }
    }, 50);
    return () => clearInterval(interval);
  }, [text, active]);
  return output;
}

function detectLocale(): string {
  try {
    const saved = localStorage.getItem("yy-locale");
    if (saved === "ar" || saved === "en") return saved;
  } catch {}
  const lang = (navigator.language || "").toLowerCase();
  return lang.startsWith("ar") ? "ar" : "en";
}

/* ── Lock SVG icon ── */
function LockIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 28" width={42} height={49} className="intro-lock-svg" aria-hidden="true">
      <path
        className={`intro-lock-shackle ${open ? "open" : ""}`}
        d="M7 11V7a5 5 0 0 1 10 0v4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect x="4" y="11" width="16" height="13" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="17" r="2" fill="currentColor" />
      <rect x="11" y="18" width="2" height="3" rx="1" fill="currentColor" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   IntroPage — flow:
   matrix bg → logo → text → lock → unlock (text reveals) →
   dino video plays → video ends → fade to main page
   ═══════════════════════════════════════════════════════════════════════ */
type Phase = "init" | "matrix" | "logo" | "text" | "lock" | "unlock" | "dino" | "fade";

export default function IntroPage() {
  const [phase, setPhase] = useState<Phase>("init");
  const [glowPos, setGlowPos] = useState({ x: 0.5, y: 0.5 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const dinoVideoRef = useRef<HTMLVideoElement>(null);
  const mouseAbs = useRef({ x: 0, y: 0 });
  const matrixColsRef = useRef<MatrixCol[]>([]);
  const rafRef = useRef(0);

  const atLeast = (target: Phase) => {
    const order: Phase[] = ["init", "matrix", "logo", "text", "lock", "unlock", "dino", "fade"];
    return order.indexOf(phase) >= order.indexOf(target);
  };

  /* ── Mount ── */
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let skip = false;
    try { skip = localStorage.getItem("yy-intro-seen") === "1"; } catch {}

    if (skip || prefersReduced) {
      setPhase("lock");
    } else {
      setPhase("matrix");
    }
  }, []);

  /* ── Start background video ── */
  useEffect(() => {
    if (phase === "matrix" && bgVideoRef.current) {
      bgVideoRef.current.play().catch(() => {});
    }
  }, [phase]);

  /* ── Canvas init ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      matrixColsRef.current = createMatrixCols(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ── Sequence timers ── */
  useEffect(() => {
    if (phase !== "matrix") return;
    const t1 = setTimeout(() => setPhase("logo"), 800);
    const t2 = setTimeout(() => setPhase("text"), 2200);
    const t3 = setTimeout(() => setPhase("lock"), 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [phase]);

  /* ── Mark seen ── */
  useEffect(() => {
    if (phase === "lock") {
      try { localStorage.setItem("yy-intro-seen", "1"); } catch {}
    }
  }, [phase]);

  /* ── Play dino video when phase enters "dino" ── */
  useEffect(() => {
    if (phase !== "dino") return;
    const vid = dinoVideoRef.current;
    if (!vid) return;

    vid.currentTime = 0;
    vid.play().catch(() => {});

    /* When the video ends, fade out and navigate */
    const onEnd = () => {
      setPhase("fade");
      const locale = detectLocale();
      setTimeout(() => {
        window.location.href = `/${locale}/`;
      }, 1000);
    };
    vid.addEventListener("ended", onEnd);

    /* Safety fallback: if video stalls, navigate after 8s */
    const fallback = setTimeout(() => {
      if (phase === "dino") onEnd();
    }, 8000);

    return () => {
      vid.removeEventListener("ended", onEnd);
      clearTimeout(fallback);
    };
  }, [phase]);

  /* ── Main animation loop: matrix + glow tracking ── */
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseAbs.current = { x: e.clientX, y: e.clientY };
    };

    const tick = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setGlowPos({
        x: mouseAbs.current.x / w || 0.5,
        y: mouseAbs.current.y / h || 0.5,
      });

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        const cw = canvas.width;
        const ch = canvas.height;
        ctx.clearRect(0, 0, cw, ch);

        const cols = matrixColsRef.current;
        const mx = mouseAbs.current.x;
        const my = mouseAbs.current.y;

        for (const col of cols) {
          col.y += col.speed;
          if (col.y - col.length * 16 > ch) {
            col.y = -col.length * 16;
            col.speed = FALL_SPEED_MIN + Math.random() * (FALL_SPEED_MAX - FALL_SPEED_MIN);
            for (let j = 0; j < col.chars.length; j++) {
              if (Math.random() > 0.6) {
                col.chars[j] = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
              }
            }
          }

          for (let j = 0; j < col.chars.length; j++) {
            const cy = col.y + j * 16;
            if (cy < -20 || cy > ch + 20) continue;

            const dx = col.x - mx;
            const dy = cy - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const nearMouse = dist < MOUSE_GLOW_DIST;

            const fadeFromTail = j / col.chars.length;
            let alpha = 0.06 + fadeFromTail * 0.08;
            let color = "208, 204, 198";

            if (nearMouse) {
              const proximity = 1 - dist / MOUSE_GLOW_DIST;
              alpha = 0.1 + proximity * 0.5;
              const r = Math.round(208 + proximity * 30);
              const g = Math.round(204 + proximity * 10);
              const b = Math.round(198 - proximity * 20);
              color = `${r}, ${g}, ${b}`;
            }

            ctx.font = "13px monospace";
            ctx.fillStyle = `rgba(${color}, ${alpha})`;
            ctx.fillText(col.chars[j], col.x, cy);
          }
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
  }, []);

  /* ── Text decode ── */
  const textActive = atLeast("text") && phase !== "init";
  const brandAr = useTextDecode("يمين", textActive);
  const brandEn = useTextDecode("Yasar", textActive);

  /* ── Lock click → unlock → dino video → navigate ── */
  const handleUnlock = useCallback(() => {
    if (phase !== "lock") return;
    setPhase("unlock");

    /* After unlock text reveals, start the dino video */
    setTimeout(() => {
      setPhase("dino");
      try { localStorage.setItem("yy-intro-seen", "1"); } catch {}
    }, 1400);
  }, [phase]);

  /* ── Skip ── */
  const handleSkip = useCallback(() => {
    try { localStorage.setItem("yy-intro-seen", "1"); } catch {}
    const locale = detectLocale();
    window.location.href = `/${locale}/`;
  }, []);

  const showDino = phase === "dino" || phase === "fade";

  return (
    <div className="intro-root">
      {/* ── Background video (logo glow animation) ── */}
      <video
        ref={bgVideoRef}
        className={`intro-video ${atLeast("matrix") && phase !== "init" ? "active" : ""}`}
        src="/images/logo-glow.mp4"
        muted loop playsInline preload="auto" aria-hidden="true"
      />

      {/* ── Noise texture ── */}
      <svg className="intro-noise" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" opacity="0.03" />
      </svg>

      {/* ── Matrix canvas ── */}
      <canvas ref={canvasRef} className="intro-matrix" aria-hidden="true" />

      {/* ── Cursor glow ── */}
      <div
        className={`intro-glow ${atLeast("matrix") && phase !== "init" ? "active" : ""}`}
        style={{
          background: `radial-gradient(160px circle at ${glowPos.x * 100}% ${glowPos.y * 100}%, rgba(208, 204, 198, 0.04), transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* ── Skip button ── */}
      <button onClick={handleSkip} className="intro-skip" type="button">
        <span lang="en">Skip</span>{" / "}<span lang="ar">تخطّي</span>
      </button>

      {/* ── Main content (brand text + lock) ── */}
      <div className={`intro-content ${showDino ? "hidden" : ""}`}>
        <div className={`intro-brand ${atLeast("logo") ? "visible" : ""}`}>
          <span className="intro-brand-ar font-heading" lang="ar" dir="rtl">{brandAr}</span>
          <span className="intro-brand-divider" aria-hidden="true" />
          <span className="intro-brand-en font-heading" lang="en" dir="ltr">{brandEn}</span>
        </div>

        <div className="intro-lock-area">
          <button
            onClick={handleUnlock}
            className={`intro-lock ${atLeast("lock") ? "visible" : ""} ${phase === "unlock" ? "unlocked" : ""}`}
            type="button"
            aria-label="Unlock"
          >
            <LockIcon open={phase === "unlock"} />
          </button>

          <div className={`intro-revealed-text ${phase === "unlock" ? "visible" : ""}`}>
            <span className="intro-revealed-ar" lang="ar" dir="rtl">
              هل موقعك يتحدث العربية فعلاً، أم يكتفي بالترجمة؟
            </span>
            <span className="intro-revealed-en" lang="en" dir="ltr">
              Does your website speak Arabic, or just translate it?
            </span>
          </div>
        </div>
      </div>

      {/* ── Logo reveal video ──
          Preloaded but hidden; plays when phase = "dino".
          Automatically triggers fade + navigation on video end. */}
      <div className={`intro-dino-wrap ${showDino ? "active" : ""}`}>
        <video
          ref={dinoVideoRef}
          className="intro-dino-video"
          src="/images/logo-reveal.mp4"
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
      </div>

      {/* ── Edge vignette ── */}
      <div className="intro-vignette" aria-hidden="true" />

      {/* ── Fade overlay ── */}
      {phase === "fade" && <div className="intro-fade-out" />}
    </div>
  );
}
