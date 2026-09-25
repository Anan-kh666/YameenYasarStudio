import { useTranslations, useLocale } from "next-intl";
import { site } from "@/lib/site";
import LanguageSwitch from "@/components/ui/LanguageSwitch";

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Tagline */}
          <div>
            <p className="text-body font-semibold text-ink">{t("tagline")}</p>
            <p className="mt-1 text-small text-ink-muted">{t("copyright")}</p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            {/* Social links — dir="ltr" so URLs don't scramble in RTL */}
            <a
              href={`mailto:${site.email}`}
              dir="ltr"
              className="text-small text-ink-muted transition-colors hover:text-yameen"
            >
              {site.email}
            </a>
            {site.instagram && (
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-small text-ink-muted transition-colors hover:text-yameen"
              >
                Instagram
              </a>
            )}
            {site.linkedin && (
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-small text-ink-muted transition-colors hover:text-yameen"
              >
                LinkedIn
              </a>
            )}
            <LanguageSwitch />
          </div>
        </div>
      </div>
    </footer>
  );
}
