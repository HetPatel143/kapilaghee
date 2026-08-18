export function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-border bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-2 font-heading text-3xl font-semibold text-maroon">{value}</p>
    </div>
  );
}
