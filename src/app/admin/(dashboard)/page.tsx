import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { getDashboardStats } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Dashboard | Kapila Admin" };

const QUICK_ACTIONS = [
  { href: "/admin/products/new", label: "Add Product" },
  { href: "/admin/content/home", label: "Edit Homepage" },
  { href: "/admin/faqs", label: "Manage FAQs" },
  { href: "/admin/documents", label: "Upload Document" },
  { href: "/admin/settings", label: "Update Business Information" },
];

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <PageHeader title="Dashboard" description="An overview of what's published on the Kapila website." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Active Products" value={stats.productCount} />
        <StatCard label="Active Sizes" value={stats.activeVariantCount} />
        <StatCard label="Published FAQs" value={stats.faqCount} />
        <StatCard label="Quality Documents" value={stats.documentCount} />
        <StatCard label="New Enquiries" value={stats.enquiryCount} />
      </div>

      <div className="mt-10">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="rounded-sm border border-border bg-white px-4 py-2.5 text-sm font-medium text-ink hover:border-maroon hover:text-maroon"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
