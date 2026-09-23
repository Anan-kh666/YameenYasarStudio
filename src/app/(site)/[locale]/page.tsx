import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <Content />;
}

/* Client-boundary-free component that uses translations. */
function Content() {
  const t = useTranslations("hero");

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-semibold leading-tight">{t("headline")}</h1>
        <p className="mt-4 text-lg leading-relaxed text-neutral-600">
          {t("subline")}
        </p>
      </div>
    </main>
  );
}
