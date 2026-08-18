/**
 * A minimal in-memory sliding-window rate limiter for admin login attempts.
 *
 * Deliberately simple: this is a single-instance small-business deployment (see
 * docs/deployment.md), so an in-memory Map is sufficient and adds no infrastructure
 * dependency (no Redis, no extra service). If the app is ever deployed across multiple
 * server instances/processes, this must move to a shared store (e.g. Redis) — each
 * instance currently tracks attempts independently.
 */

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

const attempts = new Map<string, number[]>();

function keyFor(email: string) {
  return email.trim().toLowerCase();
}

export function isRateLimited(email: string): boolean {
  const key = keyFor(email);
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  attempts.set(key, recent);
  return recent.length >= MAX_ATTEMPTS;
}

export function recordFailedAttempt(email: string): void {
  const key = keyFor(email);
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  attempts.set(key, recent);
}

export function clearAttempts(email: string): void {
  attempts.delete(keyFor(email));
}
