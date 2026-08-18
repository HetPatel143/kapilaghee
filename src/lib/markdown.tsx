import { Fragment } from "react";

/**
 * A tiny, intentionally limited markdown-like renderer for admin-authored long-form
 * content (currently: Our Story). It supports exactly: paragraphs, **bold**, *italic*,
 * [link](url) with an http/https/mailto allowlist, "- " bullet lists, and "## "/"### "
 * headings.
 *
 * This never uses dangerouslySetInnerHTML — it parses the stored plain-text markup and
 * builds React elements directly, so there is no HTML-injection surface regardless of
 * what an admin types. This is the "sanitize stored/rendered content" requirement met
 * by construction rather than by a sanitizer library.
 */

const SAFE_URL = /^(https?:|mailto:)/i;

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const pattern = /\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\(([^)]+)\)/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const key = `${keyPrefix}-${i++}`;
    if (match[1] !== undefined) {
      nodes.push(<strong key={key}>{match[1]}</strong>);
    } else if (match[2] !== undefined) {
      nodes.push(<em key={key}>{match[2]}</em>);
    } else if (match[3] !== undefined && match[4] !== undefined) {
      const href = match[4].trim();
      if (SAFE_URL.test(href)) {
        nodes.push(
          <a key={key} href={href} className="underline underline-offset-2 hover:text-maroon" target={href.startsWith("mailto:") ? undefined : "_blank"} rel={href.startsWith("mailto:") ? undefined : "noreferrer noopener"}>
            {match[3]}
          </a>
        );
      } else {
        nodes.push(match[3]);
      }
    }
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

export function RichText({ content, className }: { content: string; className?: string }) {
  const blocks = content.trim().split(/\n{2,}/);

  return (
    <div className={className}>
      {blocks.map((block, i) => {
        const key = `block-${i}`;
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);

        if (lines.length > 0 && lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={key} className="my-4 list-disc space-y-1.5 pl-5">
              {lines.map((l, j) => (
                <li key={j}>{renderInline(l.slice(2), `${key}-${j}`)}</li>
              ))}
            </ul>
          );
        }

        if (block.startsWith("### ")) {
          return (
            <h4 key={key} className="mt-6 mb-2 font-heading text-lg font-semibold text-maroon">
              {renderInline(block.slice(4), key)}
            </h4>
          );
        }

        if (block.startsWith("## ")) {
          return (
            <h3 key={key} className="mt-8 mb-3 font-heading text-xl font-semibold text-maroon">
              {renderInline(block.slice(3), key)}
            </h3>
          );
        }

        return (
          <p key={key} className="mb-4 leading-relaxed last:mb-0">
            {block.split("\n").map((line, j, arr) => (
              <Fragment key={j}>
                {renderInline(line, `${key}-${j}`)}
                {j < arr.length - 1 ? <br /> : null}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
