import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import Link from "next/link";
import { SectionHeading } from "@/components/shared/SectionHeading";
import type { PageSectionWithRelations } from "@/lib/types";
import { findSection } from "@/lib/types";

export function StorySection({ sections }: { sections: PageSectionWithRelations[] }) {
  const teaser = findSection(sections, "story-teaser");
  if (!teaser) return null;
  const image = teaser.media[0]?.media;

  return (
    <Section tone="white">
      <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className={image ? "" : "lg:col-span-2"}>
          <SectionHeading eyebrow="Our Story" title={teaser.title ?? "Our Story"} description={teaser.body ?? undefined} />
          <div className="mt-7">
            <Link href="/our-story" className="text-sm font-semibold uppercase tracking-[0.1em] text-maroon hover:underline">
              Read Our Story &rarr;
            </Link>
          </div>
        </div>
        {image ? (
          <div className="aspect-[4/3] overflow-hidden rounded-md">
            <Image
              src={image.url}
              alt={image.altText ?? "Kapila Dairy Farm"}
              width={image.width ?? 800}
              height={image.height ?? 600}
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
