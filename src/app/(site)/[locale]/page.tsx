import { setRequestLocale } from "next-intl/server";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import Packages from "@/components/sections/Packages";
import Work from "@/components/sections/Work";
import Process from "@/components/sections/Process";
import About from "@/components/sections/About";
import Faq from "@/components/sections/Faq";
import Contact from "@/components/sections/Contact";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main id="main">
      <Hero />
      <Problem />
      <Packages />
      <Work />
      <Process />
      <About />
      <Faq />
      <Contact />
    </main>
  );
}
