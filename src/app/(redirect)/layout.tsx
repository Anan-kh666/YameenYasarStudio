import { Readex_Pro, Cormorant_Garamond, Tajawal } from "next/font/google";
import "@/app/globals.css";
import "./intro.css";
import type { Metadata } from "next";

/* Load the same fonts as the locale pages so the intro
   can use font-heading and font-sans consistently. */
const readexPro = Readex_Pro({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-readex-pro",
});

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

export const metadata: Metadata = {
  title: "Yameen Yasar Studio | يمين يسار",
  /* Intro page should not be indexed — real content lives at /ar/ and /en/ */
  robots: { index: false, follow: true },
};

export default function RedirectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${readexPro.variable} ${cormorant.variable} ${tajawal.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
