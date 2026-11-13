import { useTranslations } from "next-intl";
import { Wallet } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const STEPS = [1, 2, 3, 4] as const;

/* The only numbered list on the site. Each step (except the last) draws its
   own connector to the next marker, so the line starts and ends exactly on
   the first and last markers. Phones: down the start side. Desktop: across
   the row, in reading order (right → left in RTL, via logical `start`). */
export default function Process() {
  const t = useTranslations("process");
  // "Payment: …" is one message; the label before the first colon is set
  // apart visually. The wording stays exactly as written in both locales.
  const payment = t("payment");
  const colon = payment.indexOf(":");
  const paymentLabel = colon > 0 ? payment.slice(0, colon + 1) : "";
  const paymentBody = colon > 0 ? payment.slice(colon + 1).trim() : payment;

  return (
    <section id="process" className="section-glow py-20 md:py-28" style={{ "--glow-x": "12%", "--glow-y": "100%" } as React.CSSProperties}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading className="max-w-3xl">{t("headline")}</SectionHeading>

        <ol className="mt-14 grid gap-10 md:grid-cols-4 md:gap-8">
          {STEPS.map((n, i) => (
            <li key={n} className="relative flex gap-5 md:block">
              {i < STEPS.length - 1 && (
                <span
                  className="absolute start-6 top-14 -bottom-8 w-px bg-linear-to-b from-crimson-bright/60 to-line md:start-14 md:top-6 md:bottom-auto md:h-px md:w-[calc(100%-4rem+2rem)] md:bg-linear-to-r rtl:md:bg-linear-to-l"
                  aria-hidden="true"
                />
              )}
              <span
                className="relative grid size-12 shrink-0 place-items-center rounded-full border border-crimson-bright/50 bg-linear-to-b from-surface to-bg font-heading text-h2 font-semibold text-crimson-bright lining-nums shadow-[inset_0_1px_0_rgba(245,242,237,0.08),0_0_24px_-8px_rgba(229,72,77,0.5)]"
                aria-hidden="true"
              >
                {n}
              </span>
              <div className="pt-2.5 md:mt-6 md:pt-0">
                <h3 className="font-heading text-h2 font-semibold text-text">
                  {t(`step${n}Title`)}
                </h3>
                <p className="mt-2 max-w-xs text-small text-text-muted">
                  {t(`step${n}Body`)}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-16 flex items-center gap-4 rounded-2xl border border-line bg-linear-to-b from-surface to-bg/40 px-5 py-4 shadow-[inset_0_1px_0_rgba(245,242,237,0.05)] md:px-6">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-crimson-bright/25 bg-crimson/15 text-crimson-bright" aria-hidden="true">
            <Wallet size={18} />
          </span>
          <p className="text-small text-text-muted">
            {paymentLabel && <span className="font-medium text-text">{paymentLabel} </span>}
            {paymentBody}
          </p>
        </div>
      </div>
    </section>
  );
}
