import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { LinkButton } from "@/components/shared/Button";
import { ProcessTimeline } from "@/components/public/ProcessTimeline";
import { getPageSections } from "@/lib/data";

export const metadata: Metadata = {
  title: "Our Process",
  description: "How Kapila A2 Gir Cow Ghee is made in Surat, Gujarat.",
  alternates: { canonical: "/our-process" },
};

export default async function OurProcessPage() {
  const steps = await getPageSections("process");

  return (
    <Section tone="cream">
      <Container>
        <SectionHeading
          eyebrow="Our Process"
          title="How Kapila Ghee Is Made"
          description="We only publish process details once they're confirmed and accurate."
        />
        <div className="mt-4">
          <ProcessTimeline steps={steps} variant="full" />
        </div>
        {steps.length === 0 ? (
          <div className="mt-8">
            <LinkButton href="/contact" variant="secondary">
              Ask Us Directly
            </LinkButton>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
