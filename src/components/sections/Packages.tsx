import { useTranslations } from "next-intl";
import { site } from "@/lib/site";

const TIERS = ["launch", "business", "custom"] as const;

export default function Packages() {
  const t = useTranslations("packages");

  return (
    <section id="packages" className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-heading text-h2 font-semibold text-text md:text-h1">
          {t("headline")}
        </h2>

        {site.launchOffer && (
          <div className="mt-6 rounded-2xl bg-surface px-5 py-4 text-body text-crimson-bright">
            {t("launchOffer")}
          </div>
        )}

        <div className="mt-10 grid gap-6 md:grid-cols-3 md:items-start">
          {TIERS.map((tier) => {
            const isBusiness = tier === "business";
            return (
              <div
                key={tier}
                className={`relative rounded-2xl border px-5 py-6 ${
                  isBusiness
                    ? "border-crimson-bright bg-surface"
                    : "border-line bg-surface"
                }`}
              >
                {/* "Most popular" badge — crimson fill, light text */}
                {isBusiness && (
                  <span className="absolute -top-3 inset-inline-start-5 rounded-full bg-crimson px-3 py-0.5 text-label font-medium text-text">
                    {t("business.badge")}
                  </span>
                )}

                <h3 className="font-heading text-h2 font-semibold text-text">
                  {t(`${tier}.name`)}
                </h3>

                <p className="mt-1 text-body font-semibold text-crimson-bright">
                  {t(`${tier}.price`)}
                </p>
                <p className="text-small text-text-muted">
                  {t(`${tier}.duration`)}
                </p>

                <ul className="mt-4 space-y-2">
                  {(t.raw(`${tier}.features`) as string[]).map((feature, i) => (
                    <li
                      key={i}
                      className="text-small text-text-muted before:me-2 before:text-crimson-bright before:content-['✓']"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-12">
          <h3 className="text-body font-semibold text-text">
            {t("addons.title")}
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {(["monthlyCare", "copywriting"] as const).map((addon) => (
              <div
                key={addon}
                className="rounded-2xl border border-line bg-surface px-5 py-4"
              >
                <p className="text-body font-medium text-text">
                  {t(`addons.${addon}.name`)}
                  <span className="ms-2 text-small text-crimson-bright">
                    {t(`addons.${addon}.price`)}
                  </span>
                </p>
                <p className="mt-1 text-small text-text-muted">
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
