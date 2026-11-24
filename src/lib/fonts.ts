import { Readex_Pro, Cormorant_Garamond, Tajawal, JetBrains_Mono } from "next/font/google";

/* Body/UI font — arabic + latin subsets */
const readexPro = Readex_Pro({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-readex-pro",
});

/* Cormorant Garamond: used only by the intro (intro.css, IntroPage's canvas).
   Site headings use Readex Pro in LTR and Tajawal in RTL, switched via
   --font-heading-family in globals.css. */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
  variable: "--font-cormorant",
});

/* Only 700 is used (every heading is font-semibold, which resolves to 700, and
   the intro draws at 700). `subsets` only decides what gets <link rel=preload>:
   the Latin @font-face stays in the CSS and loads on demand via unicode-range. */
const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["700"],
  display: "swap",
  variable: "--font-tajawal",
});

/* Mono for small Latin labels: the .window-url bar (system.css) and the
   Process step numbers (.pp-num).
   Latin only: it has no Arabic glyphs, so the font-mono stack in globals.css
   falls back to Readex Pro and Arabic is never drawn in a monospace face. */
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

/** CSS variable class string to apply on <html> for all four font families. */
export const fontVariableClass = `${readexPro.variable} ${cormorant.variable} ${tajawal.variable} ${jetbrainsMono.variable}`;
