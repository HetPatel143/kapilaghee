import { test } from "node:test";
import assert from "node:assert/strict";
import {
  productBasicInfoSchema,
  variantSchema,
  faqSchema,
  businessSettingsSchema,
  loginSchema,
} from "../src/lib/validation/admin";

test("product schema rejects an uppercase/spaced slug", () => {
  const result = productBasicInfoSchema.safeParse({
    name: "Kapila Ghee",
    slug: "Kapila Ghee!",
    description: "A pure ghee product description.",
    status: "active",
  });
  assert.equal(result.success, false);
});

test("product schema accepts a valid slug", () => {
  const result = productBasicInfoSchema.safeParse({
    name: "Kapila Ghee",
    slug: "kapila-a2-gir-cow-ghee",
    description: "A pure ghee product description.",
    status: "active",
  });
  assert.equal(result.success, true);
});

test("variant schema rejects a non-positive size", () => {
  assert.equal(variantSchema.safeParse({ size: 0, unit: "kg", status: "active" }).success, false);
  assert.equal(variantSchema.safeParse({ size: -1, unit: "kg", status: "active" }).success, false);
});

test("variant schema coerces a numeric string size", () => {
  const result = variantSchema.safeParse({ size: "5", unit: "kg", status: "active" });
  assert.equal(result.success, true);
  if (result.success) assert.equal(result.data.size, 5);
});

test("faq schema requires both question and answer", () => {
  assert.equal(faqSchema.safeParse({ question: "", answer: "x", status: "active" }).success, false);
  assert.equal(faqSchema.safeParse({ question: "Q?", answer: "", status: "active" }).success, false);
});

test("business settings requires name and address but not contact fields", () => {
  const result = businessSettingsSchema.safeParse({
    businessName: "Kapila Dairy Farm",
    address: "Surat, Gujarat",
    phone: "",
    whatsapp: "",
    email: "",
    instagram: "",
    facebook: "",
    googleMapsUrl: "",
  });
  assert.equal(result.success, true);
});

test("business settings rejects an invalid email when one is provided", () => {
  const result = businessSettingsSchema.safeParse({
    businessName: "Kapila Dairy Farm",
    address: "Surat, Gujarat",
    email: "not-an-email",
  });
  assert.equal(result.success, false);
});

test("business settings rejects a social URL without http(s)", () => {
  const result = businessSettingsSchema.safeParse({
    businessName: "Kapila Dairy Farm",
    address: "Surat, Gujarat",
    instagram: "instagram.com/kapiladairyfarm",
  });
  assert.equal(result.success, false);
});

test("login schema requires a valid email and a non-empty password", () => {
  assert.equal(loginSchema.safeParse({ email: "not-an-email", password: "x" }).success, false);
  assert.equal(loginSchema.safeParse({ email: "admin@kapiladairyfarm.com", password: "" }).success, false);
  assert.equal(loginSchema.safeParse({ email: "admin@kapiladairyfarm.com", password: "x" }).success, true);
});
