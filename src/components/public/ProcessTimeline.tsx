import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { LinkButton } from "@/components/shared/Button";
import { EmptyState } from "@/components/shared/EmptyState";
import type { PageSectionWithRelations } from "@/lib/types";

/**
 * Renders the confirmed production-process steps as a clean numbered timeline.
 *
 * Content safety: this component only ever renders what it's given. It does not contain
 * any hard-coded process description (e.g. Bilona method, hand-churning) — that content
 * is only shown once it exists as published PageSection rows, which happens only once the
 * business has confirmed it accurately describes current production (docs/requirements.md §2).
 */
export function ProcessTimeline({
  steps,
  variant = "full",
}: {
  steps: PageSectionWithRelations[];
  variant?: "full" | "teaser";
}) {
  if (variant === "teaser") {
    if (steps.length === 0) return null;
    return (
      <Section tone="cream">
        <Container>
          <SectionHeading eyebrow="Our Process" title="How Kapila Ghee Is Made" />
          <StepList steps={steps.slice(0, 4)} />
          <div className="mt-10">
            <LinkButton href="/our-process" variant="secondary">
              See Full Process
            </LinkButton>
          </div>
        </Container>
      </Section>
    );
  }

  if (steps.length === 0) {
    return (
      <EmptyState
        title="Our process story is being finalized"
        description="We're documenting our production process in detail together with the Kapila team. Check back soon."
      />
    );
  }

  return <StepList steps={steps} />;
}

function StepList({ steps }: { steps: PageSectionWithRelations[] }) {
  return (
    <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, i) => {
        const image = step.media[0]?.media;
        return (
          <li key={step.id} className="relative">
            <span className="font-heading text-4xl font-semibold text-warm-gold/70">
              {String(i + 1).padStart(2, "0")}
            </span>
            {image ? (
              <div className="mt-4 aspect-[4/3] overflow-hidden rounded-md bg-white">
                <Image
                  src={image.url}
                  alt={image.altText ?? step.title ?? ""}
                  width={image.width ?? 400}
                  height={image.height ?? 300}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}
            <h3 className="mt-4 font-heading text-lg font-semibold text-maroon">{step.title}</h3>
            {step.body ? <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p> : null}
          </li>
        );
      })}
    </ol>
  );
}
