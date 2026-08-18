# Kapila Dairy Farm — Final Pre-Launch Audit

Status: Prompt 4 (final QA / production readiness)
Last updated: 2026-08-18

This is a senior-level audit of the completed website + admin dashboard, performed before
treating the project as launch-ready. Findings are prioritized Critical → High → Medium →
Low. Each entry states the problem, where it was, why it mattered, the fix, and whether it
was actually fixed in this pass.

---

## Critical

### C1 — Status toggle buttons silently discarded their intended value (fixed in Prompt 3, re-verified here)
**Location:** `VariantManager`, `FaqRow`, `DocumentRow`, `MediaTile` Activate/Deactivate buttons.
**Why it mattered:** React discards a submit button's own `name`/`value` attributes when
the form/button `action` is a function reference (a documented React 19 behavior, not a
bug in React) — every Activate/Deactivate toggle across the admin was non-functional.
**Fix:** switched every such action to `.bind(null, value)` and confirmed via a live
end-to-end test (toggle a variant to inactive → confirmed in DB → confirmed hidden on the
public product page → re-activated). **Status: fixed and re-verified in this pass.**

### C2 — No login rate limiting (brute-force exposure)
**Location:** `src/app/actions/admin-auth.ts`.
**Why it mattered:** `docs/architecture.md` §19 explicitly required rate-limiting login
attempts; none existed. The admin login was open to unlimited password-guessing attempts
against a known email.
**Fix:** added `src/lib/auth/rate-limit.ts` — an in-memory sliding-window limiter (5
failed attempts / 15 minutes, keyed by email, case/whitespace-normalized). Verified live:
5 wrong passwords → 6th attempt (even with the *correct* password) is blocked with a clear
message. Documented limitation: in-memory state means each server process tracks attempts
independently — fine for the single-instance deployment this project is built for (see
`docs/deployment.md`); would need a shared store (Redis) if scaled to multiple instances.
**Status: fixed and verified.**

---

## High

### H1 — No error boundaries anywhere in the app
**Location:** entire app — no `error.tsx` existed for the public site, admin, or root layout.
**Why it mattered:** any unexpected Server/Client Component error would fall through to
Next's generic, unbranded error screen (or worse, a raw error page in some configurations)
instead of a friendly, on-brand message — and customers could potentially see more
technical detail than intended.
**Fix:** added `src/app/(public)/error.tsx` (branded, "Try Again" + "Back to Home"),
`src/app/admin/(dashboard)/error.tsx` (branded, "Try Again" + "Back to Dashboard"), and
`src/app/global-error.tsx` (inline-styled fallback for the rare case the root layout
itself fails, since it can't rely on `globals.css` having loaded). All log only a digest,
never a stack trace, to the console. **Status: fixed.**

### H2 — No Privacy Policy or Terms & Conditions pages
**Location:** site-wide — no `/privacy` or `/terms` route existed; footer had no legal links.
**Why it mattered:** the site collects personal information via the enquiry form (name,
phone/email, message) with no privacy disclosure anywhere — a real trust and compliance
gap for a public-facing business site, independent of e-commerce status.
**Fix:** added `/privacy` and `/terms` as honest, plain-language pages that describe only
what the site actually does (what the enquiry form collects, that there's no e-commerce
yet, no tracking cookies) and clearly flag the boilerplate-legal parts as
`[BUSINESS/LEGAL REVIEW REQUIRED]` rather than inventing legal language. Linked from the
footer on every page and added to the sitemap. **Status: fixed.**

### H3 — Duplicate, independently hard-coded partial address on Our Story
**Location:** `src/app/(public)/our-story/page.tsx` (removed).
**Why it mattered:** the page rendered a second, hand-typed copy of the business location
("Village Masma, Taluka Olpad, Surat, Gujarat") completely independent of
`BusinessSettings.address` — exactly the kind of drift Prompt 4 §8 asked to be checked
for. If the business address is ever updated in Admin, this copy would silently go stale.
**Fix:** removed the hard-coded line; location context is already covered by the Contact
page, footer, and homepage Location section, all of which read from `BusinessSettings`.
Re-audited every other page/component for address string literals — this was the only one.
**Status: fixed.**

### H4 — `.env.example` documented a variable that doesn't exist and omitted two that do
**Location:** `.env.example`.
**Why it mattered:** it listed `SESSION_SECRET` (never read anywhere in the codebase —
the session mechanism uses opaque random DB-backed tokens, not a signing secret) and
omitted `SITE_URL` (read in 4 files — layout, sitemap, robots, structured data) and
`ADMIN_EMAIL`/`ADMIN_PASSWORD` (read by `prisma/seed.ts` to create the first admin
account). A developer following the old file would misconfigure or fail to configure the
real required variables.
**Fix:** rewrote `.env.example` to match `grep -r process.env src/` exactly, with a
comment on each variable explaining where it's read and when it matters.
**Status: fixed.**

---

## Medium

### M1 — LocalBusiness structured data used an inaccurate schema.org type
**Location:** `src/lib/structured-data.ts`.
**Why it mattered:** `"@type": "FoodEstablishment"` implies a dine-in food service
business (a restaurant/cafe). Kapila Dairy Farm is a manufacturer/wholesaler/retailer of
packaged ghee per its FSSAI license — a materially different business type that could
confuse search engines' understanding of the business (and any rich-result eligibility
tied to the type).
**Fix:** changed to the generic `"LocalBusiness"` type, which accurately covers the
business without overclaiming a category it doesn't fit. **Status: fixed.**

