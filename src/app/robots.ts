import type { MetadataRoute } from "next";

const siteUrl = process.env.SITE_URL ?? "https://www.kapiladairyfarm.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/admin"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
