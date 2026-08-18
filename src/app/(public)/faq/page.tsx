import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { LinkButton } from "@/components/shared/Button";
import { EmptyState } from "@/components/shared/EmptyState";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import { getActiveFaqs } from "@/lib/data";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Kapila A2 Gir Cow Ghee, sizes, quality and how to order.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const faqs = await getActiveFaqs();

  return (
    <Section tone="cream">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" align="center" className="mx-auto" />

        <div className="mt-10">
          {faqs.length > 0 ? (
            <FaqAccordion faqs={faqs} />
          ) : (
            <EmptyState title="No FAQs available yet" description="Please check back shortly, or contact us directly." />
          )}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <p className="text-base text-muted">Still have a question?</p>
          <LinkButton href="/contact" size="lg">
            Contact Us
          </LinkButton>
        </div>
      </Container>
    </Section>
  );
}
