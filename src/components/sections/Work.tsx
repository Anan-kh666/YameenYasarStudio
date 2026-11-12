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

        <div className="mt-12 grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
          {PROJECTS.map(({ key, image }, i) => {
            const large = i === 0;
            return (
              <article
                key={key}
                className={`group relative isolate flex flex-col justify-end overflow-hidden rounded-2xl border border-line bg-bg ${
                  large ? "min-h-[26rem] md:col-span-2 lg:row-span-2 lg:min-h-[36rem]" : "min-h-[21rem]"
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
                {/* Two fades keep text readable: a soft one at the top for the
                    status pill, a deeper one at the bottom for the caption. */}
                <div className="absolute inset-x-0 top-0 -z-10 h-28 bg-linear-to-b from-bg/70 to-transparent" aria-hidden="true" />
                <div className="absolute inset-x-0 bottom-0 -z-10 h-4/5 bg-linear-to-t from-bg from-15% via-bg/70 to-transparent" aria-hidden="true" />
                {/* Hairline inner frame with a faint top highlight, drawn above the image */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(245,242,237,0.08)] ring-1 ring-inset ring-text/5"
                  aria-hidden="true"
                />

                {/* One calm status pill per card (the concept tag moved into the caption) */}
                <span className="absolute end-4 top-4 inline-flex items-center gap-2 rounded-full border border-text/15 bg-bg/60 px-3 py-1 text-label text-text backdrop-blur-md">
                  <span className="size-1.5 rounded-full bg-crimson-bright" aria-hidden="true" />
                  {t("comingSoon")}
                </span>

                <div className={`p-6 ${large ? "md:p-9" : ""}`}>
                  <p className="text-label text-text-muted">{t(`${key}.tag`)}</p>
                  <h3 className={`mt-2 font-heading font-semibold text-text ${large ? "text-h2 md:text-h1" : "text-h2"}`}>
                    {t(`${key}.name`)}
                  </h3>
                  <p className={`mt-3 border-t border-text/10 pt-3 text-text-muted ${large ? "max-w-md text-body" : "text-small"}`}>
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
