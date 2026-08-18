import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { MediaUploadForm } from "@/components/admin/media/MediaUploadForm";
import { MediaTile } from "@/components/admin/media/MediaTile";
import { listMediaAdmin } from "@/lib/admin-data";
import { cn } from "@/lib/utils";
import type { MediaCategory } from "@prisma/client";

export const metadata: Metadata = { title: "Media Library | Kapila Admin" };

const CATEGORIES: (MediaCategory | "all")[] = ["all", "product", "homepage", "story", "process", "quality", "other"];

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = (category as MediaCategory | "all") ?? "all";
  const media = await listMediaAdmin(activeCategory);

  return (
    <div>
      <PageHeader title="Media Library" description="Images used across the website. Upload once, reuse anywhere." />

      <MediaUploadForm />

      <div className="mt-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={c === "all" ? "/admin/media" : `/admin/media?category=${c}`}
            className={cn(
              "rounded-sm border px-3 py-1.5 text-xs font-medium capitalize",
              activeCategory === c ? "border-maroon bg-maroon/10 text-maroon" : "border-border text-ink/70 hover:bg-black/5"
            )}
          >
            {c}
          </Link>
        ))}
      </div>

      <div className="mt-6">
        {media.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {media.map((m) => (
              <MediaTile key={m.id} media={m} />
            ))}
          </div>
        ) : (
          <EmptyState title="No images yet" description="Upload an image using the form above." />
        )}
      </div>
    </div>
  );
}
