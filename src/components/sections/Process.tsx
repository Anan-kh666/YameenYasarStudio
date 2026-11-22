import { useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import SectionMarker from "@/components/ui/SectionMarker";

const STEPS = [1, 2, 3, 4] as const;

/* The four steps as a build pipeline: one framed, hairline-ruled sheet
   (like the footer's title block). Each stage has its code (S-01…, Western
   digits in both locales) and a connector that runs to the next stage in
   reading order: left → right in LTR, right → left in RTL (gradient and
   chevron flip with `dir`). Phones: one stage per row, top to bottom. */
export default function Process() {
  const t = useTranslations("process");
  // "Payment: …" is one message; the label before the first colon becomes
  // the row's label. The wording stays exactly as written in both locales.
  const payment = t("payment");
  const colon = payment.indexOf(":");
  const paymentLabel = colon > 0 ? payment.slice(0, colon) : "";
  const paymentBody = colon > 0 ? payment.slice(colon + 1).trim() : payment;

  return (
    <section
      id="process"
      className="section-glow bg-grid py-20 md:py-28"
      style={{ "--glow-x": "12%", "--glow-y": "100%", "--grid-y": "70%" } as React.CSSProperties}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionMarker index={4} label={t("marker")} className="mb-6" />
        <SectionHeading className="max-w-3xl">{t("headline")}</SectionHeading>

        <div className="frame-corners mt-14 text-text md:mt-20">
          {/* Two ruled rows: the stages (a nested meta-grid, so hairlines run
              between the stage cells too) and the payment terms. */}
          <div className="meta-grid border-x border-line bg-bg/60 [--meta-line:var(--line)]">
            <ol className="meta-grid border-y-0 p-0 [--meta-line:var(--line)] md:grid-cols-4">
              {STEPS.map((n, i) => {
                const last = i === STEPS.length - 1;
                return (
                  <li key={n} className="process-stage px-5 pb-8 pt-6 md:px-6 md:pb-10">
                    <div className="flex items-center gap-3" aria-hidden="true">
                      <span dir="ltr" className="marker-code process-code">
                        S-{String(n).padStart(2, "0")}
                      </span>
                      <span className={`process-pipe h-px flex-1 ${last ? "process-pipe-end" : ""}`} />
                      {last ? (
                        <span className="size-2 bg-crimson-bright" />
                      ) : (
                        <ChevronRight size={16} strokeWidth={1.75} className="-ms-[1.375rem] shrink-0 text-text-muted rtl:-scale-x-100" />
                      )}
                    </div>
                    <h3 className="mt-7 font-heading text-[1.625rem] font-semibold leading-[1.2] text-text md:mt-9 md:text-[1.875rem] rtl:leading-[1.35]">
                      {t(`step${n}Title`)}
                    </h3>
                    <p className="mt-3 max-w-xs text-body text-text-muted">
                      {t(`step${n}Body`)}
                    </p>
                  </li>
                );
              })}
            </ol>

            {/* Payment terms as the sheet's last meta row, across all stages */}
            <dl className="grid gap-2 px-5 py-5 md:grid-cols-[12rem_1fr] md:items-center md:gap-0 md:px-6 md:py-6">
              {paymentLabel && <dt className="meta-label">{paymentLabel}</dt>}
              <dd className="text-body text-text md:border-s md:border-line md:ps-6">
                {paymentBody}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
