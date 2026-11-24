import { useTranslations, useLocale } from "next-intl";
import { CalendarCheck, BarChart3 } from "lucide-react";
import { whatsappUrl } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/WhatsAppButton";
import SectionMarker from "@/components/ui/SectionMarker";

/* Stats strip: only facts already stated elsewhere in the copy
   (packages.launch price/duration, contact.subline reply time) */
const STATS = ["languages", "days", "price", "reply"] as const;

/* Decorative chart bars (percent heights), not data */
const BARS = [38, 54, 46, 70, 62, 84, 76];

/* Split on spaces only, never inside a word, so Arabic letters stay joined.
   Each word gets an index for its staggered entrance (see .hx-word). */
function Words({ text }: { text: string }) {
  return text.split(" ").map((word, i, all) => (
    <span key={i}>
      <span className="hx-word" style={{ "--i": i } as React.CSSProperties}>{word}</span>
      {i < all.length - 1 ? " " : null}
    </span>
  ));
}

/* Product mockup: a browser window showing a bilingual site, with a booking
   card and a small dashboard card over its edges. Purely decorative. */
function HeroMock() {
  const m = useTranslations("hero.mock");
  const locale = useLocale();

  return (
    <div className="hx-mock relative mx-auto w-full max-w-xl sm:pt-14 lg:max-w-none" aria-hidden="true">
      <div className="panel window hx-window">
        <div className="window-bar">
          <span className="window-url" dir="ltr">{m("url")}</span>
        </div>

        {/* The mock site keeps a physical layout on every page: English on the
            left, Arabic on the right, the brand's "left meets right". */}
        <div dir="ltr">
          <div className="flex items-center justify-between gap-3 border-b border-line/70 px-4 py-3 sm:px-5">
            <span className="hx-skel h-2.5 w-12" />
            <span className="hx-toggle">
              <span lang="en" className={locale === "en" ? "is-on" : ""}>{m("langEn")}</span>
              <span lang="ar" className={locale === "ar" ? "is-on" : ""}>{m("langAr")}</span>
            </span>
            <span className="flex gap-2">
              <span className="hx-skel h-2 w-7" />
              <span className="hx-skel h-2 w-7" />
            </span>
          </div>

          <div className="grid grid-cols-2">
            {(["en", "ar"] as const).map((code) => (
              <div
                key={code}
                lang={code}
                dir={code === "ar" ? "rtl" : "ltr"}
                className={`hx-pane p-4 sm:p-6 ${code === "en" ? "border-e border-line/70" : ""}`}
              >
                <p className="font-heading text-[1.0625rem] font-semibold leading-tight text-text sm:text-[1.375rem]">
                  {code === "ar" ? m("sampleAr") : m("sampleEn")}
                </p>
                <span className="hx-skel mt-3 block h-2 w-[85%]" />
                <span className="hx-skel mt-2 block h-2 w-[60%]" />
                <span className="hx-mock-btn mt-4">{code === "ar" ? m("ctaAr") : m("ctaEn")}</span>
                <span className={`hx-media mt-4 block h-16 sm:h-24 ${code === "ar" ? "hx-media-ar" : ""}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating cards follow the page direction: booking at the bottom
          start corner, the chart above the top end corner (the wrapper's top
          padding leaves it room, so it covers only the window bar). */}
      <div className="hx-float hx-float-a panel absolute -bottom-8 -start-6 hidden w-max items-center gap-3 p-3.5 sm:flex">
        <span className="icon-tile">
          <CalendarCheck size={20} />
        </span>
        <span>
          <span className="block whitespace-nowrap text-small font-medium text-text">{m("booking")}</span>
          <span className="hx-skel mt-1.5 block h-2 w-20" />
        </span>
        <span className="chip chip-live text-text-muted">{m("bookingStatus")}</span>
      </div>

      <div className="hx-float hx-float-b panel absolute -end-5 top-0 hidden w-48 p-4 sm:block">
        <span className="flex items-center gap-2 text-small font-medium text-text">
          <BarChart3 size={16} className="text-crimson-bright" />
          {m("chart")}
        </span>
        <span className="mt-0.5 block text-label text-text-muted">{m("chartPeriod")}</span>
        {/* Bars grow from the reading start, so the row follows the page direction */}
        <span className="mt-3 flex h-12 items-end gap-1.5">
          {BARS.map((h, i) => (
            <span
              key={i}
              className="hx-bar flex-1"
              style={{ height: `${h}%`, "--i": i } as React.CSSProperties}
            />
          ))}
        </span>
      </div>
    </div>
  );
}

export default function Hero() {
  const t = useTranslations("hero");
  const tWa = useTranslations("whatsapp");
  const locale = useLocale();
  const otherLocale = locale === "ar" ? "en" : "ar";
  const waHref = whatsappUrl(tWa("prefilled"));

  return (
    <section id="hero" className="hx-hero bg-dots relative isolate overflow-hidden text-text">
      {/* Crimson light behind the mockup side, and a fade into the next section */}
      <div className="aurora hx-aurora absolute inset-0" aria-hidden="true" />
      <div className="hx-fade absolute inset-x-0 bottom-0 h-40" aria-hidden="true" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-16 px-4 pb-16 pt-12 sm:px-6 md:pt-20 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:pb-20 lg:pt-24 xl:gap-20">
        <div className="min-w-0">
          <div className="hx-rise" style={{ "--d": "0s" } as React.CSSProperties}>
            <SectionMarker label={t("marker")} />
          </div>

          <h1 className="hx-title font-heading mt-6 text-balance text-text">
            {/* Screen readers get the sentence once; the animated words are hidden from them. */}
            <span className="sr-only">{t("headline")}</span>
            <span aria-hidden="true">
              <Words text={t("headline")} />
            </span>
          </h1>

          {/* The other language, small, under the headline. The <p> follows the
              page (so it aligns to the reading start); the span carries the
              other language's lang/dir and its own heading font. */}
          <p className="hx-rise mt-4" style={{ "--d": "0.45s" } as React.CSSProperties}>
            <span
              lang={otherLocale}
              dir={otherLocale === "ar" ? "rtl" : "ltr"}
              className="font-heading text-[1.125rem] font-medium leading-snug text-text/60 md:text-[1.375rem]"
            >
              {t("otherHeadline")}
            </span>
          </p>

          <p className="hx-rise mt-6 max-w-xl text-body text-text-muted md:text-[1.125rem] md:leading-8" style={{ "--d": "0.55s" } as React.CSSProperties}>
            {t("subline")}
          </p>

          <div className="hx-rise mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center" style={{ "--d": "0.65s" } as React.CSSProperties}>
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary hx-btn">
              <WhatsAppIcon />
              {t("ctaWhatsapp")}
            </a>
            <a href="#packages" className="btn btn-secondary hx-btn text-text">
              {t("ctaPackages")}
            </a>
          </div>
        </div>

        <div className="hx-rise min-w-0 sm:px-6 lg:px-0" style={{ "--d": "0.35s" } as React.CSSProperties}>
          <HeroMock />
        </div>
      </div>

      {/* Stats strip: hairline-divided cells; label first in the DOM so a
          screen reader hears "Starting price: 300 USD" */}
      <div className="hx-rise relative mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 md:pb-20" style={{ "--d": "0.8s" } as React.CSSProperties}>
        <dl className="hx-stats grid grid-cols-2 md:grid-cols-4">
          {STATS.map((key) => (
            <div key={key} className="hx-stat flex flex-col-reverse justify-end p-5 md:p-6">
              <dt className="mt-2 text-small text-text-muted">{t(`stats.${key}.label`)}</dt>
              <dd dir="auto" className="text-[1.75rem] font-semibold leading-none tabular-nums text-text md:text-[2rem]">
                {t(`stats.${key}.value`)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
