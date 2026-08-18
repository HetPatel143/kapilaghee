import { test } from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword } from "../src/lib/auth/password";

test("hashPassword never stores the plaintext password", async () => {
  const hash = await hashPassword("KapilaAdmin@123");
  assert.notEqual(hash, "KapilaAdmin@123");
  assert.match(hash, /^[0-9a-f]+:[0-9a-f]+$/); // "<salt>:<derivedKey>" hex format
});

test("verifyPassword accepts the correct password", async () => {
  const hash = await hashPassword("KapilaAdmin@123");
  assert.equal(await verifyPassword("KapilaAdmin@123", hash), true);
});

test("verifyPassword rejects an incorrect password", async () => {
  const hash = await hashPassword("KapilaAdmin@123");
  assert.equal(await verifyPassword("WrongPassword", hash), false);
});

test("verifyPassword rejects a malformed stored hash instead of throwing", async () => {
  assert.equal(await verifyPassword("anything", "not-a-valid-hash"), false);
});

test("two hashes of the same password are not identical (random salt per hash)", async () => {
  const a = await hashPassword("KapilaAdmin@123");
  const b = await hashPassword("KapilaAdmin@123");
  assert.notEqual(a, b);
});