### M2 — No `Product` structured data on the product detail page
**Location:** `src/app/(public)/our-ghee/[slug]/page.tsx`.
**Why it mattered:** Prompt 4 §18 explicitly asked for Product structured data (only with
real data, no fabricated price/rating). It was entirely missing.
**Fix:** added `buildProductJsonLd()` (name, description, url, brand, image — no `offers`,
no `aggregateRating`, since neither exists for this non-e-commerce site) and a `<script
type="application/ld+json">` on the product detail page. Verified the emitted JSON is
well-formed via a direct HTTP fetch + JSON parse. **Status: fixed.**

### M3 — Destructive confirmations used the browser's generic `window.confirm()`
**Location:** `ConfirmSubmitButton` and its four call sites (image remove, media delete,
document delete, process-step remove).
**Why it mattered:** Prompt 3 shipped this as an intentional, documented simplicity
trade-off; Prompt 4 §30 explicitly re-raised the requirement for specific, labeled buttons
("Cancel" / "Deactivate Product") rather than generic OK/Cancel, and this pass treats that
as the more specific, authoritative instruction.
**Fix:** rebuilt `ConfirmSubmitButton` on the native `<dialog>` element (`showModal()`),
which keeps focus-trapping/Escape/backdrop-click behavior for free while giving every
call site a specific title, description, and confirm-button label (e.g. "Delete Document",
"Remove Image", "Remove Step"). Also converted the two remaining ad-hoc
`window.confirm()` call sites (`MediaTile`, `DocumentRow`) to the same component for
consistency. Left simple, instantly-reversible Activate/Deactivate toggles
un-confirmed on purpose — adding a confirmation step to a one-click-to-undo action is
friction without a safety benefit. **Status: fixed.**

### M4 — README was unedited `create-next-app` boilerplate
**Location:** `README.md`.
**Why it mattered:** referenced a font (Geist) the project doesn't use, had no project
description, no setup instructions specific to this app (env vars, seeding), and no
pointer to the `docs/` folder — a real onboarding gap for anyone picking up the codebase.
**Fix:** rewrote with an accurate project description, setup steps, script reference, and
links into `docs/`. **Status: fixed.**

