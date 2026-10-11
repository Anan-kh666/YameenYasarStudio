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
          <div>
            <p className="text-body font-semibold text-text">{t("tagline")}</p>
            <p className="mt-1 text-small text-text-muted">{t("copyright")}</p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={`mailto:${site.email}`}
              dir="ltr"
              className="text-small text-text-muted transition-colors hover:text-crimson-bright"
            >
              {site.email}
            </a>
            {site.instagram && (
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-small text-text-muted transition-colors hover:text-crimson-bright"
              >
                Instagram
              </a>
            )}
            {site.linkedin && (
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-small text-text-muted transition-colors hover:text-crimson-bright"
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
