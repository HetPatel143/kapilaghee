import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProductBasicInfoForm } from "@/components/admin/products/ProductBasicInfoForm";

export const metadata: Metadata = { title: "Add Product | Kapila Admin" };

export default function NewProductPage() {
  return (
    <div>
      <PageHeader
        title="Add Product"
        breadcrumbs={[{ label: "Products", href: "/admin/products" }, { label: "Add Product" }]}
        description="Start with the basic details. You can add images and pack sizes once the product is created."
      />
      <div className="max-w-2xl">
        <ProductBasicInfoForm />
      </div>
    </div>
  );
}
