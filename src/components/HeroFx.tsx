"use client";

import { useEffect, useRef } from "react";
import { cssFontFamily } from "@/lib/cssFont";

/* ═══════════════════════════════════════════════════════════════════════
   HeroFx — the moving layers behind the hero text:
   1. A field of loose Arabic and Latin letters floating at different
      depths (canvas). They drift, shift with the pointer (parallax) and
      light up when the pointer passes near them.
   2. A crimson spotlight that follows the mouse (CSS variables, no React
      re-render per frame).
   Runs only while the hero is on screen. Under reduced motion nothing
   animates: the component renders the spotlight-free static layer only.
   Purely decorative → aria-hidden. Letters are single glyphs, so Arabic
   shaping isn't a concern here.
   ═══════════════════════════════════════════════════════════════════════ */

const AR_GLYPHS = "يمينسارعبحكلفقطو".split("");
const EN_GLYPHS = "YASRMENyasrmen".split("");

interface Glyph {
  ch: string; ar: boolean;
  x: number; y: number; z: number;      // z: 0 (far) → 1 (near)
  vx: number; vy: number;
  rot: number; vr: number;
  glow: number;
}

export default function HeroFx() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fontAr = cssFontFamily("--font-tajawal", "sans-serif");
    const fontEn = cssFontFamily("--font-cormorant", "serif");
    let w = 0, h = 0, dpr = 1;
    let glyphs: Glyph[] = [];
    const pointer = { x: -9999, y: -9999, px: 0, py: 0 };

    const seed = () => {
      const count = w < 640 ? 22 : 46;
      glyphs = Array.from({ length: count }, () => {
        const ar = Math.random() < 0.5;
        const pool = ar ? AR_GLYPHS : EN_GLYPHS;
        return {
          ch: pool[Math.floor(Math.random() * pool.length)],
          ar,
          x: Math.random() * w,
          y: Math.random() * h,
          z: Math.random() ** 1.6,
          // Arabic letters drift leftward, Latin rightward: right-to-left
          // meets left-to-right, very slowly.
          vx: (ar ? -1 : 1) * (0.05 + Math.random() * 0.12),
          vy: -(0.02 + Math.random() * 0.06),
          rot: (Math.random() - 0.5) * 0.6,
          vr: (Math.random() - 0.5) * 0.0015,
          glow: 0,
        };
      });
    };

    const resize = () => {
      const r = root.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (glyphs.length === 0) seed();
    };

    let raf = 0;
    let running = false;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(3, (now - last) / 16.667);
      last = now;
      // Smoothly follow the pointer for parallax
      const tx = pointer.x > -9000 ? pointer.x / w - 0.5 : 0;
      const ty = pointer.y > -9000 ? pointer.y / h - 0.5 : 0;
      pointer.px += (tx - pointer.px) * 0.05 * dt;
      pointer.py += (ty - pointer.py) * 0.05 * dt;

      ctx.clearRect(0, 0, w, h);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const g of glyphs) {
        g.x += g.vx * dt * (0.4 + g.z);
        g.y += g.vy * dt * (0.4 + g.z);
        g.rot += g.vr * dt;
        const m = 80;
        if (g.x < -m) g.x = w + m;
        if (g.x > w + m) g.x = -m;
        if (g.y < -m) g.y = h + m;

        const size = 16 + g.z * 60;
        const ox = -pointer.px * 60 * g.z;
        const oy = -pointer.py * 40 * g.z;
        const sx = g.x + ox;
        const sy = g.y + oy;

        const d = Math.hypot(sx - pointer.x, sy - pointer.y);
        const near = d < 180 ? 1 - d / 180 : 0;
        g.glow += (near - g.glow) * 0.08 * dt;

        const alpha = 0.04 + g.z * 0.09 + g.glow * 0.5;
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(g.rot);
        ctx.font = g.ar ? `700 ${size}px ${fontAr}` : `600 ${size}px ${fontEn}`;
        ctx.fillStyle = g.ar ? `rgba(229,72,77,${alpha})` : `rgba(222,218,212,${alpha})`;
        if (g.glow > 0.05) {
          ctx.shadowColor = g.ar ? "rgba(229,72,77,0.9)" : "rgba(255,255,255,0.7)";
          ctx.shadowBlur = 22 * g.glow;
        }
        ctx.fillText(g.ch, 0, 0);
        ctx.restore();
      }
      raf = requestAnimationFrame(tick);
    };

    const setRunning = (on: boolean) => {
      if (on === running) return;
      running = on;
      if (on) { last = performance.now(); raf = requestAnimationFrame(tick); }
      else cancelAnimationFrame(raf);
    };

    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      if (e.pointerType === "mouse") {
        root.style.setProperty("--sx", `${pointer.x}px`);
        root.style.setProperty("--sy", `${pointer.y}px`);
        root.dataset.pointer = "on";
      }
    };
    const onLeave = () => {
      pointer.x = pointer.y = -9999;
      delete root.dataset.pointer;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(root);
    resize();
    const io = new IntersectionObserver(([entry]) => setRunning(entry.isIntersecting));
    io.observe(root);
    const section = root.parentElement ?? root;
    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerleave", onLeave);

    // Draw only after the fonts are in, so letters don't flash in a fallback face.
    document.fonts.ready.then(() => root.classList.add("is-ready"));

    return () => {
      setRunning(false);
      ro.disconnect();
      io.disconnect();
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={rootRef} className="hero-fx" aria-hidden="true">
      <canvas ref={canvasRef} className="hero-fx-canvas" />
      <div className="hero-spotlight" />
    </div>
  );
}
