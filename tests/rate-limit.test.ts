import { test } from "node:test";
import assert from "node:assert/strict";
import { isRateLimited, recordFailedAttempt, clearAttempts } from "../src/lib/auth/rate-limit";

test("not rate limited before any failed attempts", () => {
  const email = "fresh-user@kapiladairyfarm.com";
  assert.equal(isRateLimited(email), false);
});

test("becomes rate limited after 5 failed attempts", () => {
  const email = "brute-force-target@kapiladairyfarm.com";
  for (let i = 0; i < 4; i++) {
    recordFailedAttempt(email);
    assert.equal(isRateLimited(email), false, `should not be limited after ${i + 1} attempts`);
  }
  recordFailedAttempt(email);
  assert.equal(isRateLimited(email), true, "should be limited after 5 attempts");
});

test("clearAttempts resets the counter (e.g. after a successful login)", () => {
  const email = "recovers-after-success@kapiladairyfarm.com";
  for (let i = 0; i < 5; i++) recordFailedAttempt(email);
  assert.equal(isRateLimited(email), true);

  clearAttempts(email);
  assert.equal(isRateLimited(email), false);
});

test("rate limiting is case-insensitive and trims whitespace on the email key", () => {
  const email = " Case-Sensitive@KapilaDairyFarm.com ";
  for (let i = 0; i < 5; i++) recordFailedAttempt(email);
  assert.equal(isRateLimited("case-sensitive@kapiladairyfarm.com"), true);
});

test("attempts against one email don't lock out a different email", () => {
  const attacked = "attacked@kapiladairyfarm.com";
  const innocent = "innocent@kapiladairyfarm.com";
  for (let i = 0; i < 5; i++) recordFailedAttempt(attacked);
  assert.equal(isRateLimited(attacked), true);
  assert.equal(isRateLimited(innocent), false);
});
