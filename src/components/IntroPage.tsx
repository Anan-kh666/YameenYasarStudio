"use client";

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import { BrandField } from "@/lib/brandField";
import { cssFontFamily } from "@/lib/cssFont";

/* ═══════════════════════════════════════════════════════════════════════
   IntroPage — flow:
   assemble (particles stream in from both edges and build "Yasar | يمين")
   → lock (enter button; particles react to the pointer)
   → [click] unlock (the words are "compiled": they decode into digits,
     type themselves out as bilingual code, a progress bar fills from both
     ends, the code collapses into one line of light; the question appears)
   → logo (the line's digits render the real logo, a scan opens it) → fade → navigate

   Returning visitors start at "lock" with a short fly-in.
   Reduced motion: static text, no canvas; the button just enters.
   ═══════════════════════════════════════════════════════════════════════ */
type Phase = "init" | "assemble" | "lock" | "unlock" | "logo" | "fade";
const ORDER: Phase[] = ["init", "assemble", "lock", "unlock", "logo", "fade"];

/* Two lines on purpose: the Arabic breaks after the comma, where it pauses. */
const QUESTION_AR = ["هل موقعك يتحدث العربية فعلاً،", "أم يكتفي بالترجمة؟"];
const QUESTION_EN = "Does your website speak Arabic, or just translate it?";

/* ── Client environment, read ONCE on the first client render ──
   "Returning visitor?" and "reduced motion?" decide where the intro starts,
   so they must not change mid-intro. Caching them in a module variable and
   reading it through useSyncExternalStore gives us "null on the server,
   fixed value on the client" without calling setState inside an effect. */
interface ClientEnv { returning: boolean; reduced: boolean }
let cachedEnv: ClientEnv | null = null;
function getClientEnv(): ClientEnv {
  if (!cachedEnv) {
    let returning = false;
    try { returning = localStorage.getItem("yy-intro-seen") === "1"; } catch {}
    cachedEnv = {
      returning,
      reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    };
  }
  return cachedEnv;
}
const subscribeNever = () => () => {};
const getServerEnv = () => null;

function detectLocale(): string {
  try {
    const saved = localStorage.getItem("yy-locale");
    if (saved === "ar" || saved === "en") return saved;
  } catch {}
  const lang = (navigator.language || "").toLowerCase();
  return lang.startsWith("ar") ? "ar" : "en";
}

const toArabicDigits = (n: number) => String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]);

function LockIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 28" width={34} height={40} className="intro-lock-svg" aria-hidden="true">
      <path
        className={`intro-lock-shackle ${open ? "open" : ""}`}
        d="M7 11V7a5 5 0 0 1 10 0v4"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      />
      <rect x="4" y="11" width="16" height="13" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="17" r="2" fill="currentColor" />
      <rect x="11" y="18" width="2" height="3" rx="1" fill="currentColor" />
    </svg>
  );
}

/* Words animate one by one. We split on spaces only — never inside a word —
   so Arabic letters stay joined. */
function Words({ text, offset = 0 }: { text: string; offset?: number }) {
  return text.split(" ").map((word, i, all) => (
    <span key={i}>
      <span className="intro-q-word" style={{ "--i": i + offset } as React.CSSProperties}>{word}</span>
      {i < all.length - 1 ? " " : null}
    </span>
  ));
}

