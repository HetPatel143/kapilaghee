"use client";

import { useEffect } from "react";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Admin error boundary:", error.digest ?? error.message);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <p className="font-heading text-xl font-semibold text-ink">Something went wrong</p>
      <p className="max-w-sm text-sm text-muted">
        This page hit an unexpected error. Your other changes are safe. Try again, or go back to the Dashboard.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-sm bg-maroon px-4 py-2 text-sm font-medium text-white hover:bg-maroon-dark"
        >
          Try Again
        </button>
        <a href="/admin" className="rounded-sm border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-black/5">
          Back to Dashboard
        </a>
      </div>
    </div>
  );
}
