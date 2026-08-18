"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdminSessionOrThrow } from "@/lib/auth/session";
import { productBasicInfoSchema, variantSchema } from "@/lib/validation/admin";
import { saveUpload, deleteUpload, UploadValidationError } from "@/lib/storage";
import { revalidateProductPages } from "@/lib/revalidate";

export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

function fieldErrorsFrom(error: import("zod").ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

// ---------- Product basic info ----------

export async function createProduct(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdminSessionOrThrow();

  const parsed = productBasicInfoSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    status: formData.get("status") ?? "active",
  });

  if (!parsed.success) {
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error) };
  }

  const existing = await db.product.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return { status: "error", message: "A product with this slug already exists.", fieldErrors: { slug: "This slug is already in use." } };
  }

  const product = await db.product.create({ data: parsed.data });
  revalidateProductPages(product.slug);
  redirect(`/admin/products/${product.id}/edit`);
}

export async function updateProduct(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdminSessionOrThrow();
  const id = String(formData.get("id") ?? "");

  const parsed = productBasicInfoSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    status: formData.get("status") ?? "active",
  });

  if (!parsed.success) {
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error) };
  }

  const conflict = await db.product.findFirst({ where: { slug: parsed.data.slug, NOT: { id } } });
  if (conflict) {
    return { status: "error", message: "A product with this slug already exists.", fieldErrors: { slug: "This slug is already in use." } };
  }

  const previous = await db.product.findUnique({ where: { id } });
  await db.product.update({ where: { id }, data: parsed.data });

  revalidateProductPages(parsed.data.slug);
  if (previous && previous.slug !== parsed.data.slug) revalidateProductPages(previous.slug);

  return { status: "success", message: "Product details saved." };
}

export async function setProductStatus(status: "active" | "inactive", formData: FormData) {
  await requireAdminSessionOrThrow();
  const id = String(formData.get("id") ?? "");

  const product = await db.product.update({ where: { id }, data: { status } });
  revalidateProductPages(product.slug);
}

// ---------- Variants ----------

export async function addVariant(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdminSessionOrThrow();
  const productId = String(formData.get("productId") ?? "");

  const parsed = variantSchema.safeParse({
    size: formData.get("size"),
    unit: formData.get("unit"),
    status: formData.get("status") ?? "active",
  });

  if (!parsed.success) {
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error) };
  }

  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product) return { status: "error", message: "Product not found." };

  const maxSort = await db.productVariant.aggregate({ where: { productId }, _max: { sortOrder: true } });

  await db.productVariant.create({
    data: { ...parsed.data, productId, sortOrder: (maxSort._max.sortOrder ?? -1) + 1 },
  });

  revalidateProductPages(product.slug);
  return { status: "success", message: "Size added." };
}

export async function updateVariant(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdminSessionOrThrow();
  const id = String(formData.get("id") ?? "");

  const parsed = variantSchema.safeParse({
    size: formData.get("size"),
    unit: formData.get("unit"),
    status: formData.get("status") ?? "active",
  });

  if (!parsed.success) {
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error) };
  }

  const variant = await db.productVariant.update({ where: { id }, data: parsed.data, include: { product: true } });
  revalidateProductPages(variant.product.slug);
  return { status: "success", message: "Size updated." };
}

export async function setVariantStatus(status: "active" | "inactive", formData: FormData) {
  await requireAdminSessionOrThrow();
  const id = String(formData.get("id") ?? "");

  const variant = await db.productVariant.update({ where: { id }, data: { status }, include: { product: true } });
  revalidateProductPages(variant.product.slug);
}

