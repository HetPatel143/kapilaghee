import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import type { PageSectionWithRelations } from "@/lib/types";
import { findSection } from "@/lib/types";

export function EverydayUse({ sections }: { sections: PageSectionWithRelations[] }) {
  const content = findSection(sections, "everyday-use-intro");
  if (!content) return null;

  return (
    <Section tone="white">
      <Container className="flex flex-col items-center gap-6 text-center">
        <div
          aria-hidden="true"
          className="h-16 w-16 overflow-hidden rounded-full border border-warm-gold/50 bg-cream"
        >
          <Image
            src="/images/brand/cow-medallion.jpg"
            alt=""
            width={330}
            height={245}
            className="h-full w-full scale-150 object-cover object-[60%_40%]"
          />
        </div>
        <SectionHeading
          align="center"
          eyebrow="Everyday Use"
          title={content.title ?? "Everyday Use"}
          description={content.body ?? undefined}
          className="mx-auto"
        />
      </Container>
    </Section>
  );
}
