import type { BusinessSettings } from "@prisma/client";
import type { ProductWithRelations } from "@/lib/types";
import { getPrimaryProductImage } from "@/lib/types";

/**
 * Builds schema.org LocalBusiness structured data from BusinessSettings.
 * Only includes fields that are actually configured — never fabricates
 * a phone number, rating, or social profile that hasn't been set in Admin.
 *
 * Uses the generic "LocalBusiness" type rather than "FoodEstablishment" — Kapila Dairy
 * Farm is a manufacturer/wholesaler/retailer of packaged ghee (per its FSSAI license),
 * not a dine-in food service business, so "FoodEstablishment" would misrepresent it.
 */
export function buildLocalBusinessJsonLd(settings: BusinessSettings | null, siteUrl: string) {
  if (!settings) return null;

  const sameAs = [settings.instagram, settings.facebook].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: settings.businessName,
    url: siteUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressRegion: "Gujarat",
      addressCountry: "IN",
    },
    ...(settings.phone ? { telephone: settings.phone } : {}),
    ...(settings.email ? { email: settings.email } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

/**
 * Builds schema.org Product structured data for a product detail page.
 *
 * Deliberately omits `offers` (price/availability) and `aggregateRating`/`review` —
 * this is a showcase site, not e-commerce (docs/future-ecommerce.md), and there is no
 * real pricing or review data to report. Fabricating either would violate Google's
 * structured-data guidelines and this project's content-accuracy rules alike.
 */
export function buildProductJsonLd(product: ProductWithRelations, siteUrl: string) {
  const image = getPrimaryProductImage(product);
  const brandName = "Kapila Dairy Farm";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    url: `${siteUrl}/our-ghee`,
    brand: { "@type": "Brand", name: brandName },
    ...(image ? { image: `${siteUrl}${image.url}` } : {}),
  };
}
