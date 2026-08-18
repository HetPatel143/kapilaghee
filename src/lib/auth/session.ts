import "server-only";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const SESSION_COOKIE = "kapila_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await db.adminSession.create({ data: { token, userId, expiresAt } });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/** Reads and validates the current session against the database. Does not redirect. */
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await db.adminSession.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) await db.adminSession.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }

  return session;
}

/** For Server Components/layouts: redirects to login if there's no valid session. */
export async function requireAdminSession() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

/** For Server Actions/route handlers: throws instead of redirecting, so callers can return a clean error state. */
export async function requireAdminSessionOrThrow() {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.adminSession.deleteMany({ where: { token } });
  }
  cookieStore.delete(SESSION_COOKIE);
}
