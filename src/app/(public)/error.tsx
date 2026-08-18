"use client";

import { useEffect } from "react";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { LinkButton } from "@/components/shared/Button";

export default function PublicError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Server-side detail stays in server logs (via Next's own error reporting); this
    // client log is deliberately minimal — no stack trace, no internal paths — so nothing
    // sensitive reaches the browser console.
    console.error("Public site error boundary:", error.digest ?? error.message);
  }, [error]);

  return (
    <Section tone="cream" className="min-h-[60vh]">
      <Container className="flex flex-col items-center gap-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-warm-gold">Something went wrong</p>
        <h1 className="font-heading text-3xl font-semibold text-maroon sm:text-4xl">
          We couldn&rsquo;t load this page
        </h1>
        <p className="max-w-md text-base text-muted">
          Please try again, or head back to the homepage. If this keeps happening, contact us and we&rsquo;ll take a look.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-sm bg-maroon px-7 py-3.5 text-base font-medium tracking-wide text-white transition-colors hover:bg-maroon-dark"
          >
            Try Again
          </button>
          <LinkButton href="/" variant="secondary" size="lg">
            Back to Home
          </LinkButton>
        </div>
      </Container>
    </Section>
  );
}
