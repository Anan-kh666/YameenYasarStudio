import { useTranslations } from "next-intl";

const CARDS = ["card1", "card2", "card3"] as const;

export default function Problem() {
  const t = useTranslations("problem");

  return (
    <section id="problem" className="bg-paper py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-heading text-h2 font-semibold text-bg md:text-h1">
          {t("headline")}
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {CARDS.map((card) => (
            <div
              key={card}
              className="rounded-2xl border border-bg/10 px-5 py-6"
            >
              <h3 className="text-body font-semibold text-bg">
                {t(`${card}Title`)}
              </h3>
              <p className="mt-2 text-small text-bg/70">
                {t(`${card}Body`)}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-body font-medium text-bg">
          {t("closing")}
        </p>
      </div>
    </section>
  );
}
