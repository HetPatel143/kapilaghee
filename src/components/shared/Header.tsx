"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { LinkButton } from "@/components/shared/Button";
import { NAV_LINKS } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Reset menuOpen when the route changes — derived during render (React's documented
  // pattern for resetting state in response to a prop/value change) rather than in an
  // effect, which avoids an extra render pass.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        scrolled || menuOpen
          ? "bg-cream/95 shadow-[0_1px_0_0_var(--color-border)] backdrop-blur"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-5 py-3 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-sm font-medium tracking-wide text-ink/80 transition-colors hover:text-maroon",
                  active && "text-maroon"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <LinkButton href="/contact" size="md">
            Enquire Now
          </LinkButton>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-sm text-maroon lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
              <path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      <div
        id="mobile-menu"
        className={cn(
          "overflow-hidden bg-cream transition-[max-height] duration-300 ease-in-out lg:hidden",
          menuOpen ? "max-h-[28rem] border-t border-border" : "max-h-0"
        )}
      >
        <nav
          aria-label="Mobile"
          inert={!menuOpen}
          className="flex flex-col gap-1 px-5 py-4 sm:px-6"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-sm px-2 py-3 text-base font-medium text-ink/85 hover:bg-maroon/5 hover:text-maroon"
            >
              {link.label}
            </Link>
          ))}
          <LinkButton href="/contact" size="md" className="mt-3 w-full">
            Enquire Now
          </LinkButton>
        </nav>
      </div>
    </header>
  );
}
