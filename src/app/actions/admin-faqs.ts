"use server";

import { db } from "@/lib/db";
import { requireAdminSessionOrThrow } from "@/lib/auth/session";
import { faqSchema } from "@/lib/validation/admin";
import { revalidateFaqs } from "@/lib/revalidate";
import type { ActionState } from "@/app/actions/admin-products";

function fieldErrorsFrom(error: import("zod").ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export async function createFaq(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdminSessionOrThrow();

  const parsed = faqSchema.safeParse({
    question: formData.get("question"),
    answer: formData.get("answer"),
    status: formData.get("status") ?? "active",
  });
  if (!parsed.success) {
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error) };
  }

  const maxSort = await db.fAQ.aggregate({ _max: { sortOrder: true } });
  await db.fAQ.create({ data: { ...parsed.data, sortOrder: (maxSort._max.sortOrder ?? -1) + 1 } });

  revalidateFaqs();
  return { status: "success", message: "FAQ added." };
}

export async function updateFaq(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdminSessionOrThrow();
  const id = String(formData.get("id") ?? "");

  const parsed = faqSchema.safeParse({
    question: formData.get("question"),
    answer: formData.get("answer"),
    status: formData.get("status") ?? "active",
  });
  if (!parsed.success) {
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error) };
  }

  await db.fAQ.update({ where: { id }, data: parsed.data });
  revalidateFaqs();
  return { status: "success", message: "FAQ updated." };
}

export async function setFaqStatus(status: "active" | "inactive", formData: FormData) {
  await requireAdminSessionOrThrow();
  const id = String(formData.get("id") ?? "");
  await db.fAQ.update({ where: { id }, data: { status } });
  revalidateFaqs();
}

export async function reorderFaq(direction: "up" | "down", formData: FormData) {
  await requireAdminSessionOrThrow();
  const id = String(formData.get("id") ?? "");

  const current = await db.fAQ.findUnique({ where: { id } });
  if (!current) return;

  const neighbor = await db.fAQ.findFirst({
    where: { sortOrder: direction === "up" ? { lt: current.sortOrder } : { gt: current.sortOrder } },
    orderBy: { sortOrder: direction === "up" ? "desc" : "asc" },
  });
  if (!neighbor) return;

  await db.$transaction([
    db.fAQ.update({ where: { id: current.id }, data: { sortOrder: neighbor.sortOrder } }),
    db.fAQ.update({ where: { id: neighbor.id }, data: { sortOrder: current.sortOrder } }),
  ]);

  revalidateFaqs();
}
