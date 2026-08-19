import type { BusinessSettings } from "@prisma/client";
import { Container } from "@/components/shared/Container";
import { Logo } from "@/components/shared/Logo";
import { NAV_LINKS } from "@/lib/nav";
import { getContactActions } from "@/lib/contact";

export function Footer({ settings }: { settings: BusinessSettings | null }) {
  const year = new Date().getFullYear();
  const contactActions = getContactActions(settings);
  const social = [
    settings?.instagram ? { label: "Instagram", href: settings.instagram } : null,
    settings?.facebook ? { label: "Facebook", href: settings.facebook } : null,
  ].filter((v): v is { label: string; href: string } => Boolean(v));

  return (
    <footer className="bg-dark-brown text-cream/90">
      <Container className="flex flex-wrap gap-x-12 gap-y-12 py-16 sm:py-20 lg:py-24">
        <div className="min-w-[220px] flex-[2_1_260px]">
          <Logo tone="cream" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/70">
            Pure A2 Gir Cow Ghee — no added ingredients, crafted in Surat, Gujarat.
          </p>
        </div>

        <div className="min-w-[140px] flex-1">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-kapila-gold">Explore</h3>
          <ul className="mt-5 space-y-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-sm text-cream/75 transition-colors hover:text-cream">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-[180px] flex-1">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-kapila-gold">Visit Us</h3>
          {settings?.address ? (
            <address className="mt-5 whitespace-pre-line text-sm not-italic leading-relaxed text-cream/75">
              {settings.address}
            </address>
          ) : null}
        </div>

        {contactActions.length > 0 || social.length > 0 ? (
          <div className="min-w-[160px] flex-1">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-kapila-gold">Get in Touch</h3>
            <ul className="mt-5 space-y-3">
              {contactActions
                .filter((a) => a.kind !== "maps")
                .map((action) => (
                  <li key={action.kind}>
                    <a href={action.href} className="text-sm text-cream/75 transition-colors hover:text-cream">
                      {action.label}
                    </a>
                  </li>
                ))}
              {social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-sm text-cream/75 transition-colors hover:text-cream"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Container>

      <div className="border-t border-cream/10">
        <Container className="flex flex-col items-center justify-between gap-4 py-7 text-center text-xs text-cream/60 sm:flex-row sm:text-left">
          <p>
            &copy; {year} {settings?.businessName ?? "Kapila Dairy Farm"}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <a href="/privacy" className="transition-colors hover:text-cream">
              Privacy Policy
            </a>
            <a href="/terms" className="transition-colors hover:text-cream">
              Terms &amp; Conditions
            </a>
            <span>FSSAI Licensed &amp; Lab Tested</span>
          </div>
        </Container>
      </div>
    </footer>
  );
}
