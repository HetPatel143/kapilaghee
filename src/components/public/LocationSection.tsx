import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { LinkButton } from "@/components/shared/Button";
import { getContactActions } from "@/lib/contact";
import type { BusinessSettings } from "@prisma/client";

export function LocationSection({ settings }: { settings: BusinessSettings | null }) {
  if (!settings?.address) return null;
  const directions = getContactActions(settings).find((a) => a.kind === "maps");

  return (
    <Section tone="gold">
      <Container className="flex flex-col items-center gap-6 text-center">
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
          <LinkButton href={directions.href} target="_blank" rel="noreferrer noopener" size="lg">
            Get Directions
          </LinkButton>
        ) : (
          <LinkButton href="/contact" variant="secondary" size="lg">
            Contact Us
          </LinkButton>
        )}
      </Container>
    </Section>
  );
}
