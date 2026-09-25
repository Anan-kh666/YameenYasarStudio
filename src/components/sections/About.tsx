import { useTranslations } from "next-intl";

/*
 * About section.
 * Shows Anan's photo when public/images/anan.jpg exists.
 * Until then, shows the brand mark on a yameen-soft background.
 */

export default function About() {
  const t = useTranslations("about");

  return (
    <section id="about" className="bg-surface py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:items-center">
          {/* Photo / placeholder — never a stock photo or avatar illustration */}
          <div className="mx-auto w-full max-w-xs md:mx-0">
            <div className="flex aspect-square items-center justify-center rounded-2xl bg-yameen-soft">
              {/* TODO(anan): replace with <img src="/images/anan.jpg"> when photo is ready */}
              <img
                src="/brand/yy-mark.svg"
                alt=""
                className="h-16 w-auto opacity-30 dark:hidden"
                aria-hidden="true"
              />
              <img
                src="/brand/yy-mark-reversed.svg"
                alt=""
                className="hidden h-16 w-auto opacity-30 dark:block"
                aria-hidden="true"
              />
            </div>
          </div>

          <div>
            <h2 className="text-h2 font-semibold text-ink md:text-h1">
              {t("headline")}
            </h2>
            <p className="mt-4 text-body text-ink-muted">
              {t("bio")}
            </p>
            <p className="mt-4 text-body font-medium text-ink">
              {t("closing")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
