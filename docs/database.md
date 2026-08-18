# Kapila Dairy Farm — Database Reference

Status: reflects the Phase 1 + Admin (Prompt 3) implementation. Supersedes the sketch in
`docs/architecture.md` §4 where they differ — this document is the accurate as-built schema.
Last updated: 2026-08-18

## Datasource

**Local development:** SQLite (`prisma/dev.db`), configured via `DATABASE_URL` in `.env`.
No setup required — `npx prisma db push` creates the file.

**Production:** PostgreSQL, per `docs/architecture.md` §2/§17. To switch: change
`provider = "sqlite"` to `provider = "postgresql"` in `prisma/schema.prisma`, point
`DATABASE_URL` at a real Postgres instance, and run `npx prisma migrate deploy`. The
schema deliberately avoids SQLite-only or Postgres-only features so this is the only
change required — see the note at the top of `prisma/schema.prisma`.

Local dev was built against SQLite rather than Postgres because no Postgres server/Docker
daemon was available in the implementation environment — this is a development-time
substitution only, not an architecture change.

## Entity-Relationship Diagram

```
BusinessSettings (singleton — one row)

AdminUser ──< AdminSession

Product ──< ProductVariant
   │
   ├──< ProductMedia >── Media
   │
   └──< Enquiry (optional productId/variantId FK)

PageSection (page: home | story | process | quality)
   ├──< PageSectionMedia >── Media
   └──< PageSectionDocument >── Document

FAQ (standalone, ordered)

Document (standalone; attached to PageSection via PageSectionDocument)
```

`>─<` = many-to-many join table. `──<` = one-to-many. All foreign keys use `onDelete:
Cascade` where the child record is meaningless without its parent (variants, product
images, session, join-table rows) — see `prisma/schema.prisma` for the exact `@relation`
directives.

## Models

### Product
`id, name, slug (unique), description, status (active|inactive), createdAt, updatedAt`
→ `variants: ProductVariant[]`, `images: ProductMedia[]`, `enquiries: Enquiry[]`

### ProductVariant
`id, productId (FK), size (Float), unit (kg|g|ml|l), status, sortOrder, createdAt, updatedAt`
Phase-2 (unused, nullable): `price, compareAtPrice, sku, stock` — see `docs/future-ecommerce.md`.

### Media
`id, url, altText, width?, height?, fileType, fileSize, category (product|homepage|story|process|quality|other), status, createdAt`
Added in Prompt 3: `category` (for the Media Library filter) and `status` (deactivate
without deleting the file).

### ProductMedia (join: Product ↔ Media)
`id, productId, mediaId, sortOrder` — `sortOrder` 0 is the product's primary image.

### Document
`id, url, label, fileType, fileSize, issuedBy?, issuedDate?, status, createdAt`
Added in Prompt 3: `status` (deactivate a document without deleting it or breaking its
attachment history).

### PageSection
`id, page (home|story|process|quality), key, title?, body?, sortOrder, status, createdAt, updatedAt`
`(page, key)` is unique. For `home`/`story`/`quality`, `key` is a fixed, developer-defined
set matching the page template (e.g. `hero`, `story-intro`, `quality-testing`) — Admin
edits these rows' content but cannot create new keys, since each key corresponds to a
specific spot in the coded layout. For `process`, `key` is generated per step
(`process-step-<timestamp>`) since it's a genuinely dynamic admin-managed list.

### PageSectionMedia / PageSectionDocument (join tables)
Same shape as `ProductMedia`: `id, pageSectionId, mediaId|documentId, sortOrder`.

### FAQ
`id, question, answer, status, sortOrder, createdAt, updatedAt`

### BusinessSettings
`id, businessName, address, phone?, whatsapp?, email?, instagram?, facebook?, googleMapsUrl?, updatedAt`
Single row (application code enforces "singleton" by always querying/updating the first
row rather than by a DB constraint — acceptable for a one-business site; see
`src/app/actions/admin-settings.ts`).

### Enquiry
`id, name, phone?, email?, message, productId? (FK), variantId? (FK), status (new|contacted|closed), createdAt`
Written by the public Contact form. No admin UI to browse/manage these yet — see
"Known Limitations" in the implementation summary; the Dashboard shows a count of `new` ones.

### AdminUser
`id, email (unique), passwordHash, createdAt` → `sessions: AdminSession[]`
`passwordHash` is `scrypt` output in `"<saltHex>:<derivedKeyHex>"` form — see
`src/lib/auth/password.ts`. Never plaintext, never sent to the client.

### AdminSession
`id, token (unique), userId (FK), expiresAt, createdAt`
Added in Prompt 3. An opaque random token (32 bytes, hex) stored server-side; the browser
only holds the token in an httpOnly cookie. Session validity is checked against this table
on every admin request (`src/lib/auth/session.ts`), so logout or expiry take effect
immediately server-side — a stolen cookie stops working the moment the session row is gone.

## Enums

`ProductStatus` (`active|inactive`) is reused across Product, ProductVariant, Media,
Document, PageSection, and FAQ — one consistent "is this visible on the public site" flag
throughout the schema, rather than a different status enum per model.

`VariantUnit` (`kg|g|ml|l`), `PageKey` (`home|story|process|quality`),
`MediaCategory` (`product|homepage|story|process|quality|other`), `EnquiryStatus`
(`new|contacted|closed`).

## Indexes & Constraints

- `Product.slug`, `AdminUser.email`, `AdminSession.token` — unique.
- `PageSection.(page, key)`, `ProductMedia.(productId, mediaId)`,
  `PageSectionMedia.(pageSectionId, mediaId)`, `PageSectionDocument.(pageSectionId, documentId)` — composite unique, preventing duplicate attachments.
- `ProductVariant.productId`, `AdminSession.userId` — indexed for lookup performance.
- Foreign keys enforced at the database level (not just application code) — verified by
  `tests/db-integrity.test.ts` (a variant cannot be created against a non-existent product;
  deleting a product cascades to its variants).

## Migrations

Local development uses `npx prisma db push` (schema-sync, no migration history — fine for
a pre-launch project with no production data yet). Before the first production deploy,
generate a proper migration history with `npx prisma migrate dev` against a local Postgres
instance, commit the generated `prisma/migrations/` folder, and deploy with
`npx prisma migrate deploy`.
