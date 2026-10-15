import { useTranslations } from "next-intl";
import { Wallet } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const STEPS = [1, 2, 3, 4] as const;

/* The only numbered list on the site. Markers sit on one line that runs
   across the row on desktop and down the reading side on phones. */
export default function Process() {
  const t = useTranslations("process");

  return (
    <section id="process" className="section-glow py-20 md:py-28" style={{ "--glow-x": "12%", "--glow-y": "100%" } as React.CSSProperties}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading className="max-w-3xl">{t("headline")}</SectionHeading>

        <div className="relative mt-14">
          {/* Phones: down the start side, through the marker centres. Desktop: across, behind the markers. */}
          <div className="steps-line bottom-6 start-6 top-6 w-px md:bottom-auto md:end-0 md:top-6 md:h-px md:w-auto" aria-hidden="true" />

          <ol className="relative grid gap-10 md:grid-cols-4 md:gap-8">
            {STEPS.map((n) => (
              <li key={n} className="flex gap-5 md:block">
                <span
                  className="grid size-12 shrink-0 place-items-center rounded-full border border-crimson-bright/60 bg-bg font-heading text-h2 font-semibold text-crimson-bright lining-nums shadow-[0_0_0_6px_var(--bg),0_0_30px_-4px_rgba(229,72,77,0.45)]"
                  aria-hidden="true"
                >
                  {n}
                </span>
                <div className="md:mt-6">
                  <h3 className="text-[1.125rem] font-semibold text-text">
                    {t(`step${n}Title`)}
                  </h3>
                  <p className="mt-2 text-small text-text-muted">
                    {t(`step${n}Body`)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-14 flex items-start gap-3 rounded-2xl border border-line bg-surface px-5 py-4 text-small text-text-muted">
          <Wallet size={18} className="mt-0.5 shrink-0 text-crimson-bright" aria-hidden="true" />
          {t("payment")}
        </p>
      </div>
    </section>
  );
}
