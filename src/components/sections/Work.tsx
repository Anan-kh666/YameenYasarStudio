import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import SectionMarker from "@/components/ui/SectionMarker";

/* Six live concept demos (/demos/<locale>/<slug>/). Screenshots come from
   `npm run shoot:demos` (public/images/work/<slug>-<locale>.webp, and
   -m.webp for the phone). `url` only decorates the browser bar (aria-hidden).
   `large` cards take two columns and two rows on lg; the order below plus
   grid-flow-dense makes the bento: large | 2 small, then 2 small | large. */
const PROJECTS = [
  { slug: "store", url: "lamsa.ae", large: true },
  { slug: "restaurant", url: "sumac.jo", large: false },
  { slug: "clinic", url: "basma.sa", large: false },
  { slug: "dashboard", url: "app.rasid.io", large: true },
  { slug: "realestate", url: "manzil.om", large: false },
  { slug: "academy", url: "qalam.academy", large: false },
] as const;

export default function Work() {
  const t = useTranslations("work");
  const locale = useLocale();

  return (
    <section id="work" className="bg-dots bg-surface py-20 text-text md:py-28">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionMarker label={t("marker")} className="mb-6" />
        <SectionHeading>{t("headline")}</SectionHeading>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-flow-dense lg:grid-cols-3 lg:gap-6">
          {PROJECTS.map(({ slug, url, large }, i) => (
            <a
              key={slug}
              href={`/demos/${locale}/${slug}/`}
              // Short link name (brand + "View live demo"); the rest is the description
              aria-labelledby={`wk-${slug}-name wk-${slug}-cta`}
              aria-describedby={`wk-${slug}-desc`}
              className={`panel panel-bg window lift wk-card group flex flex-col ${
                large ? `md:col-span-2 lg:row-span-2 ${i > 0 ? "lg:col-start-2" : ""}` : ""
              }`}
            >
              <div className="window-bar" aria-hidden="true">
                <span className="window-url" dir="ltr">{url}</span>
              </div>
              {/* Decorative screenshots: the text below names the project */}
              <div className={`wk-shot relative ${large ? "aspect-[16/10] lg:aspect-auto lg:min-h-80 lg:flex-1" : "aspect-[16/10]"}`}>
                <img
                  src={`/images/work/${slug}-${locale}.webp`}
                  alt=""
                  width={1440}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
                {large && (
                  <div className="wk-phone">
                    <img
                      src={`/images/work/${slug}-${locale}-m.webp`}
                      alt=""
                      width={390}
                      height={844}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                )}
              </div>
              {/* Small cards: text fills the rest so the CTAs line up; large cards: the image does */}
              <div className={`flex flex-col border-t border-line p-5 ${large ? "md:p-7" : "flex-1"}`}>
                <div className="flex flex-wrap items-center gap-2 text-text-muted">
                  <span className="chip">{t(`${slug}.type`)}</span>
                  <span className="chip wk-concept">{t("conceptTag")}</span>
                </div>
                <h3
                  id={`wk-${slug}-name`}
                  className={`mt-4 font-heading font-semibold text-text ${large ? "text-h2 md:text-[1.75rem] md:leading-9" : "text-h2"}`}
                >
                  {t(`${slug}.name`)}
                </h3>
                <p id={`wk-${slug}-desc`} className={`mt-2 text-text-muted ${large ? "max-w-lg text-body" : "text-small"}`}>
                  {t(`${slug}.description`)}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2 text-text-muted">
                  {(t.raw(`${slug}.features`) as string[]).map((f) => (
                    <li key={f} className="chip">{f}</li>
                  ))}
                </ul>
                <span
                  id={`wk-${slug}-cta`}
                  className="mt-auto inline-flex items-center gap-2 pt-5 text-small font-medium text-crimson-bright"
                >
                  {t("viewDemo")}
                  <ArrowRight aria-hidden="true" className="h-4 w-4 rtl:-scale-x-100" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
