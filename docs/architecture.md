# Kapila Dairy Farm — Technical Architecture

Status: Phase 1 (superseded in part — see note below)
Last updated: 2026-08-18

> **Note (Prompt 3 / Admin implementation):** §6 (API Architecture) below sketches a
> conventional REST API. The actual implementation uses Next.js Server Actions and direct
> server-side data-access functions instead — see `docs/api.md` for the accurate, as-built
> API reference and the reasoning, and `docs/database.md` for the as-built schema
> (`docs/database.md` also documents `AdminSession`, `Media.status/category`, and
> `Document.status`, which were added during the admin build and aren't in §4 below).
> Everything else in this document remains accurate.

## 1. Existing Project Inspection

The repository (`kapilaghee`) was freshly initialized for this project — there is no pre-existing `package.json`, source code, routing, styling system, database, API, authentication, or deployment configuration. The only pre-existing material is business/brand assets (`images/`: product photography, promotional graphics, the FSSAI license, the Pollucon lab report, and the Kapila logo as a PDF).

Because there is no established stack to preserve, the recommendation below is a fresh choice — justified on the requirements (content-managed showcase site today, e-commerce-ready tomorrow, small business budget, single admin operator), not on legacy constraints.

## 2. Recommended Technology Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router, TypeScript)** | One codebase for public site (SSR/SSG for SEO + performance) and admin app; file-based routing matches the sitemap directly; excellent image optimization (`next/image`) which matters for a photography-heavy dairy brand; large ecosystem, easy to host on Vercel or any Node host. |
| Database | **PostgreSQL** | Relational data (Products → Variants, FAQs, ordered Process steps, Business Settings) fits a relational model well; strong future fit for Phase 2 e-commerce (orders, inventory, transactions need real relational integrity, not a document store). Matches the brief's explicit preference. |
| ORM | **Prisma** | Type-safe schema-first modeling, clean migrations, plays well with Next.js/TypeScript, easy to extend the schema in Phase 2 without hand-written SQL migrations. |
| Auth | **Custom credential-based auth with hashed passwords (e.g., Argon2/bcrypt) + server-managed sessions (or a lightweight library such as Lucia/NextAuth in credentials mode)** | Single-admin-user system does not need social login or a heavyweight identity platform; a self-contained, auditable auth path is easier to secure and reason about for a small business site. |
| Media storage | **Cloud object storage (e.g., Cloudflare R2 / AWS S3-compatible) with signed uploads, referenced by URL in Postgres** | Keeps binary assets out of the database and off the app server's disk (important for stateless/serverless hosting); S3-compatible APIs are portable across providers. |
| Styling | **Tailwind CSS + design tokens from `design-system.md`** | Enforces the fixed design-system tokens (colors, spacing, type scale) as first-class config rather than ad hoc CSS, which directly supports the "developer controls design, admin controls content" principle. |
| Hosting | **Vercel (or any Node-compatible host) for the app; managed Postgres (e.g., Neon/Supabase/RDS)** | Minimal ops overhead appropriate for a small business; scales down to near-zero cost at low traffic and scales up if traffic grows. |

This stack is deliberately conventional and boring: a small business's website should be maintainable by whoever picks up the project next, not clever.

## 3. Project Structure (proposed)

```
kapilaghee/
├── docs/                          # this documentation set
├── images/                        # supplied source brand assets (not shipped as-is; re-exported into /public or object storage during implementation)
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
│   └── (favicons, static logo SVG exports, robots.txt)
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx                    # Home
│   │   │   ├── our-ghee/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── our-story/page.tsx
│   │   │   ├── our-process/page.tsx
│   │   │   ├── quality/page.tsx
│   │   │   ├── faq/page.tsx
│   │   │   └── contact/page.tsx
│   │   ├── admin/
│   │   │   ├── login/page.tsx
│   │   │   ├── page.tsx                    # dashboard
│   │   │   ├── products/
│   │   │   ├── faqs/
│   │   │   ├── content/
│   │   │   ├── media/
│   │   │   ├── documents/
│   │   │   └── settings/
│   │   ├── api/
│   │   │   ├── public/                     # read-only endpoints (or use server components directly)
│   │   │   └── admin/                      # authenticated CRUD endpoints
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── public/                         # Hero, ProductCard, VariantSelector, FaqAccordion, ContactCard, etc.
│   │   ├── admin/                          # DataTable, ImageUploader, DocumentUploader, ConfirmDialog, etc.
│   │   └── shared/                         # Button, Section, Container, Nav, Footer
│   ├── lib/
│   │   ├── db.ts                           # Prisma client
│   │   ├── auth.ts                         # session/auth helpers
│   │   ├── media.ts                        # upload/signed-URL helpers
│   │   └── validation/                     # zod schemas per entity
│   ├── styles/
│   │   └── tokens.css / tailwind.config.ts
│   └── content/
│       └── enums, constants (non-editable copy, nav structure)
├── .env.example
├── package.json
└── README.md
```

Public read paths favor Server Components querying Prisma directly (fast, simple, fewer round-trips) over calling a separate public REST API from the same app; a documented `/api/public/*` surface is still defined below for clarity and for any future separate client (e.g., a future mobile app) — but the Next.js app itself does not have to hop through its own HTTP API internally.

## 4. Content Model

### Product
```
id            string (uuid/cuid)
name          string
slug          string (unique)
description   text
status        enum(active, inactive)
createdAt     datetime
updatedAt     datetime
```
Relations: has many `ProductVariant`, has many `Media` (images) via a join or an ordered array of media references.

### ProductVariant
```
id            string
productId     string (FK → Product)
size          decimal          # e.g., 1, 5, 15
unit          enum(kg, g, ml, l)   # extensible without code change to the underlying data, though the enum itself is developer-defined; see note below
status        enum(active, inactive)
sortOrder     int
createdAt     datetime
updatedAt     datetime
```
Current seed data: `{size:1, unit:kg}`, `{size:5, unit:kg}`, `{size:15, unit:kg}`.

Phase-2-ready fields (not implemented in Phase 1, added later as nullable columns):
```
price               decimal?
compareAtPrice      decimal?
sku                 string?
stock               int?
inventoryStatus     enum?
```

> Note on "no code changes for new sizes": adding a new *value* (e.g., a 500 g pack) never requires a code change — it's a new `ProductVariant` row via Admin. Adding a new *unit type* (e.g., a unit the `unit` enum doesn't yet contain) does require a small, one-line code change to the enum. This is an intentional, minor trade-off: an open free-text unit field would remove all validation and let Admin produce inconsistent data (e.g., "Kg", "KGS", "kilo"). Given the business currently only needs kg (and possibly ml, per the 1000 ml jar seen in promotional art), this is judged the right balance of flexibility vs. data integrity for Phase 1.

