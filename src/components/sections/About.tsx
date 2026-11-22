import { useTranslations } from "next-intl";
import SectionHeading from "@/components/ui/SectionHeading";
import SectionMarker from "@/components/ui/SectionMarker";

/* ID-card rows under the photo: facts already in the bio, nothing new */
const ID_ROWS = ["role", "based", "languages"] as const;

export default function About() {
  const t = useTranslations("about");

  return (
    <section id="about" className="bg-grid overflow-hidden bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-center md:gap-16 lg:gap-20">
          {/* ID card: the photo in a hairline passe-partout, then ruled
              label/value rows, all inside corner brackets, with a faint
              crimson light behind it. The photo is never cropped or flipped. */}
          <div className="frame-corners relative isolate mx-auto w-full max-w-sm text-text md:mx-0">
            <div className="absolute -inset-10 -z-10 rounded-full bg-crimson/15 blur-3xl" aria-hidden="true" />
            <div className="overflow-hidden rounded-[1.375rem] border border-line bg-linear-to-b from-text/[0.06] to-bg/40 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]">
              <div className="p-2">
                <img
                  src="/images/anan.jpg"
                  alt={t("photoAlt")}
                  width={640}
                  height={800}
                  // Below the fold: lazy, so React doesn't emit a <link rel=preload>
                  // for it in <head> and it doesn't compete with the hero.
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/5] w-full rounded-2xl object-cover"
                />
              </div>
              <dl className="meta-grid mt-1 grid-cols-2 border-b-0 bg-bg/40 [--meta-line:var(--line)]">
                <div className="col-span-2">
                  <dt className="meta-label">{t("id.name")}</dt>
                  <dd className="meta-value mt-1 text-text">{t("photoAlt")}</dd>
                </div>
                {ID_ROWS.map((row) => (
                  <div key={row} className={row === "languages" ? "col-span-2" : ""}>
                    <dt className="meta-label">{t(`id.${row}`)}</dt>
                    <dd className="meta-value mt-1 text-text">{t(`id.${row}Value`)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Text column is centred on the photo and kept together (heading,
              bio, quote), so no empty band opens between bio and quote. */}
          <div className="flex flex-col">
            <SectionMarker index={5} label={t("marker")} className="mb-6" />
            <SectionHeading>{t("headline")}</SectionHeading>
            <p className="mt-6 max-w-xl text-body text-text-muted">{t("bio")}</p>
            {/* The promise, set as a pull quote */}
            <div className="mt-10 border-t border-line pt-8 md:mt-12 md:pt-10">
              <p className="max-w-xl border-s-2 border-crimson-bright ps-5 font-heading text-h2 font-semibold text-text md:text-[1.75rem] md:leading-[1.3]">
                {t("closing")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
