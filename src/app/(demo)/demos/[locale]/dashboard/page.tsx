import type { Metadata } from "next";
import DemoBar from "@/components/demo/DemoBar";
import RasidApp from "@/demos/dashboard/RasidApp";
import { content } from "@/demos/dashboard/content";
import type { DemoLocale } from "@/demos/shared";
import "@/styles/demo-dashboard.css";

type Props = { params: Promise<{ locale: DemoLocale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: content[locale].meta.title, description: content[locale].meta.description };
}

export default async function DashboardDemo({ params }: Props) {
  const { locale } = await params;
  return (
    <>
      <DemoBar locale={locale} slug="dashboard" />
      <RasidApp locale={locale} />
    </>
  );
}
