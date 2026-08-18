import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProductBasicInfoForm } from "@/components/admin/products/ProductBasicInfoForm";
import { VariantManager } from "@/components/admin/products/VariantManager";
import { ProductImageManager } from "@/components/admin/products/ProductImageManager";
import { getProductAdmin } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Edit Product | Kapila Admin" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductAdmin(id);
  if (!product) notFound();

  return (
    <div>
      <PageHeader
        title={product.name}
        breadcrumbs={[{ label: "Products", href: "/admin/products" }, { label: "Edit" }]}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="space-y-6">
          <ProductBasicInfoForm product={product} />
        </div>
        <div className="space-y-6">
          <ProductImageManager productId={product.id} images={product.images} variants={product.variants} />
          <VariantManager productId={product.id} variants={product.variants} />
        </div>
      </div>
    </div>
  );
}
