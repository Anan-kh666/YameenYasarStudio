import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import SectionMarker from "@/components/ui/SectionMarker";

/* Two columns from lg, each its own list, so opening an answer only
   pushes down the questions below it in the same column. */
const COLUMNS = [
  [1, 2, 3],
  [4, 5, 6],
] as const;

export default function Faq() {
  const t = useTranslations("faq");

  return (
    <section id="faq" className="bg-paper py-20 text-bg md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionMarker label={t("marker")} tone="paper" className="mb-6" />
        <SectionHeading tone="paper">{t("headline")}</SectionHeading>

        <div className="mt-12 grid gap-3 lg:grid-cols-2 lg:gap-4">
          {COLUMNS.map((col) => (
            <div key={col[0]} className="flex flex-col gap-3 lg:gap-4">
              {/* Native <details>: keyboard and screen-reader friendly, no JS */}
              {col.map((n) => (
                <details key={n} className="panel-paper fq-item group">
                  <summary className="flex min-h-16 cursor-pointer list-none items-center gap-4 px-5 py-4 text-[1.0625rem] font-medium leading-snug text-bg sm:px-6 [&::-webkit-details-marker]:hidden">
                    <span className="flex-1">{t(`q${n}`)}</span>
                    {/* Plus turns into a close mark when open */}
                    <span
                      className="grid size-8 shrink-0 place-items-center rounded-full border border-bg/15 transition-[transform,background-color,border-color,color] duration-300 group-hover:border-crimson/50 group-open:rotate-45 group-open:border-crimson group-open:bg-crimson group-open:text-text motion-reduce:transition-none"
                      aria-hidden="true"
                    >
                      <Plus size={16} strokeWidth={2} />
                    </span>
                  </summary>
                  <p className="max-w-[65ch] ps-5 pb-6 pe-16 text-body text-bg/75 sm:ps-6">
                    {t(`a${n}`)}
                  </p>
                </details>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
