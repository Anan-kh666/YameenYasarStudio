import { useTranslations, useLocale } from "next-intl";
import { Check, Clock, Sparkles, Wrench, PenLine } from "lucide-react";
import { site, whatsappUrl } from "@/lib/site";
import SectionHeading from "@/components/ui/SectionHeading";
import { WhatsAppIcon } from "@/components/ui/WhatsAppButton";

const TIERS = ["launch", "business", "custom"] as const;
const ADDONS = [
  { key: "monthlyCare", Icon: Wrench },
  { key: "copywriting", Icon: PenLine },
] as const;

export default function Packages() {
  const t = useTranslations("packages");
  const tHero = useTranslations("hero");
  const tWa = useTranslations("whatsapp");
  const locale = useLocale();
  const waHref = whatsappUrl(locale, tWa("prefilled"));

  return (
    <section id="packages" className="section-glow py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading>{t("headline")}</SectionHeading>

        {site.launchOffer && (
          <p className="mt-8 inline-flex items-start gap-2.5 rounded-2xl border border-crimson-bright/30 bg-crimson/15 px-4 py-2.5 text-small text-text">
            <Sparkles size={18} className="mt-0.5 shrink-0 text-crimson-bright" aria-hidden="true" />
            {t("launchOffer")}
          </p>
        )}

        {/* The featured card sits slightly taller (md:-my-4) so the middle
            option reads first, without any animation. */}
        <div className="mt-14 grid gap-6 md:grid-cols-3 md:items-stretch">
          {TIERS.map((tier) => {
            const isBusiness = tier === "business";
            return (
              <div
                key={tier}
                className={`relative flex flex-col rounded-2xl border px-6 py-8 ${
                  isBusiness ? "pkg-featured border-crimson-bright md:-my-4 md:py-12" : "border-line bg-surface"
                }`}
              >
                {/* "Most popular" badge — crimson fill, light text */}
                {isBusiness && (
                  <span className="absolute -top-3.5 start-6 rounded-full bg-crimson px-3.5 py-1 text-label font-medium text-text shadow-[0_8px_24px_-8px_rgba(229,72,77,0.7)]">
                    {t("business.badge")}
                  </span>
                )}

                <h3 className="font-heading text-h2 font-semibold text-text">
                  {t(`${tier}.name`)}
                </h3>
                <p className="mt-2 inline-flex items-center gap-1.5 text-small text-text-muted">
                  <Clock size={15} aria-hidden="true" />
                  {t(`${tier}.duration`)}
                </p>

                <p
                  className={`mt-6 font-heading text-[2.25rem] font-semibold leading-none lining-nums ${
                    isBusiness ? "text-crimson-bright" : "text-text"
                  }`}
                >
                  {t(`${tier}.price`)}
                </p>

                <div className="my-7 h-px bg-line" aria-hidden="true" />

                <ul className="space-y-3">
                  {(t.raw(`${tier}.features`) as string[]).map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-small text-text-muted">
                      <span
                        className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${
                          isBusiness ? "bg-crimson text-text" : "bg-crimson/20 text-crimson-bright"
                        }`}
                        aria-hidden="true"
                      >
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Pushes the button to the bottom so all three line up */}
                <div className="min-h-8 flex-1" aria-hidden="true" />

                {/* Same WhatsApp chat as the hero, from every card */}
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-small font-medium transition-colors ${
                    isBusiness
                      ? "hero-cta bg-crimson text-text hover:bg-crimson/90"
                      : "border border-line text-text hover:border-crimson-bright hover:text-crimson-bright"
                  }`}
                >
                  <WhatsAppIcon className="size-4" />
                  {tHero("ctaWhatsapp")}
                </a>
              </div>
            );
          })}
        </div>

        <div className="mt-16">
          <h3 className="font-heading text-h2 font-semibold text-text">
            {t("addons.title")}
          </h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {ADDONS.map(({ key, Icon }) => (
              <div key={key} className="flex items-start gap-4 rounded-2xl border border-line bg-surface px-5 py-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-crimson/20 text-crimson-bright" aria-hidden="true">
                  <Icon size={19} strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                  <p className="text-body font-medium text-text">{t(`addons.${key}.name`)}</p>
                  <p className="mt-0.5 text-small font-medium text-crimson-bright">{t(`addons.${key}.price`)}</p>
                  <p className="mt-1.5 text-small text-text-muted">{t(`addons.${key}.description`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
