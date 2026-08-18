"use server";

import { db } from "@/lib/db";
import { enquirySchema } from "@/lib/validation/enquiry";

export type EnquiryFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "phone" | "email" | "message", string>>;
};

export async function submitEnquiry(
  _prevState: EnquiryFormState,
  formData: FormData
): Promise<EnquiryFormState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
    productId: String(formData.get("productId") ?? ""),
    variantId: String(formData.get("variantId") ?? ""),
    company: String(formData.get("company") ?? ""),
  };

  const parsed = enquirySchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: EnquiryFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key === "name" || key === "phone" || key === "email" || key === "message") {
        fieldErrors[key] = issue.message;
      }
    }
    return {
      status: "error",
      message: "Please check the highlighted fields and try again.",
      fieldErrors,
    };
  }

  const { name, phone, email, message, productId, variantId } = parsed.data;

  try {
    await db.enquiry.create({
      data: {
        name,
        phone: phone || null,
        email: email || null,
        message,
        productId: productId || null,
        variantId: variantId || null,
      },
    });
    return { status: "success", message: "Thank you — we've received your enquiry and will get back to you soon." };
  } catch {
    return {
      status: "error",
      message: "Something went wrong while sending your enquiry. Please try again in a moment.",
    };
  }
}
