import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale, getTranslations, getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { site } from "@/lib/site";
import { fontVariableClass } from "@/lib/fonts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/app/globals.css";
import type { Metadata } from "next";

/* Only these namespaces are read by client components (Header, Logo and
   WhatsAppButton inside it, LanguageSwitch, Contact). Server components get
   every message on the server, so the rest never has to ship to the browser. */
const CLIENT_NAMESPACES = ["nav", "header", "languageSwitch", "whatsapp", "contact"] as const;

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

/* Required for static export — tells Next.js which locale pages to generate. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const otherLocale = locale === "ar" ? "en" : "ar";

  const ogImage = `${site.url}/og-${locale}.png`;

  return {
    title: t("title"),
    description: t("description"),
    icons: {
      icon: "/brand/favicon-512.png",
      apple: "/brand/favicon-512.png",
    },
    alternates: {
      canonical: `${site.url}/${locale}/`,
      languages: {
        ar: `${site.url}/ar/`,
        en: `${site.url}/en/`,
        // x-default points at the default locale, not "/": the intro at "/" is
        // noindex, and an hreflang target that can't be indexed is ignored.
        "x-default": `${site.url}/ar/`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${site.url}/${locale}/`,
      siteName: site.name,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      alternateLocale: otherLocale === "ar" ? "ar_SA" : "en_US",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: t("title") }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [{ url: ogImage, alt: t("title") }],
    },
  };
}

/* JSON-LD ProfessionalService — one per locale, embedded in the body */
function JsonLd({ locale }: { locale: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${site.url}/#studio`,
    name: locale === "ar" ? site.nameAr : site.name,
    alternateName: locale === "ar" ? site.name : site.nameAr,
    url: `${site.url}/${locale}/`,
    inLanguage: locale,
    logo: `${site.url}/brand/favicon-512.png`,
    image: `${site.url}/og-${locale}.png`,
    email: site.email,
    // LinkedIn is left out until site.linkedin is verified (TODO in site.ts).
    sameAs: [site.instagram],
    knowsLanguage: ["ar", "en"],
    areaServed: "Worldwide",
    description:
      locale === "ar"
        ? "مواقع وتطبيقات ويب بلغتين، بتصميم يمين لليسار حقيقي وخط عربي نظيف."
        : "Arabic and English websites with real right-to-left layouts and proper Arabic type.",
  };

  return (
    <script
      type="application/ld+json"
      // Escape "<" so no value can ever close this <script> tag early
      // (the pattern the Next.js JSON-LD guide recommends).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
    />
  );
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const allMessages = await getMessages();
  const messages = Object.fromEntries(CLIENT_NAMESPACES.map((ns) => [ns, allMessages[ns]]));
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className={fontVariableClass}>
      <body className="font-sans antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          {children}
          <Footer />
        </NextIntlClientProvider>
        <JsonLd locale={locale} />
      </body>
    </html>
  );
}
