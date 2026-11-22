import { useTranslations } from "next-intl";
import SectionHeading from "@/components/ui/SectionHeading";
import SectionMarker from "@/components/ui/SectionMarker";

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
  const tc = useTranslations("compile");

  return (
    <section id="work" className="bg-grid bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionMarker index={3} label={t("marker")} className="mb-6" />
        <SectionHeading>{t("headline")}</SectionHeading>

        {/* gap-6 leaves room for each tile's corner brackets (0.625rem outside) */}
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
          {PROJECTS.map(({ key, image }, i) => {
            const large = i === 0;
            return (
              /* The brackets sit on a wrapper: the tile itself clips its image */
              <div
                key={key}
                className={`frame-corners flex text-text ${
                  large ? "md:col-span-2 lg:row-span-2" : ""
                }`}
              >
              <article
                className={`work-tile group relative isolate flex w-full flex-col justify-end overflow-hidden rounded-2xl border border-line bg-bg ${
                  large ? "min-h-[26rem] lg:min-h-[36rem]" : "min-h-[21rem]"
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
                {/* Soft fade at the top for the project code; the caption below
                    carries its own scrim (.work-caption) so it reads cleanly
                    whatever part of the image sits behind it. */}
                <div className="absolute inset-x-0 top-0 -z-10 h-28 bg-linear-to-b from-bg/70 to-transparent" aria-hidden="true" />
                {/* Hairline inner frame with a faint top highlight, drawn above the image */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(245,242,237,0.08)] ring-1 ring-inset ring-text/5"
                  aria-hidden="true"
                />

                {/* Project code (W-01…): decorative, Western digits, never mirrored.
                    dir="ltr" goes on the inner span: on the positioned box it
                    would turn start-4 into "left" on /ar too. */}
                <span className="work-code absolute start-4 top-4" aria-hidden="true">
                  <span dir="ltr">W-{String(i + 1).padStart(2, "0")}</span>
                </span>

                <div className={`work-caption p-6 pt-20 ${large ? "md:p-9 md:pt-28" : ""}`}>
                  <h3 className={`font-heading font-semibold text-text ${large ? "text-h2 md:text-h1" : "text-h2"}`}>
                    {t(`${key}.name`)}
                  </h3>
                  <p className={`mt-3 text-text-muted ${large ? "max-w-md text-body" : "text-small"}`}>
                    {t(`${key}.description`)}
                  </p>
                  {/* Meta row: type / status (the "Coming soon" state) / locales */}
                  <dl className={`work-meta meta-grid mt-5 grid-cols-[minmax(0,1fr)_auto_auto] border-b-0 text-text ${large ? "md:max-w-lg" : ""}`}>
                    <div>
                      <dt className="meta-label">{t("metaType")}</dt>
                      <dd className="meta-value mt-1 text-text">{t(`${key}.tag`)}</dd>
                    </div>
                    <div>
                      <dt className="meta-label">{t("metaStatus")}</dt>
                      <dd className="meta-value mt-1 flex items-center gap-2 whitespace-nowrap text-text">
                        <span className="size-1.5 shrink-0 rounded-full bg-crimson-bright" aria-hidden="true" />
                        {t("comingSoon")}
                      </dd>
                    </div>
                    {/* Latin tokens as inline dir="ltr" spans: they keep the mono
                        face inside /ar while the cell still aligns to the right */}
                    <div>
                      <dt className="meta-label">
                        <span dir="ltr" className="mono-label">{tc("locale")}</span>
                      </dt>
                      <dd className="meta-value mt-1 whitespace-nowrap text-text">
                        <span dir="ltr" className="font-mono">ar · en</span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
