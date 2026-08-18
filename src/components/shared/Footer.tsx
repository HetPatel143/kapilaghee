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
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo tone="cream" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
            Pure A2 Gir Cow Ghee — no added ingredients, crafted in Surat, Gujarat.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-kapila-gold">Explore</h3>
          <ul className="mt-4 space-y-2.5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-sm text-cream/75 hover:text-cream">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-kapila-gold">Visit Us</h3>
          {settings?.address ? (
            <address className="mt-4 whitespace-pre-line text-sm not-italic leading-relaxed text-cream/75">
              {settings.address}
            </address>
          ) : null}
        </div>

        {contactActions.length > 0 || social.length > 0 ? (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-kapila-gold">Get in Touch</h3>
            <ul className="mt-4 space-y-2.5">
              {contactActions
                .filter((a) => a.kind !== "maps")
                .map((action) => (
                  <li key={action.kind}>
                    <a href={action.href} className="text-sm text-cream/75 hover:text-cream">
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
                    className="text-sm text-cream/75 hover:text-cream"
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
        <Container className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-cream/60 sm:flex-row">
          <p>
            &copy; {year} {settings?.businessName ?? "Kapila Dairy Farm"}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a href="/privacy" className="hover:text-cream">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-cream">
              Terms &amp; Conditions
            </a>
            <span>FSSAI Licensed &amp; Lab Tested</span>
          </div>
        </Container>
      </div>
    </footer>
  );
}
