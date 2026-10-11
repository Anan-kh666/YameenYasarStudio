/* ═══════════════════════════════════════════════════════════════════════
   BrandField — the particle engine behind the intro at "/".

   Idea: "right to left, left to right". Crimson particles stream in from
   the RIGHT edge and build «يمين» (right) on the right half; silver
   particles stream in from the LEFT edge and build "Yasar" (left) on the
   left half. The pointer pushes them around.

   After the click ("compile") the words are turned into a program:
     0.00s  decode   — two scan beams sweep out from the centre seam; every
                       particle they touch becomes a flickering digit
                       (Latin digits/code symbols, or Arabic-Indic ٠١٢٣…)
     0.35s  type     — the digits fly into a code editor and type themselves
                       line by line: LTR code on the left, RTL rows of
                       Arabic-Indic numbers on the right (typed right→left)
            upload   — leftover particles stream into the progress bar
     1.95s  compile  — a scan line runs down the code, lines flash
     2.45s  collapse — everything squashes into one horizontal line of light
   "render" (the finale) then releases that line's digits into the shape
   of the REAL logo (sampled from /brand/yy-logo-intro.png), and a scan
   opens the actual logo image from the line outward (DOM .intro-logo).
   Particles without a place in the logo fly off sideways as sparks.

   Plain canvas 2D, no dependencies. Letter shapes are sampled from the
   real brand fonts drawn on an offscreen canvas (the canvas does the Arabic
   shaping, so «يمين» stays joined). In the code phase each particle is ONE
   character, so the Arabic side uses only digits — digits never join, so
   no Arabic letter is ever shown cut out of its word.
   ═══════════════════════════════════════════════════════════════════════ */

export type FieldMode = "form" | "compile" | "render";

interface Particle {
  x: number; y: number; vx: number; vy: number;
  tx: number; ty: number;        // home position inside a letter
  ar: boolean;                   // true = Arabic side (crimson), false = Latin (silver)
  born: number;                  // ms after start when it begins to fly in
  size: number;
  phase: number;                 // shimmer offset
  heat: number;                  // 0..1 → drawn hotter/whiter
  // compile phase
  digit: boolean;                // has the scan beam turned it into a glyph yet?
  ch: string;                    // glyph currently shown
  target: string;                // glyph it settles on in its code cell
  cx: number; cy: number;        // code cell (NaN = no cell → goes to the progress bar)
  delay: number;                 // seconds after the mode change before it moves
  alpha: number;
  // render (finale)
  red: boolean;                  // lands on a crimson part of the logo
  spark: boolean;                // no place in the logo → flies off sideways
}

interface Dust { x: number; y: number; z: number; vy: number; phase: number }
interface Rect { x0: number; x1: number; y0: number; y1: number }

const CRIMSON = [229, 72, 77];   // --crimson-bright
const SILVER = [222, 218, 212];

/* What the left editor "types": real snippets about doing RTL properly. */
const CODE_LINES = [
  '<html lang="ar" dir="rtl">',
  'const dir = locale === "ar" ? "rtl" : "ltr";',
  "",
  ".hero {",
  "  padding-inline-start: 2rem;",
  "  text-align: start;",
  '  font-family: "Tajawal", sans-serif;',
  "}",
  "",
  "export default function Site({ locale }) {",
  '  const t = useTranslations("hero");',
  "  return <Page lang={locale} dir={dir} />;",
  "}",
  "",
  '<p lang="en" dir="ltr">Yasar</p>',
  "margin-inline-end: auto;",
  "@media (min-width: 768px) {",
  "  .grid { grid-template-columns: 1fr 1fr; }",
  "}",
  "build → /ar/ 200 OK · /en/ 200 OK",
];
const LATIN_SCRAMBLE = "0123456789{}<>/=;:()[]#$&*+-abcdef01";
const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";
const AR_SCRAMBLE = AR_DIGITS + "٪،";

const T_TYPE = 0.35;
/* Finale: when the scan starts opening the real logo, and how long it takes.
   Must match .intro-logo's clip-path animation in intro.css. */
export const T_OPEN = 0.95;
export const D_OPEN = 0.8;
const LOGO_SRC = "/brand/yy-logo-intro.png";
const T_COMPILE = 1.95;
const T_COLLAPSE = 2.45;

