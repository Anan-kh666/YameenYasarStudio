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

        {/* Geometry: markers are 3.5rem (phones) / 4.5rem (md+). Each connector
            runs centre-line from 0.75rem past its marker to 0.75rem before the
            next one: phones down the start side, md+ across the row
            (li width + 2rem gap − marker − 1.5rem). The gradient goes
            crimson → silver in reading order, flipped for RTL in CSS. */}
        <ol className="mt-14 grid gap-12 md:mt-20 md:grid-cols-4 md:gap-8">
          {STEPS.map((n, i) => (
            <li key={n} className="relative flex gap-5 md:block">
              {i < STEPS.length - 1 && (
                <span
                  className="process-connector absolute start-[calc(1.75rem-1px)] top-[4.25rem] -bottom-[2.25rem] w-0.5 md:start-[5.25rem] md:top-[calc(2.25rem-1px)] md:bottom-auto md:h-0.5 md:w-[calc(100%-4rem)]"
                  aria-hidden="true"
                />
              )}
              <span
                className="process-marker relative grid size-14 shrink-0 place-items-center rounded-full font-heading text-[1.75rem] font-semibold leading-none text-crimson-bright lining-nums md:size-[4.5rem] md:text-[2.25rem]"
                aria-hidden="true"
              >
                {n}
              </span>
              <div className="pt-2.5 md:mt-8 md:pt-0">
                <h3 className="font-heading text-[1.625rem] font-semibold leading-[1.2] text-text md:text-[1.875rem] rtl:leading-[1.35]">
                  {t(`step${n}Title`)}
                </h3>
                <p className="mt-3 max-w-xs text-body text-text-muted">
                  {t(`step${n}Body`)}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* Payment terms: label set as a small heading on the reading side,
            the terms themselves in full body size beside it. */}
        <div className="mt-16 grid gap-4 rounded-2xl border border-line border-s-2 border-s-crimson-bright bg-linear-to-b from-surface to-bg/40 px-6 py-6 shadow-[inset_0_1px_0_rgba(245,242,237,0.05)] md:mt-20 md:grid-cols-[auto_1fr] md:items-center md:gap-6 md:px-8 md:py-7">
          <p className="flex items-center gap-3 font-heading text-h2 font-semibold text-text">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-crimson-bright/25 bg-crimson/15 text-crimson-bright" aria-hidden="true">
              <Wallet size={18} />
            </span>
            {paymentLabel}
          </p>
          <p className="text-body text-text md:border-s md:border-line md:ps-6">
            {paymentBody}
          </p>
        </div>
      </div>
    </section>
  );
}