### FAQ
```
id          string
question    string
answer      text
status      enum(active, inactive)
sortOrder   int
```

### PageSection
A single, flexible-but-bounded model to cover Home/Story/Process/Quality editable content, instead of a bespoke table per page (which would be simpler per-page but harder to maintain) or a fully generic JSON blob CMS (which would be more flexible but harder to validate and reason about). Design:

```
id          string
page        enum(home, story, process, quality)
key         string        # e.g., "hero", "why-kapila", "process-step-1", "quality-intro"
title       string?
body        text?
sortOrder   int
status      enum(active, inactive)
```
plus a join table `PageSectionMedia (pageSectionId, mediaId, sortOrder)` so a section can reference 0..n images, and (for `quality`) `PageSectionDocument (pageSectionId, documentId, sortOrder)` for attached certificates/reports.

This keeps each page's structure predictable (a fixed set of expected `key`s per `page`, validated at the application layer / seed level) while still letting Admin edit text/images without new migrations for ordinary content changes. It intentionally avoids building a generic block-based page builder — out of scope per "avoid an unnecessarily complicated CMS."

### BusinessSettings
Single-row table (or key/value settings table constrained to one row):
```
businessName    string   (required)
address         string   (required)
phone           string?
whatsapp        string?
email           string?
instagram       string?
facebook        string?
googleMapsUrl   string?
```

### Media
```
id          string
url         string
altText     string?
width       int?
height      int?
fileType    string
fileSize    int
createdAt   datetime
```

### Document
```
id            string
url           string
label         string        # e.g., "FSSAI License", "Lab Test Report - March 2025"
fileType      string
fileSize      int
issuedBy      string?       # e.g., "Pollucon Laboratories Pvt. Ltd.", "FSSAI"
issuedDate    date?
createdAt     datetime
```

### Enquiry (supports the "Enquire Now" CTA)
```
id            string
name          string
phone         string?
email         string?
message       text
productId     string?  (FK → Product, optional)
variantId     string?  (FK → ProductVariant, optional)
status        enum(new, contacted, closed)
createdAt     datetime
```
Whether enquiries are stored in the DB, emailed, forwarded to WhatsApp, or all three depends on which contact channels the business confirms — the model is defined now so the Contact form has a durable backend regardless of which delivery channel(s) are wired up first.

### AdminUser
```
id             string
email          string (unique)
passwordHash   string
createdAt      datetime
```

