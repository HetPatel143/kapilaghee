export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="rounded-md border border-dashed border-border bg-white/50 px-6 py-10 text-center">
      <p className="font-heading text-lg text-maroon">{title}</p>
      {description ? <p className="mt-2 text-sm text-muted">{description}</p> : null}
    </div>
  );
}
