import { useTranslations } from "next-intl";
import { site } from "@/lib/site";
import Logo from "@/components/ui/Logo";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

/* Same anchors as the header nav */
const NAV_ITEMS = ["packages", "work", "about", "contact"] as const;

export default function Footer() {
  const t = useTranslations();

  // On phones each link is a 44px-tall row (tap target); desktop keeps the tighter list
  const linkClass =
    "inline-flex min-h-11 items-center text-small text-text-muted transition-colors hover:text-text md:min-h-0";
  // Column titles reuse existing strings: "Menu" (header.menu) and "Contact" (nav.contact)
  const titleClass = "text-small font-medium text-text";

  return (
    <footer className="relative bg-bg">
      {/* The brand line across the top edge: crimson where reading starts, fading to silver */}
      <span className="divider-brand" aria-hidden="true" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Phones: brand block on top, then the two link lists side by side */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 pb-12 pt-16 md:grid-cols-12 md:gap-8 md:pb-16 md:pt-20">
          <div className="col-span-2 md:col-span-6 lg:col-span-5">
            {/* Pull in by most of the logo file's transparent side space (see Logo.tsx), leaving a few px of the gutter so the focus ring stays on screen */}
            <a href="#main" className="-ms-3 inline-flex min-h-11 items-center md:-ms-5">
              <Logo sizeClass="h-11 md:h-12" />
            </a>
            <p className="mt-6 max-w-sm text-body text-text-muted">{t("footer.tagline")}</p>
            <WhatsAppButton className="mt-8" />
          </div>

          <nav aria-label="Footer" className="min-w-0 md:col-span-3 lg:col-start-8 lg:col-span-2">
            <p className={titleClass}>{t("header.menu")}</p>
            <ul className="mt-3 md:mt-5 md:space-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item}>
                  <a href={`#${item}`} className={linkClass}>
                    {t(`nav.${item}`)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0 md:col-span-3">
            <p className={titleClass}>{t("nav.contact")}</p>
            <ul className="mt-3 md:mt-5 md:space-y-3">
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
        </div>

        {/* Sign-off: the studio's two names, Arabic on the right and Latin on the
            left in every locale (the brand idea: right and left meeting, as in
            the intro), joined by a hairline. Physical order on purpose, so the
            row is dir="ltr"; each name carries its own lang/dir and font.
            Decorative repeat of the logo's name, hidden from screen readers. */}
        <div
          dir="ltr"
          aria-hidden="true"
          className="flex items-center gap-4 border-t border-line py-8 sm:gap-6 md:py-10"
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
