import type { MetadataRoute } from "next";
import { getActiveProducts } from "@/lib/data";

const siteUrl = process.env.SITE_URL ?? "https://www.kapiladairyfarm.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getActiveProducts();

  const staticRoutes = [
    "",
    "/our-ghee",
    "/our-story",
    "/our-process",
    "/quality",
    "/faq",
    "/contact",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const productRoutes = products.map((product) => ({
    url: `${siteUrl}/our-ghee/${product.slug}`,
    lastModified: product.updatedAt,
  }));

  return [...staticRoutes, ...productRoutes];
}
