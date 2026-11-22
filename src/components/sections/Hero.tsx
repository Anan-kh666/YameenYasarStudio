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
      /* Fills the screen under the sticky header (h-16, md:h-[4.25rem]); svh so
         iOS Safari's collapsing toolbar doesn't make it jump. */
      className="hero relative isolate flex min-h-[calc(100svh-4rem)] flex-col overflow-hidden md:min-h-[calc(100svh-4.25rem)]"
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

      <div className="hero-content relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 pb-28 pt-12 sm:px-6 md:pb-32 md:pt-16">
        <h1 className="hero-title font-heading text-balance font-semibold text-text">
          {/* Screen readers get the sentence once; the animated words are hidden from them. */}
          <span className="sr-only">{t("headline")}</span>
          <span aria-hidden="true">
            <Words text={t("headline")} />
          </span>
        </h1>

        {/* "Two languages meeting": a line drawn from the reading side runs
            into the other language's headline on the opposite side. The row
            follows the page direction; the <p> has its own lang/dir, so its
            natural start alignment lands on the page's end side when it wraps. */}
        <div className="mt-7 flex items-center gap-5 md:mt-9 md:gap-8">
          <div className="hero-line min-w-8 flex-1" aria-hidden="true" />
          <p
            className="hero-other font-heading max-w-[80%] text-[1.25rem] leading-snug font-semibold text-text/80 md:max-w-none md:text-[2rem]"
            lang={otherLocale}
            dir={otherLocale === "ar" ? "rtl" : "ltr"}
          >
            {t("otherHeadline")}
          </p>
        </div>

        <p className="hero-rise mt-10 max-w-xl text-body text-text-muted md:mt-12 md:text-[1.1875rem] md:leading-8" style={{ "--d": "0.75s" } as React.CSSProperties}>
          {t("subline")}
        </p>

        <div className="hero-rise mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center" style={{ "--d": "0.9s" } as React.CSSProperties}>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-hero hero-cta"
          >
            <WhatsAppIcon />
            {t("ctaWhatsapp")}
          </a>
          <a href="#packages" className="btn btn-secondary btn-hero text-text">
            {t("ctaPackages")}
          </a>
        </div>

        {/* Decorative scroll cue, centred so it never needs mirroring */}
        <span className="hero-cue" aria-hidden="true" />
      </div>
    </section>
  );
}
