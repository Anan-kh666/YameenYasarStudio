import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const QUESTIONS = [1, 2, 3, 4, 5, 6] as const;

export default function Faq() {
  const t = useTranslations("faq");

  return (
    <section id="faq" className="bg-paper py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
        {/* Heading stays in view beside the list on wide screens */}
        <SectionHeading tone="paper" className="lg:sticky lg:top-24 lg:self-start">
          {t("headline")}
        </SectionHeading>

        {/* Native <details>: keyboard and screen-reader friendly, no JS */}
        <div className="border-t border-bg/10">
          {QUESTIONS.map((n) => (
            <details key={n} className="group border-b border-bg/10">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[1.0625rem] font-medium text-bg transition-colors hover:text-crimson [&::-webkit-details-marker]:hidden">
                {t(`q${n}`)}
                {/* Plus turns into a close mark when open */}
                <span
                  className="grid size-8 shrink-0 place-items-center rounded-full border border-bg/15 transition-[transform,background-color,color] duration-300 group-open:rotate-45 group-open:border-crimson group-open:bg-crimson group-open:text-text motion-reduce:transition-none"
                  aria-hidden="true"
                >
                  <Plus size={16} strokeWidth={2} />
                </span>
              </summary>
              <p className="pb-6 pe-14 text-body text-bg/70">
                {t(`a${n}`)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
