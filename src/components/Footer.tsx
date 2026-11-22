import { useLocale, useTranslations } from "next-intl";
import { site } from "@/lib/site";
import Logo from "@/components/ui/Logo";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

/* Same anchors as the header nav, with each section's SectionMarker code */
const NAV_ITEMS = [
  ["packages", 2],
  ["work", 3],
  ["about", 5],
  ["contact", 7],
] as const;

/* Cell heading of the title block: crimson cell number + muted label */
function CellTitle({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p className="mono-label">
      <span className="text-crimson-bright">{n}</span>{" "}
      <span className="mono-muted">{children}</span>
    </p>
  );
}

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale();

  // On phones each link is a 44px-tall row (tap target); desktop keeps the tighter list
  const linkClass =
    "inline-flex min-h-11 items-center gap-3 text-small text-text-muted transition-colors hover:text-text md:min-h-0";

  // Bottom row of the title block: build facts of this page. `ltr` marks Latin
  // tokens (label and/or value) so they keep the mono face inside /ar.
  const buildCells = [
    { label: t("footer.builtBy"), value: locale === "ar" ? site.nameAr : site.name },
    { label: t("compile.locale"), value: locale, ltr: "both" },
    { label: t("compile.dir"), value: locale === "ar" ? "rtl" : "ltr", ltr: "both" },
    { label: t("footer.year"), value: String(new Date().getFullYear()), ltr: "value" },
  ];

  return (
    <footer className="relative bg-bg">
      {/* The brand line across the top edge: crimson where reading starts, fading to silver */}
      <span className="divider-brand" aria-hidden="true" />

      <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 md:pt-20">
        {/* Title block (compile system): a ruled frame with corner brackets.
            .meta-grid draws the hairlines between cells; border-x closes the sides. */}
        <div className="frame-corners text-text">
          <div className="meta-grid grid-cols-2 border-x border-line [--meta-line:var(--line)] md:grid-cols-12">
            <div className="col-span-2 p-5 md:col-span-5 md:row-span-2 md:p-7">
              <CellTitle n="01">{t("footer.studio")}</CellTitle>
              {/* Pull in by most of the logo file's transparent side space (see Logo.tsx), leaving a few px of the gutter so the focus ring stays on screen */}
              <a href="#main" className="-ms-3 mt-5 inline-flex min-h-11 items-center md:-ms-5">
                <Logo sizeClass="h-11 md:h-12" />
              </a>
              <p className="mt-5 max-w-sm text-body text-text-muted">{t("footer.tagline")}</p>
              <WhatsAppButton className="mt-7" />
            </div>

            <div className="col-span-2 p-5 md:col-span-7 md:p-7">
              <CellTitle n="02">{t("nav.contact")}</CellTitle>
              <ul className="mt-3 md:mt-5 md:flex md:flex-wrap md:gap-x-10 md:gap-y-3">
                <li>
                  <a href={`mailto:${site.email}`} dir="ltr" className={linkClass}>
                    {site.email}
                  </a>
                </li>
                {site.instagram && (
                  <li>
                    <a href={site.instagram} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      Instagram
                    </a>
                  </li>
                )}
                {site.linkedin && (
                  <li>
                    <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      LinkedIn
                    </a>
                  </li>
                )}
              </ul>
            </div>

            <nav aria-label="Footer" className="col-span-2 p-5 md:col-span-7 md:p-7">
              <CellTitle n="03">{t("footer.index")}</CellTitle>
              <ul className="mt-3 grid grid-cols-2 gap-x-6 md:mt-5 md:gap-y-3">
                {NAV_ITEMS.map(([item, code]) => (
                  <li key={item}>
                    <a href={`#${item}`} className={linkClass}>
                      <span className="font-mono text-[0.75rem] text-text-muted/80" dir="ltr" aria-hidden="true">
                        ‹{String(code).padStart(2, "0")}›
                      </span>
                      {t(`nav.${item}`)}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {buildCells.map(({ label, value, ltr }) => (
              <div key={label} className="px-5 py-4 md:col-span-3 md:px-7">
                <p dir={ltr === "both" ? "ltr" : undefined} className="meta-label">{label}</p>
                <p dir={ltr ? "ltr" : undefined} className="meta-value mt-1.5 text-text">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sign-off: the studio's two names, Arabic on the right and Latin on the
            left in every locale (the brand idea: right and left meeting, as in
            the intro), joined by a hairline. Physical order on purpose, so the
            row is dir="ltr"; each name carries its own lang/dir and font.
            Decorative repeat of the logo's name, hidden from screen readers. */}
        <div
          dir="ltr"
          aria-hidden="true"
          className="mt-6 flex items-center gap-4 py-8 sm:gap-6 md:mt-8 md:py-10"
        >
          <span
            lang="en"
            className="shrink-0 font-[family-name:var(--font-cormorant)] text-[1.75rem] font-semibold leading-none text-text/80 sm:text-[2.5rem] md:text-[3.25rem]"
          >
            {site.name.replace(" Studio", "")}
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-text/30 to-crimson-bright/70" />
          <span
            lang="ar"
            dir="rtl"
            className="shrink-0 font-[family-name:var(--font-tajawal)] text-[1.75rem] font-bold leading-none text-crimson-bright sm:text-[2.5rem] md:text-[3.25rem]"
          >
            {site.nameAr}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line py-6">
          {/* dir="auto": the Arabic copyright line is Latin text ("© 2026 Yameen Yasar
              Studio"); without it RTL reordering shows "Yameen Yasar Studio 2026 ©" */}
          <p dir="auto" className="text-label text-text-muted">{t("footer.copyright")}</p>
          <LanguageSwitch variant="pill" />
        </div>
      </div>
    </footer>
  );
}
