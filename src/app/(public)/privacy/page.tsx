import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { getBusinessSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Kapila Dairy Farm handles information submitted through this website.",
  alternates: { canonical: "/privacy" },
};

export default async function PrivacyPolicyPage() {
  const settings = await getBusinessSettings();

  return (
    <Section tone="cream">
      <Container className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-warm-gold">Legal</p>
        <h1 className="mt-3 font-heading text-3xl font-semibold text-maroon sm:text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted">Last updated: 2026</p>

        <div className="mt-8 space-y-6 text-base leading-relaxed text-ink/85">
          <p>
            This website is a brand and product showcase for {settings?.businessName ?? "Kapila Dairy Farm"}.
            It is not currently an e-commerce store, and we do not process online payments or store
            payment information.
          </p>

          <div>
            <h2 className="font-heading text-xl font-semibold text-maroon">Information We Collect</h2>
            <p className="mt-2">
              When you submit the enquiry form on our Contact page, we collect the information you
              provide: your name, phone number and/or email address, and your message. If you enquire
              about a specific product, we also record which product/size you asked about.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-maroon">How We Use It</h2>
            <p className="mt-2">
              We use this information solely to respond to your enquiry. We do not sell or share your
              information with third parties for marketing purposes.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-maroon">Cookies</h2>
            <p className="mt-2">
              This website does not use marketing or tracking cookies. A session cookie is used only
              for the password-protected admin dashboard used by Kapila Dairy Farm staff.
            </p>
          </div>

          <div className="rounded-md border border-dashed border-border bg-white/60 p-5">
            <p className="text-sm text-muted">
              <strong className="text-ink">Note:</strong> this is a plain-language summary, not a
              legally drafted privacy policy. A complete, legally reviewed version is
              <span className="font-medium text-maroon"> [BUSINESS/LEGAL REVIEW REQUIRED]</span> and
              will replace this page once available.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-maroon">Contact Us</h2>
            <p className="mt-2">
              For any privacy questions, please reach us via our{" "}
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
