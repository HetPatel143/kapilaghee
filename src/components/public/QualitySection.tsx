import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import type { PageSectionWithRelations } from "@/lib/types";
import { findSection } from "@/lib/types";

export function QualitySection({
  homeSections,
  hasDocuments,
}: {
  homeSections: PageSectionWithRelations[];
  hasDocuments: boolean;
}) {
  const teaser = findSection(homeSections, "quality-teaser");
  if (!teaser) return null;

  return (
    <Section tone="maroon">
      <Container className="text-center">
        <SectionHeading
          align="center"
          tone="cream"
          eyebrow="Quality & Purity"
          title={teaser.title ?? "Quality & Purity"}
          description={teaser.body ?? undefined}
        />
        {hasDocuments ? (
          <div className="mt-6">
            <Link href="/quality" className="text-sm font-semibold uppercase tracking-[0.1em] text-cream hover:underline">
              View Quality Information &rarr;
            </Link>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
