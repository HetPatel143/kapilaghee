import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProductCard } from "@/components/public/ProductCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { getActiveProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Our Ghee",
  description:
    "Kapila A2 Gir Cow Ghee — pure ghee made from Gir cow milk with no added ingredients. Available in 1 KG, 5 KG and 15 KG packs.",
  alternates: { canonical: "/our-ghee" },
};

export default async function OurGheePage() {
  const products = await getActiveProducts();

  return (
    <Section tone="cream">
      <Container>
        <SectionHeading
          eyebrow="Our Ghee"
          title="Kapila A2 Gir Cow Ghee"
          description="Pure ghee, made from Gir cow milk, with no added ingredients. This is currently a showcase and enquiry site — reach out and our team will help with your order."
        />
        <div className="mt-10 space-y-6">
          {products.length > 0 ? (
            products.map((product) => <ProductCard key={product.id} product={product} />)
          ) : (
            <EmptyState
              title="No products available right now"
              description="Please check back shortly, or contact us directly."
            />
          )}
        </div>
      </Container>
    </Section>
  );
}
