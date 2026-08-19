import Link from "next/link";

export function StatCard({ label, value, href }: { label: string; value: number; href?: string }) {
  const content = (
    <>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-2 font-heading text-3xl font-semibold text-maroon">{value}</p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="block rounded-md border border-border bg-white p-5 transition-colors hover:border-maroon">
        {content}
      </Link>
    );
  }

  return <div className="rounded-md border border-border bg-white p-5">{content}</div>;
}
