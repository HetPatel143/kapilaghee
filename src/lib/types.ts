import type { Prisma } from "@prisma/client";

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    variants: true;
    images: { include: { media: true } };
  };
}>;

export type PageSectionWithRelations = Prisma.PageSectionGetPayload<{
  include: {
    media: { include: { media: true } };
    documents: { include: { document: true } };
  };
}>;

/**
 * The primary product image is simply the first one by sort order — Admin sets this by
 * reordering images (see ProductImageManager), the same way it controls every other
 * ordered list in the CMS (variants, FAQs, process steps).
 */
export function getPrimaryProductImage(product: ProductWithRelations) {
  if (product.images.length === 0) return null;
  return product.images[0].media;
}

export function findSection(sections: PageSectionWithRelations[], key: string) {
  return sections.find((s) => s.key === key) ?? null;
}