export async function reorderVariant(direction: "up" | "down", formData: FormData) {
  await requireAdminSessionOrThrow();
  const id = String(formData.get("id") ?? "");

  const current = await db.productVariant.findUnique({ where: { id }, include: { product: true } });
  if (!current) return;

  const neighbor = await db.productVariant.findFirst({
    where: {
      productId: current.productId,
      sortOrder: direction === "up" ? { lt: current.sortOrder } : { gt: current.sortOrder },
    },
    orderBy: { sortOrder: direction === "up" ? "desc" : "asc" },
  });
  if (!neighbor) return;

  await db.$transaction([
    db.productVariant.update({ where: { id: current.id }, data: { sortOrder: neighbor.sortOrder } }),
    db.productVariant.update({ where: { id: neighbor.id }, data: { sortOrder: current.sortOrder } }),
  ]);

  revalidateProductPages(current.product.slug);
}

// ---------- Images ----------

export async function addProductImage(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdminSessionOrThrow();
  const productId = String(formData.get("productId") ?? "");
  const file = formData.get("file");
  const altText = String(formData.get("altText") ?? "");
  const variantId = String(formData.get("variantId") ?? "") || null;

  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Please choose an image to upload." };
  }

  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product) return { status: "error", message: "Product not found." };

  try {
    const uploaded = await saveUpload(file, "image");
    const maxSort = await db.productMedia.aggregate({ where: { productId }, _max: { sortOrder: true } });

    const media = await db.media.create({
      data: { ...uploaded, altText: altText || product.name, category: "product" },
    });
    await db.productMedia.create({
      data: { productId, mediaId: media.id, variantId, sortOrder: (maxSort._max.sortOrder ?? -1) + 1 },
    });

    revalidateProductPages(product.slug);
    return { status: "success", message: "Image uploaded." };
  } catch (error) {
    if (error instanceof UploadValidationError) return { status: "error", message: error.message };
    return { status: "error", message: "Unable to upload the image. Please try again." };
  }
}

export async function removeProductImage(formData: FormData) {
  await requireAdminSessionOrThrow();
  const productMediaId = String(formData.get("productMediaId") ?? "");

  const link = await db.productMedia.findUnique({
    where: { id: productMediaId },
    include: { product: true, media: true },
  });
  if (!link) return;

  await db.productMedia.delete({ where: { id: productMediaId } });

  // Only remove the underlying file/Media row if nothing else references it.
  const stillUsed = await db.productMedia.findFirst({ where: { mediaId: link.mediaId } });
  const stillUsedInSections = await db.pageSectionMedia.findFirst({ where: { mediaId: link.mediaId } });
  if (!stillUsed && !stillUsedInSections) {
    await deleteUpload(link.media.url);
    await db.media.delete({ where: { id: link.mediaId } }).catch(() => {});
  }

  revalidateProductPages(link.product.slug);
}

export async function setProductImageVariant(formData: FormData) {
  await requireAdminSessionOrThrow();
  const productMediaId = String(formData.get("productMediaId") ?? "");
  const variantId = String(formData.get("variantId") ?? "") || null;

  const link = await db.productMedia.update({
    where: { id: productMediaId },
    data: { variantId },
    include: { product: true },
  });

  revalidateProductPages(link.product.slug);
}

export async function reorderProductImage(direction: "up" | "down", formData: FormData) {
  await requireAdminSessionOrThrow();
  const id = String(formData.get("productMediaId") ?? "");

  const current = await db.productMedia.findUnique({ where: { id }, include: { product: true } });
  if (!current) return;

  const neighbor = await db.productMedia.findFirst({
    where: {
      productId: current.productId,
      sortOrder: direction === "up" ? { lt: current.sortOrder } : { gt: current.sortOrder },
    },
    orderBy: { sortOrder: direction === "up" ? "desc" : "asc" },
  });
  if (!neighbor) return;

  await db.$transaction([
    db.productMedia.update({ where: { id: current.id }, data: { sortOrder: neighbor.sortOrder } }),
    db.productMedia.update({ where: { id: neighbor.id }, data: { sortOrder: current.sortOrder } }),
  ]);

  revalidateProductPages(current.product.slug);
}
