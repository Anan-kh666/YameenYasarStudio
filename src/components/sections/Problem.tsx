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
        <SectionHeading tone="paper" className="max-w-3xl">
          {t("headline")}
        </SectionHeading>

        {/* The three problems as one sheet split by hairlines, not three
            floating cards. divide-x is logical in Tailwind v4 (border-inline),
            so the dividers sit correctly in RTL too. */}
        <ul className="mt-12 grid divide-y divide-bg/10 overflow-hidden rounded-2xl border border-bg/12 bg-white/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] md:mt-14 md:grid-cols-3 md:divide-x md:divide-y-0">
          {CARDS.map(({ key, Icon }) => (
            <li key={key} className="px-6 py-7 md:px-8 md:py-9">
              {/* crimson is allowed as a colour on paper (see brand tokens) */}
              <span
                className="grid size-11 place-items-center rounded-xl border border-crimson/20 bg-crimson/[0.06] text-crimson"
                aria-hidden="true"
              >
                <Icon size={21} strokeWidth={1.6} />
              </span>
              <h3 className="mt-6 font-heading text-[1.375rem] font-semibold leading-[1.3] text-bg">
                {t(`${key}Title`)}
              </h3>
              <p className="mt-2.5 text-body text-bg/70">
                {t(`${key}Body`)}
              </p>
            </li>
          ))}
        </ul>

        {/* The consequence, set as a pull-statement: the largest line in the
            section after the heading, with the crimson bar on the reading side */}
        <p className="mt-14 max-w-4xl border-s-2 border-crimson ps-5 font-heading text-[1.625rem] font-semibold leading-[1.3] text-bg md:mt-20 md:text-balance md:ps-8 md:text-[2.25rem] md:leading-[1.25] rtl:leading-[1.5] md:rtl:leading-[1.45]">
          {t("closing")}
        </p>
      </div>
    </section>
  );
}
