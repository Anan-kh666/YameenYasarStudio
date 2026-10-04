import { useTranslations } from "next-intl";

const PROJECTS = ["onlineStore", "clinic", "saas"] as const;

export default function Work() {
  const t = useTranslations("work");

  return (
    <section id="work" className="bg-surface py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-heading text-h2 font-semibold text-text md:text-h1">
          {t("headline")}
        </h2>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {PROJECTS.map((key) => (
            <div
              key={key}
              className="overflow-hidden rounded-2xl border border-line bg-bg"
            >
              <div className="relative aspect-[16/10] bg-surface">
                <div className="flex h-full items-center justify-center text-small text-text-muted">
                  {t("comingSoon")}
                </div>
                <span className="absolute inset-inline-start-3 top-3 rounded-full bg-bg/80 px-2.5 py-0.5 text-label text-text-muted backdrop-blur-sm">
                  {t(`${key}.tag`)}
                </span>
              </div>

              <div className="px-5 py-4">
                <h3 className="text-body font-semibold text-text">
                  {t(`${key}.name`)}
                </h3>
                <p className="mt-1 text-small text-text-muted">
                  {t(`${key}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
