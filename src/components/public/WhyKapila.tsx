import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import type { PageSectionWithRelations } from "@/lib/types";
import { findSection } from "@/lib/types";

export function WhyKapila({ sections }: { sections: PageSectionWithRelations[] }) {
  const intro = findSection(sections, "why-kapila-intro");
  const points = ["why-point-gir-cow", "why-point-purity", "why-point-quality"]
    .map((key) => findSection(sections, key))
    .filter((s): s is PageSectionWithRelations => Boolean(s));

  if (!intro && points.length === 0) return null;

  return (
    <Section tone="cream">
      <Container>
        <SectionHeading
          eyebrow="Why Kapila"
          title={intro?.title ?? "Why Kapila"}
          description={intro?.body ?? undefined}
        />

        {points.length > 0 ? (
          <div className="mt-12 grid gap-8 sm:grid-cols-3 sm:gap-10">
            {points.map((point, i) => (
              <div key={point.id} className="border-t-2 border-maroon/25 pt-5">
                <span className="font-heading text-sm text-warm-gold">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 font-heading text-xl font-semibold text-maroon">{point.title}</h3>
                {point.body ? <p className="mt-2 text-sm leading-relaxed text-muted">{point.body}</p> : null}
              </div>
            ))}
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