## 5. Database ERD

```
BusinessSettings (singleton)

AdminUser (standalone — authenticates admin routes only)

Product ──< ProductVariant
   │
   ├──< ProductMedia >── Media
   │
   └──< Enquiry (optional productId/variantId)

PageSection (page: home|story|process|quality)
   ├──< PageSectionMedia >── Media
   └──< PageSectionDocument >── Document

FAQ (standalone, ordered)

Document (standalone; referenced by PageSectionDocument, primarily under "quality")
```

`>─<` denotes a many-to-many join table; `──<` denotes one-to-many.

## 6. API Architecture

Two clearly separated surfaces:

### Public APIs (read-only, unauthenticated)
```
GET  /api/public/products              # active products, with active variants
GET  /api/public/products/[slug]       # single active product detail
GET  /api/public/faqs                  # active FAQs, ordered
GET  /api/public/page-sections/[page]  # active sections for home|story|process|quality
GET  /api/public/settings              # business settings (safe subset)
POST /api/public/enquiries             # create an enquiry (rate-limited, validated, spam-protected)
```
(If the Next.js app renders these via Server Components directly against Prisma, these routes still exist conceptually as the documented read contract — they may be implemented as internal data-access functions rather than literal HTTP endpoints; the endpoint list above should be kept accurate for any future headless/mobile client regardless of the internal implementation choice.)

### Admin APIs (authenticated CRUD)
```
POST   /api/admin/auth/login
POST   /api/admin/auth/logout

GET    /api/admin/products
POST   /api/admin/products
GET    /api/admin/products/[id]
PATCH  /api/admin/products/[id]
DELETE /api/admin/products/[id]           # soft delete → status:inactive

POST   /api/admin/products/[id]/variants
PATCH  /api/admin/variants/[id]
DELETE /api/admin/variants/[id]           # soft delete → status:inactive
POST   /api/admin/variants/reorder

GET    /api/admin/faqs
POST   /api/admin/faqs
PATCH  /api/admin/faqs/[id]
DELETE /api/admin/faqs/[id]
POST   /api/admin/faqs/reorder

GET    /api/admin/page-sections/[page]
PATCH  /api/admin/page-sections/[id]

GET    /api/admin/media
POST   /api/admin/media                   # upload
DELETE /api/admin/media/[id]

GET    /api/admin/documents
POST   /api/admin/documents               # upload
PATCH  /api/admin/documents/[id]
DELETE /api/admin/documents/[id]

GET    /api/admin/settings
PATCH  /api/admin/settings

GET    /api/admin/enquiries
PATCH  /api/admin/enquiries/[id]          # update status
```

Every `/api/admin/*` route (except login) requires a valid authenticated session, checked server-side on every request — never trusting client-side route guarding alone.

## 7. Authentication Architecture

- Single (or small number of) admin user(s) stored in `AdminUser`.
- Passwords hashed with a modern algorithm (Argon2id preferred, bcrypt acceptable) with per-user salt; never stored or logged in plain text.
- Login issues a server-side session (signed, httpOnly, secure, SameSite=Lax/Strict cookie) or a short-lived JWT stored in an httpOnly cookie — no tokens stored in localStorage/sessionStorage (XSS-exposed).
- Middleware/guard on all `/admin/*` pages and `/api/admin/*` routes validates the session server-side on every request; expired/invalid sessions redirect to `/admin/login`.
- Logout invalidates the session server-side (not just client-side cookie deletion) if using server-tracked sessions.
- No sensitive data (password hash, session secrets) ever serialized to the client.
- Rate-limit login attempts to reduce brute-force risk.
- CSRF protection on state-changing admin requests (framework-provided or same-site cookie + custom header check).

## 8. Image / Media Architecture

- **Upload path:** Admin uploads → server validates (file type allowlist: jpg/png/webp for images, pdf/jpg/png for documents; max size, e.g., 5MB images / 10MB documents) → server generates a signed upload to object storage (or proxies the upload) → stores the resulting URL + metadata in `Media`/`Document`.
- **Optimization:** `next/image` (or equivalent) handles responsive resizing/format negotiation (WebP/AVIF) at request time from the stored original; originals are not manually pre-resized by Admin.
- **Deletion:** deleting a `Media`/`Document` row also removes the underlying object storage file; if a `Media` item is still referenced elsewhere (e.g., a Product image), Admin is warned/blocked from deleting it until unlinked, to avoid dangling broken images.
- **Alt text:** required field on `Media` for images used in content-facing contexts, to satisfy accessibility requirements.
- **Documents:** FSSAI license and lab report images/PDFs are uploaded as `Document` records and linked to the `quality` `PageSection`, so replacing/adding a future certificate is an Admin task, not a code change.

