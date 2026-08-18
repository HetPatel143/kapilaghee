"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validation/admin";
import { isRateLimited, recordFailedAttempt, clearAttempts } from "@/lib/auth/rate-limit";

export type LoginFormState = {
  status: "idle" | "error";
  message?: string;
};

export async function loginAction(_prevState: LoginFormState, formData: FormData): Promise<LoginFormState> {
  const parsed = loginSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  if (!parsed.success) {
    return { status: "error", message: "Enter a valid email and password." };
  }

  const { email, password } = parsed.data;

  if (isRateLimited(email)) {
    return {
      status: "error",
      message: "Too many failed attempts. Please wait 15 minutes before trying again.",
    };
  }

  const user = await db.adminUser.findUnique({ where: { email } });

  // Same generic message whether the email doesn't exist or the password is wrong —
  // never reveal which one was incorrect.
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    recordFailedAttempt(email);
    return { status: "error", message: "Invalid email or password." };
  }

  clearAttempts(email);
  await createSession(user.id);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}
