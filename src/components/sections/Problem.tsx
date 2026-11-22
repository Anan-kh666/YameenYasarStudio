import { useTranslations } from "next-intl";
import { FlipHorizontal2, Type, Languages } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import SectionMarker from "@/components/ui/SectionMarker";

/* One icon per problem: mirroring, type, translation. `code` is the error
   code shown in the code column (decorative, Western digits in both locales). */
const CARDS = [
  { key: "card1", code: "E-01", Icon: FlipHorizontal2 },
  { key: "card2", code: "E-02", Icon: Type },
  { key: "card3", code: "E-03", Icon: Languages },
] as const;

export default function Problem() {
  const t = useTranslations("problem");

  return (
    <section
      id="problem"
      className="bg-grid-paper bg-paper py-20 md:py-28"
      style={{ "--grid-x": "80%", "--grid-y": "20%" } as React.CSSProperties}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Editorial split on lg+: the heading holds the reading side, the
            three problems run as ruled rows beside it. Grid columns follow
            `dir`, so in RTL the heading sits on the right. */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
            <SectionMarker index={1} label={t("marker")} tone="paper" className="mb-6" />
            <SectionHeading tone="paper">{t("headline")}</SectionHeading>
          </div>

          {/* The problems as an error log: code column, title + description,
              icon cell. Rows are ruled with hairlines like a list of sheets. */}
          <ol className="problem-rows text-bg lg:col-span-7">
            {CARDS.map(({ key, code, Icon }) => (
              <li
                key={key}
                className="problem-row grid grid-cols-[3.75rem_1fr] gap-x-4 py-7 sm:grid-cols-[4.5rem_1fr_auto] sm:gap-x-6 md:py-9"
              >
                {/* dir="ltr" keeps the code in mono and unmirrored on /ar */}
                <span dir="ltr" className="mono-label justify-self-start pt-2 text-crimson" aria-hidden="true">
                  {code}
                </span>
                <div>
                  <h3 className="font-heading text-[1.625rem] font-semibold leading-[1.2] text-bg md:text-[2rem] rtl:leading-[1.35]">
                    {t(`${key}Title`)}
                  </h3>
                  <p className="mt-3 max-w-xl text-body text-bg/72">
                    {t(`${key}Body`)}
                  </p>
                </div>
                {/* crimson icon on paper: crimson is allowed as text on paper */}
                <span
                  className="problem-icon hidden size-12 place-items-center border border-bg/15 text-crimson sm:grid"
                  aria-hidden="true"
                >
                  <Icon size={22} strokeWidth={1.6} />
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* The consequence: a dark statement band, the loudest line in the
            section, with the crimson bar on the reading side (border-s). The
            mono line above it reads as "these three errors compile to this". */}
        <div className="problem-closing mt-14 rounded-2xl border-s-4 border-crimson-bright bg-bg px-6 py-9 md:mt-20 md:px-12 md:py-14">
          <p dir="ltr" className="mono-label mb-5 flex w-fit gap-3 text-crimson-bright md:mb-7" aria-hidden="true">
            {CARDS.map(({ code }) => (
              <span key={code}>{code}</span>
            ))}
          </p>
          <p className="font-heading text-[1.75rem] font-semibold leading-[1.25] text-text text-balance md:text-[2.75rem] md:leading-[1.15] rtl:leading-[1.45] md:rtl:leading-[1.4]">
            {t("closing")}
          </p>
        </div>
      </div>
    </section>
  );
}
