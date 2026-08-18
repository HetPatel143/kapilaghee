# Kapila Dairy Farm

Website for Kapila Dairy Farm — a brand/product showcase and enquiry site for A2 Gir Cow
Ghee, plus an admin dashboard for managing its content. Built with Next.js (App Router),
Prisma, and Tailwind CSS.

## Documentation

Full project documentation lives in [`docs/`](docs/):

- [`docs/requirements.md`](docs/requirements.md) — business/customer/admin requirements
- [`docs/architecture.md`](docs/architecture.md) — technical architecture (see the note at
  the top — superseded in part by `api.md`/`database.md`)
- [`docs/api.md`](docs/api.md) — the actual Server Actions / data-access API surface
- [`docs/database.md`](docs/database.md) — schema reference
- [`docs/admin-guide.md`](docs/admin-guide.md) — how to use the admin dashboard (written for a non-technical business owner)
- [`docs/deployment.md`](docs/deployment.md) — how to deploy to production
- [`docs/final-audit.md`](docs/final-audit.md) — the pre-launch QA/security/performance audit
- [`docs/design-system.md`](docs/design-system.md), [`docs/ux-specification.md`](docs/ux-specification.md), [`docs/sitemap.md`](docs/sitemap.md) — design and UX reference
- [`docs/future-ecommerce.md`](docs/future-ecommerce.md) — how Phase 2 (online ordering) extends this system

## Getting Started

```bash
npm install
cp .env.example .env      # fill in DATABASE_URL, SITE_URL, ADMIN_EMAIL, ADMIN_PASSWORD
npx prisma db push        # create the local SQLite database
npm run db:seed           # seed demo content + the first admin user
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site, and
[http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the admin
dashboard (credentials come from the `ADMIN_EMAIL`/`ADMIN_PASSWORD` you set before seeding).

## Scripts

```bash
npm run dev       # start the dev server
npm run build     # production build
npm run start     # run a production build
npm run lint      # ESLint
npm test          # run the test suite (node:test)
npm run db:seed   # seed the database
```

## Stack

Next.js 16 (App Router, Server Actions) · TypeScript · Tailwind CSS v4 · Prisma ·
PostgreSQL in production / SQLite in local dev (see `docs/database.md`).
