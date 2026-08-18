import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { LinkButton } from "@/components/shared/Button";
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
          <div className="mt-8">
            <LinkButton href="/quality" variant="inverse">
              View Quality Information
            </LinkButton>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
