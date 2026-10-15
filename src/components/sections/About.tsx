import { useTranslations } from "next-intl";
import SectionHeading from "@/components/ui/SectionHeading";

export default function About() {
  const t = useTranslations("about");

  return (
    <section id="about" className="overflow-hidden bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
          {/* Photo with an offset crimson frame behind it. The frame moves
              toward the reading end (mirrored in RTL); the photo never flips. */}
          <div className="relative isolate mx-auto w-full max-w-sm md:mx-0">
            <div
              className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl border border-crimson-bright/50 rtl:-translate-x-3"
              aria-hidden="true"
            />
            <div className="absolute -inset-8 -z-10 rounded-full bg-crimson/20 blur-3xl" aria-hidden="true" />
            <img
              src="/images/anan.jpg"
              alt={t("headline")}
              className="relative aspect-[4/5] w-full rounded-2xl object-cover"
            />
          </div>

          <div>
            <SectionHeading>{t("headline")}</SectionHeading>
            <p className="mt-6 text-body text-text-muted">{t("bio")}</p>
            {/* The promise, set as a pull quote */}
            <p className="mt-8 border-s-2 border-crimson-bright ps-5 font-heading text-h2 font-semibold text-text">
              {t("closing")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
