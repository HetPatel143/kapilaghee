import type { BusinessSettings } from "@prisma/client";

export type ContactAction = {
  label: string;
  href: string;
  kind: "phone" | "whatsapp" | "email" | "maps";
};

function toWhatsAppDigits(raw: string) {
  return raw.replace(/[^\d]/g, "");
}

/** Keeps a leading "+" (international prefix) but strips everything else non-numeric. */
function toTelHref(raw: string) {
  const trimmed = raw.trim();
  const plus = trimmed.startsWith("+") ? "+" : "";
  return `tel:${plus}${trimmed.replace(/[^\d]/g, "")}`;
}

/**
 * Builds the list of contact quick-actions that are actually usable right now.
 * Nothing is invented here — an action only appears if the corresponding
 * BusinessSettings field is configured. This is what lets "Enquire Now" and the
 * Contact page degrade gracefully while phone/WhatsApp/email are not yet set up.
 */
export function getContactActions(settings: Pick<BusinessSettings, "phone" | "whatsapp" | "email" | "googleMapsUrl"> | null | undefined): ContactAction[] {
  if (!settings) return [];
  const actions: ContactAction[] = [];

  if (settings.phone) {
    actions.push({ label: "Call Us", href: toTelHref(settings.phone), kind: "phone" });
  }
  if (settings.whatsapp) {
    actions.push({
      label: "WhatsApp Us",
      href: `https://wa.me/${toWhatsAppDigits(settings.whatsapp)}`,
      kind: "whatsapp",
    });
  }
  if (settings.email) {
    actions.push({ label: "Email Us", href: `mailto:${settings.email}`, kind: "email" });
  }
  if (settings.googleMapsUrl) {
    actions.push({ label: "Get Directions", href: settings.googleMapsUrl, kind: "maps" });
  }

  return actions;
}
