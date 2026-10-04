import { useTranslations } from "next-intl";

const QUESTIONS = [1, 2, 3, 4, 5, 6] as const;

export default function Faq() {
  const t = useTranslations("faq");

  return (
    <section id="faq" className="bg-paper py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="font-heading text-h2 font-semibold text-bg md:text-h1 mb-8">
          {t("headline")}
        </h2>

        <div className="space-y-3">
          {QUESTIONS.map((n) => (
            <details
              key={n}
              className="group rounded-2xl border border-bg/10"
            >
              <summary className="cursor-pointer px-5 py-4 text-body font-medium text-bg transition-colors hover:text-crimson [&::-webkit-details-marker]:hidden list-none">
                {t(`q${n}`)}
              </summary>
              <div className="px-5 pb-4 text-small text-bg/70">
                {t(`a${n}`)}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
