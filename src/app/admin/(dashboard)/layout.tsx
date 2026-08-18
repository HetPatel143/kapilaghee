import type { Metadata } from "next";
import { requireAdminSession } from "@/lib/auth/session";
import { AdminShell } from "@/components/admin/AdminShell";

// Note: each admin page sets its own full "X | Kapila Admin" title explicitly rather
// than relying on a title.template here — nested metadata title templates were not
// reliably inherited across this route group in testing, so this is the robust fallback.
export const metadata: Metadata = {
  title: "Kapila Admin",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminSession();

  return <AdminShell userEmail={session.user.email}>{children}</AdminShell>;
}
