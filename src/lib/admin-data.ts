import "server-only";
import { db } from "@/lib/db";
import type { PageKey } from "@/lib/data";
import type { MediaCategory } from "@prisma/client";

/**
 * Admin read layer — unlike src/lib/data.ts (public site), these return content
 * regardless of status, since Admin needs to see and manage inactive items too.
 */

export async function getDashboardStats() {
  const [productCount, activeVariantCount, faqCount, documentCount, enquiryCount] = await Promise.all([
    db.product.count({ where: { status: "active" } }),
    db.productVariant.count({ where: { status: "active" } }),
    db.fAQ.count({ where: { status: "active" } }),
    db.document.count({ where: { status: "active" } }),
    db.enquiry.count({ where: { status: "new" } }),
  ]);
  return { productCount, activeVariantCount, faqCount, documentCount, enquiryCount };
}

export async function listProductsAdmin() {
  return db.product.findMany({
    orderBy: { updatedAt: "desc" },
    include: { variants: true, images: true },
  });
}

export async function getProductAdmin(id: string) {
  return db.product.findUnique({
    where: { id },
    include: {
      variants: { orderBy: { sortOrder: "asc" } },
      images: { orderBy: { sortOrder: "asc" }, include: { media: true } },
    },
  });
}

export async function listFaqsAdmin() {
  return db.fAQ.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getFaqAdmin(id: string) {
  return db.fAQ.findUnique({ where: { id } });
}

export async function listMediaAdmin(category?: MediaCategory | "all") {
  return db.media.findMany({
    where: category && category !== "all" ? { category } : undefined,
    orderBy: { createdAt: "desc" },
  });
}

export async function listDocumentsAdmin() {
  return db.document.findMany({ orderBy: { createdAt: "desc" } });
}

export async function listPageSectionsAdmin(page: PageKey) {
  return db.pageSection.findMany({
    where: { page },
    orderBy: { sortOrder: "asc" },
    include: {
      media: { include: { media: true } },
      documents: { include: { document: true } },
    },
  });
}

export async function getBusinessSettingsAdmin() {
  return db.businessSettings.findFirst();
}
