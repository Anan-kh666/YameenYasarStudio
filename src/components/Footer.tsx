import { useTranslations } from "next-intl";
import { site, whatsappUrl } from "@/lib/site";
import Logo from "@/components/ui/Logo";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

/* Same anchors as the header nav */
const NAV_ITEMS = ["services", "packages", "work", "about", "contact"] as const;

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-small font-semibold text-text">{children}</p>;
}

export default function Footer() {
  const t = useTranslations();

  // On phones each link is a 44px-tall row (tap target); desktop keeps the tighter list
  const linkClass =
    "inline-flex min-h-11 items-center text-small text-text-muted transition-colors hover:text-text md:min-h-0";

  const contactLinks: { href: string; label: string; ltr?: boolean; external?: boolean }[] = [
    { href: `mailto:${site.email}`, label: site.email, ltr: true },
    { href: whatsappUrl(t("whatsapp.prefilled")), label: t("header.whatsapp"), external: true },
    { href: site.instagram, label: "Instagram", external: true },
    { href: site.linkedin, label: "LinkedIn", external: true },
  ];

  return (
    <footer className="hx-footer relative bg-bg">
      {/* The brand line across the top edge: crimson where reading starts, fading to silver */}
      <span className="divider-brand" aria-hidden="true" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 py-16 md:grid-cols-12 md:gap-8 md:py-20">
          <div className="md:col-span-6 lg:col-span-5">
            {/* Pull in by most of the logo file's transparent side space (see Logo.tsx), leaving a few px of the gutter so the focus ring stays on screen */}
            <a href="#main" className="-ms-3 inline-flex min-h-11 items-center md:-ms-5">
              <Logo sizeClass="h-10 md:h-11" />
            </a>
            <p className="mt-5 max-w-sm text-body font-medium text-text">{t("footer.tagline")}</p>
            <p className="mt-2 max-w-sm text-small text-text-muted">{t("contact.subline")}</p>
            <WhatsAppButton className="mt-7" />
          </div>

          <nav aria-label="Footer" className="md:col-span-3 lg:col-span-3 lg:col-start-7">
            <ColumnTitle>{t("footer.navTitle")}</ColumnTitle>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 md:mt-5 md:grid-cols-1 md:gap-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item}>
                  <a href={`#${item}`} className={linkClass}>
                    {t(`nav.${item}`)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3 lg:col-span-3 lg:col-start-10">
            <ColumnTitle>{t("nav.contact")}</ColumnTitle>
            <ul className="mt-3 md:mt-5 md:space-y-3">
              {contactLinks.map(({ href, label, ltr, external }) => (
                <li key={href}>
                  <a
                    href={href}
                    dir={ltr ? "ltr" : undefined}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className={linkClass}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
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
