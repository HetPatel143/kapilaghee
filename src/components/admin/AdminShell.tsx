"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { logoutAction } from "@/app/actions/admin-auth";
import { cn } from "@/lib/utils";

export function AdminShell({
  userEmail,
  children,
}: {
  userEmail: string;
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF6EC]">
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-white px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-ink/70 hover:bg-black/5 lg:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>
          <Link href="/admin" className="font-heading text-lg font-semibold text-maroon">
            Kapila Admin
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted sm:inline">{userEmail}</span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-sm border border-border px-3 py-1.5 text-sm font-medium text-ink/80 hover:bg-black/5"
            >
              Logout
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1440px]">
        <aside className="hidden w-60 shrink-0 border-r border-border bg-white lg:block">
          <div className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
            <AdminSidebar />
          </div>
        </aside>

        {/* Mobile drawer */}
        <div
          className={cn(
            "fixed inset-0 z-50 lg:hidden",
            drawerOpen ? "pointer-events-auto" : "pointer-events-none"
          )}
          aria-hidden={!drawerOpen}
        >
          <div
            className={cn(
              "absolute inset-0 bg-black/30 transition-opacity",
              drawerOpen ? "opacity-100" : "opacity-0"
            )}
            onClick={() => setDrawerOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation"
            inert={!drawerOpen}
            className={cn(
              "absolute inset-y-0 left-0 w-64 bg-white shadow-xl transition-transform duration-200",
              drawerOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="flex h-14 items-center justify-between border-b border-border px-4">
              <span className="font-heading text-base font-semibold text-maroon">Menu</span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close navigation menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-ink/70 hover:bg-black/5"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                  <path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <AdminSidebar onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
