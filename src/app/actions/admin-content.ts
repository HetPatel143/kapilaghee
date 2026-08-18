"use server";

import { db } from "@/lib/db";
import { requireAdminSessionOrThrow } from "@/lib/auth/session";
import { pageSectionSchema, processStepSchema } from "@/lib/validation/admin";
import { saveUpload, UploadValidationError } from "@/lib/storage";
import {
  revalidateHome,
  revalidateStory,
  revalidateProcess,
  revalidateQuality,
} from "@/lib/revalidate";
import type { ActionState } from "@/app/actions/admin-products";
import type { PageKey } from "@/lib/data";
import type { MediaCategory } from "@prisma/client";

function fieldErrorsFrom(error: import("zod").ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

function revalidateFor(page: PageKey) {
  if (page === "home") revalidateHome();
  if (page === "story") revalidateStory();
  if (page === "process") revalidateProcess();
  if (page === "quality") revalidateQuality();
}

// ---------- Section text content (Home / Story / Quality fixed sections) ----------

export async function updateSectionContent(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdminSessionOrThrow();
  const id = String(formData.get("id") ?? "");
  const page = String(formData.get("page") ?? "") as PageKey;

  const parsed = pageSectionSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error) };
  }

  await db.pageSection.update({
    where: { id },
    data: { title: parsed.data.title || null, body: parsed.data.body || null },
  });

  revalidateFor(page);
  return { status: "success", message: "Section saved." };
}

// ---------- Section image (single image per section, e.g. hero/story image) ----------

export async function setSectionImageFromLibrary(formData: FormData) {
  await requireAdminSessionOrThrow();
  const sectionId = String(formData.get("sectionId") ?? "");
  const page = String(formData.get("page") ?? "") as PageKey;
  const mediaId = String(formData.get("mediaId") ?? "");

  await db.pageSectionMedia.deleteMany({ where: { pageSectionId: sectionId } });
  if (mediaId) {
    await db.pageSectionMedia.create({ data: { pageSectionId: sectionId, mediaId, sortOrder: 0 } });
  }
  revalidateFor(page);
}

export async function uploadSectionImage(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdminSessionOrThrow();
  const sectionId = String(formData.get("sectionId") ?? "");
  const page = String(formData.get("page") ?? "") as PageKey;
  const altText = String(formData.get("altText") ?? "");
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Please choose an image to upload." };
  }

  try {
    const uploaded = await saveUpload(file, "image");
    const media = await db.media.create({
      data: { ...uploaded, altText: altText || null, category: page as MediaCategory },
    });
    await db.pageSectionMedia.deleteMany({ where: { pageSectionId: sectionId } });
    await db.pageSectionMedia.create({ data: { pageSectionId: sectionId, mediaId: media.id, sortOrder: 0 } });

    revalidateFor(page);
    return { status: "success", message: "Image updated." };
  } catch (error) {
    if (error instanceof UploadValidationError) return { status: "error", message: error.message };
    return { status: "error", message: "Unable to upload the image. Please try again." };
  }
}

export async function removeSectionImage(formData: FormData) {
  await requireAdminSessionOrThrow();
  const sectionId = String(formData.get("sectionId") ?? "");
  const page = String(formData.get("page") ?? "") as PageKey;
  await db.pageSectionMedia.deleteMany({ where: { pageSectionId: sectionId } });
  revalidateFor(page);
}

// ---------- Quality: attach/detach documents ----------

export async function attachDocumentToSection(formData: FormData) {
  await requireAdminSessionOrThrow();
  const sectionId = String(formData.get("sectionId") ?? "");
  const documentId = String(formData.get("documentId") ?? "");
  if (!documentId) return;

  const existing = await db.pageSectionDocument.findFirst({ where: { pageSectionId: sectionId, documentId } });
  if (!existing) {
    const maxSort = await db.pageSectionDocument.aggregate({ where: { pageSectionId: sectionId }, _max: { sortOrder: true } });
    await db.pageSectionDocument.create({
      data: { pageSectionId: sectionId, documentId, sortOrder: (maxSort._max.sortOrder ?? -1) + 1 },
    });
  }
  revalidateQuality();
}

export async function detachDocumentFromSection(formData: FormData) {
  await requireAdminSessionOrThrow();
  const pageSectionDocumentId = String(formData.get("pageSectionDocumentId") ?? "");
  await db.pageSectionDocument.delete({ where: { id: pageSectionDocumentId } });
  revalidateQuality();
}

// ---------- Process steps (dynamic ordered list) ----------

export async function addProcessStep(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdminSessionOrThrow();

  const parsed = processStepSchema.safeParse({
    key: `process-step-${Date.now()}`,
    title: formData.get("title"),
    body: formData.get("body"),
    status: formData.get("status") ?? "active",
  });
  if (!parsed.success) {
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error) };
  }

  const maxSort = await db.pageSection.aggregate({ where: { page: "process" }, _max: { sortOrder: true } });
  await db.pageSection.create({
    data: {
      page: "process",
      key: parsed.data.key,
      title: parsed.data.title,
      body: parsed.data.body || null,
      status: parsed.data.status,
      sortOrder: (maxSort._max.sortOrder ?? -1) + 1,
    },
  });

  revalidateProcess();
  return { status: "success", message: "Step added." };
}

export async function updateProcessStep(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdminSessionOrThrow();
  const id = String(formData.get("id") ?? "");

  const parsed = processStepSchema.safeParse({
    key: "unused",
    title: formData.get("title"),
    body: formData.get("body"),
    status: formData.get("status") ?? "active",
  });
  if (!parsed.success) {
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error) };
  }

  await db.pageSection.update({
    where: { id },
    data: { title: parsed.data.title, body: parsed.data.body || null, status: parsed.data.status },
  });

  revalidateProcess();
  return { status: "success", message: "Step updated." };
}

export async function deleteProcessStep(formData: FormData) {
  await requireAdminSessionOrThrow();
  const id = String(formData.get("id") ?? "");
  await db.pageSection.delete({ where: { id } });
  revalidateProcess();
}

export async function reorderProcessStep(direction: "up" | "down", formData: FormData) {
  await requireAdminSessionOrThrow();
  const id = String(formData.get("id") ?? "");

  const current = await db.pageSection.findUnique({ where: { id } });
  if (!current) return;

  const neighbor = await db.pageSection.findFirst({
    where: {
      page: "process",
      sortOrder: direction === "up" ? { lt: current.sortOrder } : { gt: current.sortOrder },
    },
    orderBy: { sortOrder: direction === "up" ? "desc" : "asc" },
  });
  if (!neighbor) return;

  await db.$transaction([
    db.pageSection.update({ where: { id: current.id }, data: { sortOrder: neighbor.sortOrder } }),
    db.pageSection.update({ where: { id: neighbor.id }, data: { sortOrder: current.sortOrder } }),
  ]);

  revalidateProcess();
}
