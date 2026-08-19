import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { EmptyState } from "@/components/shared/EmptyState";
import { EnquiryForm } from "@/components/public/EnquiryForm";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import { LinkButton } from "@/components/shared/Button";
import { getBusinessSettings, getProductBySlug, getVariantById, getActiveFaqs } from "@/lib/data";
import { getContactActions } from "@/lib/contact";
import { formatVariantLabel } from "@/lib/utils";
import { buildLocalBusinessJsonLd } from "@/lib/structured-data";

const siteUrl = process.env.SITE_URL ?? "https://www.kapiladairyfarm.com";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Kapila Dairy Farm in Surat, Gujarat, or send us an enquiry about our A2 Gir Cow Ghee.",
  alternates: { canonical: "/contact" },
};

type Props = { searchParams: Promise<{ product?: string; variant?: string }> };

export default async function ContactPage({ searchParams }: Props) {
  const { product: productSlug, variant: variantId } = await searchParams;

  const [settings, product, variant, faqs] = await Promise.all([
    getBusinessSettings(),
    productSlug ? getProductBySlug(productSlug) : Promise.resolve(null),
    variantId ? getVariantById(variantId) : Promise.resolve(null),
    getActiveFaqs(),
  ]);

  const contactActions = getContactActions(settings);
  const mapsAction = contactActions.find((a) => a.kind === "maps");
  const quickActions = contactActions.filter((a) => a.kind !== "maps");

  const contextLabel = variant
    ? `Kapila A2 Gir Cow Ghee — ${formatVariantLabel(variant.size, variant.unit)}`
    : product
      ? product.name
      : undefined;

  const jsonLd = buildLocalBusinessJsonLd(settings, siteUrl);

  return (
    <>
      <Section tone="cream">
        {jsonLd ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        ) : null}
        <Container>
          <SectionHeading eyebrow="Contact" title="Get in Touch" description="We'd be happy to help." />

          <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-maroon">Visit Kapila Dairy Farm</h2>
              {settings?.address ? (
                <address className="mt-4 whitespace-pre-line text-base not-italic leading-relaxed text-ink/80">
                  {settings.address}
                </address>
              ) : null}

              {mapsAction ? (
                <a
                  href={mapsAction.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-4 inline-block text-sm font-semibold uppercase tracking-[0.1em] text-maroon hover:underline"
                >
                  Open in Google Maps &rarr;
                </a>
              ) : null}

              {quickActions.length > 0 ? (
                <ul className="mt-8 space-y-3 border-t border-border pt-6">
                  {quickActions.map((action) => (
                    <li key={action.kind}>
                      <a href={action.href} className="text-base font-medium text-ink hover:text-maroon">
                        {action.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div className="rounded-md border border-border bg-white p-6 sm:p-8">
              <h2 className="mb-6 font-heading text-2xl font-semibold text-maroon">Send an Enquiry</h2>
              <EnquiryForm
                productId={product?.id}
                variantId={variant?.id}
                contextLabel={contextLabel}
                whatsappNumber={settings?.whatsapp}
              />
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="white" id="faq">
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
            <LinkButton href="#enquiry-form" size="lg">
              Ask Us Directly
            </LinkButton>
          </div>
        </Container>
      </Section>
    </>
  );
}
