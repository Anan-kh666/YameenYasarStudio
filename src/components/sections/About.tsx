import { useTranslations } from "next-intl";
import { BadgeCheck, Languages, MapPin, User, type LucideIcon } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import SectionMarker from "@/components/ui/SectionMarker";

/* Founder card rows: facts already in the bio, nothing new.
   The name row reuses photoAlt (the founder's name in each locale). */
const ROWS: { key: "name" | "role" | "based" | "languages"; icon: LucideIcon }[] = [
  { key: "name", icon: User },
  { key: "role", icon: BadgeCheck },
  { key: "based", icon: MapPin },
  { key: "languages", icon: Languages },
];

export default function About() {
  const t = useTranslations("about");

  return (
    <section id="about" className="overflow-hidden bg-surface py-20 text-text md:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-center md:gap-16 lg:gap-20">
        {/* Founder card: photo framed in a panel, then icon rows.
            The photo is never cropped differently or flipped. */}
        <div className="relative isolate mx-auto w-full max-w-sm md:mx-0">
          <div className="aurora absolute -inset-12 -z-10 opacity-70" aria-hidden="true" />
          <div className="panel panel-bg p-2">
            <img
              src="/images/anan.jpg"
              alt={t("photoAlt")}
              width={640}
              height={800}
              // Below the fold: lazy, so React doesn't emit a <link rel=preload>
              // for it in <head> and it doesn't compete with the hero.
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] w-full rounded-xl object-cover"
            />
            <dl className="ab-rows mt-2 px-3 pb-1">
              {ROWS.map(({ key, icon: Icon }) => (
                <div key={key} className="flex items-center gap-3 py-3">
                  <Icon size={18} strokeWidth={1.75} aria-hidden="true" className="shrink-0 text-crimson-bright" />
                  <dt className="text-small text-text-muted">{t(`id.${key}`)}</dt>
                  <dd className="ms-auto text-end text-small font-medium text-text">
                    {key === "name" ? t("photoAlt") : t(`id.${key}Value`)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="flex flex-col">
          <SectionMarker label={t("marker")} className="mb-6 self-start" />
          <SectionHeading>{t("headline")}</SectionHeading>
          <p className="mt-6 max-w-xl text-body text-text-muted">{t("bio")}</p>
          {/* The promise, set as a pull quote */}
          <figure className="panel mt-10 max-w-xl p-6 md:mt-12 md:p-8">
            <blockquote className="border-s-2 border-crimson-bright ps-5 font-heading text-h2 font-semibold text-text md:text-[1.625rem] md:leading-[1.35]">
              {t("closing")}
            </blockquote>
          </figure>
        </div>
      </div>
    </section>
  );
}
