export function FormField({
  label,
  htmlFor,
  error,
  hint,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {optional ? <span className="ml-1 font-normal text-muted">(optional)</span> : null}
      </label>
      {children}
      {hint && !error ? <p className="mt-1.5 text-xs text-muted">{hint}</p> : null}
      {error ? (
        <p role="alert" className="mt-1.5 text-xs text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
