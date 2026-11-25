import { demoBarCopy, type DemoLocale } from "@/demos/shared";

/* Thin studio strip on top of every demo: says it is a concept, links back to
   the studio's Work section and to the same demo in the other language.
   Server component, plain links: switching language is a full page load,
   like the main site, because <html dir> is set on the server. */
export default function DemoBar({ locale, slug }: { locale: DemoLocale; slug: string }) {
  const t = demoBarCopy[locale];
  const other = locale === "ar" ? "en" : "ar";
  return (
    <div className="demo-bar">
      <p className="demo-bar-label">
        {t.label} <a href={`/${locale}/`}>{t.studio}</a>
      </p>
      <nav className="demo-bar-links">
        <a href={`/${locale}/#work`}>{t.back}</a>
        <a href={`/demos/${other}/${slug}/`} lang={other} hrefLang={other}>{t.other}</a>
      </nav>
    </div>
  );
}
