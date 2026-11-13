import { useTranslations } from "next-intl";
import { Check, Clock, Sparkles, Wrench, PenLine } from "lucide-react";
import { site, whatsappUrl } from "@/lib/site";
import SectionHeading from "@/components/ui/SectionHeading";
import { WhatsAppIcon } from "@/components/ui/WhatsAppButton";

const TIERS = ["launch", "business", "custom"] as const;
const ADDONS = [
  { key: "monthlyCare", Icon: Wrench },
  { key: "copywriting", Icon: PenLine },
] as const;

/* Shows a price string exactly as written in the messages, but styles its
   parts: "from 1,500 USD" → small "from", large "1,500", small "USD".
   A Latin currency ("300 USD") is wrapped in dir="ltr": inside Arabic text
   the bidi algorithm would otherwise display it as "USD 300". */
function Price({
  value,
  amountClass,
  partClass,
}: {
  value: string;
  amountClass: string;
  partClass: string;
}) {
  const m = value.match(/^(.*?)(\d[\d,.]*)(\s*)(\S*)(.*)$/);
  if (!m) return <>{value}</>;
  const [, before, amount, space, unit, after] = m;
  return (
    <>
      {before && <span className={partClass}>{before}</span>}
      <span dir={/[A-Za-z]/.test(unit) ? "ltr" : undefined}>
        <span className={amountClass}>{amount}</span>
        {space}
        {unit && <span className={partClass}>{unit}</span>}
      </span>
      {after && <span className={partClass}>{after}</span>}
    </>
  );
}

export default function Packages() {
  const t = useTranslations("packages");
  const tHero = useTranslations("hero");
  const tWa = useTranslations("whatsapp");
  const waHref = whatsappUrl(tWa("prefilled"));

  return (
    <section id="packages" className="section-glow py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading>{t("headline")}</SectionHeading>

          {site.launchOffer && (
            <p className="inline-flex max-w-sm items-start gap-3 self-start rounded-2xl border border-crimson-bright/25 bg-[linear-gradient(135deg,rgba(139,13,26,0.32),rgba(139,13,26,0.08))] px-4 py-3 text-small text-text md:self-end">
              <Sparkles size={17} className="mt-[0.2rem] shrink-0 text-crimson-bright" aria-hidden="true" />
              <span className="text-balance">{t("launchOffer")}</span>
            </p>
          )}
        </div>

        {/* md and up: each card is a 4-row subgrid (name, price, features,
            button), so prices, lists and buttons line up across all three
            cards whatever the name or list length. Order stays cheapest →
            most custom on every screen size, so reading/focus order matches
            what you see; the featured card stands out by border, glow,
            badge and the one filled button instead. */}
        <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-3 md:grid-rows-[auto_auto_1fr_auto] md:gap-y-0">
          {TIERS.map((tier) => {
            const isBusiness = tier === "business";
            return (
              <div
                key={tier}
                className={`relative isolate flex flex-col rounded-2xl px-6 py-8 md:row-span-4 md:grid md:grid-rows-subgrid md:gap-0 md:px-7 ${
                  isBusiness ? "mt-3 md:mt-0" : "border border-line bg-surface shadow-[inset_0_1px_0_rgba(245,242,237,0.04)]"
                }`}
              >
                {/* The featured card's frame reaches 1rem past the others on
                    md+ (taller look) while its rows stay aligned with them. */}
                {isBusiness && (
                  <span
                    className="pkg-featured absolute inset-0 -z-10 rounded-2xl border border-crimson-bright md:-inset-y-4"
                    aria-hidden="true"
                  />
                )}

                {/* "Most popular" badge — crimson fill, light text */}
                {isBusiness && (
                  <span className="absolute -top-3.5 start-6 rounded-full bg-crimson px-3.5 py-1 text-label font-medium text-text shadow-[0_8px_24px_-8px_rgba(229,72,77,0.7)] md:-top-[1.875rem] md:start-7">
                    {t("business.badge")}
                  </span>
                )}

                <div>
                  <h3 className="font-heading text-h2 font-semibold text-text">
                    {t(`${tier}.name`)}
                  </h3>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-small text-text-muted">
                    <Clock size={15} aria-hidden="true" />
                    {t(`${tier}.duration`)}
                  </p>
                </div>

                <p
                  className={`mt-7 border-b pb-7 font-heading leading-none ${
                    isBusiness ? "border-crimson-bright/25 text-crimson-bright" : "border-line text-text"
                  }`}
                >
                  <Price
                    value={t(`${tier}.price`)}
                    amountClass="text-[2.75rem] font-semibold lining-nums tabular-nums"
                    partClass="font-sans text-small font-medium text-text-muted"
                  />
                </p>

                <ul className="mt-7 space-y-3.5">
                  {(t.raw(`${tier}.features`) as string[]).map((feature, i) => (
                    <li
                      key={i}
                      className={`flex items-start gap-3 text-small ${isBusiness ? "text-text/90" : "text-text-muted"}`}
                    >
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

                {/* Same WhatsApp chat as the hero, from every card.
                    On md+ it sits in the last subgrid row, so all three line up. */}
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 self-end rounded-xl px-5 py-3 text-small font-medium transition-colors md:mt-10 ${
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

        {/* Add-ons as a short price list: title on the reading side, each
            add-on a row with its price at the end (like a menu). */}
        <div className="mt-20 grid gap-6 md:mt-24 md:grid-cols-12 md:gap-8">
          <h3 className="font-heading text-h2 font-semibold text-text md:col-span-3 md:pt-6">
            {t("addons.title")}
          </h3>
          <ul className="divide-y divide-line rounded-2xl border border-line bg-surface/70 md:col-span-9">
            {ADDONS.map(({ key, Icon }) => (
              <li key={key} className="flex items-start gap-4 px-5 py-6 md:items-center md:gap-5 md:px-7">
                <span
                  className="grid size-10 shrink-0 place-items-center rounded-xl border border-crimson-bright/20 bg-crimson/15 text-crimson-bright"
                  aria-hidden="true"
                >
                  <Icon size={19} strokeWidth={1.75} />
                </span>
                <div className="min-w-0 flex-1 md:flex md:items-center md:justify-between md:gap-8">
                  <div className="min-w-0">
                    <p className="text-body font-medium text-text">{t(`addons.${key}.name`)}</p>
                    <p className="mt-0.5 text-small text-text-muted">{t(`addons.${key}.description`)}</p>
                  </div>
                  <p className="mt-2 shrink-0 text-small md:mt-0">
                    <Price
                      value={t(`addons.${key}.price`)}
                      amountClass="font-heading text-[1.5rem] font-semibold leading-none lining-nums text-text"
                      partClass="text-text-muted"
                    />
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
