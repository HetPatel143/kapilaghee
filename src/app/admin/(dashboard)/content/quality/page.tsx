import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { SectionCard } from "@/components/admin/content/SectionCard";
import { SectionTextForm } from "@/components/admin/content/SectionTextForm";
import { QualityDocumentAttacher } from "@/components/admin/content/QualityDocumentAttacher";
import { listPageSectionsAdmin, listDocumentsAdmin } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Quality & Purity Content | Kapila Admin" };

const SECTION_CONFIG: Record<string, { label: string; description: string; hasDocuments?: boolean }> = {
  "quality-intro": { label: "Quality & Purity — Intro", description: "Heading and intro shown at the top of the page." },
  "quality-compliance": { label: "Food Safety & Compliance", description: "Licensing information.", hasDocuments: true },
  "quality-testing": { label: "Product Testing", description: "Lab testing information.", hasDocuments: true },
};

export default async function AdminQualityContentPage() {
  const [sections, documents] = await Promise.all([listPageSectionsAdmin("quality"), listDocumentsAdmin()]);
  const activeDocuments = documents.filter((d) => d.status === "active");

  return (
    <div>
      <PageHeader
        title="Quality & Purity Content"
        description="Only publish documents and claims the business has confirmed. See the Documents page to upload new certificates or reports."
      />

      <div className="space-y-4">
        {sections.map((section, i) => {
          const config = SECTION_CONFIG[section.key] ?? { label: section.key, description: "" };
          return (
            <SectionCard key={section.id} title={config.label} description={config.description} defaultOpen={i === 0}>
              <div className="space-y-6">
                <SectionTextForm sectionId={section.id} page="quality" title={section.title} body={section.body} />
                {config.hasDocuments ? (
                  <QualityDocumentAttacher sectionId={section.id} attached={section.documents} available={activeDocuments} />
                ) : null}
              </div>
            </SectionCard>
          );
        })}
      </div>
    </div>
  );
}
