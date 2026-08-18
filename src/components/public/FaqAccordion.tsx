"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { FAQ } from "@prisma/client";

export function FaqAccordion({ faqs }: { faqs: FAQ[] }) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  return (
    <div className="divide-y divide-border border-y border-border">
      {faqs.map((faq) => {
        const open = openId === faq.id;
        const panelId = `faq-panel-${faq.id}`;
        const buttonId = `faq-button-${faq.id}`;
        return (
          <div key={faq.id}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : faq.id)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="font-heading text-lg font-medium text-ink">{faq.question}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "shrink-0 text-2xl leading-none text-maroon transition-transform duration-200",
                    open && "rotate-45"
                  )}
                >
                  +
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!open}
              className={cn(
                "grid overflow-hidden transition-all duration-300 ease-in-out",
                open ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <p className="min-h-0 text-sm leading-relaxed text-muted sm:text-base">{faq.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
