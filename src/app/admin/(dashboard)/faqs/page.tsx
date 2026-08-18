import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { FaqRow } from "@/components/admin/faqs/FaqRow";
import { AddFaqForm } from "@/components/admin/faqs/AddFaqForm";
import { listFaqsAdmin } from "@/lib/admin-data";

export const metadata: Metadata = { title: "FAQs | Kapila Admin" };

export default async function AdminFaqsPage() {
  const faqs = await listFaqsAdmin();

  return (
    <div>
      <PageHeader title="FAQs" description="Manage the questions shown on the public FAQ page. Click a question to edit it." />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-3">
          {faqs.length > 0 ? (
            faqs.map((faq, i) => (
              <FaqRow key={faq.id} faq={faq} isFirst={i === 0} isLast={i === faqs.length - 1} />
            ))
          ) : (
            <EmptyState title="No FAQs yet" description="Add your first FAQ using the form." />
          )}
        </div>
        <div>
          <AddFaqForm />
        </div>
      </div>
    </div>
  );
}
