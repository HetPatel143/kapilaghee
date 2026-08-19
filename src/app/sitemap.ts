import type { MetadataRoute } from "next";

const siteUrl = process.env.SITE_URL ?? "https://www.kapiladairyfarm.com";

export default function sitemap(): MetadataRoute.Sitemap {
  // /our-ghee/[slug] now redirects to /our-ghee (single combined product page — see that
  // route's page.tsx), so there are no separate per-product URLs to list here.
  const staticRoutes = [
    "",
    "/our-ghee",
    "/our-story",
    "/our-process",
    "/quality",
    "/contact",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  return staticRoutes;
}
