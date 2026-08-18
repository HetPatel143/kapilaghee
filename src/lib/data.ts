import { db } from "@/lib/db";

/**
 * Data access layer — the single place public pages read content from.
 *
 * This implements the "Public APIs" read contract documented in docs/architecture.md §6
 * as direct server-side data-access functions (Server Components call these directly),
 * rather than as literal HTTP round-trips within the same app. The contract — which
 * fields are returned, and that only active/published content is ever surfaced — is
 * what matters and is preserved here so a future standalone API/mobile client could be
 * built against the same shape without changing these functions' behavior.
 *
 * No page component queries Prisma directly — everything goes through here.
 */

export async function getBusinessSettings() {
  return db.businessSettings.findFirst();
}

export async function getActiveProducts() {
  return db.product.findMany({
    where: { status: "active" },
    orderBy: { createdAt: "asc" },
    include: {
      variants: {
        where: { status: "active" },
        orderBy: { sortOrder: "asc" },
      },
      images: {
        orderBy: { sortOrder: "asc" },
        include: { media: true },
      },
    },
  });
}

export async function getProductBySlug(slug: string) {
  return db.product.findFirst({
    where: { slug, status: "active" },
    include: {
      variants: {
        where: { status: "active" },
        orderBy: { sortOrder: "asc" },
      },
      images: {
        orderBy: { sortOrder: "asc" },
        include: { media: true },
      },
    },
  });
}

export async function getVariantById(id: string) {
  return db.productVariant.findUnique({ where: { id }, include: { product: true } });
}

export async function getActiveFaqs() {
  return db.fAQ.findMany({
    where: { status: "active" },
    orderBy: { sortOrder: "asc" },
  });
}

export type PageKey = "home" | "story" | "process" | "quality";

export async function getPageSections(page: PageKey) {
  return db.pageSection.findMany({
    where: { page, status: "active" },
    orderBy: { sortOrder: "asc" },
    include: {
      media: {
        orderBy: { sortOrder: "asc" },
        include: { media: true },
      },
      documents: {
        orderBy: { sortOrder: "asc" },
        include: { document: true },
      },
    },
  });
}

export async function getPageSection(page: PageKey, key: string) {
  return db.pageSection.findFirst({
    where: { page, key, status: "active" },
    include: {
      media: {
        orderBy: { sortOrder: "asc" },
        include: { media: true },
      },
      documents: {
        orderBy: { sortOrder: "asc" },
        include: { document: true },
      },
    },
  });
}
