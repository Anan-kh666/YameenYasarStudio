import { useTranslations } from "next-intl";
import { Mail, Plus } from "lucide-react";
import { site, whatsappUrl } from "@/lib/site";
import SectionHeading from "@/components/ui/SectionHeading";
import { WhatsAppIcon } from "@/components/ui/WhatsAppButton";

const QUESTIONS = [1, 2, 3, 4, 5, 6] as const;

export default function Faq() {
  const t = useTranslations("faq");
  // Reuses the contact strings (no new copy) for the "ask us directly" aside
  const tContact = useTranslations("contact");
  const tWa = useTranslations("whatsapp");

  // Crimson text is allowed on paper (AA); the hairline underline marks a link
  const linkClass =
    "inline-flex min-h-11 items-center gap-2.5 text-body font-medium text-crimson underline decoration-crimson/30 underline-offset-4 transition-colors hover:decoration-crimson";

  return (
    <section id="faq" className="bg-paper py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16">
        {/* Heading + direct contact stay in view beside the list on wide
            screens, so the left column is not an empty block. */}
        <div className="lg:sticky lg:top-24 lg:col-span-5 lg:self-start">
          <SectionHeading tone="paper">{t("headline")}</SectionHeading>

          <div className="mt-8 hidden max-w-xs border-t border-bg/10 pt-6 lg:block">
            <p className="text-small text-bg/65">{tContact("subline")}</p>
            <ul className="mt-3 flex flex-col">
              <li>
                <a href={whatsappUrl(tWa("prefilled"))} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  <WhatsAppIcon className="size-[1.125rem]" />
                  {tContact("whatsapp")}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className={linkClass}>
                  <Mail size={18} aria-hidden="true" />
                  {/* Email stays left-to-right inside Arabic text */}
                  <span dir="ltr">{site.email}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Native <details>: keyboard and screen-reader friendly, no JS */}
        <div className="border-t border-bg/15 lg:col-span-7">
          {QUESTIONS.map((n) => (
            <details key={n} className="group border-b border-bg/15">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-[1.0625rem] font-medium leading-snug text-bg transition-colors hover:text-crimson group-open:text-crimson md:text-[1.125rem] [&::-webkit-details-marker]:hidden">
                {t(`q${n}`)}
                {/* Plus turns into a close mark when open */}
                <span
                  className="grid size-8 shrink-0 place-items-center rounded-full border border-bg/15 transition-[transform,background-color,color] duration-300 group-open:rotate-45 group-open:border-crimson group-open:bg-crimson group-open:text-text motion-reduce:transition-none"
                  aria-hidden="true"
                >
                  <Plus size={16} strokeWidth={2} />
                </span>
              </summary>
              {/* ~65 characters per line reads comfortably in both scripts */}
              <p className="max-w-[65ch] pb-7 pe-14 text-body text-bg/75">
                {t(`a${n}`)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
