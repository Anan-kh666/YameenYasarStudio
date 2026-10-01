import { useTranslations } from "next-intl";
import { site } from "@/lib/site";

/*
 * Work section — showcases portfolio projects.
 *
 * Zait & Za'atar is real but needs screenshots and a URL from Anan.
 * Clinic and SaaS are concept projects shown as "Coming soon".
 */

type Project = {
  key: string;
  /** Non-empty URL means the project is live */
  url: string;
};

const PROJECTS: Project[] = [
  { key: "zaitZaatar", url: site.zaitZaatarUrl },
  { key: "clinic", url: "" },
  { key: "saas", url: "" },
];

export default function Work() {
  const t = useTranslations("work");

  return (
    <section id="work" className="bg-surface py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-h2 font-semibold text-ink md:text-h1">
          {t("headline")}
        </h2>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {PROJECTS.map(({ key, url }) => {
            const isLive = key === "zaitZaatar";
            return (
              <div
                key={key}
                className="overflow-hidden rounded-2xl border border-line bg-paper"
              >
                {/* Screenshot area — placeholder until Anan provides images */}
                <div className="relative aspect-[16/10] bg-yameen-soft">
                  {isLive ? (
                    /* TODO(anan): replace with AR + EN screenshots from public/images/work/ */
                    <div className="flex h-full items-center justify-center">
                      <img src="/brand/yy-mark.svg" alt="" className="h-10 w-auto opacity-20 dark:hidden" aria-hidden="true" />
                      <img src="/brand/yy-mark-reversed.svg" alt="" className="hidden h-10 w-auto opacity-20 dark:block" aria-hidden="true" />
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center text-small text-ink-muted">
                      {t("comingSoon")}
                    </div>
                  )}

                  {/* Concept-project tag — only for non-live projects */}
                  {!isLive && (
                    <span className="absolute inset-inline-start-3 top-3 rounded-full bg-paper/80 px-2.5 py-0.5 text-label text-ink-muted backdrop-blur-sm">
                      {t(`${key}.tag`)}
                    </span>
                  )}
                </div>

                <div className="px-5 py-4">
                  <h3 className="text-body font-semibold text-ink">
                    {t(`${key}.name`)}
                  </h3>
                  <p className="mt-1 text-small text-ink-muted">
                    {t(`${key}.description`)}
                  </p>

                  {/* "View site" link — hidden until a real URL exists */}
                  {url && (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-small font-medium text-yameen transition-colors hover:text-yameen/80"
                    >
                      {t("viewSite")}
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
