import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const productBasicInfoSchema = z.object({
  name: z.string().trim().min(2, "Product name is required.").max(120),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required.")
    .max(120)
    .regex(slugPattern, "Slug can only contain lowercase letters, numbers, and hyphens."),
  description: z
    .string()
    .trim()
    .min(10, "Description should be at least 10 characters.")
    .max(2000, "Description is too long (max 2000 characters)."),
  status: z.enum(["active", "inactive"]),
});

export const variantSchema = z.object({
  size: z.coerce.number({ error: "Size must be a number." }).positive("Size must be greater than 0."),
  unit: z.enum(["kg", "g", "ml", "l"]),
  status: z.enum(["active", "inactive"]),
});

export const faqSchema = z.object({
  question: z.string().trim().min(3, "Question is required.").max(300),
  answer: z.string().trim().min(3, "Answer is required.").max(2000),
  status: z.enum(["active", "inactive"]),
});

export const pageSectionSchema = z.object({
  title: z.string().trim().max(200).optional().or(z.literal("")),
  body: z.string().trim().max(4000).optional().or(z.literal("")),
});

export const processStepSchema = z.object({
  key: z.string().trim().min(1),
  title: z.string().trim().min(2, "Step title is required.").max(120),
  body: z.string().trim().max(1000).optional().or(z.literal("")),
  status: z.enum(["active", "inactive"]),
});

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .refine((v) => !v || /^https?:\/\//i.test(v), { message: "Must be a valid URL starting with http:// or https://" });

const optionalEmail = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .refine((v) => !v || z.email().safeParse(v).success, { message: "Must be a valid email address." });

export const businessSettingsSchema = z.object({
  businessName: z.string().trim().min(2, "Business name is required.").max(200),
  address: z.string().trim().min(5, "Address is required.").max(500),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  whatsapp: z.string().trim().max(30).optional().or(z.literal("")),
  email: optionalEmail,
  instagram: optionalUrl,
  facebook: optionalUrl,
  googleMapsUrl: optionalUrl,
});

export const documentMetaSchema = z.object({
  label: z.string().trim().min(2, "Document label is required.").max(200),
  issuedBy: z.string().trim().max(200).optional().or(z.literal("")),
  issuedDate: z.string().trim().optional().or(z.literal("")),
});

export const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});
