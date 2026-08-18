# Kapila Dairy Farm — UX Specification

Status: Phase 1
Last updated: 2026-08-18

---

## 1. Homepage Information Hierarchy

**Order:**

1. Hero
2. Trust / value highlights
3. Kapila Ghee product (sizes overview)
4. Why Kapila
5. Process
6. Quality
7. Story
8. Everyday use
9. Location
10. Final CTA
11. Footer

**Why this order:** A first-time, mostly-mobile visitor arriving from a search or a WhatsApp-shared link needs, in this sequence: (1) an immediate answer to "what is this and is it credible" (Hero + trust strip), (2) "what can I actually buy" (product/sizes) before being asked to trust a longer story, (3) "why this one over another ghee" (Why Kapila — the differentiators), (4) supporting evidence in increasing depth — how it's made, then how it's verified (Quality, with real FSSAI/lab documents) — placed *after* the product so it reads as substantiation, not as the opening pitch, (5) the emotional/brand story, which lands better once the visitor already understands the product and trusts the claims, (6) a practical "how would I use this" section that nudges toward purchase intent, (7) location, which matters mainly to a visitor who is already convinced and wants to know if this is a real, visitable place, (8) a final direct CTA before the footer so intent doesn't require scrolling back up. This mirrors how a careful FMCG/D2C buyer actually evaluates an unfamiliar food brand: identity → product → why → evidence → story → practical use → trust-through-locality → action.

### Section-by-section

**Hero**
- Purpose: instantly communicate brand + product + primary action.
- Content: Kapila wordmark/logo, short headline (product name + one-line positioning drawn only from confirmed claims, e.g., "Pure Desi/A2 Gir Cow Ghee — No Added Ingredients"), one hero image (product jar/tin or cow medallion imagery), primary CTA "Enquire Now", secondary link to "View Our Ghee."
- Admin-managed: hero title, description, image.
- Responsive: on mobile, image stacks above text; CTA remains reachable without scrolling past the fold.
- Empty state: if hero image not yet uploaded, fall back to a fixed brand-color panel with the wordmark — never a broken image icon.

**Trust / value highlights**
- Purpose: quick-scan credibility strip.
- Content: 3–4 short, document-backed statements only (e.g., "FSSAI Licensed," "Lab Tested for Purity," "No Added Ingredients," "Traditional Gir Cow Ghee") — no unverified health claims here.
- Responsive: horizontal row on desktop, 2-column or stacked on mobile.

**Kapila Ghee product**
- Purpose: show what's actually available.
- Content: product image, short description, list of active pack sizes (data-driven from Product Variants), link to Product Detail / Our Ghee.
- CTA: "Enquire Now" per product, "View All Sizes."
- Empty state: if no variants are active, show product without a size list rather than an empty size row.

**Why Kapila**
- Purpose: differentiation, in the business's own confirmed terms (pure, no additives, Gir cow, FSSAI-licensed, lab-tested) — not invented superlatives.
- Content: 3–4 short points, each admin-editable as homepage section content.

**Process**
- Purpose: teaser of the Our Process page.
- Content: 3–4 step titles/thumbnails (admin-managed), "See Full Process" link.
- Note: displays only steps the business has confirmed reflect actual practice (see Information Requiring Confirmation in `requirements.md` re: Bilona method).

**Quality**
- Purpose: teaser of Quality & Purity page, built around the real FSSAI license and lab report rather than marketing badges.
- Content: FSSAI license number, "Lab Tested" statement referencing the actual Pollucon report, "View Certificates" link.

**Story**
- Purpose: brand warmth/emotional connection.
- Content: short story excerpt + image, "Read Our Story" link.
- Empty state: if no story content exists yet, this section is omitted from the homepage entirely rather than shown with placeholder lorem-ipsum-style text.

**Everyday use**
- Purpose: help visitors picture using the product (roti/paratha, cooking, traditional use) — grounded only in ordinary, uncontroversial usage (cooking fat), not the skin-application/health claims seen in supplied marketing unless the business confirms them.
- Content: 2–3 short use-case cards with imagery.

**Location**
- Purpose: establish the business as a real, physical place.
- Content: address, embedded Google Map (if Maps URL configured), "Get Directions" link.
- Empty state: if Google Maps URL isn't configured yet, show the address as text only, no broken map embed.

**Final CTA**
- Purpose: last conversion opportunity before the footer.
- Content: short prompt + "Enquire Now" button, and phone/WhatsApp quick-links if configured.

**Footer**
- Business name, address, quick nav links, social links (only those configured), FSSAI license number, copyright line.

---

## 2. Public Page Specifications

### Our Ghee (`/our-ghee`)
- **Purpose:** product catalog overview (single product today, extensible to more).
- **Target user:** visitor ready to see concrete options.
- **Primary goal:** understand available pack sizes and reach an enquiry.
- **Sections:** intro copy, product card(s) with active variants, "How to order" note (enquiry-based, not cart-based, in Phase 1).
- **CTA:** "Enquire Now" per product/variant.
- **Images:** product photography per size if available, else shared product image.
- **Responsive:** single column on mobile; grid on tablet/desktop.
- **Empty state:** if zero active products exist (unlikely but possible mid-edit), show a "Currently updating our product range — please contact us" message, not a blank page.
- **Error state:** if content fails to load, show a friendly retry message, not a raw error.