### M5 — No security response headers
**Location:** `next.config.ts`.
**Why it mattered:** no `X-Frame-Options`, `X-Content-Type-Options`, or `Referrer-Policy`
were set — the admin login page in particular had no clickjacking protection.
**Fix:** added `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`, and a conservative
`Permissions-Policy` via `next.config.ts` `headers()`, applied site-wide. Verified via a
direct response-header check. **Deliberately not added:** a `Content-Security-Policy`
— a strict CSP needs careful testing against Next's hydration scripts and
`next/image` before it's safe to ship, and getting it wrong risks breaking the site
outright; this is flagged as a follow-up rather than risked here. **Status: partially
fixed (safe headers added; CSP explicitly deferred with reasoning, not silently skipped).**

---

## Low

### L1 — `npm audit` reports 3 high-severity advisories in Prisma's CLI tooling
**Location:** `deepmerge-ts` (transitive dependency of `@prisma/config`, used by the
`prisma` CLI, not `@prisma/client` at runtime).
**Why it's low, not higher:** this is a stack-exhaustion DoS in a *build/dev-time CLI
tool's config-merging code path* — it is not part of the deployed application, and no
untrusted input reaches it in this project's usage. `npm audit fix --force` would install
`prisma@6.12.0`, which is a **downgrade** from the current `6.19.3`, not an upgrade — doing
that blindly risks reintroducing already-fixed issues for a lower-severity, non-runtime
advisory. **Recommendation, not fixed here:** monitor for a genuine upstream patch release
of `@prisma/config`/`deepmerge-ts` and upgrade normally when one exists, rather than
downgrading now.

### L2 — Admin has no way to browse/manage `Enquiry` records
**Location:** admin dashboard (Dashboard page shows a count only).
**Why it's low:** this is a real gap for daily operations (enquiries currently must be
read directly from the database), but it is a **new feature**, not a defect in something
that exists — out of scope for this "polish what exists" pass per §53. Flagged here so
it's a visible, intentional decision rather than a silent omission.
**Recommendation:** a simple `/admin/enquiries` list (read + status update) would close
this gap; a small addition given the `Enquiry` model and `EnquiryStatus` enum already exist.

### L3 — Products admin list has no search/filter
**Location:** `/admin/products`.
**Why it's low:** with exactly one product today, a search box would be inert UI. Noted
for when the catalog grows past a handful of items, not fixed now — adding it today would
be speculative complexity for data that doesn't exist yet.

---

## Verified — No Issue Found

These were specifically checked per the Prompt 4 checklist and found correct, listed here
so it's clear they were actually tested rather than assumed:

- **Product sizes are fully data-driven.** Grepped every public component for hard-coded
  "1 KG"/"5 KG"/"15 KG" strings — none found; `TrustStrip`, `ProductCard`,
  `ProductVariantSelector`, and the product detail page all read `ProductVariant` rows.
  Live-tested: added a temporary variant via Admin → appeared on `/our-ghee/[slug]` →
  deactivated → disappeared from the public active list → reactivated → reappeared, then
  the temporary test variant was removed.
- **Optional contact fields hide/show correctly, live-tested both directions.** Added a
  phone number in Settings → "Call Us" appeared on Contact and in the header/footer CTA
  paths → removed it → disappeared again, while WhatsApp (left configured) remained
  visible independently. No fake phone/WhatsApp/Instagram/email is ever fabricated;
  `getContactActions()` only emits an action for a field that is actually set.
- **Address consistency.** Every page that shows the address (`Footer`, `Contact`,
  homepage `LocationSection`, structured data) reads `BusinessSettings.address` — the one
  exception found (H3, Our Story) was fixed above.
- **No dead CTAs.** Grepped for `href="#"` / empty `href` across `src/` — zero matches.
  Every CTA (`Explore Our Ghee`, `Enquire Now`, `View Quality Information`, `Read Our
  Story`, `Get Directions`, FAQ links) routes to a real page or a real conditional action.
- **No mock/placeholder customer-visible data.** Grepped for `lorem ipsum`, `John Doe`,
  `example.com`, `test@example`, `TODO`/`FIXME`/`HACK` across `src/` — zero matches. Also
  checked actual seeded database content (not just code) for any of the previously-flagged
  unverified claims (immunity, bilona, chemical-free, heavy-metal-free, Ayurvedic,
  organic, "100% pure", therapeutic language) — zero matches. The only mention of "Bilona"
  in the entire codebase is a code comment explaining why the component deliberately does
  *not* publish that claim.
