import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid WhatsApp number.")
    .max(20, "Please enter a valid WhatsApp number."),
  message: z.string().trim().min(5, "Please add a short message."),
  productId: z.string().trim().optional().or(z.literal("")),
  variantId: z.string().trim().optional().or(z.literal("")),
  // Honeypot field — real users never fill this in; bots often do.
  company: z.string().max(0, "Spam detected.").optional().or(z.literal("")),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
