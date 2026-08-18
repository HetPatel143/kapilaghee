import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { UploadDocumentForm } from "@/components/admin/documents/UploadDocumentForm";
import { DocumentRow } from "@/components/admin/documents/DocumentRow";
import { listDocumentsAdmin } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Documents | Kapila Admin" };

export default async function AdminDocumentsPage() {
  const documents = await listDocumentsAdmin();

  return (
    <div>
      <PageHeader
        title="Documents"
        description="Certificates and reports (FSSAI license, lab reports). Attach them to the Quality page from the Content → Quality screen."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-3">
          {documents.length > 0 ? (
            documents.map((doc) => <DocumentRow key={doc.id} document={doc} />)
          ) : (
            <EmptyState title="No documents yet" description="Upload your first document using the form." />
          )}
        </div>
        <div>
          <UploadDocumentForm />
        </div>
      </div>
    </div>
  );
}
