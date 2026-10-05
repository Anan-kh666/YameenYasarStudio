import { useTranslations, useLocale } from "next-intl";
import { whatsappUrl } from "@/lib/site";

/* Inline WhatsApp icon — lucide doesn't carry brand icons */
function WaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
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
      className="relative flex min-h-[85vh] items-center overflow-hidden"
    >
      {/* Atmospheric background — logo glow video */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          src="/images/logo-glow.mp4"
          muted loop playsInline autoPlay preload="auto"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/60 to-transparent" />
      </div>

      {/* Aurora orbs */}
      <div className="hero-aurora" aria-hidden="true">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
      </div>

      {/* Decorative logo mark */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <img
          src="/brand/yy-mark-new.png"
          alt=""
          className="absolute top-1/2 end-[5%] h-[60%] w-auto -translate-y-1/2 opacity-[0.07]"
        />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="grid gap-4 md:grid-cols-2 md:items-end md:gap-8">
          <h1 className="font-heading text-h1 font-semibold leading-[1.2] text-text md:text-display hero-slide-start">
            {t("headline")}
          </h1>
          <p
            className="text-small text-text-muted md:justify-self-end md:self-end hero-slide-end"
            lang={otherLocale}
            dir={otherLocale === "ar" ? "rtl" : "ltr"}
          >
            {t("otherHeadline")}
          </p>
        </div>

        <p className="mt-6 max-w-xl text-body text-text-muted">
          {t("subline")}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-crimson px-6 py-3 text-body font-medium text-text transition-colors hover:bg-crimson/90"
          >
            <WaIcon className="size-5" />
            {t("ctaWhatsapp")}
          </a>
          <a
            href="#packages"
            className="inline-flex items-center rounded-xl border-2 border-crimson-bright px-6 py-3 text-body font-medium text-crimson-bright transition-colors hover:bg-surface"
          >
            {t("ctaPackages")}
          </a>
        </div>
      </div>
    </section>
  );
}
