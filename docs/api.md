# Kapila Dairy Farm — API Reference

Status: reflects the Phase 1 + Admin (Prompt 3) implementation.
Last updated: 2026-08-18

## Implementation Note: Server Actions, Not a Separate REST API

`docs/architecture.md` (Prompt 1) sketched the public/admin split as conventional REST
endpoints (`GET /api/public/products`, `POST /api/admin/products`, etc.). During
implementation this was built as **Next.js Server Actions and direct server-side data
access functions** instead of a literal `/api/*` route tree. This section explains why,
and maps every originally-sketched endpoint to what actually exists.

**Why:** the customer site and admin dashboard are the *only* consumers of this data —
there is no separate mobile app or third-party integration yet. Server Actions give the
same guarantees a REST API would (server-side execution, server-side auth checks, typed
request/response) with less boilerplate, and Next.js automatically keeps the calling
page's data in sync after a mutation. If a standalone API consumer is ever needed (see
`docs/future-ecommerce.md`), these functions can be wrapped in literal route handlers
without changing their internals — the contract below is what that wrapping would expose.

## Public Read Layer — `src/lib/data.ts`

Called directly from Server Components (Home, Our Ghee, Product Detail, Our Story, Our
Process, Quality, FAQ, Contact). Every function only returns `status: "active"` rows.

| Function | Equivalent to |
|---|---|
| `getBusinessSettings()` | `GET /api/public/settings` |
| `getActiveProducts()` | `GET /api/public/products` |
| `getProductBySlug(slug)` | `GET /api/public/products/[slug]` |
| `getVariantById(id)` | (supporting lookup for the Contact page's pre-filled enquiry context) |
| `getActiveFaqs()` | `GET /api/public/faqs` |
| `getPageSections(page)` / `getPageSection(page, key)` | `GET /api/public/page-sections/[page]` |

## Public Mutation — Enquiries

| Server Action | Location | Equivalent to |
|---|---|---|
| `submitEnquiry(prevState, formData)` | `src/app/actions/enquiry.ts` | `POST /api/public/enquiries` |

Validated with Zod (`src/lib/validation/enquiry.ts`), includes a honeypot field, and
requires at least a phone or an email. No authentication required — this is the one
public-facing mutation in the system.

## Admin Read Layer — `src/lib/admin-data.ts`

Called only from within `src/app/admin/(dashboard)/**` pages, which are gated by
`requireAdminSession()` in the enclosing layout. Returns rows regardless of status (Admin
needs to see and manage inactive items too).

| Function | Equivalent to |
|---|---|
| `getDashboardStats()` | dashboard summary counts |
| `listProductsAdmin()` / `getProductAdmin(id)` | `GET /api/admin/products`, `GET /api/admin/products/[id]` |
| `listFaqsAdmin()` / `getFaqAdmin(id)` | `GET /api/admin/faqs` |
| `listMediaAdmin(category?)` | `GET /api/admin/media` |
| `listDocumentsAdmin()` | `GET /api/admin/documents` |
| `listPageSectionsAdmin(page)` | `GET /api/admin/page-sections/[page]` |
| `getBusinessSettingsAdmin()` | `GET /api/admin/settings` |

## Admin Mutations — Server Actions

Every action below calls `requireAdminSessionOrThrow()` as its first line — this is the
server-side authorization check equivalent to the REST spec's requirement that "every
admin mutation endpoint must verify authentication and authorization server-side." A
request without a valid session cookie throws before touching the database, regardless of
what the client sent.

### Products & Variants — `src/app/actions/admin-products.ts`

| Action | Equivalent to |
|---|---|
| `createProduct` | `POST /api/admin/products` |
| `updateProduct` | `PATCH /api/admin/products/[id]` |
| `setProductStatus` | soft delete → `DELETE /api/admin/products/[id]` (sets `status: inactive`) |
| `addVariant` | `POST /api/admin/products/[id]/variants` |
| `updateVariant` | `PATCH /api/admin/variants/[id]` |
| `setVariantStatus` | soft delete → `DELETE /api/admin/variants/[id]` |
| `reorderVariant(direction, formData)` | `POST /api/admin/variants/reorder` |
| `addProductImage` | attach image to product |
| `removeProductImage` | detach image (deletes the underlying `Media` + file only if unused elsewhere) |
| `reorderProductImage(direction, formData)` | reorder / change primary image |

### FAQs — `src/app/actions/admin-faqs.ts`

`createFaq`, `updateFaq`, `setFaqStatus`, `reorderFaq(direction, formData)`.

### Content Sections — `src/app/actions/admin-content.ts`

`updateSectionContent`, `setSectionImageFromLibrary`, `uploadSectionImage`,
`removeSectionImage`, `attachDocumentToSection`, `detachDocumentFromSection`,
`addProcessStep`, `updateProcessStep`, `deleteProcessStep` (hard delete — see
`docs/admin-guide.md` for why this one entity allows it), `reorderProcessStep(direction, formData)`.

### Media — `src/app/actions/admin-media.ts`

`uploadMedia`, `setMediaStatus`, `deleteMedia` (blocked with a clear error if the image is
still referenced by a product or content section).

### Documents — `src/app/actions/admin-documents.ts`

`uploadDocument`, `updateDocumentMeta`, `setDocumentStatus`, `deleteDocument` (blocked if
still attached to a Quality page section).

### Settings — `src/app/actions/admin-settings.ts`

`updateBusinessSettings`.

### Auth — `src/app/actions/admin-auth.ts`

`loginAction` (verifies credentials, creates an `AdminSession` row, sets an httpOnly
cookie), `logoutAction` (deletes the `AdminSession` row server-side, then clears the cookie).

## A Note on the `.bind()` Pattern

Several actions above take a leading non-`FormData` argument (e.g.
`reorderVariant(direction, formData)`). These are called from buttons using React's
`action.bind(null, value)` pattern — e.g. `formAction={reorderVariant.bind(null, "up")}` —
rather than a hidden form field, because a submit button's own `name`/`value` attributes
are silently ignored by React when the form/button `action` is a function reference. Every
such action in this codebase uses `.bind()`, not button `name`/`value`, for this reason.

## Revalidation — `src/lib/revalidate.ts`

Every mutation above calls one of `revalidateHome()`, `revalidateProductPages(slug?)`,
`revalidateStory()`, `revalidateProcess()`, `revalidateQuality()`, `revalidateFaqs()`, or
`revalidateSettings()` (which revalidates the whole layout, since `BusinessSettings` feeds
the Header/Footer on every page) after writing to the database. This is what makes admin
changes appear on the public site within seconds, without a server restart — see
`docs/architecture.md` §39 for the original requirement this satisfies.
