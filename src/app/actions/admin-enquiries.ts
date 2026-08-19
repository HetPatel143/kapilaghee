"use server";

import { db } from "@/lib/db";
import { requireAdminSessionOrThrow } from "@/lib/auth/session";
import type { EnquiryStatus } from "@prisma/client";

export async function setEnquiryStatus(status: EnquiryStatus, formData: FormData) {
  await requireAdminSessionOrThrow();
  const id = String(formData.get("id") ?? "");
  await db.enquiry.update({ where: { id }, data: { status } });
}

export type DeleteEnquiryState = { status: "idle" | "error"; message?: string };

export async function deleteEnquiry(_prev: DeleteEnquiryState, formData: FormData): Promise<DeleteEnquiryState> {
  await requireAdminSessionOrThrow();
  const id = String(formData.get("id") ?? "");
  await db.enquiry.delete({ where: { id } });
  return { status: "idle" };
}
