import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { EmptyState } from "@/components/shared/EmptyState";
import { ProductPurchasePanel } from "@/components/public/ProductPurchasePanel";
import { getActiveProducts } from "@/lib/data";
import { buildProductJsonLd } from "@/lib/structured-data";

const siteUrl = process.env.SITE_URL ?? "https://www.kapiladairyfarm.com";

export const metadata: Metadata = {
  title: "Our Ghee",
  description:
    "Kapila A2 Gir Cow Ghee — pure ghee made from Gir cow milk with no added ingredients. Available in 1 KG, 5 KG and 15 KG packs.",
  alternates: { canonical: "/our-ghee" },
};

export default async function OurGheePage() {
  const products = await getActiveProducts();
  const product = products[0] ?? null;
  const jsonLd = product ? buildProductJsonLd(product, siteUrl) : null;

  return (
    <Section tone="cream">
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      <Container>
        {product ? (
          <ProductPurchasePanel product={product} />
        ) : (
          <EmptyState
            title="No products available right now"
            description="Please check back shortly, or contact us directly."
          />
        )}

        {products.length > 1 ? (
          <div className="mt-20 space-y-16 border-t border-border pt-16">
            {products.slice(1).map((p) => (
              <ProductPurchasePanel key={p.id} product={p} />
            ))}
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
