import { Readex_Pro, Cormorant_Garamond, Tajawal } from "next/font/google";

/* Body/UI font — arabic + latin subsets */
const readexPro = Readex_Pro({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-readex-pro",
});

/* Headline fonts — Cormorant Garamond for Latin, Tajawal for Arabic.
   Tajawal gives Arabic a modern, clean feel vs the traditional Amiri serif.
   CSS switches between them via --font-heading-family in globals.css. */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
  variable: "--font-cormorant",
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-tajawal",
});

/** CSS variable class string to apply on <html> for all three font families. */
export const fontVariableClass = `${readexPro.variable} ${cormorant.variable} ${tajawal.variable}`;
