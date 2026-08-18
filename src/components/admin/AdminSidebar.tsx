"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { cn } from "@/lib/utils";

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav aria-label="Admin" className="flex h-full flex-col gap-1 p-4">
      {ADMIN_NAV.map((item) => {
        if ("children" in item) {
          return (
            <div key={item.label} className="mt-2 first:mt-0">
              <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                {item.label}
              </p>
              <div className="flex flex-col gap-0.5">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={onNavigate}
                    aria-current={isActive(child.href) ? "page" : undefined}
                    className={cn(
                      "rounded-sm px-3 py-2 text-sm transition-colors",
                      isActive(child.href)
                        ? "bg-maroon/10 font-medium text-maroon"
                        : "text-ink/75 hover:bg-black/[0.03] hover:text-ink"
                    )}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive(item.href, "exact" in item && item.exact) ? "page" : undefined}
            className={cn(
              "rounded-sm px-3 py-2 text-sm transition-colors",
              isActive(item.href, "exact" in item && item.exact)
                ? "bg-maroon/10 font-medium text-maroon"
                : "text-ink/75 hover:bg-black/[0.03] hover:text-ink"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
