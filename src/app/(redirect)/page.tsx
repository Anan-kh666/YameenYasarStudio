import IntroPage from "@/components/IntroPage";

/**
 * Root "/" page — the intro experience.
 * Shows the brand animation sequence, then a question button
 * that navigates to /ar/ or /en/ based on detected language.
 *
 * SEO: /ar/ and /en/ are the real landing pages (indexed, shareable).
 * This page is noindex (set in layout.tsx metadata).
 */
export default function RedirectPage() {
  return (
    <>
      <IntroPage />
      {/* Noscript fallback: if JS is disabled, redirect to /ar/ or show links */}
      <noscript>
        {/* Hide the intro container (it renders empty without JS) */}
        <style>{`.intro-root { display: none; }`}</style>
        <meta httpEquiv="refresh" content="0;url=/ar/" />
        <div className="intro-noscript">
          <a href="/ar/" lang="ar">
            العربية
          </a>
          <span style={{ color: "#A3A09B", margin: "0 1rem" }}>&middot;</span>
          <a href="/en/">English</a>
        </div>
      </noscript>
    </>
  );
}
