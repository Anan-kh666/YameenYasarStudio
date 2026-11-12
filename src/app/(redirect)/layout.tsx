import { fontVariableClass } from "@/lib/fonts";
import "@/app/globals.css";
import "./intro.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yameen Yasar Studio | يمين يسار",
  /* Intro page should not be indexed — real content lives at /ar/ and /en/ */
  robots: { index: false, follow: true },
  icons: {
    icon: "/brand/favicon-512.png",
    apple: "/brand/favicon-512.png",
  },
};

export default function RedirectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={fontVariableClass}
    >
      <body>{children}</body>
    </html>
  );
}
