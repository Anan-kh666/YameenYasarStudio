/**
 * Root "/" page — redirects to /ar or /en based on browser language.
 * Respects a manual choice stored in localStorage ("yy-locale").
 * Falls back to /ar (default locale) if JS is disabled.
 */
export default function RedirectPage() {
  return (
    <>
      {/* Inline script runs before paint to avoid a flash */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var saved = null;
              try { saved = localStorage.getItem("yy-locale"); } catch(e) {}
              if (saved === "ar" || saved === "en") {
                location.replace("/" + saved + "/");
                return;
              }
              var lang = (navigator.language || "").toLowerCase();
              var loc = lang.startsWith("ar") ? "ar" : "en";
              location.replace("/" + loc + "/");
            })();
          `,
        }}
      />
      <noscript>
        <meta httpEquiv="refresh" content="0;url=/ar/" />
        <p style={{ fontFamily: "system-ui", textAlign: "center", marginTop: "2rem" }}>
          <a href="/ar/" lang="ar">العربية</a> &middot; <a href="/en/">English</a>
        </p>
      </noscript>
    </>
  );
}
