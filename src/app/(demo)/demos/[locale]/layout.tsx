import { fontVariableClass } from "@/lib/fonts";
import { DEMO_LOCALES } from "@/demos/shared";
import "@/app/globals.css";
import type { Metadata } from "next";

/* Root layout #3: the concept demos at /demos/<locale>/<slug>/.
   Each demo looks like a client's own site, so there is no studio Header or
   Footer here; pages render <DemoBar> instead. Demo copy lives next to each
   demo in src/demos/<slug>/content.ts (fictional businesses, not site copy). */

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return DEMO_LOCALES.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  // Fictional businesses: keep them out of search results.
  robots: { index: false, follow: true },
  icons: { icon: "/brand/favicon-512.png", apple: "/brand/favicon-512.png" },
};

export default async function DemoLayout({ children, params }: Props) {
  const { locale } = await params;
  // Same rule as the main site: direction comes from <html dir>, server-side.
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className={fontVariableClass}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
