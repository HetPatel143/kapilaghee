import Image from "next/image";
import type { Document } from "@prisma/client";

const dateFormatter = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "long", year: "numeric" });

export function DocumentCard({ document }: { document: Document }) {
  const isImage = document.fileType.startsWith("image/");

  return (
    <a
      href={document.url}
      target="_blank"
      rel="noreferrer noopener"
      className="group block overflow-hidden rounded-md border border-border bg-white transition-shadow hover:shadow-[0_8px_24px_rgba(59,33,24,0.1)]"
    >
      {isImage ? (
        <div className="aspect-[4/3] overflow-hidden bg-cream">
          <Image
            src={document.url}
            alt={`${document.label} — document preview`}
            width={800}
            height={600}
            className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
      ) : null}
      <div className="p-5">
        <p className="font-heading text-lg font-semibold text-maroon">{document.label}</p>
        {document.issuedBy ? <p className="mt-1 text-sm text-muted">Issued by {document.issuedBy}</p> : null}
        {document.issuedDate ? (
          <p className="mt-0.5 text-xs uppercase tracking-wide text-muted/80">
            {dateFormatter.format(document.issuedDate)}
          </p>
        ) : null}
        <span className="mt-3 inline-block text-xs font-semibold uppercase tracking-[0.15em] text-maroon">
          View Full Document &rarr;
        </span>
      </div>
    </a>
  );
}
