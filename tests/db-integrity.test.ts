import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { existsSync, unlinkSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

/**
 * Exercises real database constraints (unique slug, foreign keys, cascade delete)
 * against a throwaway SQLite file — never the dev database — so these tests are safe
 * to run repeatedly without disturbing seeded/demo data.
 */

const testDbPath = path.join(process.cwd(), "prisma", "test.db");
const testDbUrl = `file:${testDbPath}`;
let db: PrismaClient;

before(() => {
  if (existsSync(testDbPath)) unlinkSync(testDbPath);
  execSync("npx prisma db push --skip-generate --accept-data-loss", {
    env: { ...process.env, DATABASE_URL: testDbUrl },
    stdio: "pipe",
  });
  db = new PrismaClient({ datasourceUrl: testDbUrl });
});

after(async () => {
  await db.$disconnect();
  if (existsSync(testDbPath)) unlinkSync(testDbPath);
});

test("product slugs must be unique", async () => {
  await db.product.create({
    data: { name: "Kapila Ghee", slug: "kapila-ghee", description: "Pure ghee.", status: "active" },
  });

  await assert.rejects(() =>
    db.product.create({
      data: { name: "Kapila Ghee Duplicate", slug: "kapila-ghee", description: "Pure ghee.", status: "active" },
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
    data: { name: "Test Product", slug: "test-product-cascade", description: "For cascade test.", status: "active" },
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
    data: { email: "test-admin@kapiladairyfarm.com", passwordHash: "salt:hash" },
  });
  const session = await db.adminSession.create({
    data: { token: "test-token-abc123", userId: user.id, expiresAt: new Date(Date.now() + 60_000) },
  });

  const found = await db.adminSession.findUnique({ where: { token: "test-token-abc123" }, include: { user: true } });
  assert.equal(found?.user.email, "test-admin@kapiladairyfarm.com");

  await db.adminSession.delete({ where: { id: session.id } });
});

test("an FAQ deactivated via status update no longer counts as active, but still exists", async () => {
  const faq = await db.fAQ.create({
    data: { question: "Test question?", answer: "Test answer.", status: "active", sortOrder: 0 },
  });

  await db.fAQ.update({ where: { id: faq.id }, data: { status: "inactive" } });

  const activeCount = await db.fAQ.count({ where: { status: "active" } });
  const stillExists = await db.fAQ.findUnique({ where: { id: faq.id } });

  assert.equal(activeCount, 0);
  assert.ok(stillExists, "deactivating must not delete the row");
  assert.equal(stillExists?.status, "inactive");
});
