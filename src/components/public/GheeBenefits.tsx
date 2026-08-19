import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import type { PageSectionWithRelations } from "@/lib/types";
import { findSection } from "@/lib/types";

/**
 * Content safety note (see docs/requirements.md §2 / Prompt 4 §32): this section
 * intentionally sticks to plain, verifiable, non-medical statements about ghee (flavor,
 * cooking properties, tradition, ingredients) rather than the therapeutic/health claims
 * seen in the supplied promotional material ("improves immunity", "heals wounds",
 * "promotes healthy pregnancy", "improves bone development"). Those are specific health
 * claims that food-safety advertising rules (and FSSAI in particular) restrict — they
 * need real substantiation before publication, not just business sign-off on wording.
 */
export function GheeBenefits({ sections }: { sections: PageSectionWithRelations[] }) {
  const intro = findSection(sections, "benefits-intro");
  const points = ["benefits-point-1", "benefits-point-2", "benefits-point-3", "benefits-point-4"]
    .map((key) => findSection(sections, key))
    .filter((s): s is PageSectionWithRelations => Boolean(s));

  if (!intro && points.length === 0) return null;

  return (
    <Section tone="cream">
      <Container>
        <SectionHeading
          eyebrow="Everyday Benefits"
          title={intro?.title ?? "Why Ghee, Every Day"}
          description={intro?.body ?? undefined}
        />

        {points.length > 0 ? (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {points.map((point) => (
              <div key={point.id} className="border-t-2 border-warm-gold/50 pt-5">
                <h3 className="font-heading text-lg font-semibold text-maroon">{point.title}</h3>
                {point.body ? <p className="mt-2 text-sm leading-relaxed text-muted">{point.body}</p> : null}
              </div>
            ))}
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
