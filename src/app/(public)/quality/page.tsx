import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { EmptyState } from "@/components/shared/EmptyState";
import { DocumentCard } from "@/components/public/DocumentCard";
import { getPageSections } from "@/lib/data";
import { findSection } from "@/lib/types";

export const metadata: Metadata = {
  title: "Quality & Purity",
  description:
    "Kapila Dairy Farm is FSSAI licensed and lab tested. View our food safety license and independent purity test report.",
  alternates: { canonical: "/quality" },
};

export default async function QualityPage() {
  const sections = await getPageSections("quality");
  const intro = findSection(sections, "quality-intro");
  const compliance = findSection(sections, "quality-compliance");
  const testing = findSection(sections, "quality-testing");

  const allDocuments = sections.flatMap((s) => s.documents.map((d) => d.document));

  return (
    <>
      <Section tone="maroon" className="py-16 sm:py-20">
        <Container className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-kapila-gold">Quality &amp; Purity</p>
          <h1 className="mt-4 font-heading text-4xl font-semibold text-cream sm:text-5xl">
            {intro?.title ?? "Quality & Purity"}
          </h1>
          {intro?.body ? (
            <p className="mx-auto mt-4 max-w-xl text-base text-cream/80">{intro.body}</p>
          ) : null}
        </Container>
      </Section>

      <Section tone="cream">
        <Container>
          <div className="grid gap-10 sm:grid-cols-2">
            <InfoBlock title="Food Safety & Compliance" body={compliance?.body} />
            <InfoBlock title="Product Testing" body={testing?.body} />
          </div>

          <div className="mt-14">
            <SectionHeading eyebrow="Documentation" title="Certificates & Reports" />
            {allDocuments.length > 0 ? (
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {allDocuments.map((doc) => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
              </div>
            ) : (
              <div className="mt-8">
                <EmptyState
                  title="No documents available yet"
                  description="Certificates and test reports will appear here once they're added."
                />
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}

function InfoBlock({ title, body }: { title: string; body?: string | null }) {
  if (!body) return null;
  return (
    <div className="border-t-2 border-maroon/25 pt-5">
      <h2 className="font-heading text-xl font-semibold text-maroon">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">{body}</p>
    </div>
  );
}
