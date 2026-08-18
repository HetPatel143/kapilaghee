# Kapila Dairy Farm — Design System

Status: Phase 1 — initial tokens, to be refined during visual design in the next prompt.
Last updated: 2026-08-18

## 1. Design Direction

**Target feeling:** Modern Indian Heritage + Premium Dairy Brand — pure, warm, authentic, trustworthy, premium, traditional, modern, professional.

**What we are preserving from the existing identity:**
- The maroon + golden-yellow + brown + cream palette already used on packaging and the logo.
- The circular cow medallion as a recognizable brand device.
- The angular "KAPILA" wordmark and its "DAIRY FARM" subtext treatment.

**What we are deliberately changing from the existing promotional graphics:**
- The existing WhatsApp promo graphics are dense: multiple claim badges, drop shadows, comic-style distressed headline fonts, busy photo collages. The website will not copy these layouts.
- We reduce to: generous white/cream space, one clear message per section, restrained use of maroon and gold as accents rather than full-bleed backgrounds everywhere, and photography treated with consistent, calm framing.

**What we are explicitly avoiding:**
- Generic "organic green" food-brand look.
- Generic Shopify/food-template aesthetics.
- Excessive gradients, rounded-corner cards, icon clutter, cheap drop shadows, and heavy animation.

---

## 2. Color Tokens

Starting values (from the brief), reviewed against the supplied packaging/logo assets — the packaging maroon and gold are close to these; refine with exact eyedropper values once high-res source files are available.

```
--color-maroon        #8F1D18   /* primary brand color — wordmark, name-plates, primary buttons */
--color-maroon-dark    #6E120F   /* hover/pressed state, dark accents */
--color-kapila-gold    #F4C542   /* packaging gold — accent fields, badges */
--color-warm-gold      #D99A25   /* secondary gold — borders, dividers, icons */
--color-cream          #FFF8E7   /* page background, card background */
--color-dark-brown     #3B2118   /* body text on light backgrounds, footer background option */
--color-white          #FFFFFF   /* surfaces, reversed text on maroon */

--color-ink            #2A1B14   /* primary body text (slightly softer than pure black) */
--color-muted          #7A6A5C   /* secondary/muted text on cream */
--color-border          #E7D9BE   /* hairline borders on cream surfaces */
--color-success         #4B7A3B   /* form success state — muted, not the packaging's bright green */
--color-error            #B3261E   /* form error state */
```

**Usage rules:**
- Maroon is the primary interactive color (buttons, links, active nav state). Gold is an accent, not a background flooded across entire sections — use it for dividers, small fields, badges, and the medallion ring.
- Cream, not stark white, is the default page background — this is what gives the "warm/premium" feel instead of a cold e-commerce template.
- Dark brown is reserved for footer background and for body copy where extra warmth is wanted; primary body text uses `--color-ink` for readability.
- The packaging's bright leaf-green "100% NATURAL" badge is **not** adopted as a website UI color — it belongs to the physical label, not the digital brand system. If a "natural" indicator is needed on the site, it is expressed in maroon/gold, not green, to keep the identity coherent and avoid drifting into a generic organic-food look.
- Contrast check required before final sign-off: `--color-kapila-gold` text/icons on `--color-cream` background is likely too low-contrast for body text — gold is for accents/large elements only, never small body text.

---

## 3. Typography

Suggested starting pairing (validated against the wordmark's geometric, slightly architectural feel):

```
--font-heading: "Playfair Display", "DM Serif Display", serif;
--font-body:    "Inter", "Manrope", sans-serif;
```

- Headings use the serif to carry the "heritage/premium" feeling; the existing KAPILA wordmark itself stays as a locked logo asset (not reset in a web font) — it is used as an image/SVG wherever the literal logo appears.
- Body copy uses a clean grotesque sans for legibility at small sizes and fast scanning — this deliberately does not try to imitate the distressed/stencil display font used in the promotional graphics (e.g., "TRADITIONAL PROCESS OF A2 GIR COW GHEE"), which reads as busy marketing-collateral styling, not a lasting on-screen type system.
- Devanagari support: since "कपिला" appears on-pack, if any Hindi/Gujarati copy is used on the site later, pair with a Devanagari-compatible font (e.g., Noto Sans Devanagari / Noto Serif Devanagari) rather than relying on fallback rendering.

**Scale (mobile-first, fluid where practical):**

```
--text-xs:    0.75rem
--text-sm:    0.875rem
--text-base:  1rem
--text-lg:    1.125rem
--text-xl:    1.375rem
--text-2xl:   1.75rem
--text-3xl:   2.25rem
--text-4xl:   2.75rem   /* hero heading, desktop */
```

Headings scale up meaningfully from mobile to desktop (not just body text) — see Responsive Strategy in `ux-specification.md`.

---

## 4. Spacing & Layout

```
--space-1: 4px   --space-2: 8px   --space-3: 12px  --space-4: 16px
--space-5: 24px  --space-6: 32px  --space-7: 48px  --space-8: 64px  --space-9: 96px
```

- Section vertical rhythm on desktop: `--space-9` (96px) between major homepage sections; `--space-7` (48px) on mobile.
- Max content width: ~1200px, with generous side gutters (`--space-5`–`--space-6` on mobile, wider on desktop) rather than edge-to-edge content — reinforces "premium," not "template."
- Corner radius: small and consistent, not the rounded-everywhere look. `--radius-sm: 4px` for inputs/badges, `--radius-md: 8px` for cards/images. No pill-shaped cards.
- Shadows: minimal, soft, used sparingly (e.g., sticky header on scroll, modal). No stacked/cheap drop shadows on every card.

## 5. Imagery Style

- Product photography: clean, consistent background treatment (light/neutral), consistent bottle/tin framing — matching the calm studio shots already supplied (e.g., the plain-background tin/jar photos), not the busy lifestyle-collage graphics.
- The cow medallion device may be reused sparingly as a brand motif (e.g., small accent near "Our Story" or "Our Process"), not on every section.
- Process/story photography, once supplied, should be treated with a consistent color grade (warm, slightly desaturated) rather than mixed styles.
- Icons: used sparingly, thin-line or simple filled style in maroon/dark-brown — not the multiple mismatched icon styles seen across the promotional graphics (bone, shield, bandage, pregnancy icons in one graphic; leaf/lotus/bolt icons in another).

## 6. Components (initial inventory — refined in the implementation phase)

- Primary Button (maroon fill, cream text) — "Enquire Now"
- Secondary Button (maroon outline, maroon text)
- Nav bar (cream/white, maroon text, gold hairline on scroll)
- Product Card (image, name, available sizes, "View Details")
- Variant Selector/Pill (size chips: 1 KG / 5 KG / 15 KG, data-driven, not hard-coded)
- Section Heading (eyebrow label + serif heading + short supporting line)
- Trust Badge (FSSAI license number, "Lab Tested" — text-based/document-linked, not invented seal graphics)
- FAQ Accordion
- Contact Card (address, conditionally-rendered phone/WhatsApp/email/social rows)
- Document Viewer/Card (for FSSAI license, lab report)
- Footer

## 7. What Admin Cannot Change

Per the Admin Content Principle in `requirements.md`: colors, typography, spacing, component structure, and navigation are fixed in code. Admin edits content (text, images, documents, FAQs) that flows into these fixed components — it does not choose new colors, fonts, or layouts. This is what keeps the site visually consistent as content changes.
