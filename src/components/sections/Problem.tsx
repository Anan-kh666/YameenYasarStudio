import { useTranslations } from "next-intl";
import { FlipHorizontal2, Type, Languages, ArrowRight, ArrowLeft, X, Check } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import SectionMarker from "@/components/ui/SectionMarker";

/* One icon and one "broken vs correct" demo per problem. */
const CARDS = [
  { key: "card1", Icon: FlipHorizontal2, demo: "mirror" },
  { key: "card2", Icon: Type, demo: "type" },
  { key: "card3", Icon: Languages, demo: "translate" },
] as const;

type Demo = (typeof CARDS)[number]["demo"];

/* Decorative skeleton of each mistake and its fix. The two cells follow
   `dir`, so "broken" is always read first. */
function DemoCell({ demo, good }: { demo: Demo; good: boolean }) {
  return (
    <div className={`prob-cell ${good ? "prob-good" : "prob-bad"}`}>
      <span className="prob-badge">{good ? <Check size={11} strokeWidth={3} /> : <X size={11} strokeWidth={3} />}</span>
      {demo === "mirror" && (
        /* A "next" button: the arrow should point the way the reader reads
           (right in LTR, left in RTL). The broken one points backwards. */
        <span className="prob-next">
          <span className="prob-line w-8" />
          {good ? (
            <ArrowRight size={16} strokeWidth={2} className="rtl:-scale-x-100" />
          ) : (
            <ArrowLeft size={16} strokeWidth={2} className="rtl:-scale-x-100" />
          )}
        </span>
      )}
      {demo === "type" && (
        <span className={`prob-text ${good ? "" : "prob-text-bad"}`}>
          <span className="prob-line w-[90%]" />
          <span className="prob-line w-[70%]" />
          <span className="prob-line w-[80%]" />
        </span>
      )}
      {demo === "translate" && (
        <span className="prob-words">
          {good ? (
            <>
              <span className="prob-line w-[42%]" />
              <span className="prob-line w-[30%]" />
              <span className="prob-line w-[56%]" />
            </>
          ) : (
            <>
              <span className="prob-line w-[22%]" />
              <span className="prob-line prob-line-err w-[38%]" />
              <span className="prob-line w-[18%]" />
              <span className="prob-line prob-line-err w-[30%]" />
            </>
          )}
        </span>
      )}
    </div>
  );
}

export default function Problem() {
  const t = useTranslations("problem");

  return (
    <section id="problem" className="section-pad bg-paper text-bg">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionMarker label={t("marker")} tone="paper" className="mb-6" />
        <SectionHeading tone="paper" className="max-w-3xl">
          {t("headline")}
        </SectionHeading>

        <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3 lg:gap-5">
          {CARDS.map(({ key, Icon, demo }) => (
            <li key={key} className="panel-paper flex flex-col p-6 md:p-7">
              <span className="icon-tile icon-tile-paper">
                <Icon size={20} strokeWidth={1.7} aria-hidden="true" />
              </span>
              <div className="prob-demo mt-6" aria-hidden="true">
                <DemoCell demo={demo} good={false} />
                <DemoCell demo={demo} good />
              </div>
              <h3 className="mt-6 font-heading text-[1.25rem] font-semibold leading-[1.3] text-bg ltr:tracking-[-0.01em] rtl:leading-[1.4]">
                {t(`${key}Title`)}
              </h3>
              <p className="mt-2 text-[0.9375rem] leading-6 text-bg/70">{t(`${key}Body`)}</p>
            </li>
          ))}
        </ul>

        {/* The consequence as a dark statement band, the loudest line here. */}
        <div className="relative mt-6 overflow-hidden rounded-2xl bg-bg px-6 py-10 md:mt-8 md:px-12 md:py-14">
          <div className="aurora absolute inset-0 opacity-70" aria-hidden="true" />
          <span className="brand-rule relative mb-6" aria-hidden="true" />
          <p className="relative max-w-4xl font-heading text-[1.625rem] font-semibold leading-[1.3] text-text text-balance ltr:tracking-[-0.015em] md:text-[2.5rem] md:leading-[1.15] rtl:leading-[1.45] md:rtl:leading-[1.4]">
            {t("closing")}
          </p>
        </div>
      </div>
    </section>
  );
}
