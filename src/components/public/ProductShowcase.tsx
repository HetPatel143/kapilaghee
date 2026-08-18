import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { EmptyState } from "@/components/shared/EmptyState";
import { ProductCard } from "@/components/public/ProductCard";
import type { ProductWithRelations } from "@/lib/types";

export function ProductShowcase({ products }: { products: ProductWithRelations[] }) {
  return (
    <Section tone="white">
      <Container>
        <SectionHeading
          eyebrow="Our Ghee"
          title="Kapila A2 Gir Cow Ghee"
          description="Made from Gir cow milk, with no added ingredients."
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
