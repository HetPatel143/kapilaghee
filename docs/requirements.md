# Kapila Dairy Farm — Requirements Document

Status: Phase 1 (Discovery & Requirements)
Last updated: 2026-08-18

This document defines what the Kapila Dairy Farm website must do in Phase 1 (brand + product showcase + enquiry) and what it must be *capable of becoming* in Phase 2 (e-commerce), without being rebuilt.

---

## 0. Source of Truth for This Document

This requirements document is based on:

- Business description supplied by the user in the project brief.
- Assets supplied in `images/` — product packaging photography, promotional graphics, an FSSAI Form C license, a Pollucon Laboratories test report, and the Kapila wordmark/logo.

No requirement below is based on assumptions about the business beyond what these sources state. Where the business intent is unclear, it is listed in [Information Requiring Confirmation](#information-requiring-confirmation) rather than guessed.

---

## 1. Confirmed Information

Verified directly from supplied documents/assets — safe to treat as fact for Phase 1 planning.

### Business identity
- Brand name: **Kapila Dairy Farm**
- Registered proprietor: **Kanubhai Manilal Patel** (per FSSAI license)
- Registered/authorized address:
  Block No. 197/A, Plot No. 71/3, Anjani Industrial Estate, Village Masma, Taluka Olpad, Surat – 394540, Gujarat, India.
- Kind of business (per FSSAI license): Manufacturer (General Manufacturing), Trade/Retail – Wholesaler, Trade/Retail – Retailer.

### Product
- Core product: cow ghee. Packaging label reads **"KAPILA DAIRY FARM — DESI COW GHEE"**. Separate logo/promotional artwork reads **"A2 GIR COW GHEE"**.
  ⚠ These two namings are not identical — see [Information Requiring Confirmation](#information-requiring-confirmation).
- Confirmed pack sizes appearing on physical labels: **5 KG**, **15 KG** (tin containers), and a **1000 ML** glass jar shown in promotional graphics. The user's brief separately states the business's current pack sizes as **1 KG, 5 KG, 15 KG**. Net weight is printed directly on the 5kg and 15kg tin labels.
- Packaging visual elements: Kapila wordmark, "DAIRY FARM" subtext, a circular medallion containing a Gir cow head photograph, a maroon "DESI COW GHEE" name-plate, a green "100% NATURAL" leaf badge, and the line "Good for health."
- Product description used in the brief and consistent with packaging: pure ghee, no added ingredients.

### Certifications & lab documentation (verified, real documents supplied)
- **FSSAI License** (Form C, Government of Gujarat, Food Safety and Standards Authority of India):
  - License Number: **10724022000260**
  - Licensee: Kapila Dairy Farm (Proprietor: Kanubhai Manilal Patel)
  - Category: State License
  - Issued On: 12-09-2024 (New License)
  - Valid Upto: 11-09-2027
  - Address matches the confirmed business address above.
- **Laboratory Test Report** (Pollucon Laboratories Pvt. Ltd., Surat):
  - Test Report No: PLPL/FD/25/03/20/0145, Issue Date: 27/03/2025
  - Sample: Ghee, 250 gm, sealed, sent by party
  - Results (all within FSSAI limits per the report's own reference column):

    | Parameter | Result | FSSAI Limit |
    |---|---|---|
    | Moisture | 0.41% | Max 0.5% |
    | Milk Fat | 99.59% | Min 99.5% |
    | B.R. at 40°C | 41.6 | 40.0–44.0 |
    | R.M. Value | 28.1 | Min 24.0 |
    | Polenske Value | 0.57 | 0.5–2.0 |
    | Free Fatty Acid (as Oleic Acid) | 0.79% | Max 2.0% |
    | Baudouin Test | Negative | Negative |
    | Iodine Value | 33.2 | 25–38 |
    | Saponification Value | 220 | 205–235 |

  These are genuine, dated, named-lab, named-parameter test results and may be presented on a Quality & Purity page as an actual document/certificate — not as an unverified marketing claim.

### Brand visual identity (from logo + packaging)
- Wordmark: "KAPILA" in a bold, geometric sans-serif, deep maroon, with an angular apex "A"; "DAIRY FARM" in a smaller tracked-out sans-serif beneath it, flanked by thin horizontal rule lines.
- Primary background field in existing materials: golden/bright yellow.
- Recurring brand device: a circular medallion with a maroon ring border framing a photograph of a Gir cow's head.
- Recurring maroon rectangular "name-plate" used to hold product-type text (e.g., "DESI COW GHEE").
- Devanagari "कपिला" appears on the glass jar label alongside the Latin wordmark.

### Contact
- Phone, WhatsApp, Instagram, Facebook, and email are **not supplied**. Confirmed only that the physical address above exists and is FSSAI-registered.

---

## 2. Information Requiring Confirmation

The business must confirm the following before it is published as fact on the live site. None of it is assumed or fabricated in this document.

| # | Item | Why it matters |
|---|---|---|
| 1 | **Product naming**: is the product to be marketed as "A2 Gir Cow Ghee" (per logo/brief) or "Desi Cow Ghee" (per current physical packaging), or both? | Determines page titles, SEO copy, and whether new packaging is being introduced. |
| 2 | Whether "A2" is a claim the business wants to make prominently on the public website, given A2 protein content is not a parameter measured in the supplied lab report. | A2 is a specific, checkable claim; publishing it without the business's explicit confirmation could create a compliance risk. |
| 3 | Whether the **Bilona / hand-churning method** shown in promotional graphics reflects the actual current production process, and whether it should be described on the Our Process page. | The lab report and FSSAI license do not certify a production method — this is currently unverified marketing content. |
| 4 | Whether the **health/nutrition claims** in promotional graphics (e.g., "improves bone development," "improves immunity," "healing of wounds," "promotes healthy pregnancy," "rich in CLA, Omega-3, vitamins A/D/E/K," "Ayurvedic Approved") are approved by the business for publication, and whether they have any supporting basis beyond the marketing graphic itself. | These are health claims. FSSAI licensing does not certify specific health benefit claims. Publishing them needs explicit business sign-off, ideally with legal/regulatory review given FSSAI advertising rules for food products. |
| 5 | Whether the **A1 vs A2 comparison graphic** (with claims like "Jersey and unhealthy cows," "Degradation of health") should be adapted for the website, softened, or omitted. | Comparative/disparaging claims about other producers carry higher legal and reputational risk than descriptive claims about Kapila's own product. |
| 6 | Exact current pack sizes and pricing intentions (1 KG appears only in the brief, not on a supplied label). | Needed to seed the initial Product Variant records correctly. |
| 7 | Shelf life, storage instructions, ingredients declaration (beyond "ghee") | Standard content customers expect on a product page; not present in supplied assets. |
| 8 | Phone number, WhatsApp number, Instagram handle, Facebook page, Google Maps link, business email | Currently unavailable; Contact page and Business Settings must support these as optional/empty until supplied. |
| 9 | Business story / founder story / farm history | Not supplied. Our Story page must not be fabricated; it will show a `[CONTENT TO BE PROVIDED]` placeholder until real content is given. |
| 10 | Whether "A2 Gir Cow Ghee" and "Desi Cow Ghee" are the same SKU or the business intends two distinct product lines | Affects the Product content model (one product with variants vs. two products). |
| 11 | Farm/herd details (number of cows, grazing practices, "organic farm" claim seen in comparison graphic) | "Organic" is a regulated term; not to be published without confirmation of any organic certification. |

Until confirmed, the website will:
- Use the **name and claims the business has explicitly approved** (default to the safer, document-backed language: "Desi/Gir Cow Ghee," "Pure ghee, no added ingredients," FSSAI-licensed, lab-tested).
- Mark placeholder sections clearly with `[CONTENT TO BE PROVIDED]` rather than inventing copy.
- Keep unverified health/process claims out of Phase 1 launch copy, or present them only if/when the business explicitly signs off, with wording softened to avoid overstated medical claims.

---

## 3. Business Requirements

What the website must achieve for Kapila Dairy Farm as a business:

1. Establish a credible, premium online presence for the brand that matches the quality of the physical product.
2. Communicate the product (Desi/A2 Gir Cow Ghee), available pack sizes, and quality credentials clearly.
3. Convert visitor interest into direct enquiries (call/WhatsApp/message/form) — this is the primary conversion goal of Phase 1.
4. Present verifiable trust signals (FSSAI license, lab test report) prominently and honestly.
5. Give the business owner a way to keep product, content, and contact information up to date without needing a developer for routine changes.
6. Be built on an architecture that can grow into full e-commerce (pricing, cart, checkout, orders) in Phase 2 without a rebuild.
7. Rank for relevant local search intent (Gir Cow Ghee Surat, A2 Ghee Surat, Kapila Dairy Farm) over time.

## 4. Customer Requirements

What a visitor needs to be able to accomplish:

1. Understand what Kapila Dairy Farm is and what makes the ghee different, within seconds of landing on the homepage.
2. See the product clearly — photography, pack sizes, and a plain-language description.
3. Understand how the ghee is made, to the extent the business has approved that content.
4. See genuine quality/purity evidence (FSSAI license, lab report) rather than marketing badges alone.
5. Learn where the farm/business is physically located, with a map.
6. Contact the business easily — by whichever channels are actually available (phone/WhatsApp/email/form), on both mobile and desktop.
7. Enquire about a specific pack size without needing to create an account or go through checkout.
8. Get answers to common questions (FAQ) without needing to contact the business.
9. Have a fast, uncluttered browsing experience on a mobile phone, since most local FMCG/dairy traffic in India is mobile-first.

## 5. Admin Requirements

What the business owner needs to be able to manage, without code changes:

1. Log in securely to a private admin area.
2. Manage products: add/edit/deactivate, images, description.
3. Manage product variants (pack sizes): add/edit/reorder/activate-deactivate — including sizes not yet invented (e.g., a future 500g pack) without any code change.
4. Edit homepage content: hero title/description/image, section content, CTA text.
5. Edit the Our Story page content and images.
6. Edit the Our Process steps (title, description, image per step) and their order.
7. Manage Quality & Purity page: upload/replace documents (FSSAI license, lab reports) and supporting description text.
8. Manage FAQs: add/edit/delete/deactivate/reorder.
9. Manage Business Settings: business name, address, phone, WhatsApp, email, Instagram, Facebook, Google Maps URL — all optional except business name and address.
10. See a simple dashboard overview (not a complex analytics suite in Phase 1).
11. Trust that anything left blank in Admin is simply hidden on the public site, not shown broken.

## 6. Functional Requirements

### Public site
- Server-rendered (or statically generated) public pages for: Home, Our Ghee, Product Detail, Our Story, Our Process, Quality & Purity, FAQ, Contact.
- All customer-facing content (text, images, FAQs, business info) is sourced from the database via Admin-managed content, not hard-coded, except for layout/design.
- "Enquire Now" as the primary CTA across the site: opens an enquiry path (form and/or WhatsApp/phone link depending on what contact channels are configured).
- Enquiry submissions must reach the business (e.g., stored in DB and/or emailed) — the exact delivery channel depends on what's confirmed (see open items).
- "Add to Cart" UI must NOT exist anywhere on the Phase 1 site.
- Contact page renders optional fields conditionally — a field with no value in Business Settings does not render an empty label/row.
- Documents (FSSAI license, lab report) are viewable/downloadable from the Quality & Purity page.

### Admin
- Authenticated-only access to all admin routes and admin API endpoints.
- CRUD for Products, Product Variants, FAQs, Page Sections (Home/Story/Process/Quality), Media, Documents, Business Settings.
- Image upload with validation (file type, file size) and preview.
- Soft-deactivation (status flags) preferred over hard deletion for Products/Variants/FAQs, so historical references (e.g., past enquiries referencing a variant) remain intact.
- Reordering support (sortOrder) for Variants, Process steps, FAQs.

## 7. Non-Functional Requirements

### Performance
- Fast initial load on mobile 4G: target Largest Contentful Paint under ~2.5s on the homepage.
- Images served in modern formats (e.g., WebP/AVIF where supported) and responsively sized.
- Public pages should be cacheable/pre-renderable where content doesn't change per-request.

### Accessibility
- WCAG 2.1 AA as the target baseline: sufficient color contrast (notably maroon-on-gold and gold-on-white combinations must be checked), full keyboard navigability, visible focus states, semantic HTML, alt text on all meaningful images, accessible form labels and error messages.

### Security
- Passwords hashed (never stored plain-text); admin sessions/tokens handled server-side and securely (httpOnly, secure cookies or equivalent).
- All admin mutation endpoints require authentication and authorization server-side, not just UI-level hiding.
- Input validation and sanitization on all public-facing forms (enquiry, contact) to prevent injection/spam abuse.
- File upload validation (type/size) to prevent malicious uploads.

### Responsiveness
- Fully responsive across mobile, tablet, desktop, and large desktop, designed mobile-first rather than shrunk down from desktop.

### SEO
- Unique title/meta description per page, canonical URLs, Open Graph tags, sitemap.xml, robots.txt, semantic heading hierarchy, descriptive image alt text, local business structured data (schema.org) on Home/Contact.

### Maintainability
- Clear separation between admin-editable content and developer-owned design/layout (see Admin Content Principle below).
- Documented content model; predictable API structure; typed code where the stack supports it.

### Scalability
- Data model and API structure must accommodate Phase 2 e-commerce fields/entities being added without breaking Phase 1 schema or URLs.

## 8. Admin Content Principle

**Admin controls content and business information.** Product data, variants, images, text copy, FAQs, business contact details, and uploaded documents are all editable in Admin.

**Developers control the design system and layout.** Colors, typography, component structure, page layout, responsive behavior, navigation structure, and animation/motion are fixed in code, not exposed as admin settings. This keeps the site visually consistent as content changes over time and avoids building an unnecessarily complex CMS.

## 9. Future Requirements (Phase 2 — E-commerce, not built in Phase 1)

To be introduced later, without breaking Phase 1's architecture:

- Pricing and `compareAtPrice` on Product Variants
- Inventory/stock tracking per variant
- Shopping cart
- Checkout flow
- Online payment integration
- Order management (admin) and order history (customer)
- Customer accounts/authentication
- Coupons/discounts
- Delivery/shipping management
- Order tracking

See [`future-ecommerce.md`](future-ecommerce.md) for how Phase 1 entities extend into these.

## 10. Explicitly Out of Scope for Phase 1

Cart, checkout, payment, orders, customer accounts, coupons, inventory management, delivery management, order tracking. These are being architected for, not implemented, in this phase.
