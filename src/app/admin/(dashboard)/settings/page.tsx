import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { getBusinessSettingsAdmin } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Business Settings | Kapila Admin" };

export default async function AdminSettingsPage() {
  const settings = await getBusinessSettingsAdmin();

  return (
    <div>
      <PageHeader title="Business Settings" description="This information is the single source of truth for the Contact page and site footer." />
      <SettingsForm settings={settings} />
    </div>
  );
}
