"use client";

import { useActionState } from "react";
import { updateBusinessSettings } from "@/app/actions/admin-settings";
import type { ActionState } from "@/app/actions/admin-products";
import { FormField } from "@/components/admin/FormField";
import { SaveButton } from "@/components/admin/SaveButton";
import { FormStatusBanner } from "@/components/admin/FormStatusBanner";
import { inputClasses } from "@/components/admin/fieldStyles";
import type { BusinessSettings } from "@prisma/client";

const initialState: ActionState = { status: "idle" };

export function SettingsForm({ settings }: { settings: BusinessSettings | null }) {
  const [state, formAction] = useActionState(updateBusinessSettings, initialState);

  return (
    <form action={formAction} noValidate className="max-w-2xl space-y-8">
      <section className="space-y-4 rounded-md border border-border bg-white p-6">
        <h2 className="font-heading text-base font-semibold text-ink">Business</h2>
        <FormField label="Business Name" htmlFor="businessName" error={state.fieldErrors?.businessName}>
          <input
            id="businessName"
            name="businessName"
            required
            defaultValue={settings?.businessName}
            className={inputClasses(Boolean(state.fieldErrors?.businessName))}
          />
        </FormField>
        <FormField label="Address" htmlFor="address" error={state.fieldErrors?.address}>
          <textarea
            id="address"
            name="address"
            required
            rows={3}
            defaultValue={settings?.address}
            className={inputClasses(Boolean(state.fieldErrors?.address))}
          />
        </FormField>
      </section>

      <section className="space-y-4 rounded-md border border-border bg-white p-6">
        <h2 className="font-heading text-base font-semibold text-ink">Contact</h2>
        <p className="text-xs text-muted">
          Leave any of these blank if not available yet — the corresponding button/link is automatically hidden on the public website.
        </p>
        <FormField label="Phone" htmlFor="phone" optional error={state.fieldErrors?.phone}>
          <input id="phone" name="phone" type="tel" defaultValue={settings?.phone ?? ""} className={inputClasses()} />
        </FormField>
        <FormField label="WhatsApp" htmlFor="whatsapp" optional hint="Include country code, e.g. 919876543210" error={state.fieldErrors?.whatsapp}>
          <input id="whatsapp" name="whatsapp" type="tel" defaultValue={settings?.whatsapp ?? ""} className={inputClasses()} />
        </FormField>
        <FormField label="Email" htmlFor="email" optional error={state.fieldErrors?.email}>
          <input id="email" name="email" type="email" defaultValue={settings?.email ?? ""} className={inputClasses(Boolean(state.fieldErrors?.email))} />
        </FormField>
      </section>

      <section className="space-y-4 rounded-md border border-border bg-white p-6">
        <h2 className="font-heading text-base font-semibold text-ink">Social</h2>
        <FormField label="Instagram URL" htmlFor="instagram" optional error={state.fieldErrors?.instagram}>
          <input id="instagram" name="instagram" type="url" defaultValue={settings?.instagram ?? ""} className={inputClasses(Boolean(state.fieldErrors?.instagram))} />
        </FormField>
        <FormField label="Facebook URL" htmlFor="facebook" optional error={state.fieldErrors?.facebook}>
          <input id="facebook" name="facebook" type="url" defaultValue={settings?.facebook ?? ""} className={inputClasses(Boolean(state.fieldErrors?.facebook))} />
        </FormField>
      </section>

      <section className="space-y-4 rounded-md border border-border bg-white p-6">
        <h2 className="font-heading text-base font-semibold text-ink">Location</h2>
        <FormField label="Google Maps URL" htmlFor="googleMapsUrl" optional error={state.fieldErrors?.googleMapsUrl}>
          <input id="googleMapsUrl" name="googleMapsUrl" type="url" defaultValue={settings?.googleMapsUrl ?? ""} className={inputClasses(Boolean(state.fieldErrors?.googleMapsUrl))} />
        </FormField>
      </section>

      <FormStatusBanner status={state.status} message={state.message} />
      <SaveButton>Save Business Settings</SaveButton>
    </form>
  );
}
