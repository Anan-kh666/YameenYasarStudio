import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/* Required for output: 'export' — tells Next.js this route is fully static */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${site.url}/ar/`,
      alternates: {
        languages: { ar: `${site.url}/ar/`, en: `${site.url}/en/` },
      },
    },
    {
      url: `${site.url}/en/`,
      alternates: {
        languages: { ar: `${site.url}/ar/`, en: `${site.url}/en/` },
      },
    },
  ];
}
