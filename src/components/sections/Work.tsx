import { useTranslations } from "next-intl";
import SectionHeading from "@/components/ui/SectionHeading";
import SectionMarker from "@/components/ui/SectionMarker";

/* Concept projects with mood images (Higgsfield GPT Image 2.5). The images
   hold no text on purpose: AI-drawn Arabic letters come out broken.
   `url` only decorates the browser bar (aria-hidden), it is not a real link.
   The first project is the large tile of the bento grid. */
const PROJECTS = [
  { key: "onlineStore", image: "/images/work/store.jpg", url: "store.yameenyasar.com" },
  { key: "clinic", image: "/images/work/clinic.jpg", url: "clinic.yameenyasar.com" },
  { key: "saas", image: "/images/work/saas.jpg", url: "product.yameenyasar.com" },
] as const;

export default function Work() {
  const t = useTranslations("work");

  return (
    <section id="work" className="bg-dots bg-surface py-20 text-text md:py-28">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionMarker label={t("marker")} className="mb-6" />
        <SectionHeading>{t("headline")}</SectionHeading>

        {/* Bento from lg: the first case study takes two columns and both rows */}
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 lg:gap-6">
          {PROJECTS.map(({ key, image, url }, i) => {
            const large = i === 0;
            return (
              <article
                key={key}
                className={`panel panel-bg window group flex flex-col ${
                  large ? "md:col-span-2 lg:row-span-2" : ""
                }`}
              >
                <div className="window-bar" aria-hidden="true">
                  <span className="window-url" dir="ltr">{url}</span>
                </div>
                {/* Decorative mood image: the text below names the project */}
                <div className={`relative overflow-hidden ${large ? "aspect-[16/10] lg:aspect-auto lg:flex-1" : "aspect-[16/10]"}`}>
                  <img
                    src={image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                  />
                </div>
                <div className={`border-t border-line p-5 ${large ? "md:p-7" : ""}`}>
                  <div className="flex flex-wrap items-center gap-2 text-text-muted">
                    <span className="chip">{t(`${key}.tag`)}</span>
                    <span className="chip wk-soon">{t("comingSoon")}</span>
                  </div>
                  <h3 className={`mt-4 font-heading font-semibold text-text ${large ? "text-h2 md:text-[1.75rem] md:leading-9" : "text-h2"}`}>
                    {t(`${key}.name`)}
                  </h3>
                  <p className={`mt-2 text-text-muted ${large ? "max-w-lg text-body" : "text-small"}`}>
                    {t(`${key}.description`)}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
