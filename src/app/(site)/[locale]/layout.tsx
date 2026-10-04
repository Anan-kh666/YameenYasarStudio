import { Readex_Pro, Cormorant_Garamond, Tajawal } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale, getTranslations, getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { site } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/app/globals.css";
import type { Metadata } from "next";

/* Body/UI font — arabic + latin subsets */
const readexPro = Readex_Pro({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-readex-pro",
});

/* Headline fonts — Cormorant Garamond for Latin, Tajawal for Arabic.
   Tajawal gives Arabic a modern, clean feel vs the traditional Amiri serif.
   CSS switches between them via --font-heading-family in globals.css. */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
  variable: "--font-cormorant",
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-tajawal",
});

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
        "x-default": `${site.url}/`,
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
      images: [ogImage],
    },
  };
}

/* JSON-LD ProfessionalService — one per locale, embedded in the body */
function JsonLd({ locale }: { locale: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: locale === "ar" ? site.nameAr : site.name,
    url: `${site.url}/${locale}/`,
    email: site.email,
    areaServed: "Worldwide",
    description:
      locale === "ar"
        ? "مواقع وتطبيقات ويب بلغتين، بتصميم يمين لليسار حقيقي وخط عربي نظيف."
        : "Arabic and English websites with real right-to-left layouts and proper Arabic type.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className={`${readexPro.variable} ${cormorant.variable} ${tajawal.variable}`}>
      <body className="font-sans antialiased">
        {/* Moving wallpaper — subtle looping background pattern */}
        <div className="wallpaper" aria-hidden="true" />
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
