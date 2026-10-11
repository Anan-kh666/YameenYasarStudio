import { useTranslations, useLocale } from "next-intl";
import { whatsappUrl } from "@/lib/site";
import HeroFx from "@/components/HeroFx";

/* Inline WhatsApp icon — lucide doesn't carry brand icons */
function WaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

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
  const waHref = whatsappUrl(locale, tWa("prefilled"));

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
            <WaIcon className="size-5" />
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
