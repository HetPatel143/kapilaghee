import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin Login | Kapila Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-brown px-5">
      <div className="w-full max-w-sm rounded-md bg-cream p-8 shadow-lg">
        <p className="text-center font-heading text-2xl font-semibold text-maroon">Kapila Admin</p>
        <p className="mt-1 text-center text-sm text-muted">Sign in to manage the website</p>

        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
