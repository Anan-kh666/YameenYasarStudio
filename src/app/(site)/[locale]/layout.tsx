import { Readex_Pro } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale, getTranslations, getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import "@/app/globals.css";
import type { Metadata } from "next";

const readexPro = Readex_Pro({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-sans",
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

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/`,
      languages: {
        ar: "/ar/",
        en: "/en/",
        "x-default": "/",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      locale: locale === "ar" ? "ar_SA" : "en_US",
      alternateLocale: otherLocale === "ar" ? "ar_SA" : "en_US",
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className={readexPro.variable}>
      <body className="font-sans antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
