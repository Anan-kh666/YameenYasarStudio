import { useTranslations } from "next-intl";
import { site } from "@/lib/site";

const TIERS = ["launch", "business", "custom"] as const;

export default function Packages() {
  const t = useTranslations("packages");

  return (
    <section id="packages" className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-h2 font-semibold text-ink md:text-h1">
          {t("headline")}
        </h2>

        {/* Launch-offer banner — controlled by site.launchOffer flag */}
        {site.launchOffer && (
          <div className="mt-6 rounded-2xl bg-yasar-soft px-5 py-4 text-body text-yasar-ink">
            {t("launchOffer")}
          </div>
        )}

        {/* Package cards — Business visually emphasized */}
        <div className="mt-10 grid gap-6 md:grid-cols-3 md:items-start">
          {TIERS.map((tier) => {
            const isBusiness = tier === "business";
            return (
              <div
                key={tier}
                className={`relative rounded-2xl border px-5 py-6 ${
                  isBusiness
                    ? "border-yameen bg-yameen-soft"
                    : "border-line bg-surface"
                }`}
              >
                {/* "Most popular" badge — yasar fill + ink text per brand spec */}
                {isBusiness && (
                  <span className="absolute -top-3 inset-inline-start-5 rounded-full bg-yasar px-3 py-0.5 text-label font-medium text-ink">
                    {t("business.badge")}
                  </span>
                )}

                <h3 className="text-h2 font-semibold text-ink">
                  {t(`${tier}.name`)}
                </h3>

                <p className="mt-1 text-body font-semibold text-yameen">
                  {t(`${tier}.price`)}
                </p>
                <p className="text-small text-ink-muted">
                  {t(`${tier}.duration`)}
                </p>

                {/* Features — stored as arrays in messages/*.json */}
                <ul className="mt-4 space-y-2">
                  {(t.raw(`${tier}.features`) as string[]).map((feature, i) => (
                    <li
                      key={i}
                      className="text-small text-ink-muted before:me-2 before:text-yameen before:content-['✓']"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Add-ons */}
        <div className="mt-12">
          <h3 className="text-body font-semibold text-ink">
            {t("addons.title")}
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {(["monthlyCare", "copywriting"] as const).map((addon) => (
              <div
                key={addon}
                className="rounded-2xl border border-line bg-surface px-5 py-4"
              >
                <p className="text-body font-medium text-ink">
                  {t(`addons.${addon}.name`)}
                  <span className="ms-2 text-small text-yameen">
                    {t(`addons.${addon}.price`)}
                  </span>
                </p>
                <p className="mt-1 text-small text-ink-muted">
                  {t(`addons.${addon}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
