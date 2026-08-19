import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { EnquiryRow } from "@/components/admin/enquiries/EnquiryRow";
import { listEnquiriesAdmin } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Enquiries | Kapila Admin" };

export default async function AdminEnquiriesPage() {
  const enquiries = await listEnquiriesAdmin();

  return (
    <div>
      <PageHeader title="Enquiries" description="Everyone who has sent an enquiry from the website, newest first." />

      <div className="space-y-3">
        {enquiries.length > 0 ? (
          enquiries.map((enquiry) => <EnquiryRow key={enquiry.id} enquiry={enquiry} />)
        ) : (
          <EmptyState title="No enquiries yet" description="Enquiries submitted from the website will show up here." />
        )}
      </div>
    </div>
  );
}
