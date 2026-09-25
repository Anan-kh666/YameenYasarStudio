import { useTranslations } from "next-intl";

/*
 * FAQ section — native <details>/<summary> accordion.
 * Accessible without JS, keyboard-navigable, announced by screen readers.
 */

const QUESTIONS = [1, 2, 3, 4, 5, 6] as const;

export default function Faq() {
  const t = useTranslations("faq");

  return (
    <section id="faq" className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="space-y-3">
          {QUESTIONS.map((n) => (
            <details
              key={n}
              className="group rounded-2xl border border-line bg-surface"
            >
              <summary className="cursor-pointer px-5 py-4 text-body font-medium text-ink transition-colors hover:text-yameen [&::-webkit-details-marker]:hidden list-none">
                {t(`q${n}`)}
              </summary>
              <div className="px-5 pb-4 text-small text-ink-muted">
                {t(`a${n}`)}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
