import { useTranslations } from "next-intl";

/*
 * Work section — showcases portfolio projects.
 *
 * Zait & Za'atar is real but needs screenshots and a URL from Anan.
 * Clinic and SaaS are concept projects shown as "Coming soon".
 */

/* TODO(anan): replace with the real Zait & Za'atar live URL */
const ZAIT_URL = "#";

type Project = {
  key: string;
  /** Real project with a live link (even if placeholder) */
  live: boolean;
};

const PROJECTS: Project[] = [
  { key: "zaitZaatar", live: true },
  { key: "clinic", live: false },
  { key: "saas", live: false },
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
          {PROJECTS.map(({ key, live }) => (
            <div
              key={key}
              className="overflow-hidden rounded-2xl border border-line bg-paper"
            >
              {/* Screenshot area — placeholder until Anan provides images */}
              <div className="relative aspect-[16/10] bg-yameen-soft">
                {live ? (
                  /* TODO(anan): add AR + EN screenshots to public/images/work/ */
                  <div className="flex h-full items-center justify-center text-small text-ink-muted">
                    TODO(anan): screenshot
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-small text-ink-muted">
                    {t("comingSoon")}
                  </div>
                )}

                {/* Concept-project tag — only for non-live projects */}
                {!live && (
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

                {/* Link — only for live projects */}
                {live && (
                  <a
                    href={ZAIT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-small font-medium text-yameen transition-colors hover:text-yameen/80"
                  >
                    {t("viewSite")}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
