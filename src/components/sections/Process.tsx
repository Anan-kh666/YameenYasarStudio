import { useTranslations } from "next-intl";

const STEPS = [1, 2, 3, 4] as const;

export default function Process() {
  const t = useTranslations("process");

  return (
    <section id="process" className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-h2 font-semibold text-ink md:text-h1">
          {t("headline")}
        </h2>

        {/* Numbered steps — Process is the one section where numbers are appropriate */}
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {STEPS.map((n) => (
            <li key={n} className="rounded-2xl border border-line bg-surface px-5 py-6">
              <span className="text-h1 font-semibold text-yameen" aria-hidden="true">
                {n}
              </span>
              <h3 className="mt-3 text-body font-semibold text-ink">
                {t(`step${n}Title`)}
              </h3>
              <p className="mt-2 text-small text-ink-muted">
                {t(`step${n}Body`)}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-8 text-small text-ink-muted">
          {t("payment")}
        </p>
      </div>
    </section>
  );
}
