"use server";

import { db } from "@/lib/db";
import { requireAdminSessionOrThrow } from "@/lib/auth/session";
import { businessSettingsSchema } from "@/lib/validation/admin";
import { revalidateSettings } from "@/lib/revalidate";
import type { ActionState } from "@/app/actions/admin-products";

function fieldErrorsFrom(error: import("zod").ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export async function updateBusinessSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdminSessionOrThrow();

  const parsed = businessSettingsSchema.safeParse({
    businessName: formData.get("businessName"),
    address: formData.get("address"),
    phone: formData.get("phone"),
    whatsapp: formData.get("whatsapp"),
    email: formData.get("email"),
    instagram: formData.get("instagram"),
    facebook: formData.get("facebook"),
    googleMapsUrl: formData.get("googleMapsUrl"),
  });

  if (!parsed.success) {
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error) };
  }

  const data = {
    businessName: parsed.data.businessName,
    address: parsed.data.address,
    phone: parsed.data.phone || null,
    whatsapp: parsed.data.whatsapp || null,
    email: parsed.data.email || null,
    instagram: parsed.data.instagram || null,
    facebook: parsed.data.facebook || null,
    googleMapsUrl: parsed.data.googleMapsUrl || null,
  };

  const existing = await db.businessSettings.findFirst();
  if (existing) {
    await db.businessSettings.update({ where: { id: existing.id }, data });
  } else {
    await db.businessSettings.create({ data });
  }

  revalidateSettings();
  return { status: "success", message: "Business settings saved." };
}
