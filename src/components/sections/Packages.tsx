import { useTranslations } from "next-intl";
import { AppWindow, Bot, CalendarCheck, Check, Clock, Files, LayoutDashboard, PenLine, ShieldCheck, Sparkles } from "lucide-react";
import { site } from "@/lib/site";
import SectionHeading from "@/components/ui/SectionHeading";
import SectionMarker from "@/components/ui/SectionMarker";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

const TIERS = ["launch", "business", "custom"] as const;
const ADDONS = [
  { key: "monthlyCare", Icon: ShieldCheck },
  { key: "copywriting", Icon: PenLine },
] as const;
/* Custom tier's capabilities, in the order of custom.features
   (booking systems, dashboards, web apps, AI assistants). */
const CUSTOM_ICONS = [CalendarCheck, LayoutDashboard, AppWindow, Bot];

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

  return (
    <section id="packages" className="relative isolate overflow-hidden py-20 md:py-28">
      {/* Soft crimson light behind the featured card */}
      <div className="aurora pp-aurora absolute inset-x-0 top-1/3 -z-10 h-[36rem]" aria-hidden="true" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <SectionMarker label={t("marker")} className="mb-6" />
          <SectionHeading align="center">{t("headline")}</SectionHeading>

          {site.launchOffer && (
            <p className="pp-announce mt-8">
              <Sparkles size={16} className="shrink-0 text-crimson-bright" aria-hidden="true" />
              <span className="text-pretty">{t("launchOffer")}</span>
            </p>
          )}
        </div>

        {/* md and up: each card is a 5-row subgrid (name, price, chips,
            features, button), so prices, lists and buttons line up across all
            three cards. Order stays cheapest → most custom everywhere, so
            reading/focus order matches what you see. */}
        <div className="mt-14 grid gap-6 md:mt-20 md:grid-cols-3 md:grid-rows-[auto_auto_auto_1fr_auto] md:gap-y-0 lg:gap-x-8">
          {TIERS.map((tier) => {
            const isBusiness = tier === "business";
            const features = t.raw(`${tier}.features`) as string[];
            return (
              <div
                key={tier}
                className={`relative isolate flex flex-col p-6 text-text md:row-span-5 md:grid md:grid-rows-subgrid md:gap-0 md:p-7 ${
                  isBusiness ? "mt-3 md:mt-0" : "panel"
                }`}
              >
                {/* The featured card's frame reaches 1rem past the others from
                    lg (raised look) while its rows stay aligned with theirs. */}
                {isBusiness && <span className="pp-featured absolute inset-0 -z-10 lg:-inset-y-4" aria-hidden="true" />}

                <div>
                  {isBusiness && (
                    <span className="absolute -top-3 start-6 rounded-full bg-crimson px-3 py-1 text-label font-medium text-text shadow-[0_8px_24px_-8px_rgba(229,72,77,0.7)] md:start-7 lg:-top-7">
                      {t("business.badge")}
                    </span>
                  )}
                  <h3 className="font-heading text-[1.25rem] font-semibold leading-[1.3] text-text text-balance rtl:leading-[1.35]">
                    {t(`${tier}.name`)}
                  </h3>
                </div>

                <p className="mt-5 font-heading leading-none text-text">
                  <Price
                    value={t(`${tier}.price`)}
                    amountClass="text-[3rem] font-semibold lining-nums tabular-nums ltr:tracking-[-0.03em] md:text-[3.5rem]"
                    partClass="font-sans text-small font-medium text-text-muted"
                  />
                </p>

                {/* Delivery time and page count, from the copy */}
                <div className="mt-5 flex flex-wrap gap-2 text-text-muted">
                  <span className="chip">
                    <Clock size={13} aria-hidden="true" />
                    <span className="sr-only">{t("meta.duration")}: </span>
                    {t(`${tier}.duration`)}
                  </span>
                  {/* Custom says "by scope" for both; don't print it twice */}
                  {t(`${tier}.pages`) !== t(`${tier}.duration`) && (
                    <span className="chip">
                      <Files size={13} aria-hidden="true" />
                      {t("meta.pages")}: {t(`${tier}.pages`)}
                    </span>
                  )}
                </div>

                {tier === "custom" ? (
                  /* Custom tier: its capabilities as a compact icon grid */
                  <ul className="mt-6 grid grid-cols-2 gap-2 border-t border-line pt-6">
                    {features.map((feature, i) => {
                      const Icon = CUSTOM_ICONS[i] ?? Check;
                      return (
                        <li key={i} className="pp-cap">
                          <Icon size={18} className="text-crimson-bright" aria-hidden="true" />
                          {feature}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <ul className={`mt-6 space-y-3 border-t pt-6 ${isBusiness ? "border-crimson-bright/25" : "border-line"}`}>
                    {features.map((feature, i) => (
                      <li key={i} className={`flex items-start gap-3 text-small ${isBusiness ? "text-text" : "text-text-muted"}`}>
                        <Check
                          size={16}
                          strokeWidth={2.5}
                          className="mt-[0.2rem] shrink-0 text-crimson-bright"
                          aria-hidden="true"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Same WhatsApp chat as the hero, from every card. On md+ it
                    sits in the last subgrid row, so all three line up. */}
                <WhatsAppButton
                  label={tHero("ctaWhatsapp")}
                  variant={isBusiness ? "primary" : "secondary"}
                  className="mt-8 w-full self-end"
                />
              </div>
            );
          })}
        </div>

        {/* Add-ons: a slim row of two panels */}
        <div className="mt-16 md:mt-24">
          <h3 className="font-heading text-[1.25rem] font-semibold leading-[1.3] text-text rtl:leading-[1.35]">
            {t("addons.title")}
          </h3>
          <ul className="mt-5 grid gap-4 md:grid-cols-2">
            {ADDONS.map(({ key, Icon }) => (
              <li key={key} className="panel panel-bg grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 p-5 sm:grid-cols-[auto_1fr_auto]">
                <span className="icon-tile" aria-hidden="true">
                  <Icon size={20} />
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-text">{t(`addons.${key}.name`)}</p>
                  <p className="mt-0.5 text-small text-text-muted">{t(`addons.${key}.description`)}</p>
                </div>
                <p className="col-start-2 text-small sm:col-start-auto sm:text-end">
                  <Price
                    value={t(`addons.${key}.price`)}
                    amountClass="font-heading text-[1.5rem] font-semibold leading-none lining-nums text-text"
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
