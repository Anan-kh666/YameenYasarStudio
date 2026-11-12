import { useTranslations } from "next-intl";
import { site } from "@/lib/site";
import Logo from "@/components/ui/Logo";
import LanguageSwitch from "@/components/ui/LanguageSwitch";

/* Same anchors as the header nav */
const NAV_ITEMS = ["packages", "work", "about", "contact"] as const;

export default function Footer() {
  const t = useTranslations();

  // On phones each link is a 44px-tall row (tap target); desktop keeps the tighter list
  const linkClass = "inline-flex min-h-11 items-center text-small text-text-muted transition-colors hover:text-crimson-bright md:min-h-0";

  return (
    <footer className="relative border-t border-line bg-bg">
      {/* The brand line across the top edge: crimson from one side, silver from the other */}
      <div
        className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-crimson-bright/70 to-transparent"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 py-14 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <a href="#main" className="inline-flex min-h-11 items-center">
              <Logo />
            </a>
            <p className="mt-5 max-w-xs text-small text-text-muted">{t("footer.tagline")}</p>
          </div>

          <nav aria-label="Footer">
            <ul className="md:space-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item}>
                  <a href={`#${item}`} className={linkClass}>
                    {t(`nav.${item}`)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="md:space-y-3">
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

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line py-6">
          {/* dir="auto": the Arabic copyright line is Latin text ("© 2026 Yameen Yasar
              Studio"); without it RTL reordering shows "Yameen Yasar Studio 2026 ©" */}
          <p dir="auto" className="text-label text-text-muted">{t("footer.copyright")}</p>
          <LanguageSwitch />
        </div>
      </div>
    </footer>
  );
}