- **Terminology consistency.** "A2 Gir Cow Ghee" is used consistently as the formal
  product name in titles/meta descriptions/headings; "Kapila Ghee" appears only as natural
  shorthand in casual copy (e.g. "How Kapila Ghee Is Made") — normal brand-voice variation,
  not the kind of random alternation ("A2 Ghee"/"Desi Ghee"/"Cow Ghee") §31 warned against.
- **Admin → public integration**, re-verified end-to-end in this pass for: product
  description, variant activation, homepage section content, FAQ addition/visibility, and
  Settings/contact visibility. (Product image replacement and document upload were
  exercised functionally in Prompt 3's QA pass and rely on the same, already-verified
  `revalidatePath` mechanism — not re-run individually here to avoid duplicating a
  file-upload test that doesn't change per code review.)
- **Sitemap/robots correctness.** `/robots.txt` disallows `/admin` and `/api/admin`;
  every admin page carries `<meta name="robots" content="noindex, nofollow">` via the
  `(dashboard)` layout's metadata; `/sitemap.xml` lists only real public routes (now
  including `/privacy` and `/terms`) — no admin URLs are exposed to crawlers.
  Unauthenticated requests to every admin route were re-confirmed to 307-redirect to
  `/admin/login` (including with a garbage session cookie, not just no cookie).
- **Password/session security.** Passwords are scrypt-hashed with a random salt (never
  plaintext, never sent to the client); sessions are opaque random tokens validated
  against a DB table on every request; logout deletes the DB row (confirmed via direct
  query, not just cookie clearing); admin routes are gated server-side in the `(dashboard)`
  layout, not just hidden client-side.
- **File upload validation.** `src/lib/storage.ts` checks magic bytes (not just the
  client-supplied MIME type) against an allowlist (JPEG/PNG/WebP for images; +PDF for
  documents), enforces size limits (5MB/10MB), and generates its own filenames — user
  input never reaches the filesystem path, so path traversal isn't possible.
- **Database integrity.** Verified via `tests/db-integrity.test.ts` against a real SQLite
  file: duplicate product slugs are rejected, a variant cannot be created against a
  non-existent product (FK enforced), deleting a product cascades to its variants, and
  deactivating an FAQ changes its status without deleting the row.
- **Production build, lint, typecheck, and full test suite all pass clean** as of this
  audit (30/30 tests, zero ESLint warnings/errors, zero TypeScript errors, clean `next build`).
- **No console.log/debug statements, no orphaned TODO comments, no dead/duplicate
  components** found in `src/`.
- **Phase 2 e-commerce compatibility** (see `docs/future-ecommerce.md` for detail):
  `ProductVariant` already carries nullable `price`/`compareAtPrice`/`sku`/`stock`
  columns, unused but present; nothing in the current component tree assumes a price
  exists (no component reads `variant.price`); the `Enquiry` model and Contact-based
  conversion flow can coexist with a future cart rather than being replaced by one.
  Confirmed nothing in this pass introduced an assumption that would block that path.

---

## Not Changed (and why)

- **Did not touch the `(public)`/`(dashboard)` route-group split, the Server Actions API
  pattern, the design tokens, or the Prisma schema's core shape** — all already correct
  per Prompts 1–3 and re-verified working; rewriting any of them here would be exactly the
  "change things just because they can be changed" anti-pattern this phase was warned
  against.
- **Did not implement a Content-Security-Policy** — see M5. Deferred with reasoning, not
  silently skipped.
- **Did not build an Enquiries admin UI or a product search box** — see L2/L3. Both are
  additions, not fixes, and out of scope for this phase.
- **Did not touch `npm audit`'s flagged Prisma CLI dependency** — see L1. The suggested
  automated fix is a downgrade; declined for that reason, documented instead.
