import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/* Required for output: 'export' — tells Next.js this route is fully static */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
