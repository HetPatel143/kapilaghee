import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { getContactActions } from "@/lib/contact";
import type { BusinessSettings } from "@prisma/client";

/**
 * Deliberately has no button-styled CTA — the Final CTA section immediately below this
 * one already provides the page's closing action. A second full button here just for
 * "Get Directions"/"Contact Us" was redundant clutter; a plain link is enough.
 */
export function LocationSection({ settings }: { settings: BusinessSettings | null }) {
  if (!settings?.address) return null;
  const directions = getContactActions(settings).find((a) => a.kind === "maps");

  return (
    <Section tone="gold" className="py-12 sm:py-16">
      <Container className="flex flex-col items-center gap-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-warm-gold">
          Visit Kapila Dairy Farm
        </p>
        <h2 className="font-heading text-3xl font-semibold text-maroon sm:text-4xl">
          Surat, Gujarat
        </h2>
        <address className="max-w-md whitespace-pre-line text-base not-italic leading-relaxed text-ink/80">
          {settings.address}
        </address>
        {directions ? (
          <a
            href={directions.href}
            target="_blank"
            rel="noreferrer noopener"
            className="text-sm font-semibold uppercase tracking-[0.1em] text-maroon hover:underline"
          >
            Get Directions &rarr;
          </a>
        ) : null}
      </Container>
    </Section>
  );
}
