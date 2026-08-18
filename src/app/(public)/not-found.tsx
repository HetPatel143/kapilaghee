import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { LinkButton } from "@/components/shared/Button";

export default function NotFound() {
  return (
    <Section tone="cream" className="min-h-[60vh]">
      <Container className="flex flex-col items-center gap-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-warm-gold">404</p>
        <h1 className="font-heading text-3xl font-semibold text-maroon sm:text-4xl">
          We couldn&apos;t find that page
        </h1>
        <p className="max-w-md text-base text-muted">
          The page you&rsquo;re looking for may have moved. Let&rsquo;s get you back on track.
        </p>
        <LinkButton href="/" size="lg">
          Back to Home
        </LinkButton>
      </Container>
    </Section>
  );
}
