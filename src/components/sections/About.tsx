import { useTranslations } from "next-intl";

export default function About() {
  const t = useTranslations("about");

  return (
    <section id="about" className="bg-surface py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:items-center">
          <div className="mx-auto w-full max-w-xs md:mx-0">
            <img
              src="/images/anan.jpg"
              alt={t("headline")}
              className="aspect-square w-full rounded-2xl object-cover"
            />
          </div>

          <div>
            <h2 className="font-heading text-h2 font-semibold text-text md:text-h1">
              {t("headline")}
            </h2>
            <p className="mt-4 text-body text-text-muted">
              {t("bio")}
            </p>
            <p className="mt-4 text-body font-medium text-text">
              {t("closing")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
