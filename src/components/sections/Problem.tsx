import { useTranslations } from "next-intl";
import { FlipHorizontal2, Type, Languages } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

/* One icon per problem: mirroring, type, translation */
const CARDS = [
  { key: "card1", Icon: FlipHorizontal2 },
  { key: "card2", Icon: Type },
  { key: "card3", Icon: Languages },
] as const;

export default function Problem() {
  const t = useTranslations("problem");

  return (
    <section id="problem" className="bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Editorial split on lg+: the heading holds the reading side, the
            three problems run as ruled rows beside it. Grid columns follow
            `dir`, so in RTL the heading sits on the right. */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <SectionHeading tone="paper" className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
            {t("headline")}
          </SectionHeading>

          <ul className="problem-rows lg:col-span-7">
            {CARDS.map(({ key, Icon }) => (
              <li key={key} className="grid grid-cols-[auto_1fr] gap-x-5 py-8 first:pt-0 md:gap-x-7 md:py-10">
                {/* crimson fill with paper-coloured icon: crimson is allowed on paper */}
                <span
                  className="grid size-12 place-items-center rounded-2xl bg-crimson text-paper shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_12px_28px_-14px_rgba(139,13,26,0.8)] md:size-14"
                  aria-hidden="true"
                >
                  <Icon size={24} strokeWidth={1.6} />
                </span>
                <div className="pt-1">
                  <h3 className="font-heading text-[1.625rem] font-semibold leading-[1.2] text-bg md:text-[2rem] rtl:leading-[1.35]">
                    {t(`${key}Title`)}
                  </h3>
                  <p className="mt-3 max-w-xl text-body text-bg/72">
                    {t(`${key}Body`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* The consequence: a dark statement band, the loudest line in the
            section, with the crimson bar on the reading side (border-s). */}
        <p className="problem-closing mt-14 rounded-2xl border-s-4 border-crimson-bright bg-bg px-6 py-9 font-heading text-[1.75rem] font-semibold leading-[1.25] text-text text-balance md:mt-20 md:px-12 md:py-14 md:text-[2.75rem] md:leading-[1.15] rtl:leading-[1.45] md:rtl:leading-[1.4]">
          {t("closing")}
        </p>
      </div>
    </section>
  );
}
