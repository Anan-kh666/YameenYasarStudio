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

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {CARDS.map(({ key, Icon }) => (
            <div
              key={key}
              className="rounded-2xl border border-bg/10 bg-white/55 px-6 py-7 shadow-[0_1px_2px_rgba(11,11,11,0.04)]"
            >
              {/* crimson is allowed as a colour on paper (see brand tokens) */}
              <span className="grid size-11 place-items-center rounded-xl bg-crimson/10 text-crimson" aria-hidden="true">
                <Icon size={22} strokeWidth={1.75} />
              </span>
              <h3 className="mt-5 text-[1.125rem] font-semibold leading-snug text-bg">
                {t(`${key}Title`)}
              </h3>
              <p className="mt-2 text-body text-bg/70">
                {t(`${key}Body`)}
              </p>
            </div>
          ))}
        </div>

        {/* The consequence, set as a statement */}
        <p className="mt-14 max-w-3xl border-s-4 border-crimson ps-5 font-heading text-h2 font-semibold text-bg md:text-[1.75rem] md:leading-[1.3]">
          {t("closing")}
        </p>
      </div>
    </section>
  );
}
