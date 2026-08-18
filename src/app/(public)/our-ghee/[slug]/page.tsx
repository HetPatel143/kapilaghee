import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { ProductPurchasePanel } from "@/components/public/ProductPurchasePanel";
import { getProductBySlug, getActiveProducts } from "@/lib/data";
import { buildProductJsonLd } from "@/lib/structured-data";

const siteUrl = process.env.SITE_URL ?? "https://www.kapiladairyfarm.com";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const products = await getActiveProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/our-ghee/${product.slug}` },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const jsonLd = buildProductJsonLd(product, siteUrl);

  return (
    <Section tone="cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container>
        <nav aria-label="Breadcrumb" className="mb-8 text-xs text-muted">
          <Link href="/our-ghee" className="hover:text-maroon">
            Our Ghee
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        <ProductPurchasePanel product={product} />
      </Container>
    </Section>
  );
}
