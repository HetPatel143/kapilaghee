import { z } from "zod";

export const enquirySchema = z
  .object({
    name: z.string().trim().min(2, "Please enter your name."),
    phone: z.string().trim().optional().or(z.literal("")),
    email: z.string().trim().email("Please enter a valid email.").optional().or(z.literal("")),
    message: z.string().trim().min(5, "Please add a short message."),
    productId: z.string().trim().optional().or(z.literal("")),
    variantId: z.string().trim().optional().or(z.literal("")),
    // Honeypot field — real users never fill this in; bots often do.
    company: z.string().max(0, "Spam detected.").optional().or(z.literal("")),
  })
  .refine((data) => Boolean(data.phone) || Boolean(data.email), {
    message: "Please share a phone number or an email so we can reach you.",
    path: ["phone"],
  });

export type EnquiryInput = z.infer<typeof enquirySchema>;
