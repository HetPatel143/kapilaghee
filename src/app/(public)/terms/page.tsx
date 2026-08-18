import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { getBusinessSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms of use for the Kapila Dairy Farm website.",
  alternates: { canonical: "/terms" },
};

export default async function TermsPage() {
  const settings = await getBusinessSettings();

  return (
    <Section tone="cream">
      <Container className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-warm-gold">Legal</p>
        <h1 className="mt-3 font-heading text-3xl font-semibold text-maroon sm:text-4xl">Terms &amp; Conditions</h1>
        <p className="mt-2 text-sm text-muted">Last updated: 2026</p>

        <div className="mt-8 space-y-6 text-base leading-relaxed text-ink/85">
          <p>
            This website is operated by {settings?.businessName ?? "Kapila Dairy Farm"} as a brand and
            product information site. By using this website, you agree to the following:
          </p>

          <div>
            <h2 className="font-heading text-xl font-semibold text-maroon">No Online Sales</h2>
            <p className="mt-2">
              This website currently does not process orders, payments, or sell products online.
              Product and pack-size information shown here is for reference — to purchase, please
              contact us directly using the enquiry form or the details on our Contact page.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-maroon">Content Accuracy</h2>
            <p className="mt-2">
              We aim to keep product information, sizes, and business details accurate and up to
              date. Details such as pack sizes may change; please confirm current availability with
              us directly before making purchasing decisions.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-maroon">Intellectual Property</h2>
            <p className="mt-2">
              The Kapila Dairy Farm name, logo, and product photography belong to Kapila Dairy Farm
              and may not be reproduced without permission.
            </p>
          </div>

          <div className="rounded-md border border-dashed border-border bg-white/60 p-5">
            <p className="text-sm text-muted">
              <strong className="text-ink">Note:</strong> this is a plain-language summary, not
              legally drafted terms. A complete, legally reviewed version is
              <span className="font-medium text-maroon"> [BUSINESS/LEGAL REVIEW REQUIRED]</span> and
              will replace this page once available. Once online ordering is introduced, this page
              will be updated with applicable sale, shipping, and refund terms at that time.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-maroon">Contact Us</h2>
            <p className="mt-2">
              Questions about these terms can be sent via our{" "}
              <a href="/contact" className="text-maroon hover:underline">
                Contact page
              </a>
              .
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