function makeSprite(rgb: number[]): HTMLCanvasElement {
  const s = document.createElement("canvas");
  s.width = s.height = 32;
  const g = s.getContext("2d")!;
  const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  const [r, gr, b] = rgb;
  grad.addColorStop(0, `rgba(255,255,255,1)`);
  grad.addColorStop(0.12, `rgba(${r},${gr},${b},0.95)`);
  grad.addColorStop(0.4, `rgba(${r},${gr},${b},0.22)`);
  grad.addColorStop(1, `rgba(${r},${gr},${b},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, 32, 32);
  return s;
}

const rand = (s: string) => s[Math.floor(Math.random() * s.length)];
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
/* Same curve as cubic-bezier(0.65, 0, 0.35, 1) used for the CSS scan, closely enough */
const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);

export class BrandField {
  private ctx: CanvasRenderingContext2D;
  private dpr = 1;
  private w = 0;
  private h = 0;
  private portrait = false;
  private particles: Particle[] = [];
  private dust: Dust[] = [];
  private sprites: { ar: HTMLCanvasElement; en: HTMLCanvasElement; hot: HTMLCanvasElement };
  /* Pre-rendered glowing glyphs: atlas[char] = [silver, crimson, hot] */
  private atlas = new Map<string, HTMLCanvasElement[]>();
  private glyphSize = 12;
  private glyphBox = 20;
  private codeRegion: Rect = { x0: 0, x1: 0, y0: 0, y1: 0 };
  private sink = { x0: 0, x1: 0, y: 0 };      // progress bar, in viewport px
  private mode: FieldMode = "form";
  private modeAt = 0;
  private startAt = 0;
  private last = 0;
  private raf = 0;
  private fast = false;
  private pointer = { x: -9999, y: -9999, active: false };
  private seam = { x: 0, y0: 0, y1: 0 };
  private logo: HTMLImageElement;
  private logoRect = { cx: 0, cy: 0, w: 0, h: 0 };

  constructor(private canvas: HTMLCanvasElement, private fonts: { ar: string; en: string }) {
    this.ctx = canvas.getContext("2d")!;
    // Load the real logo early; its pixels decide where the finale's digits land.
    this.logo = new Image();
    this.logo.src = LOGO_SRC;
    this.sprites = { ar: makeSprite(CRIMSON), en: makeSprite(SILVER), hot: makeSprite([255, 236, 230]) };
  }

  /** Height of the line everything collapses into — the video's collision line. */
  private get lineY() {
    return this.h * 0.5;
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.portrait = this.h > this.w;
    this.canvas.width = Math.round(this.w * this.dpr);
    this.canvas.height = Math.round(this.h * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    const targets = this.sampleTargets();
    if (this.particles.length === 0) {
      this.spawn(targets);
    } else {
      for (let i = 0; i < this.particles.length; i++) {
        const t = targets[i % targets.length];
        this.particles[i].tx = t.x;
        this.particles[i].ty = t.y;
      }
    }
    this.dust = Array.from({ length: this.portrait ? 70 : 140 }, () => ({
      x: Math.random() * this.w,
      y: Math.random() * this.h,
      z: 0.2 + Math.random() * 0.8,
      vy: -(0.05 + Math.random() * 0.2),
      phase: Math.random() * Math.PI * 2,
    }));

    this.glyphSize = Math.max(10, Math.min(13, this.w / 100));
    this.glyphBox = Math.ceil(this.glyphSize * 1.9);
    this.atlas.clear();
    this.codeRegion = this.portrait
      ? { x0: this.w * 0.06, x1: this.w * 0.94, y0: this.h * 0.1, y1: this.h * 0.54 }  // clear of the Skip button
      : { x0: this.w * 0.06, x1: this.w * 0.94, y0: this.h * 0.08, y1: this.h * 0.54 };
  }

  /** Where the progress bar is on screen (leftover particles fly into it). */
  setSink(rect: DOMRect) {
    this.sink = { x0: rect.left, x1: rect.right, y: rect.top + rect.height / 2 };
  }

  /* Draw both words offscreen (red channel = Latin, green = Arabic) and
     turn the filled pixels into a grid of target points. */
  private sampleTargets() {
    const { w, h, portrait } = this;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const g = c.getContext("2d", { willReadFrequently: true })!;
    const size = portrait ? Math.min(w * 0.27, h * 0.14) : Math.min(w * 0.125, h * 0.27);
    const en = portrait ? [w * 0.39, h * 0.31] : [w * 0.29, h * 0.4];
    const ar = portrait ? [w * 0.61, h * 0.45] : [w * 0.71, h * 0.4];

    g.textAlign = "center";
    g.textBaseline = "middle";
    g.direction = "ltr";
    g.font = `600 ${size * 1.08}px ${this.fonts.en}`;
    g.fillStyle = "#f00";
    g.fillText("Yasar", en[0], en[1]);
    g.direction = "rtl";
    g.font = `700 ${size}px ${this.fonts.ar}`;
    g.fillStyle = "#0f0";
    g.fillText("يمين", ar[0], ar[1] + size * 0.06);

    this.seam = { x: w / 2, y0: en[1] - size * 0.55, y1: Math.max(en[1], ar[1]) + size * 0.55 };

    const data = g.getImageData(0, 0, w, h).data;
    let filled = 0;
    for (let i = 3; i < data.length; i += 16) if (data[i] > 128) filled++;
    filled *= 4;
    const max = Math.max(1600, Math.min(4200, (w * h) / 300));
    const gap = Math.max(2, Math.round(Math.sqrt(filled / max)));

    const out: { x: number; y: number; ar: boolean }[] = [];
    for (let y = 0; y < h; y += gap) {
      for (let x = 0; x < w; x += gap) {
        const i = (y * w + x) * 4;
        if (data[i + 3] < 128) continue;
        out.push({
          x: x + (Math.random() - 0.5) * gap * 0.6,
          y: y + (Math.random() - 0.5) * gap * 0.6,
          ar: data[i + 1] > data[i],
        });
      }
    }
    return out;
  }

  private spawn(targets: { x: number; y: number; ar: boolean }[]) {
    const { w, h } = this;
    let arMin = Infinity, arMax = -Infinity, enMin = Infinity, enMax = -Infinity;
    for (const t of targets) {
      if (t.ar) { arMin = Math.min(arMin, t.x); arMax = Math.max(arMax, t.x); }
      else { enMin = Math.min(enMin, t.x); enMax = Math.max(enMax, t.x); }
    }
    this.particles = targets.map((t) => {
      // Stream order: the right edge of «يمين» arrives first, the left edge of "Yasar" first.
      const along = t.ar ? 1 - (t.x - arMin) / (arMax - arMin || 1) : (t.x - enMin) / (enMax - enMin || 1);
      const fromX = t.ar ? w + 20 + Math.random() * w * 0.25 : -20 - Math.random() * w * 0.25;
      const fromY = h * 0.5 + (t.y - h * 0.4) * 0.5 + Math.sin(along * 7 + (t.ar ? 0 : Math.PI)) * h * 0.22 + (Math.random() - 0.5) * h * 0.14;
      return {
        x: fromX, y: fromY, vx: 0, vy: 0, tx: t.x, ty: t.y, ar: t.ar,
        born: along * 1100 + Math.random() * 350,
        size: 0.55 + Math.random() * 0.75,
        phase: Math.random() * Math.PI * 2,
        heat: 0,
        digit: false, ch: "0", target: "0", cx: NaN, cy: NaN, delay: 0, alpha: 1,
        red: false, spark: false,
      };
    });
  }

  /* ── Code layout ─────────────────────────────────────────────────────
     Build the editor cells. Landscape: Latin code in the left half, Arabic
     numbers in the right half. Portrait: Latin block on top, Arabic below.
     Cells come back in TYPING order: Latin rows left→right, Arabic rows
     right→left (RTL). */
  private buildCells() {
    const { glyphSize: fs, codeRegion: r, portrait } = this;
    const cw = fs * 0.64;
    const rh = fs * 1.55;
    const gutter = this.w * 0.03;
    const midX = (r.x0 + r.x1) / 2;
    const midY = (r.y0 + r.y1) / 2;
    const en: Rect = portrait ? { ...r, y1: midY - rh * 0.5 } : { ...r, x1: midX - gutter };
    const ar: Rect = portrait ? { ...r, y0: midY + rh * 0.5 } : { ...r, x0: midX + gutter };

    const latin: { x: number; y: number; ch: string; row: number; col: number }[] = [];
    const enCols = Math.floor((en.x1 - en.x0) / cw);
    const enRows = Math.floor((en.y1 - en.y0) / rh);
    for (let row = 0; row < enRows; row++) {
      const line = CODE_LINES[row % CODE_LINES.length].slice(0, enCols);
      for (let col = 0; col < line.length; col++) {
        if (line[col] === " ") continue;
        latin.push({ x: en.x0 + col * cw + cw / 2, y: en.y0 + row * rh + rh / 2, ch: line[col], row, col });
      }
    }

    const arabic: typeof latin = [];
    const arCols = Math.floor((ar.x1 - ar.x0) / cw);
    const arRows = Math.floor((ar.y1 - ar.y0) / rh);
    for (let row = 0; row < arRows; row++) {
      if (Math.random() < 0.12) continue;               // the odd blank line
      let col = Math.floor(Math.random() * 3) * 2;      // indentation, from the right
      const len = Math.floor(arCols * (0.35 + Math.random() * 0.55));
      while (col < len) {
        const group = 2 + Math.floor(Math.random() * 5);
        for (let k = 0; k < group && col < len; k++, col++) {
          arabic.push({ x: ar.x1 - col * cw - cw / 2, y: ar.y0 + row * rh + rh / 2, ch: rand(AR_DIGITS), row, col });
        }
        col++;                                          // space between number groups
      }
    }
    return { latin, arabic };
  }

  /* Hand out cells. Particles are sorted top→bottom, start→end of their
     word, so the top of a word becomes the top of the code (smooth motion).
     If there are more particles than cells, every k-th one gets a cell and
     the rest are "uploaded" into the progress bar. */
  private assignCells() {
    const { latin, arabic } = this.buildCells();
    const assign = (ps: Particle[], cells: typeof latin, rtl: boolean) => {
      ps.sort((a, b) => Math.round(a.y / 10) - Math.round(b.y / 10) || (rtl ? b.x - a.x : a.x - b.x));
      const n = ps.length;
      const m = Math.min(n, cells.length);
      let last = -1;
      ps.forEach((p, i) => {
        const ci = Math.floor((i * m) / n);
        if (ci !== last && ci < cells.length) {
          const c = cells[ci];
          p.cx = c.x;
          p.cy = c.y;
          p.target = c.ch;
          p.delay = T_TYPE + c.row * 0.05 + c.col * 0.005 + Math.random() * 0.05;
          last = ci;
        } else {
          p.cx = p.cy = NaN;
          p.delay = T_TYPE + Math.random() * 1.3;       // stream into the bar over the load
        }
      });
    };
    assign(this.particles.filter((p) => !p.ar), latin, false);
    assign(this.particles.filter((p) => p.ar), arabic, true);
  }

  /* Glowing glyph sprite, drawn once per character and colour. */
  private glyph(ch: string, kind: 0 | 1 | 2): HTMLCanvasElement {
    let set = this.atlas.get(ch);
    if (!set) {
      set = [SILVER, CRIMSON, [255, 240, 235]].map((rgb, i) => {
        const box = this.glyphBox;
        const s = document.createElement("canvas");
        s.width = s.height = Math.ceil(box * this.dpr);
        const g = s.getContext("2d")!;
        g.scale(this.dpr, this.dpr);
        const isAr = AR_SCRAMBLE.includes(ch);
        g.font = isAr
          ? `700 ${this.glyphSize * 1.15}px ${this.fonts.ar}`
          : `500 ${this.glyphSize}px ui-monospace, "SF Mono", Menlo, Consolas, monospace`;
        g.textAlign = "center";
        g.textBaseline = "middle";
        const [r, gr, b] = rgb;
        g.shadowColor = i === 2 ? "rgba(229,72,77,1)" : `rgba(${r},${gr},${b},0.9)`;
        g.shadowBlur = this.glyphSize * (i === 2 ? 0.9 : 0.55);
        g.fillStyle = `rgb(${r},${gr},${b})`;
        g.fillText(ch, box / 2, box / 2);
        return s;
      });
      this.atlas.set(ch, set);
    }
    return set[kind];
  }

  /** fast = returning visitor: shorter, tighter fly-in. */
  start(fast: boolean) {
    this.fast = fast;
    if (fast) for (const p of this.particles) p.born = Math.random() * 280;
    this.startAt = this.last = performance.now();
    this.modeAt = this.startAt;
    const loop = (now: number) => {
      this.step(now);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    cancelAnimationFrame(this.raf);
  }

  setPointer(x: number, y: number, active: boolean) {
    this.pointer = { x, y, active };
  }

  setMode(mode: FieldMode) {
    if (mode === this.mode) return;
    this.mode = mode;
    this.modeAt = performance.now();
    if (mode === "compile") {
      for (const p of this.particles) {
        p.ch = rand(p.ar ? AR_SCRAMBLE : LATIN_SCRAMBLE);
        p.heat = 0;
      }
      this.assignCells();
    }
    if (mode === "render") this.assignLogo();
  }

  private step(now: number) {
    const dt = Math.min(2.5, (now - this.last) / 16.667);
    this.last = now;
    const t = (now - this.startAt) / 1000;
    const sinceMode = (now - this.modeAt) / 1000;
    const { ctx, w, h, mode } = this;

    // Fade the previous frame instead of clearing it: short light trails.
    // Glyphs need crisper frames than the dots, and the collapse wants streaks.
    const collapsing = mode === "compile" && sinceMode > T_COLLAPSE;
    const fade = mode === "form" ? 0.34 : mode === "render" ? 0.45 : collapsing ? 0.36 : 0.55;
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = `rgba(0,0,0,${fade})`;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";

    /* Background dust with a little pointer parallax for depth */
    const px = this.pointer.active ? (this.pointer.x - w / 2) / w : 0;
    const py = this.pointer.active ? (this.pointer.y - h / 2) / h : 0;
    for (const d of this.dust) {
      d.y += d.vy * dt;
      if (d.y < -10) { d.y = h + 10; d.x = Math.random() * w; }
      const a = 0.12 + 0.14 * Math.sin(t * 1.4 + d.phase);
      ctx.globalAlpha = Math.max(0, a) * d.z;
      const s = 3 + d.z * 4;
      ctx.drawImage(this.sprites.en, d.x - px * 40 * d.z - s / 2, d.y - py * 40 * d.z - s / 2, s, s);
    }

    if (mode === "form") this.stepForm(now, t, dt);
    else if (mode === "compile") this.stepCompile(sinceMode, dt);
    else this.stepRender(sinceMode, dt);

    ctx.globalAlpha = 1;
  }

  /* ── Before the click: words made of light ── */
  private stepForm(now: number, t: number, dt: number) {
    const { ctx } = this;
    const k = this.fast ? 0.02 : 0.013;
    const damp = Math.pow(0.9, dt);
    const R = this.portrait ? 95 : 130;
    const elapsed = now - this.startAt;

    for (const p of this.particles) {
      if (elapsed < p.born) continue;
      const tx = p.tx + Math.sin(t * 1.3 + p.phase) * 0.7;
      const ty = p.ty + Math.cos(t * 1.1 + p.phase) * 0.7;
      const dx = tx - p.x;
      const dy = ty - p.y;
      p.vx += dx * k * dt;
      p.vy += dy * k * dt;
      // Sideways push while travelling, so paths curve like ribbons.
      // Arabic and Latin curve in opposite directions and braid.
      const dist = Math.hypot(dx, dy);
      if (dist > 6) {
        const f = (0.35 * Math.min(dist, 320)) / 320 * (p.ar ? 1 : -1) * dt;
        p.vx += (-dy / dist) * f;
        p.vy += (dx / dist) * f;
      }

      if (this.pointer.active) {
        const ex = p.x - this.pointer.x;
        const ey = p.y - this.pointer.y;
        const d2 = ex * ex + ey * ey;
        if (d2 < R * R && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const f = (1 - d / R) ** 2 * 2.6 * dt;
          p.vx += (ex / d) * f;
          p.vy += (ey / d) * f;
          p.heat = Math.min(1, p.heat + 0.08);
        }
      }

      p.vx *= damp;
      p.vy *= damp;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.heat *= Math.pow(0.95, dt);

      const speed = Math.abs(p.vx) + Math.abs(p.vy);
      const shimmer = 0.62 + 0.38 * Math.sin(t * 2.2 + p.phase * 3);
      const s = (p.size * 6 + Math.min(speed, 14) * 0.35) * (1 + p.heat * 0.6);
      // Fast particles are dimmer, so the streams read as ribbons, not white blobs.
      ctx.globalAlpha = Math.min(1, shimmer / (1 + speed * 0.07));
      ctx.drawImage(p.ar ? this.sprites.ar : this.sprites.en, p.x - s / 2, p.y - s / 2, s, s);
      if (p.heat > 0.05) {
        ctx.globalAlpha = p.heat * 0.45;
        ctx.drawImage(this.sprites.hot, p.x - s / 2, p.y - s / 2, s, s);
      }
    }

    /* The seam between the two words — where right and left meet */
    if (!this.portrait) {
      const a = Math.min(1, Math.max(0, (elapsed - 1500) / 900));
      if (a > 0) this.drawSeam(a);
    }
  }

  private drawSeam(a: number) {
    const { ctx } = this;
    const { x, y0, y1 } = this.seam;
    const mid = (y0 + y1) / 2;
    const half = ((y1 - y0) / 2) * (0.4 + 0.6 * a);
    const g = ctx.createLinearGradient(0, mid - half, 0, mid + half);
    g.addColorStop(0, "rgba(229,72,77,0)");
    g.addColorStop(0.5, `rgba(255,220,215,${0.55 * a})`);
    g.addColorStop(1, "rgba(222,218,212,0)");
    ctx.globalAlpha = 1;
    ctx.fillStyle = g;
    ctx.fillRect(x - 0.75, mid - half, 1.5, half * 2);
  }

  /* ── After the click: decode → type → upload → compile → collapse ── */
  private stepCompile(sm: number, dt: number) {
    const { ctx, w, h, glyphBox: box } = this;
    const collapse = sm > T_COLLAPSE;

    // Decode beams: from the seam outward, reaching the edges in 0.5 s
    const beam = Math.min(1, sm / 0.5) * (w / 2 + 40);
    // Compile scan line: runs down the code region
    const r = this.codeRegion;
    const scanP = (sm - T_COMPILE) / (T_COLLAPSE - T_COMPILE - 0.05);
    const scanY = scanP >= 0 && scanP <= 1 ? r.y0 + (r.y1 - r.y0) * scanP : NaN;

    for (const p of this.particles) {
      if (p.alpha <= 0.01) continue;
      if (!p.digit && Math.abs(p.x - w / 2) < beam) {
        p.digit = true;
        p.heat = 0.5;
      }

      if (p.digit && sm > p.delay) {
        const hasCell = !Number.isNaN(p.cx);
        let tx: number, ty: number, k: number, damp: number;
        if (collapse && hasCell) {
          // Squash every line of code into one line of light
          const c = Math.min(1, (sm - T_COLLAPSE) / 0.35);
          tx = p.cx + (w / 2 - p.cx) * c * 0.15;
          ty = this.lineY;
          k = 0.06; damp = 0.78;
        } else if (hasCell) {
          tx = p.cx; ty = p.cy; k = 0.07; damp = 0.74;
        } else {
          // Upload: fall into a random point on the progress bar
          tx = this.sink.x0 + ((p.phase / (Math.PI * 2)) * (this.sink.x1 - this.sink.x0));
          ty = this.sink.y; k = 0.03; damp = 0.86;
        }
        p.vx += (tx - p.x) * k * dt;
        p.vy += (ty - p.y) * k * dt;
        p.vx *= Math.pow(damp, dt);
        p.vy *= Math.pow(damp, dt);
        if (!hasCell && Math.abs(ty - p.y) < 6) p.alpha *= Math.pow(0.7, dt);   // absorbed by the bar
      } else {
        // Waiting its turn: settle back on the letter while flickering
        p.vx = (p.vx + (p.tx - p.x) * 0.05 * dt) * Math.pow(0.8, dt);
        p.vy = (p.vy + (p.ty - p.y) * 0.05 * dt) * Math.pow(0.8, dt);
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // Which character to show
      const settled = !Number.isNaN(p.cx) && Math.abs(p.x - p.cx) + Math.abs(p.y - p.cy) < 2.5 && !collapse;
      if (p.digit) {
        if (settled) {
          p.ch = Math.random() < 0.004 ? rand(p.ar ? AR_SCRAMBLE : LATIN_SCRAMBLE) : p.target;
        } else if (Math.random() < 0.3 * dt) {
          p.ch = rand(p.ar ? AR_SCRAMBLE : LATIN_SCRAMBLE);
        }
      }

      if (!Number.isNaN(scanY) && Math.abs(p.y - scanY) < 9) p.heat = 1;
      if (collapse) p.heat = Math.max(p.heat, Math.min(0.6, (sm - T_COLLAPSE) / 0.5));
      p.heat *= Math.pow(0.9, dt);

      if (!p.digit) {
        // Not reached by the beam yet: still a dot of light
        const s = p.size * 6;
        ctx.globalAlpha = p.alpha * 0.9;
        ctx.drawImage(p.ar ? this.sprites.ar : this.sprites.en, p.x - s / 2, p.y - s / 2, s, s);
        continue;
      }
      // While still sitting in its letter the glyph is small and dim: the
      // word reads as "made of digits" instead of a white blob of glyphs.
      const waiting = sm <= p.delay;
      const scale = waiting ? 0.6 : 1;
      const bw = box * scale * (collapse ? 1 + Math.min(Math.abs(p.vx), 20) * 0.08 : 1);
      const bh = box * scale;
      ctx.globalAlpha = p.alpha * (waiting ? 0.5 : 0.55 + 0.45 * (1 - p.heat));
      ctx.drawImage(this.glyph(p.ch, p.ar ? 1 : 0), p.x - bw / 2, p.y - bh / 2, bw, bh);
      if (p.heat > 0.05) {
        ctx.globalAlpha = p.alpha * p.heat * (waiting ? 0.5 : 1);
        ctx.drawImage(this.glyph(p.ch, 2), p.x - bw / 2, p.y - bh / 2, bw, bh);
      }
    }

    /* Decode beams */
    if (sm < 0.7) {
      const a = Math.max(0, 1 - sm / 0.7);
      for (const side of [-1, 1]) {
        const x = w / 2 + side * beam;
        const g = ctx.createLinearGradient(x - 30, 0, x + 30, 0);
        g.addColorStop(0, "rgba(229,72,77,0)");
        g.addColorStop(0.5, `rgba(255,225,220,${0.5 * a})`);
        g.addColorStop(1, "rgba(229,72,77,0)");
        ctx.globalAlpha = 1;
        ctx.fillStyle = g;
        ctx.fillRect(x - 30, this.seam.y0 - 60, 60, this.seam.y1 - this.seam.y0 + 120);
      }
    }

    /* Compile scan line */
    if (!Number.isNaN(scanY)) {
      const g = ctx.createLinearGradient(0, scanY - 14, 0, scanY + 14);
      g.addColorStop(0, "rgba(229,72,77,0)");
      g.addColorStop(0.5, "rgba(255,200,195,0.35)");
      g.addColorStop(1, "rgba(229,72,77,0)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = g;
      ctx.fillRect(r.x0 - 20, scanY - 14, r.x1 - r.x0 + 40, 28);
    }

    /* The single line of light */
    if (collapse) this.drawLine(Math.min(1, (sm - T_COLLAPSE) / 0.4), w * 0.48, h);
  }

  private drawLine(a: number, half: number, h: number) {
    const { ctx, w } = this;
    const y = this.lineY;
    const g = ctx.createLinearGradient(w / 2 - half, 0, w / 2 + half, 0);
    g.addColorStop(0, "rgba(222,218,212,0)");
    g.addColorStop(0.5, `rgba(255,245,240,${0.85 * a})`);
    g.addColorStop(1, "rgba(229,72,77,0)");
    ctx.globalAlpha = 1;
    ctx.fillStyle = g;
    ctx.fillRect(w / 2 - half, y - 1.5, half * 2, 3);
    const glow = ctx.createRadialGradient(w / 2, y, 0, w / 2, y, h * 0.35);
    glow.addColorStop(0, `rgba(255,235,228,${0.3 * a})`);
    glow.addColorStop(0.3, `rgba(229,72,77,${0.12 * a})`);
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, y - h * 0.35, w, h * 0.7);
  }

  /** Where the real logo sits — the CSS for .intro-logo uses the same sizes. */
  static logoWidth(w: number, h: number) {
    return h > w ? w * 0.84 : Math.min(w * 0.6, 880);
  }

  /* Sample the real logo into target points and hand them to the visible
     particles. Both are sorted left→right, so each spot on the line rises
     or sinks straight into the logo column above/below it: the line opens. */
  private assignLogo() {
    const { w, h } = this;
    const img = this.logo;
    const ready = img.complete && img.naturalWidth > 0;
    const lw = BrandField.logoWidth(w, h);
    const lh = ready ? (lw * img.naturalHeight) / img.naturalWidth : lw * 0.3;
    this.logoRect = { cx: w / 2, cy: h / 2, w: lw, h: lh };

    const live = this.particles.filter((p) => p.alpha > 0.3);
    const targets: { x: number; y: number; red: boolean }[] = [];
    if (ready) {
      const cw = Math.round(lw);
      const ch = Math.round(lh);
      const c = document.createElement("canvas");
      c.width = cw;
      c.height = ch;
      const g = c.getContext("2d", { willReadFrequently: true })!;
      g.drawImage(img, 0, 0, cw, ch);
      const data = g.getImageData(0, 0, cw, ch).data;
      let filled = 0;
      for (let i = 3; i < data.length; i += 16) if (data[i] > 160) filled++;
      filled *= 4;
      const want = Math.min(2600, live.length);
      const gap = Math.max(2, Math.round(Math.sqrt(filled / Math.max(1, want))));
      const x0 = w / 2 - cw / 2;
      const y0 = h / 2 - ch / 2;
      for (let y = 0; y < ch; y += gap) {
        for (let x = 0; x < cw; x += gap) {
          const i = (y * cw + x) * 4;
          if (data[i + 3] < 160) continue;
          targets.push({ x: x0 + x, y: y0 + y, red: data[i] > data[i + 1] * 1.6 });
        }
      }
    }

    live.sort((a, b) => a.x - b.x);
    targets.sort((a, b) => a.x - b.x);
    const n = live.length;
    const m = Math.min(n, targets.length);
    let last = -1;
    live.forEach((p, i) => {
      const ti = Math.floor((i * m) / n);
      if (m > 0 && ti !== last) {
        const t = targets[ti];
        p.cx = t.x;
        p.cy = t.y;
        p.red = t.red;
        p.spark = false;
        p.target = rand(p.ar ? AR_DIGITS : "0123456789");
        // Middle rows leave the line first, outer rows last.
        p.delay = (Math.abs(t.y - h / 2) / (lh / 2)) * 0.3 + Math.random() * 0.1;
        last = ti;
      } else {
        const side = p.x < w / 2 ? -1 : 1;
        p.spark = true;
        p.vx = side * (6 + Math.random() * 20) * (0.5 + Math.abs(p.x - w / 2) / w);
        p.vy = (Math.random() - 0.5) * 3;
      }
      p.heat = 1;
    });
    // Particles that were already "uploaded" stay gone.
    for (const p of this.particles) if (p.alpha <= 0.3) p.alpha = 0;
  }

  /* ── Finale: the line of light renders the real logo ──
     0.00s  digits leave the line for their logo points (crimson where the
            logo is crimson, silver where it is grey)
     0.95s  the real logo image opens from the line outward (CSS clip-path,
            same timing); digits inside the opened band dissolve into it
     Sparks fly off sideways and fade. */
  private stepRender(sm: number, dt: number) {
    const { ctx, w, h, glyphBox: box } = this;
    const L = this.logoRect;
    const openP = easeInOutCubic(clamp01((sm - T_OPEN) / D_OPEN));
    // Same band as the CSS clip: from the centre to 30% beyond each edge
    const band = openP * (L.h * 0.8);

    for (const p of this.particles) {
      if (p.alpha <= 0.01) continue;
      if (p.spark) {
        p.vx *= Math.pow(0.97, dt);
        p.vy *= Math.pow(0.97, dt);
        p.alpha *= Math.pow(0.965, dt);
      } else if (sm > p.delay) {
        p.vx = (p.vx + (p.cx - p.x) * 0.09 * dt) * Math.pow(0.7, dt);
        p.vy = (p.vy + (p.cy - p.y) * 0.09 * dt) * Math.pow(0.7, dt);
      } else {
        // Still on the line, waiting: keep it on the line
        p.vy = (p.vy + (this.lineY - p.y) * 0.1 * dt) * Math.pow(0.7, dt);
        p.vx *= Math.pow(0.7, dt);
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      if (!p.spark && openP > 0 && Math.abs(p.cy - L.cy) < band) {
        p.heat = Math.max(p.heat, 0.8);
        p.alpha *= Math.pow(0.82, dt);              // the real logo takes over here
      }

      const settled = !p.spark && Math.abs(p.x - p.cx) + Math.abs(p.y - p.cy) < 2;
      if (settled) {
        p.ch = Math.random() < 0.01 ? rand(p.ar ? AR_DIGITS : "0123456789") : p.target;
      } else if (Math.random() < 0.3 * dt) {
        p.ch = rand(p.ar ? AR_SCRAMBLE : LATIN_SCRAMBLE);
      }
      p.heat *= Math.pow(0.92, dt);

      const kind: 0 | 1 = p.spark ? (p.ar ? 1 : 0) : p.red ? 1 : 0;
      const scale = p.spark ? 1 : 0.72;
      const bw = box * scale * (p.spark ? 1 + Math.min(Math.abs(p.vx), 20) * 0.08 : 1);
      const bh = box * scale;
      ctx.globalAlpha = p.alpha * (0.7 + 0.3 * (1 - p.heat));
      ctx.drawImage(this.glyph(p.ch, kind), p.x - bw / 2, p.y - bh / 2, bw, bh);
      if (p.heat > 0.05) {
        ctx.globalAlpha = p.alpha * p.heat * 0.8;
        ctx.drawImage(this.glyph(p.ch, 2), p.x - bw / 2, p.y - bh / 2, bw, bh);
      }
    }

    /* The line hands over: it fades as its digits leave */
    if (sm < 0.6) this.drawLine(1 - sm / 0.6, w * 0.48, h);

    /* Scan edges: two bright lines opening up and down from the centre */
    // (they fade out as they pass the logo's top and bottom edges)
    if (openP > 0 && band < L.h * 0.6) {
      const a = Math.min(1, openP * 5) * (1 - band / (L.h * 0.6));
      const half = L.w * 0.56;
      for (const side of [-1, 1]) {
        const y = L.cy + side * band;
        const g = ctx.createLinearGradient(L.cx - half, 0, L.cx + half, 0);
        g.addColorStop(0, "rgba(229,72,77,0)");
        g.addColorStop(0.5, `rgba(255,240,235,${0.9 * a})`);
        g.addColorStop(1, "rgba(222,218,212,0)");
        ctx.globalAlpha = 1;
        ctx.fillStyle = g;
        ctx.fillRect(L.cx - half, y - 1, half * 2, 2);
      }
    }
  }
}
