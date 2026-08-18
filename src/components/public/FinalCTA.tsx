import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { LinkButton } from "@/components/shared/Button";
import { getContactActions } from "@/lib/contact";
import type { BusinessSettings } from "@prisma/client";
import type { PageSectionWithRelations } from "@/lib/types";
import { findSection } from "@/lib/types";

export function FinalCTA({
  settings,
  sections,
}: {
  settings: BusinessSettings | null;
  sections: PageSectionWithRelations[];
}) {
  const content = findSection(sections, "final-cta");
  const quickActions = getContactActions(settings).filter((a) => a.kind !== "maps");

  return (
    <Section tone="cream">
      <Container className="flex flex-col items-center gap-6 text-center">
        <h2 className="font-heading text-3xl font-semibold text-maroon sm:text-4xl">
          {content?.title ?? "Have questions about Kapila Ghee?"}
        </h2>
        <p className="max-w-md text-base text-muted">{content?.body ?? "We'd be happy to help."}</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <LinkButton href="/contact" size="lg">
            Enquire Now
          </LinkButton>
          {quickActions.map((action) => (
            <LinkButton key={action.kind} href={action.href} variant="secondary" size="lg">
              {action.label}
            </LinkButton>
          ))}
        </div>
      </Container>
    </Section>
  );
}
