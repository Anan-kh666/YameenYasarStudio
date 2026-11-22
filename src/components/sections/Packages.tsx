import { useTranslations } from "next-intl";
import { Check, Sparkles } from "lucide-react";
import { site, whatsappUrl } from "@/lib/site";
import SectionHeading from "@/components/ui/SectionHeading";
import SectionMarker from "@/components/ui/SectionMarker";
import { WhatsAppIcon } from "@/components/ui/WhatsAppButton";

const TIERS = ["launch", "business", "custom"] as const;
/* Decorative spec codes (Western digits in both locales): P-01… per tier,
   A-01… per add-on, in the same order as the lists. */
const ADDONS = ["monthlyCare", "copywriting"] as const;
const code = (letter: string, i: number) => `${letter}-${String(i + 1).padStart(2, "0")}`;

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
          <div>
            <SectionMarker index={2} label={t("marker")} className="mb-6" />
            <SectionHeading>{t("headline")}</SectionHeading>
          </div>

          {site.launchOffer && (
            <p className="inline-flex max-w-sm items-start gap-3 self-start rounded-2xl border border-crimson-bright/25 bg-[linear-gradient(135deg,rgba(139,13,26,0.32),rgba(139,13,26,0.08))] px-4 py-3 text-small text-text md:self-end">
              <Sparkles size={17} className="mt-[0.2rem] shrink-0 text-crimson-bright" aria-hidden="true" />
              <span className="text-balance">{t("launchOffer")}</span>
            </p>
          )}
        </div>

        {/* md and up: each card is a 5-row subgrid (name, price, spec rows,
            features, button), so prices, specs, lists and buttons line up across all three
            cards whatever the name or list length. Order stays cheapest →
            most custom on every screen size, so reading/focus order matches
            what you see; the featured card stands out by border, glow,
            badge and the one filled button instead. */}
        <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-3 md:grid-rows-[auto_auto_auto_1fr_auto] md:gap-y-0">
          {TIERS.map((tier, i) => {
            const isBusiness = tier === "business";
            return (
              <div
                key={tier}
                className={`relative isolate flex flex-col rounded-2xl px-6 py-8 text-text md:row-span-5 md:grid md:grid-rows-subgrid md:gap-0 md:px-7 ${
                  isBusiness ? "mt-3 md:mt-0" : "border border-line bg-surface shadow-[inset_0_1px_0_rgba(245,242,237,0.04)]"
                }`}
              >
                {/* The featured card's frame reaches 1rem past the others on
                    md+ (taller look) while its rows stay aligned with them.
                    Its corner brackets sit on that frame (the `absolute`
                    utility wins over .frame-corners' position: relative). */}
                {isBusiness && (
                  <span
                    className="pkg-featured frame-corners absolute inset-0 -z-10 rounded-2xl border border-crimson-bright [--corner-color:var(--crimson-bright)] md:-inset-y-4"
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
                  {/* dir="ltr" keeps the code in mono; w-fit lets it sit on the reading side */}
                  <p
                    dir="ltr"
                    className={`mono-label w-fit ${isBusiness ? "text-crimson-bright" : "mono-muted"}`}
                    aria-hidden="true"
                  >
                    {code("P", i)}
                  </p>
                  <h3 className="mt-3 font-heading text-[1.625rem] font-semibold leading-[1.2] text-text text-balance rtl:leading-[1.35]">
                    {t(`${tier}.name`)}
                  </h3>
                </div>

                <p
                  className={`mt-6 pb-6 font-heading leading-none ${
                    isBusiness ? "text-crimson-bright" : "text-text"
                  }`}
                >
                  <Price
                    value={t(`${tier}.price`)}
                    amountClass="text-[3.25rem] font-semibold tracking-[-0.01em] lining-nums tabular-nums md:text-[3.75rem]"
                    partClass="font-sans text-small font-medium text-text-muted"
                  />
                </p>

                {/* Spec rows: delivery time and page count, from the copy */}
                <dl className={`meta-grid grid-cols-2 ${isBusiness ? "[--meta-line:rgba(229,72,77,0.3)]" : "[--meta-line:var(--line)]"}`}>
                  {(["duration", "pages"] as const).map((field) => (
                    <div key={field} className="py-3.5 first:ps-0 last:pe-0">
                      <dt className="meta-label">{t(`meta.${field}`)}</dt>
                      <dd className="meta-value mt-1.5 text-text">{t(`${tier}.${field}`)}</dd>
                    </div>
                  ))}
                </dl>

                <ul className="mt-3 divide-y divide-line/70">
                  {(t.raw(`${tier}.features`) as string[]).map((feature, i) => (
                    <li
                      key={i}
                      className={`flex items-start gap-3 py-3 text-small ${isBusiness ? "text-text" : "text-text-muted"}`}
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

        {/* Add-ons as a ruled spec list: title on the reading side, each
            add-on a row of code, name + description, and price at the end. */}
        <div className="mt-20 grid gap-6 md:mt-24 md:grid-cols-12 md:gap-8">
          <h3 className="font-heading text-[1.875rem] font-semibold leading-[1.2] text-text md:col-span-3 md:pt-5 rtl:leading-[1.35]">
            {t("addons.title")}
          </h3>
          <ul className="meta-grid text-text [--meta-line:var(--line)] md:col-span-9">
            {ADDONS.map((key, i) => (
              <li
                key={key}
                className="spec-row grid grid-cols-[3.25rem_1fr] gap-x-4 px-0 py-6 sm:grid-cols-[4rem_1fr_auto] sm:items-baseline sm:gap-x-6 md:px-4"
              >
                <span dir="ltr" className="mono-label mono-muted justify-self-start" aria-hidden="true">
                  {code("A", i)}
                </span>
                <div className="min-w-0">
                  <p className="font-heading text-[1.375rem] font-semibold leading-[1.25] text-text rtl:leading-[1.35]">{t(`addons.${key}.name`)}</p>
                  <p className="mt-1 text-small text-text-muted">{t(`addons.${key}.description`)}</p>
                </div>
                <p className="col-start-2 mt-3 text-small sm:col-start-auto sm:mt-0 sm:text-end">
                  <Price
                    value={t(`addons.${key}.price`)}
                    amountClass="font-heading text-[2rem] font-semibold leading-none lining-nums text-text"
                    partClass="text-text-muted"
                  />
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