export default function IntroPage() {
  const env = useSyncExternalStore(subscribeNever, getClientEnv, getServerEnv);
  const [phaseState, setPhase] = useState<Phase | null>(null);
  /* Until something advances the phase, the starting phase follows from env. */
  const phase: Phase = phaseState ?? (env ? (env.returning || env.reduced ? "lock" : "assemble") : "init");
  const atLeast = (p: Phase) => ORDER.indexOf(phase) >= ORDER.indexOf(p);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fieldRef = useRef<BrandField | null>(null);
  const enterRef = useRef<HTMLButtonElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const pctEnRef = useRef<HTMLSpanElement>(null);
  const pctArRef = useRef<HTMLSpanElement>(null);

  const navigate = useCallback(() => {
    window.location.href = `/${detectLocale()}/`;
  }, []);

  /* ── Particle field: wait for the brand fonts (max 1.5 s), then start ── */
  useEffect(() => {
    if (!env || env.reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    const fonts = {
      ar: cssFontFamily("--font-tajawal", "sans-serif"),
      en: cssFontFamily("--font-cormorant", "serif"),
    };
    const fontsReady = Promise.all([
      document.fonts.load(`700 100px ${fonts.ar}`, "يمين"),
      document.fonts.load(`600 100px ${fonts.en}`, "Yasar"),
    ]).catch(() => {});
    Promise.race([fontsReady, new Promise((r) => setTimeout(r, 1500))]).then(() => {
      if (cancelled) return;
      const field = new BrandField(canvas, fonts);
      field.resize();
      field.start(env.returning);
      fieldRef.current = field;
      // If we started on the timeout (slow network), the letters were sampled
      // from the fallback font. Re-sample once the real fonts arrive: the
      // particles simply glide into the correct shapes.
      fontsReady.then(() => { if (!cancelled) field.resize(); });
    });

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => fieldRef.current?.resize(), 200);
    };

    /* Pointer drives the particles, and pulls the enter button a little
       toward the cursor ("magnetic"). Touch only counts while pressed. */
    const onMove = (e: PointerEvent) => {
      const touching = e.pointerType !== "mouse" ? e.pressure > 0 || e.buttons > 0 : true;
      fieldRef.current?.setPointer(e.clientX, e.clientY, touching);
      const btn = enterRef.current;
      if (btn && e.pointerType === "mouse") {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const near = Math.hypot(dx, dy) < 180;
        btn.style.setProperty("--mx", `${near ? dx * 0.25 : 0}px`);
        btn.style.setProperty("--my", `${near ? dy * 0.25 : 0}px`);
      }
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") fieldRef.current?.setPointer(-9999, -9999, false);
    };
    const onLeave = () => fieldRef.current?.setPointer(-9999, -9999, false);

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelled = true;
      clearTimeout(resizeTimer);
      fieldRef.current?.stop();
      fieldRef.current = null;
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [env]);

  /* ── Phase sequence — each phase schedules ONLY its own next step.
     (Scheduling several timeouts in one effect let React's cleanup cancel
     the later ones; see commit 20f11fe.) ── */
  useEffect(() => {
    if (phase !== "assemble") return;
    const t = setTimeout(() => setPhase("lock"), 2700);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase === "lock") {
      try { localStorage.setItem("yy-intro-seen", "1"); } catch {}
    }
  }, [phase]);

  /* ── Tell the particles what to do in each phase ── */
  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    if (phase === "unlock") {
      // Leftover particles "upload" into the progress bar, so the engine
      // needs to know where the bar is on screen.
      if (barRef.current) field.setSink(barRef.current.getBoundingClientRect());
      field.setMode("compile");
    }
    if (phase === "logo") field.setMode("render");
  }, [phase]);

  /* ── Bilingual progress counter: 0% → 100% and ٠٪ → ١٠٠٪ together ──
     Written straight into the DOM each frame (no React re-render per frame). */
  useEffect(() => {
    if (phase !== "unlock") return;
    const en = pctEnRef.current;
    const ar = pctArRef.current;
    if (!en || !ar) return;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - t0 - 350) / 2100));
      const eased = 1 - (1 - p) ** 2;
      const n = Math.round(eased * 100);
      en.textContent = `${n}%`;
      ar.textContent = `${toArabicDigits(n)}٪`;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  /* ── Finale: the real logo is rendered (see brandField "render" and
     .intro-logo), holds for a moment, then we fade into the site. ── */
  useEffect(() => {
    if (phase !== "logo") return;
    const t = setTimeout(() => {
      setPhase("fade");
      setTimeout(navigate, 1000);
    }, 3600);
    return () => clearTimeout(t);
  }, [phase, navigate]);

  /* ── Enter click ── */
  const handleUnlock = useCallback(() => {
    if (phase !== "lock") return;
    try { localStorage.setItem("yy-intro-seen", "1"); } catch {}

    if (env?.reduced) {
      setPhase("fade");
      setTimeout(navigate, 300);
      return;
    }

    setPhase("unlock");
    setTimeout(() => setPhase("logo"), 3000);
  }, [phase, env, navigate]);

  const handleSkip = useCallback(() => {
    try { localStorage.setItem("yy-intro-seen", "1"); } catch {}
    navigate();
  }, [navigate]);

  return (
    <div className={`intro-root phase-${phase}`}>
      <h1 className="sr-only">Yameen Yasar Studio · يمين يسار</h1>

      {/* Ambient silk loop — the same file the hero uses, so it is cached
          by the time the visitor lands on /ar/ or /en/. */}
      {env && !env.reduced && (
        <video
          className="intro-ambient"
          src="/images/ambient-silk.mp4"
          muted loop playsInline autoPlay preload="auto" aria-hidden="true"
        />
      )}

      {/* Blueprint grid — fades in while the words are compiled into code */}
      <div className="intro-grid" aria-hidden="true" />

      {/* The real logo (exact file, transparent background). It sits under
          the canvas and is opened by a CSS scan in the "logo" phase, in the
          same place and with the same timing the particles use. */}
      {env && !env.reduced && (
        <div className="intro-logo" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are unoptimized anyway */}
          <img src="/brand/yy-logo-intro.png" alt="" width={1016} height={304} decoding="async" />
        </div>
      )}

      <canvas ref={canvasRef} className="intro-canvas" aria-hidden="true" />

      {env?.reduced && (
        <div className="intro-static-brand" aria-hidden="true">
          <span className="intro-static-en" lang="en">Yasar</span>
          <span className="intro-static-divider" />
          <span className="intro-static-ar" lang="ar" dir="rtl">يمين</span>
        </div>
      )}

      {/* Direction-neutral page: the Skip button stays physically top-right. */}
      <button onClick={handleSkip} className="intro-skip" type="button">
        <span lang="en">Skip</span>{" / "}<span lang="ar">تخطّي</span>
      </button>

      <div className="intro-stage">
        <div className={`intro-enter-wrap ${phase === "lock" ? "visible" : ""} ${atLeast("unlock") ? "gone" : ""}`}>
          <button
            ref={enterRef}
            onClick={handleUnlock}
            className="intro-enter"
            type="button"
            aria-label="Enter · ادخل"
            tabIndex={phase === "lock" ? 0 : -1}
          >
            <span className="intro-enter-ring" aria-hidden="true" />
            <LockIcon open={atLeast("unlock")} />
          </button>
          <span className="intro-enter-hint" aria-hidden="true">
            <span lang="ar">ادخل</span> · <span lang="en">Enter</span>
          </span>
        </div>

        <div className={`intro-question ${atLeast("unlock") ? "visible" : ""}`}>
          {/* "Loading" bar: fills from BOTH ends and meets in the middle —
              left-to-right and right-to-left at the same time. Physical
              left/right on purpose: this page is direction-neutral. */}
          <div className="intro-progress" aria-hidden="true">
            <span ref={pctEnRef} className="intro-progress-num" lang="en">0%</span>
            <span ref={barRef} className="intro-progress-bar" />
            <span ref={pctArRef} className="intro-progress-num" lang="ar" dir="rtl">٠٪</span>
          </div>
          <p className="intro-q" aria-live="polite">
            <span className="intro-q-ar" lang="ar" dir="rtl">
              <span className="block"><Words text={QUESTION_AR[0]} /></span>
              <span className="block"><Words text={QUESTION_AR[1]} offset={5} /></span>
            </span>
            <span className="intro-q-en" lang="en" dir="ltr">
              <Words text={QUESTION_EN} offset={6} />
            </span>
          </p>
        </div>
      </div>

      <svg className="intro-noise" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <filter id="intro-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#intro-noise)" opacity="0.05" />
      </svg>
      <div className="intro-vignette" aria-hidden="true" />

      {phase === "fade" && <div className="intro-fade-out" />}
    </div>
  );
}
