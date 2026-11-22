import { useTranslations, useLocale } from "next-intl";
import { whatsappUrl } from "@/lib/site";
import HeroFx from "@/components/HeroFx";
import { WhatsAppIcon } from "@/components/ui/WhatsAppButton";
import SectionMarker from "@/components/ui/SectionMarker";

/* Stats strip: only facts already stated elsewhere in the copy
   (packages.launch price/duration, contact.subline reply time) */
const STATS = ["languages", "days", "price", "reply"] as const;

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
  const tc = useTranslations("compile");
  const tWa = useTranslations("whatsapp");
  const locale = useLocale();
  const otherLocale = locale === "ar" ? "en" : "ar";
  const waHref = whatsappUrl(tWa("prefilled"));
  // Spec card rows are always Arabic first, then English, whatever the page
  const headlines = {
    ar: locale === "ar" ? t("headline") : t("otherHeadline"),
    en: locale === "en" ? t("headline") : t("otherHeadline"),
  };

  return (
    <section
      id="hero"
      /* Fills the screen under the sticky header (h-16, md:h-[4.25rem]); svh so
         iOS Safari's collapsing toolbar doesn't make it jump. */
      className="hero bg-grid relative isolate flex min-h-[calc(100svh-4rem)] flex-col overflow-hidden md:min-h-[calc(100svh-4.25rem)]"
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

      <div className="hero-content relative mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-4 pb-12 pt-10 sm:px-6 md:pb-10 lg:grid-cols-[minmax(0,1fr)_19rem] xl:gap-16">
        <div className="min-w-0">
          <div className="hero-rise mb-7" style={{ "--d": "0.1s" } as React.CSSProperties}>
            <SectionMarker index={0} label={t("marker")} />
          </div>

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
          <div className="mt-7 flex items-center gap-5 md:gap-8">
            <div className="hero-line min-w-8 flex-1" aria-hidden="true" />
            <p
              className="hero-other font-heading max-w-[80%] text-[1.25rem] leading-snug font-semibold text-text/80 md:max-w-none md:text-[2rem]"
              lang={otherLocale}
              dir={otherLocale === "ar" ? "rtl" : "ltr"}
            >
              {t("otherHeadline")}
            </p>
          </div>

          <p className="hero-rise mt-8 max-w-xl text-body text-text-muted md:text-[1.1875rem] md:leading-8" style={{ "--d": "0.75s" } as React.CSSProperties}>
            {t("subline")}
          </p>

          <div className="hero-rise mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center" style={{ "--d": "0.9s" } as React.CSSProperties}>
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

        </div>

        {/* Spec card (lg+), on the side opposite the headline: the same
            headline "compiled" for both locales, then a build bar filled from
            both ends. A visual echo of the intro, so hidden from screen
            readers (both headlines are already on the page). */}
        <div className="hero-spec frame-corners hidden text-text lg:block" aria-hidden="true">
          <div className="border border-line bg-bg/55 backdrop-blur-md">
            <p className="mono-label mono-muted px-5 py-3.5">{t("specTitle")}</p>
            <div className="meta-grid">
              {(["ar", "en"] as const).map((code) => (
                <div key={code} className="px-5 py-4">
                  <p dir="ltr" className="meta-label normal-case tracking-[0.08em]">
                    {tc("locale")} <span className="text-text">{code}</span> · {tc("dir")}{" "}
                    <span className="text-text">{code === "ar" ? "rtl" : "ltr"}</span>
                  </p>
                  <p
                    lang={code}
                    dir={code === "ar" ? "rtl" : "ltr"}
                    className="mt-2.5 font-heading text-[1.5rem] font-semibold leading-snug text-text"
                  >
                    {headlines[code]}
                  </p>
                </div>
              ))}
            </div>
            <div className="px-5 pb-4 pt-3.5">
              <p className="meta-label">{tc("build")}</p>
              <div dir="ltr" className="mt-3 flex bg-line/60">
                <span className="build-half build-half-latin" />
                <span className="build-half build-half-arabic" />
              </div>
              <p dir="ltr" className="meta-value mt-2 flex justify-between text-[0.75rem] text-text-muted">
                <span>100%</span>
                <span lang="ar" className="font-sans text-crimson-bright">١٠٠٪</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats strip: hairline-divided cells; label first in the DOM so a
          screen reader hears "Starting price: 300 USD" */}
      <div className="hero-rise relative mx-auto w-full max-w-6xl px-4 sm:px-6" style={{ "--d": "1.05s" } as React.CSSProperties}>
        <dl className="meta-grid hero-stats grid-cols-2 border-b-0 md:grid-cols-4">
          {STATS.map((key) => (
            <div key={key} className="flex flex-col-reverse justify-end">
              <dt className="mt-2 text-small text-text-muted">{t(`stats.${key}.label`)}</dt>
              <dd dir="auto" className="text-[1.875rem] font-medium leading-none tabular-nums text-text md:text-[2.125rem]">
                {t(`stats.${key}.value`)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
