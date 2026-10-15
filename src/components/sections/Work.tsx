import { useTranslations } from "next-intl";
import SectionHeading from "@/components/ui/SectionHeading";

/* Concept projects with mood images (Higgsfield GPT Image 2.5). The images
   hold no text on purpose: AI-drawn Arabic letters come out broken.
   The first project is the large tile of the grid. */
const PROJECTS = [
  { key: "onlineStore", image: "/images/work/store.jpg" },
  { key: "clinic", image: "/images/work/clinic.jpg" },
  { key: "saas", image: "/images/work/saas.jpg" },
] as const;

export default function Work() {
  const t = useTranslations("work");

  return (
    <section id="work" className="bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading>{t("headline")}</SectionHeading>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
          {PROJECTS.map(({ key, image }, i) => {
            const large = i === 0;
            return (
              <article
                key={key}
                className={`group relative isolate flex flex-col justify-end overflow-hidden rounded-2xl border border-line bg-bg ${
                  large ? "min-h-[24rem] md:col-span-2 lg:row-span-2 lg:min-h-[34rem]" : "min-h-[20rem]"
                }`}
              >
                {/* Decorative mood image: the text below names the project */}
                <img
                  src={image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                />
                {/* Dark fade so the text over the image stays readable */}
                <div className="absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-gradient-to-t from-bg via-bg/60 to-transparent" aria-hidden="true" />

                <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-3">
                  <span className="rounded-full border border-text/15 bg-bg/70 px-3 py-1 text-label text-text-muted backdrop-blur-md">
                    {t(`${key}.tag`)}
                  </span>
                  <span className="rounded-full bg-crimson px-3 py-1 text-label font-medium text-text">
                    {t("comingSoon")}
                  </span>
                </div>

                <div className={`p-6 ${large ? "md:p-8" : ""}`}>
                  <h3 className={`font-heading font-semibold text-text ${large ? "text-h2 md:text-h1" : "text-h2"}`}>
                    {t(`${key}.name`)}
                  </h3>
                  <p className={`mt-2 text-text-muted ${large ? "max-w-md text-body" : "text-small"}`}>
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
