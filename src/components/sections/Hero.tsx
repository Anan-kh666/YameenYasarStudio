import { useTranslations, useLocale } from "next-intl";
import { whatsappUrl } from "@/lib/site";
import HeroFx from "@/components/HeroFx";
import { WhatsAppIcon } from "@/components/ui/WhatsAppButton";

/* Split on spaces only, never inside a word, so Arabic letters stay joined.
   Each word gets an index for its staggered entrance (see .hero-word). */
function Words({ text }: { text: string }) {
  return text.split(" ").map((word, i, all) => (
    <span key={i}>
      <span className="hero-word" style={{ "--i": i } as React.CSSProperties}>{word}</span>
      {i < all.length - 1 ? " " : null}
    </span>
  ));
}

export default function Hero() {
  const t = useTranslations("hero");
  const tWa = useTranslations("whatsapp");
  const locale = useLocale();
  const otherLocale = locale === "ar" ? "en" : "ar";
  const waHref = whatsappUrl(tWa("prefilled"));

  return (
    <section
      id="hero"
      className="hero relative isolate flex min-h-[calc(100svh-4rem)] items-center overflow-hidden"
    >
      {/* Silk-ribbon loop (generated with Higgsfield/Kling): crimson and
          silver light meeting in the middle. Same file the intro uses. */}
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <video
          className="hero-silk"
          src="/images/ambient-silk.mp4"
          poster="/images/ambient-silk-poster.jpg"
          muted loop playsInline autoPlay preload="auto"
        />
        <div className="hero-shade" />
      </div>

      <HeroFx />

      <div className="hero-content relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end md:gap-10">
          <h1 className="font-heading text-balance text-h1 font-semibold leading-[1.15] text-text md:text-display lg:text-[4.5rem] lg:leading-[1.08]">
            {/* Screen readers get the sentence once; the animated words are hidden from them. */}
            <span className="sr-only">{t("headline")}</span>
            <span aria-hidden="true">
              <Words text={t("headline")} />
            </span>
          </h1>
          <p
            className="hero-other text-small text-text-muted md:justify-self-end md:pb-3"
            lang={otherLocale}
            dir={otherLocale === "ar" ? "rtl" : "ltr"}
          >
            {t("otherHeadline")}
          </p>
        </div>

        <div className="hero-line mt-8" aria-hidden="true" />

        <p className="hero-rise mt-8 max-w-xl text-body text-text-muted" style={{ "--d": "0.75s" } as React.CSSProperties}>
          {t("subline")}
        </p>

        <div className="hero-rise mt-8 flex flex-wrap items-center gap-3" style={{ "--d": "0.9s" } as React.CSSProperties}>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-cta inline-flex items-center gap-2 rounded-xl bg-crimson px-6 py-3 text-body font-medium text-text transition-[background-color,box-shadow] hover:bg-crimson/90"
          >
            <WhatsAppIcon className="size-5" />
            {t("ctaWhatsapp")}
          </a>
          <a
            href="#packages"
            className="inline-flex items-center rounded-xl border-2 border-crimson-bright px-6 py-3 text-body font-medium text-crimson-bright backdrop-blur-sm transition-colors hover:bg-surface"
          >
            {t("ctaPackages")}
          </a>
        </div>
      </div>
    </section>
  );
}
