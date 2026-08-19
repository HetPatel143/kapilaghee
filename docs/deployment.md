# Kapila Dairy Farm — Deployment Guide

Status: Prompt 4 (production readiness) + Vercel deploy fix
Last updated: 2026-08-18

The project is now deploying to Vercel. This guide covers that path first, then stays
generic for anyone hosting elsewhere (Railway, Render, a VPS, etc.) — the one place the
choice of provider actually matters is file storage (§4).

## 0. Vercel Quick Fix (if your build is failing right now)

If your Vercel build fails with `Environment variable not found: DATABASE_URL` or
`Can't reach database server`, that's because the app needs a real, internet-reachable
PostgreSQL database *before* it can build — Next.js fetches content from the database
while pre-rendering pages, and Vercel's ephemeral build environment has no database of
its own.

1. **Get a Postgres database.** Easiest with Vercel: your project's **Storage** tab →
   **Create Database** → Postgres (or connect Neon/Supabase via the Vercel Marketplace).
   This automatically adds a `DATABASE_URL` environment variable to your Vercel project.
   If you provisioned a database elsewhere, add `DATABASE_URL` yourself under
   **Project Settings → Environment Variables**.
2. **Add `SITE_URL`** in the same Environment Variables screen — your real deployed URL
   (e.g. `https://kapilaghee.vercel.app` or your custom domain once attached).
3. **Apply the schema and seed the database**, from your own machine, pointed at that
   same production `DATABASE_URL` (copy the connection string from Vercel):
   ```bash
   # in your local project folder, temporarily:
   DATABASE_URL="<paste the production connection string>" npx prisma db push
   DATABASE_URL="<paste the production connection string>" ADMIN_EMAIL="you@yourdomain.com" ADMIN_PASSWORD="<a strong password>" npm run db:seed
   ```
   (On Windows PowerShell: `$env:DATABASE_URL="..."; npx prisma db push` instead of the
   inline `VAR=value` form.)
4. **Redeploy** — either push a new commit, or use Vercel's "Redeploy" button on the
   failed deployment now that the database exists and the env vars are set.

This only needs to be done once per environment (production, and again for any preview
environment if you want previews to have their own database).

## 1. Requirements

| Requirement | Version / Notes |
|---|---|
| Node.js | 20 LTS or newer (developed and tested on 22.13) |
| Database | PostgreSQL 14+, in every environment including local dev (see `docker-compose.yml`) |
| File storage | See §4 below — local disk works only on a host with a persistent, writable filesystem (**not** Vercel) |
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

## 3. First-Time Setup (local development)

```bash
npm install
docker compose up -d        # starts local Postgres — see docker-compose.yml
cp .env.example .env        # already points at the docker-compose Postgres by default
npx prisma db push          # applies the schema
npm run db:seed             # seeds BusinessSettings placeholder, sample product, FAQs,
                             # documents, and the first admin user
npm run dev
```

For production (Vercel or otherwise), see §0 above for the Vercel-specific path, or §5
below for the general database setup steps.

### Note on migrations

This project uses `prisma db push` (schema sync, no migration history) throughout —
appropriate for a pre-launch project with no production data at stake yet. Once real
business data exists in production, switch to tracked migrations before making further
schema changes:

```bash
# with DATABASE_URL pointed at a local/staging Postgres instance:
npx prisma migrate dev --name init
```

Commit the generated `prisma/migrations/` folder, and from then on deploy schema changes
with `npx prisma migrate deploy` (not `db push`) so they're tracked and reversible.

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

## 5. Database Setup for Production

1. Provision a PostgreSQL database (managed service recommended: Vercel Postgres, Neon,
   Supabase, RDS, etc. — Vercel Postgres/Neon-via-Marketplace are the least setup if
   you're already hosting on Vercel, since they wire `DATABASE_URL` in automatically).
2. Set `DATABASE_URL` (and `SITE_URL`) in your hosting provider's environment variables.
3. Run `npx prisma db push` (or `prisma migrate deploy` once you've adopted tracked
   migrations per §3's note) against that `DATABASE_URL`.
4. Run `npm run db:seed` once (see the seeding caveat above) or manually create
   `BusinessSettings` and the first `AdminUser` via a one-off script.

**Important:** Next.js pre-renders most public pages at *build* time, which means the
database must already exist, be reachable, and have its schema applied **before** your
first successful build — steps 1–3 above have to happen before you deploy, not after (see
§0 for the exact Vercel sequence). `generateStaticParams` for the product page is written
to degrade gracefully (skips static generation rather than failing the whole build) if the
database is briefly unreachable, but most other pages are not — a reachable, migrated
database is a hard prerequisite for a successful build, not just for runtime.

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
- [ ] `DATABASE_URL` points to a real, reachable production Postgres instance
- [ ] Database schema applied (`prisma db push` or `migrate deploy`) **before** the first build
- [ ] `ADMIN_PASSWORD` is a strong, unique value — not the seed placeholder
- [ ] File storage swapped to object storage if deploying to a serverless/ephemeral host like Vercel (§4) — otherwise admin-uploaded images/documents will disappear after each deploy
- [ ] HTTPS is terminated in front of the app (required for admin cookies to work — §6)
- [ ] `npm run build` succeeds cleanly with production env vars set
- [ ] Real `robots.txt`/`sitemap.xml` reachable at the production domain and pointing at
      that domain's URLs (verify after `SITE_URL` is set correctly)
- [ ] Backup routine in place per §8 before real customer/business data accumulates