## 9. SEO Architecture

- Per-page `<title>` and meta description (Next.js Metadata API), unique per route, written around real content (see keyword note below).
- Canonical URL per page; `sitemap.xml` generated from the same route list plus dynamic product slugs; `robots.txt` allowing all public routes and disallowing `/admin/*`.
- Open Graph + Twitter card metadata per page (falls back to a default brand image if a page has none set).
- Semantic HTML and a single `<h1>` per page, consistent with the UX spec's heading hierarchy rule.
- Local business structured data (`schema.org/LocalBusiness` or `FoodEstablishment`/`Organization` as appropriate) on Home and Contact, populated from `BusinessSettings` — only emitted for fields that are actually configured (no fabricated phone/rating data).
- Target search intent (from the brief): "Kapila Dairy Farm," "Kapila Ghee," "Kapila A2 Gir Cow Ghee," "Gir Cow Ghee Surat," "A2 Gir Cow Ghee Surat," "Desi Cow Ghee Surat" — addressed through natural page copy (product/story/location content) rather than keyword stuffing meta tags.

## 10. Accessibility & Performance

Covered in detail in `ux-specification.md` §5 and `requirements.md` §7 (Non-functional Requirements). Architecturally, this means: server-rendered/static-first pages (fast first paint, no client-JS dependency for core content), `next/image` for all imagery, minimal client-side JavaScript (interactive islands only: nav toggle, FAQ accordion, variant selector, forms), and semantic/accessible markup built into shared components so every page inherits it rather than each page re-implementing it.

## 11. Deployment

- App hosted on a Node-compatible platform (e.g., Vercel) with environment-based config (`.env`) for DB connection, object storage credentials, session secret.
- Postgres hosted on a managed provider; migrations run via Prisma Migrate as part of the deploy pipeline.
- Separate environment variables/secrets for development vs. production; no secrets committed to the repository (`.env.example` documents required keys without values).

## 12. Implementation Roadmap

**Phase 1.0 — Foundation**
1. Scaffold Next.js + TypeScript + Tailwind, wire design tokens from `design-system.md`.
2. Set up Postgres + Prisma; implement schema from §4; seed `BusinessSettings`, one `Product` ("Kapila Ghee" — final name pending confirmation) with three `ProductVariant`s (1/5/15 kg), and placeholder `PageSection` rows for home/story/process/quality.
3. Build shared layout: Nav, Footer, Section/Container primitives, Button.

**Phase 1.1 — Public Site**
4. Build Home, Our Ghee, Product Detail, Our Story, Our Process, Quality & Purity, FAQ, Contact pages against the seeded content, per `ux-specification.md`.
5. Implement Contact/enquiry form with validation and an `Enquiry` persistence path.
6. Implement SEO metadata, sitemap, robots, structured data.

**Phase 1.2 — Admin**
7. Build auth (login/logout, session middleware, password hashing) and protect `/admin/*`.
8. Build Products + Variants management.
9. Build Content management (Home/Story/Process/Quality sections), FAQs, Media library, Documents library.
10. Build Business Settings.

**Phase 1.3 — Hardening & Launch**
11. Accessibility pass (contrast, keyboard nav, alt text audit).
12. Performance pass (image sizing, Lighthouse/Core Web Vitals check).
13. Content QA against confirmed-vs-unverified information (§2 of `requirements.md`) — ensure no unverified claim ships without business sign-off.
14. Deploy to production, connect real domain, submit sitemap.

**Phase 2 — E-commerce (future, separate engagement)**
See `future-ecommerce.md`.

## 13. Missing Information List (blocking or content-affecting)

1. Final product name/positioning: "A2 Gir Cow Ghee" vs. "Desi Cow Ghee" (or both).
2. Confirmation on publishing the A2 claim, Bilona-method claim, and specific health/nutrition claims from the promotional graphics.
3. Confirmed current pack sizes and whether 1 KG exists as a real, sellable SKU today.
4. Phone number, WhatsApp number, email address, Instagram/Facebook handles, Google Maps link.
5. Business story / founder narrative content.
6. Ingredients declaration wording, shelf life, storage instructions.
7. Whether any additional certificates beyond the FSSAI license and the single supplied Pollucon lab report exist or are expected to be added.
8. Preferred enquiry delivery channel(s) (email inbox, WhatsApp Business, both) so the `Enquiry` flow can be wired to the right destination at implementation time.
9. Desired admin user(s): who logs in, how many accounts are needed.
10. Domain name / hosting account details for deployment.
