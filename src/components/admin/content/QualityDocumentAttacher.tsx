"use client";

import { attachDocumentToSection, detachDocumentFromSection } from "@/app/actions/admin-content";
import { inputClasses } from "@/components/admin/fieldStyles";
import type { Document, PageSectionDocument } from "@prisma/client";

type AttachedDoc = PageSectionDocument & { document: Document };

export function QualityDocumentAttacher({
  sectionId,
  attached,
  available,
}: {
  sectionId: string;
  attached: AttachedDoc[];
  available: Document[];
}) {
  const attachedIds = new Set(attached.map((a) => a.documentId));
  const unattached = available.filter((d) => !attachedIds.has(d.id));

  return (
    <div className="space-y-3 border-t border-border pt-5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">Attached Documents</p>

      {attached.length > 0 ? (
        <ul className="space-y-2">
          {attached.map((a) => (
            <li key={a.id} className="flex items-center justify-between rounded-sm border border-border px-3 py-2 text-sm">
              <a href={a.document.url} target="_blank" rel="noreferrer noopener" className="text-maroon hover:underline">
                {a.document.label}
              </a>
              <form action={detachDocumentFromSection}>
                <input type="hidden" name="pageSectionDocumentId" value={a.id} />
                <button type="submit" className="text-xs font-medium text-error hover:underline">
                  Detach
                </button>
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">No documents attached yet.</p>
      )}

      {unattached.length > 0 ? (
        <form action={attachDocumentToSection} className="flex flex-wrap items-end gap-3">
          <input type="hidden" name="sectionId" value={sectionId} />
          <div className="w-64">
            <label htmlFor={`doc-${sectionId}`} className="mb-1 block text-xs font-medium text-muted">
              Attach a document
            </label>
            <select id={`doc-${sectionId}`} name="documentId" defaultValue="" className={inputClasses()}>
              <option value="" disabled>
                Select a document...
              </option>
              {unattached.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="rounded-sm border border-border px-3 py-2 text-sm font-medium text-ink hover:bg-black/5">
            Attach
          </button>
        </form>
      ) : (
        <p className="text-xs text-muted">
          No more documents available. Upload one from the <a href="/admin/documents" className="text-maroon hover:underline">Documents</a> page first.
        </p>
      )}
    </div>
  );
}
