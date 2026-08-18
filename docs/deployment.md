# Kapila Dairy Farm — Deployment Guide

Status: Prompt 4 (production readiness)
Last updated: 2026-08-18

No specific hosting provider has been chosen yet, so this guide is written for a generic
Node.js hosting environment (Vercel, Railway, Render, a VPS, etc.) and calls out the one
place the choice of provider actually matters (file storage — see §4).

## 1. Requirements

| Requirement | Version / Notes |
|---|---|
| Node.js | 20 LTS or newer (developed and tested on 22.13) |
| Database | PostgreSQL 14+ in production (see `docs/database.md` — local dev uses SQLite, production must use Postgres) |
| File storage | See §4 below — local disk works only on a host with a persistent, writable filesystem |
| npm | Whatever ships with your Node version — no other package manager was used or tested |

## 2. Environment Variables

Copy `.env.example` to `.env` and fill in real values. Summary (see `.env.example` for
full comments on where each is read):

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string in production |
| `SITE_URL` | Yes | The real production URL (e.g. `https://www.kapiladairyfarm.com`) — used for canonical URLs, Open Graph, sitemap, and structured data. **Do not leave this at the localhost default in production** — every SEO/structured-data URL will be wrong if you do. |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Only for the initial seed | Read once by `prisma/seed.ts` to create the first `AdminUser`. Not read anywhere at runtime — safe to unset after the first seed. Use a strong, unique password; change it (or create a fresh admin user and deactivate the seeded one, once that capability exists) before real business use. |

Never commit `.env` — it's gitignored. `.env.example` contains variable *names* only, no
real values.

## 3. First-Time Setup

```bash
npm install
cp .env.example .env
# edit .env: set DATABASE_URL to your Postgres instance, SITE_URL to your real domain,
# and choose a real ADMIN_EMAIL/ADMIN_PASSWORD

npx prisma migrate deploy   # applies schema to the database (see note below)
npm run db:seed             # seeds BusinessSettings placeholder, sample product, FAQs,
                             # documents, and the first admin user
npm run build
npm start
```

### Note on migrations

This project was developed locally against SQLite using `prisma db push` (schema sync,
no migration history — appropriate for pre-launch development with no production data at
stake). **Before the first production deploy**, generate a real migration history against
a local/staging Postgres instance:

```bash
# with DATABASE_URL pointed at a real (throwaway/staging) Postgres instance:
npx prisma migrate dev --name init
```

Commit the generated `prisma/migrations/` folder. From then on, deploy with
`npx prisma migrate deploy` (not `db push`) so schema changes are tracked and reversible.

### Note on seeding production

`npm run db:seed` is written to be safe to re-run (it uses `upsert` for most rows), but it
does seed one demo product and a handful of FAQs. Review what it creates
(`prisma/seed.ts`) before running it against a real production database — you likely want
to seed only `BusinessSettings` and the first `AdminUser`, then build the real product
catalog and content through the Admin dashboard rather than keeping the seeded demo data.

## 4. File Storage — the one production-specific decision

`src/lib/storage.ts` currently saves uploaded images/documents to the local filesystem
(`public/uploads/`). This works correctly on:
- A traditional VPS or any host with a persistent, writable disk that survives restarts.

This does **not** work correctly on:
- Serverless/edge platforms with an ephemeral or read-only filesystem (e.g. Vercel's
  default deployment) — uploaded files would disappear on the next deploy or cold start.

**Before deploying to a serverless platform**, swap `storage.ts`'s `saveUpload`/
`deleteUpload` implementations for an object-storage adapter (S3, Cloudflare R2, etc.) —
see the `.env.example` placeholders (`MEDIA_STORAGE_*`) and `docs/architecture.md` §8 for
the intended design. Every caller (`src/app/actions/admin-products.ts`,
`admin-media.ts`, `admin-documents.ts`, `admin-content.ts`) goes through this one module,
so this is a contained, single-file change — not a rewrite.

## 5. Database Migration to Production

1. Provision a PostgreSQL database (managed service recommended: Neon, Supabase, RDS, etc.).
2. Set `DATABASE_URL` to its connection string.
3. In `prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"`.
4. Run `npx prisma migrate deploy` (after generating the migration per §3's note).
5. Run `npm run db:seed` once (see the seeding caveat above) or manually create
   `BusinessSettings` and the first `AdminUser` via a one-off script.

## 6. Cookies, HTTPS, and Sessions

- Admin session cookies are set `httpOnly`, `sameSite: "lax"`, and `secure: true` in
  production (`process.env.NODE_ENV === "production"`) — this means **the admin login
  will not work correctly over plain HTTP in production**; the site must be served over
  HTTPS. Any standard host (Vercel, or a VPS behind a reverse proxy like Caddy/Nginx with
  Let's Encrypt) provides this by default — no extra app configuration is needed once
  HTTPS is terminated correctly in front of the app.
- No CORS configuration is needed — there is no separate API origin; the admin and public
  site are the same Next.js app, and no other origin calls it.

## 7. Error Logging

Server-side errors are currently logged to `console.error` (visible in your host's log
stream — e.g. Vercel's function logs, or stdout on a VPS under a process manager like
`pm2`/`systemd`). `error.tsx`/`global-error.tsx` boundaries (see `docs/final-audit.md` H1)
log only an error digest client-side, never a full stack trace, to the browser console.
There is no third-party error-tracking service (Sentry, etc.) wired up — if the business
wants proactive error alerting rather than reading logs after the fact, that would be a
deliberate future addition, not something silently missing today.

## 8. Backup & Recovery Recommendations

No backup platform is implemented — these are the operational practices to put in place
once real business data exists, appropriate to the scale of a small-business site:

- **Database:** if using a managed Postgres provider (Neon, Supabase, RDS), enable its
  built-in automated daily backups/point-in-time-recovery — this is typically a checkbox/
  plan setting, not something to build. If self-hosting Postgres, schedule a daily
  `pg_dump` to off-server storage.
- **Uploaded media/documents:** whatever storage you choose in §4 (local disk or object
  storage), ensure it's included in your backup routine — a VPS needs its disk backed up;
  S3/R2 buckets should have versioning enabled so an accidental delete/overwrite is
  recoverable.
- **Business-critical documents** (the FSSAI license, lab reports): since these are also
  physical/official documents the business already holds independently of the website,
  the website's copy being lost is inconvenient (re-upload from Admin) rather than a loss
  of the original — but versioned object storage still avoids that inconvenience.
- **Recovery drill:** periodically confirm a backup actually restores — an untested
  backup is not a backup. This doesn't need tooling, just a calendar reminder.

## 9. Production Configuration Checklist

- [ ] `SITE_URL` set to the real domain (not localhost)
- [ ] `DATABASE_URL` points to production Postgres, not the dev SQLite file
- [ ] `prisma/schema.prisma` datasource `provider` set to `"postgresql"`
- [ ] Migrations applied via `prisma migrate deploy`, not `db push`
- [ ] `ADMIN_PASSWORD` is a strong, unique value — not the seed placeholder
- [ ] File storage swapped to object storage if deploying to a serverless/ephemeral host (§4)
- [ ] HTTPS is terminated in front of the app (required for admin cookies to work — §6)
- [ ] `npm run build` succeeds cleanly with production env vars set
- [ ] Real `robots.txt`/`sitemap.xml` reachable at the production domain and pointing at
      that domain's URLs (verify after `SITE_URL` is set correctly)
- [ ] Backup routine in place per §8 before real customer/business data accumulates
