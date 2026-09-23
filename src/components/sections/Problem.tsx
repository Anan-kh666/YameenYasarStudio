import { useTranslations } from "next-intl";

const CARDS = ["card1", "card2", "card3"] as const;

export default function Problem() {
  const t = useTranslations("problem");

  return (
    <section id="problem" className="bg-surface py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-h2 font-semibold text-ink md:text-h1">
          {t("headline")}
        </h2>

        {/* Three cards — side by side on desktop, stacked on mobile */}
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {CARDS.map((card) => (
            <div
              key={card}
              className="rounded-2xl border border-line bg-paper px-5 py-6"
            >
              <h3 className="text-body font-semibold text-ink">
                {t(`${card}Title`)}
              </h3>
              <p className="mt-2 text-small text-ink-muted">
                {t(`${card}Body`)}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-body font-medium text-ink">
          {t("closing")}
        </p>
      </div>
    </section>
  );
}