### Product Detail (`/our-ghee/[slug]`)
- **Purpose:** deep-dive on one product.
- **Target user:** visitor deciding on size/quantity before enquiring.
- **Primary goal:** get enough information to enquire confidently.
- **Sections:** image gallery, name, description, variant selector (size chips, data-driven), product information (what's confirmed: ingredients = ghee, no additives; shelf life/storage shown only once confirmed), Enquire CTA.
- **CTA:** "Enquire Now," pre-selecting the chosen variant where the enquiry mechanism supports it.
- **Images:** multiple product images if supplied; falls back gracefully to one image.
- **Responsive:** gallery above content on mobile; side-by-side on desktop.
- **Empty/error states:** unknown slug → 404 page with link back to Our Ghee; inactive product → treated as not found publicly.

### Our Story (`/our-story`)
- **Purpose:** brand narrative and philosophy.
- **Target user:** visitor evaluating trust/authenticity, not just product specs.
- **Primary goal:** build emotional connection and credibility.
- **Sections:** title, narrative body (admin rich text), supporting images.
- **CTA:** soft CTA to Contact/Enquire at the end.
- **Empty state:** while story content is `[CONTENT TO BE PROVIDED]`, the page shows only what's confirmed (business name, location, FSSAI registration) rather than fabricated narrative — flagged visibly in Admin as incomplete, not shown as a placeholder on the live public page.

### Our Process (`/our-process`)
- **Purpose:** explain how the ghee is made, to the extent confirmed.
- **Target user:** visitor assessing authenticity/traditional method claims.
- **Primary goal:** communicate process transparently and only with confirmed content.
- **Sections:** ordered list of steps (admin-managed: title, description, image per step).
- **CTA:** link to Quality & Purity ("See how we verify it").
- **Empty/error states:** if fewer than 2 steps are defined, render what exists without forcing a fixed step count.

### Quality & Purity (`/quality`)
- **Purpose:** present real compliance/testing evidence.
- **Target user:** skeptical or health-conscious buyer wanting proof.
- **Primary goal:** build trust via verifiable documents, not adjectives.
- **Sections:** FSSAI license (number + viewable document), lab test report (issuing lab name, date, key parameters table, viewable document), any additional certificates as they're supplied, plain-language explanation of what the tested parameters mean.
- **CTA:** "Have a question about our quality process? Contact us."
- **Empty/error states:** if a document image fails to load, show a text fallback with the license/report number rather than a broken image.

### FAQ (`/faq`)
- **Purpose:** self-serve answers.
- **Target user:** visitor with a specific question before enquiring.
- **Primary goal:** reduce repetitive enquiries; reassure remaining doubts.
- **Sections:** accordion list, admin-managed, reorderable.
- **CTA:** "Still have a question? Contact us" at the bottom.
- **Empty state:** if no FAQs are published yet, this nav item/page is hidden rather than showing an empty accordion.

### Contact (`/contact`)
- **Purpose:** enable direct contact through whatever channels are actually configured.
- **Target user:** visitor ready to reach out.
- **Primary goal:** successful enquiry submission or direct contact.
- **Sections:** address + map, conditionally-rendered phone/WhatsApp/email rows, conditionally-rendered social links, enquiry form (name, phone/email, message, optional product/variant interest).
- **CTA:** "Send Enquiry" (form submit); "Call," "WhatsApp," "Email" quick-action buttons where configured.
- **Validation:** required fields (name, one contact method, message) validated client- and server-side; clear inline error messages.
- **Loading/success/error states:** submit button shows a loading state; on success, a confirmation message replaces or overlays the form; on failure, an inline error with a retry option, and the entered data is not lost.
- **Empty state:** if literally no contact channel is configured yet (only address known), the page still works — it shows address/map and the enquiry form only.

---

## 3. Admin Page Specifications

General patterns applied across all admin pages:
- **Loading state:** skeleton or spinner while fetching; never an unstyled blank screen.
- **Empty state:** friendly "No [items] yet — Add your first [item]" with the create action inline, for every list view.
- **Validation:** inline, field-level error messages; disabled submit until required fields are valid; server-side validation always re-checked regardless of client-side checks.
- **Confirmation dialogs:** required before any destructive/deactivating action (e.g., "Deactivate this variant? It will be hidden from the public site.").
- **Error handling:** failed requests show a retry-capable error message and never silently fail; unsaved changes warn before navigating away.

### Admin Login (`/admin/login`)
- **Purpose:** authenticate the business owner/admin.
- **Main actions:** submit email/username + password.
- **Validation:** required fields; generic error message on failure ("Invalid email or password") that does not reveal which field was wrong.
- **Loading state:** button shows a loading state during auth; disabled to prevent double submit.

### Dashboard (`/admin`)
- **Purpose:** at-a-glance overview and navigation hub.
- **Main actions:** navigate to Products, Content, FAQs, Media, Documents, Settings.
- **Content:** simple counts (active products, active variants, published FAQs); no complex analytics in Phase 1.

### Products (`/admin/products`)
- **Purpose:** manage the product catalog.
- **Main actions:** create, edit, deactivate product; open a product's Variants.
- **Table:** name, status (active/inactive), variant count, last updated, actions.
- **Form:** name, slug (auto-generated, editable), description, images (multi-upload via Media), status.
- **Validation:** unique slug; required name/description; at least one image recommended (warned, not blocked).

### Product Variants (`/admin/products/[id]/variants`)
- **Purpose:** manage pack sizes for a product.
- **Main actions:** add size, edit size/unit, reorder (drag or up/down), activate/deactivate.
- **Table:** size, unit, status, sort order, actions.
- **Form:** size (numeric), unit (dropdown: kg, g, ml, l — extensible), status, sort order.
- **Validation:** size + unit combination should be unique per product; numeric size > 0.

### Content — Home / Story / Process / Quality (`/admin/content/*`)
- **Purpose:** edit the structured, section-based content for each page.
- **Main actions:** edit section fields (title, body text, image reference[s]); for Process, manage an ordered list of steps; for Quality, attach Documents.
- **Form:** varies by section type (see `PageSection` model in `architecture.md`), but always: text fields + image picker (from Media) + save.
- **Validation:** required title per section; image optional but warned if missing for image-bearing sections.
- **Preview:** a "Preview on site" link/button after saving, so the admin can verify how content reads live.

### FAQs (`/admin/faqs`)
- **Purpose:** manage FAQ list.
- **Main actions:** add, edit, delete/deactivate, reorder.
- **Table:** question, status, sort order, actions.
- **Form:** question, answer (rich text or plain, TBD in implementation), status, sort order.
- **Confirmation:** required before delete.

### Media (`/admin/media`)
- **Purpose:** central image library.
- **Main actions:** upload, view usage (which product/section references it), delete (blocked or warned if currently in use).
- **Validation:** file type allowlist (jpg/png/webp), max file size enforced client- and server-side, with a clear error if exceeded.

### Documents (`/admin/documents`)
- **Purpose:** manage certificates/reports (FSSAI license, lab test reports, future certificates).
- **Main actions:** upload (PDF/image), label/describe, link to Quality content, delete.
- **Validation:** file type allowlist (pdf/jpg/png), max size enforced.

### Business Settings (`/admin/settings`)
- **Purpose:** single source of truth for contact/social info used across Contact page and footer.
- **Main actions:** edit business name, address (required), phone/WhatsApp/email/Instagram/Facebook/Google Maps URL (all optional).
- **Validation:** phone/email format validated when present but not required to be present; empty optional fields save as empty, and the public site hides the corresponding UI row rather than rendering blank.

---

## 4. Responsive Strategy

**Mobile navigation:** collapsed hamburger/off-canvas menu with the "Enquire Now" CTA always visible in the header (not hidden inside the menu) — since Phase 1's core conversion event is contact, not browsing depth.

**Product card behavior:** single column, full-width image on mobile; 2–3 column grid on tablet/desktop; size chips wrap rather than overflow.

**Image behavior:** all images use responsive `srcset`/fixed aspect-ratio containers to avoid layout shift; hero image crops to a shorter aspect ratio on mobile to preserve above-the-fold text visibility.

**Typography scaling:** heading sizes step down meaningfully on mobile (not just a linear shrink) — e.g., hero heading drops from `--text-4xl` to roughly `--text-2xl`/`--text-3xl` on small screens to avoid awkward wrapping.

**Section spacing:** vertical rhythm compresses on mobile (`--space-7` between sections vs. `--space-9` on desktop) to reduce excessive scrolling without feeling cramped.

**CTA behavior:** primary CTA remains thumb-reachable; on mobile, consider a persistent bottom "Enquire Now" bar on Product Detail and Contact pages.

**Admin responsive behavior:** admin is optimized for desktop/tablet use (typical for a business owner managing content at a desk), but must remain usable on a large phone for quick edits — tables collapse to stacked cards below a breakpoint; forms remain single-column and usable at all sizes.

---

## 5. Accessibility Notes (see also `design-system.md` §2 contrast rules)

- All interactive elements reachable and operable via keyboard, with visible focus rings using the maroon/gold palette at sufficient contrast.
- All meaningful images (product photography, documents, process steps) have descriptive alt text; purely decorative images use empty alt.
- Forms: every input has an associated `<label>`; errors are announced (e.g., `aria-live`) and described in text, not color alone.
- Heading hierarchy is strictly sequential per page (one `<h1>`, logically nested `<h2>`/`<h3>`).
- Buttons vs. links used semantically correct (`<button>` for actions, `<a>` for navigation).
