import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/og";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/api/og", "/api/markdown/"],
      disallow: ["/dashboard", "/og-preview", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
