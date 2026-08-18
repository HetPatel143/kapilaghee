"use server";

import { db } from "@/lib/db";
import { requireAdminSessionOrThrow } from "@/lib/auth/session";
import { saveUpload, deleteUpload, UploadValidationError } from "@/lib/storage";
import { revalidatePath } from "next/cache";
import type { ActionState } from "@/app/actions/admin-products";
import type { MediaCategory } from "@prisma/client";

export async function uploadMedia(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdminSessionOrThrow();

  const file = formData.get("file");
  const altText = String(formData.get("altText") ?? "");
  const category = String(formData.get("category") ?? "other") as MediaCategory;

  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Please choose an image to upload." };
  }
  if (!altText.trim()) {
    return { status: "error", message: "Alt text is required so the image stays accessible." };
  }

  try {
    const uploaded = await saveUpload(file, "image");
    await db.media.create({ data: { ...uploaded, altText, category } });
    revalidatePath("/admin/media");
    return { status: "success", message: "Image uploaded to the media library." };
  } catch (error) {
    if (error instanceof UploadValidationError) return { status: "error", message: error.message };
    return { status: "error", message: "Unable to upload the image. Please try again." };
  }
}

export async function setMediaStatus(status: "active" | "inactive", formData: FormData) {
  await requireAdminSessionOrThrow();
  const id = String(formData.get("id") ?? "");
  await db.media.update({ where: { id }, data: { status } });
  revalidatePath("/admin/media");
}

export type DeleteMediaState = { status: "idle" | "error"; message?: string };

export async function deleteMedia(_prev: DeleteMediaState, formData: FormData): Promise<DeleteMediaState> {
  await requireAdminSessionOrThrow();
  const id = String(formData.get("id") ?? "");

  const [productUse, sectionUse] = await Promise.all([
    db.productMedia.findFirst({ where: { mediaId: id } }),
    db.pageSectionMedia.findFirst({ where: { mediaId: id } }),
  ]);

  if (productUse || sectionUse) {
    return {
      status: "error",
      message: "This image is still in use on the website. Remove it from that product/section first, then delete it here.",
    };
  }

  const media = await db.media.findUnique({ where: { id } });
  if (media) {
    await deleteUpload(media.url);
    await db.media.delete({ where: { id } });
  }

  revalidatePath("/admin/media");
  return { status: "idle" };
}
