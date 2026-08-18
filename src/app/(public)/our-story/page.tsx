import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { LinkButton } from "@/components/shared/Button";
import { getPageSections } from "@/lib/data";
import { findSection } from "@/lib/types";
import { RichText } from "@/lib/markdown";

export const metadata: Metadata = {
  title: "Our Story",
  description: "The story of Kapila Dairy Farm, a Gir cow ghee business based in Surat, Gujarat.",
  alternates: { canonical: "/our-story" },
};

export default async function OurStoryPage() {
  const sections = await getPageSections("story");
  const intro = findSection(sections, "story-intro");
  const placeholder = findSection(sections, "story-placeholder");
  const image = intro?.media[0]?.media ?? placeholder?.media[0]?.media;

  return (
    <>
      <Section tone="maroon" className="py-16 sm:py-20">
        <Container className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-kapila-gold">Our Story</p>
          <h1 className="mt-4 font-heading text-4xl font-semibold text-cream sm:text-5xl">
            {intro?.title ?? "Our Story"}
          </h1>
        </Container>
      </Section>

      <Section tone="cream">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            {intro?.body ? <RichText content={intro.body} className="text-lg text-ink/85" /> : null}
            {placeholder?.body ? (
              <p className="mt-6 rounded-md border border-dashed border-border bg-white/60 p-6 text-base leading-relaxed text-muted">
                {placeholder.body}
              </p>
            ) : null}
          </div>
          {image ? (
            <div className="mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-md bg-white">
              <Image
                src={image.url}
                alt={image.altText ?? "Kapila Dairy Farm"}
                width={image.width ?? 800}
                height={image.height ?? 600}
                className="h-full w-full object-contain p-6"
              />
            </div>
          ) : null}
        </Container>
      </Section>

      <Section tone="white">
        <Container className="flex flex-col items-center gap-5 text-center">
          <h2 className="font-heading text-2xl font-semibold text-maroon sm:text-3xl">
            Want to know more?
          </h2>
          <LinkButton href="/contact" size="lg">
            Enquire Now
          </LinkButton>
        </Container>
      </Section>
    </>
  );
}
