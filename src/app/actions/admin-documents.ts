"use server";

import { db } from "@/lib/db";
import { requireAdminSessionOrThrow } from "@/lib/auth/session";
import { saveUpload, deleteUpload, UploadValidationError } from "@/lib/storage";
import { documentMetaSchema } from "@/lib/validation/admin";
import { revalidateQuality } from "@/lib/revalidate";
import type { ActionState } from "@/app/actions/admin-products";

function fieldErrorsFrom(error: import("zod").ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export async function uploadDocument(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdminSessionOrThrow();

  const file = formData.get("file");
  const parsed = documentMetaSchema.safeParse({
    label: formData.get("label"),
    issuedBy: formData.get("issuedBy"),
    issuedDate: formData.get("issuedDate"),
  });

  if (!parsed.success) {
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error) };
  }
  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Please choose a file to upload." };
  }

  try {
    const uploaded = await saveUpload(file, "document");
    await db.document.create({
      data: {
        ...uploaded,
        label: parsed.data.label,
        issuedBy: parsed.data.issuedBy || null,
        issuedDate: parsed.data.issuedDate ? new Date(parsed.data.issuedDate) : null,
      },
    });
    revalidateQuality();
    return { status: "success", message: "Document uploaded." };
  } catch (error) {
    if (error instanceof UploadValidationError) return { status: "error", message: error.message };
    return { status: "error", message: "Unable to upload the document. Please try again." };
  }
}

export async function updateDocumentMeta(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdminSessionOrThrow();
  const id = String(formData.get("id") ?? "");

  const parsed = documentMetaSchema.safeParse({
    label: formData.get("label"),
    issuedBy: formData.get("issuedBy"),
    issuedDate: formData.get("issuedDate"),
  });
  if (!parsed.success) {
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error) };
  }

  await db.document.update({
    where: { id },
    data: {
      label: parsed.data.label,
      issuedBy: parsed.data.issuedBy || null,
      issuedDate: parsed.data.issuedDate ? new Date(parsed.data.issuedDate) : null,
    },
  });
  revalidateQuality();
  return { status: "success", message: "Document details saved." };
}

export async function setDocumentStatus(status: "active" | "inactive", formData: FormData) {
  await requireAdminSessionOrThrow();
  const id = String(formData.get("id") ?? "");
  await db.document.update({ where: { id }, data: { status } });
  revalidateQuality();
}

export type DeleteDocumentState = { status: "idle" | "error"; message?: string };

export async function deleteDocument(_prev: DeleteDocumentState, formData: FormData): Promise<DeleteDocumentState> {
  await requireAdminSessionOrThrow();
  const id = String(formData.get("id") ?? "");

  const inUse = await db.pageSectionDocument.findFirst({ where: { documentId: id } });
  if (inUse) {
    return {
      status: "error",
      message: "This document is attached to the Quality page. Remove it there first, then delete it here.",
    };
  }

  const document = await db.document.findUnique({ where: { id } });
  if (document) {
    await deleteUpload(document.url);
    await db.document.delete({ where: { id } });
  }

  revalidateQuality();
  return { status: "idle" };
}
