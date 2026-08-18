import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { listProductsAdmin } from "@/lib/admin-data";
import { setProductStatus } from "@/app/actions/admin-products";

export const metadata: Metadata = { title: "Products | Kapila Admin" };

const dateFormatter = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export default async function AdminProductsPage() {
  const products = await listProductsAdmin();

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage the ghee products shown on the public website."
        actions={
          <Link
            href="/admin/products/new"
            className="rounded-sm bg-maroon px-4 py-2 text-sm font-medium text-white hover:bg-maroon-dark"
          >
            Add Product
          </Link>
        }
      />

      {products.length === 0 ? (
        <EmptyState title="No products yet" description="Add your first product to get started." />
      ) : (
        <div className="overflow-x-auto rounded-md border border-border bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border bg-black/[0.02] text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Variants</th>
                <th className="px-4 py-3 font-medium">Updated</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3.5">
                    <p className="font-medium text-ink">{product.name}</p>
                    <p className="text-xs text-muted">/{product.slug}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={product.status} />
                  </td>
                  <td className="px-4 py-3.5 text-ink/80">
                    {product.variants.filter((v) => v.status === "active").length} active / {product.variants.length} total
                  </td>
                  <td className="px-4 py-3.5 text-ink/70">{dateFormatter.format(product.updatedAt)}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/products/${product.id}/edit`} className="font-medium text-maroon hover:underline">
                        Edit
                      </Link>
                      <a
                        href={`/our-ghee/${product.slug}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-ink/60 hover:text-ink"
                      >
                        View
                      </a>
                      <form action={setProductStatus.bind(null, product.status === "active" ? "inactive" : "active")}>
                        <input type="hidden" name="id" value={product.id} />
                        <button type="submit" className="text-ink/60 hover:text-ink">
                          {product.status === "active" ? "Deactivate" : "Activate"}
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
