export function SectionCard({
  title,
  description,
  defaultOpen = false,
  children,
}: {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-md border border-border bg-white [&_summary::-webkit-details-marker]:hidden"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4">
        <div>
          <p className="font-heading text-base font-semibold text-ink">{title}</p>
          {description ? <p className="mt-0.5 text-xs text-muted">{description}</p> : null}
        </div>
        <span
          aria-hidden="true"
          className="shrink-0 text-lg text-ink/50 transition-transform group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="border-t border-border p-5">{children}</div>
    </details>
  );
}
