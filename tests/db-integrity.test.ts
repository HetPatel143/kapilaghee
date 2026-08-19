import { test, after } from "node:test";
import assert from "node:assert/strict";
import { PrismaClient } from "@prisma/client";

/**
 * Exercises real database constraints (unique slug, foreign keys, cascade delete)
 * against the same Postgres database the app itself uses (see docker-compose.yml /
 * DATABASE_URL — Prisma Client loads .env automatically, same as src/lib/db.ts).
 *
 * Every row these tests create uses an identifiable test-only slug/email/question, and
 * the `after` hook below removes all of them — this must never touch real seeded data.
 */

const db = new PrismaClient();

const TEST_PRODUCT_SLUGS = ["kapila-ghee-test-unique-slug", "kapila-ghee-test-cascade"];
const TEST_ADMIN_EMAIL = "test-admin@kapiladairyfarm.com";
const TEST_FAQ_QUESTION = "Test question (db-integrity.test.ts)?";

after(async () => {
  await db.product.deleteMany({ where: { slug: { in: TEST_PRODUCT_SLUGS } } });
  await db.adminUser.deleteMany({ where: { email: TEST_ADMIN_EMAIL } });
  await db.fAQ.deleteMany({ where: { question: TEST_FAQ_QUESTION } });
  await db.$disconnect();
});

test("product slugs must be unique", async () => {
  await db.product.create({
    data: { name: "Test Product", slug: TEST_PRODUCT_SLUGS[0], description: "Pure ghee.", status: "active" },
  });

  await assert.rejects(() =>
    db.product.create({
      data: { name: "Test Product Duplicate", slug: TEST_PRODUCT_SLUGS[0], description: "Pure ghee.", status: "active" },
    })
  );
});

test("a variant cannot be created against a non-existent product (foreign key enforced)", async () => {
  await assert.rejects(() =>
    db.productVariant.create({
      data: { productId: "does-not-exist", size: 1, unit: "kg", status: "active", sortOrder: 0 },
    })
  );
});

test("deleting a product cascades to delete its variants", async () => {
  const product = await db.product.create({
    data: { name: "Test Product", slug: TEST_PRODUCT_SLUGS[1], description: "For cascade test.", status: "active" },
  });
  const variant = await db.productVariant.create({
    data: { productId: product.id, size: 1, unit: "kg", status: "active", sortOrder: 0 },
  });

  await db.product.delete({ where: { id: product.id } });

  const found = await db.productVariant.findUnique({ where: { id: variant.id } });
  assert.equal(found, null);
});

test("an admin session is looked up by its unique token", async () => {
  const user = await db.adminUser.create({
    data: { email: TEST_ADMIN_EMAIL, passwordHash: "salt:hash" },
  });
  const session = await db.adminSession.create({
    data: { token: "test-token-abc123", userId: user.id, expiresAt: new Date(Date.now() + 60_000) },
  });

  const found = await db.adminSession.findUnique({ where: { token: "test-token-abc123" }, include: { user: true } });
  assert.equal(found?.user.email, TEST_ADMIN_EMAIL);

  await db.adminSession.delete({ where: { id: session.id } });
});

test("an FAQ deactivated via status update no longer counts as active, but still exists", async () => {
  const faq = await db.fAQ.create({
    data: { question: TEST_FAQ_QUESTION, answer: "Test answer.", status: "active", sortOrder: 0 },
  });

  await db.fAQ.update({ where: { id: faq.id }, data: { status: "inactive" } });

  const stillExists = await db.fAQ.findUnique({ where: { id: faq.id } });

  assert.ok(stillExists, "deactivating must not delete the row");
  assert.equal(stillExists?.status, "inactive");
});
