# Government ERP

Backend for a small ERP system built for a government service center (a Setu Kendra / CSC style shop that handles citizen document work — birth certificates, income certificates, PAN, Aadhaar updates, passports, driving licenses, and so on).

The idea is simple: a counter staff member takes in a customer's request, the system generates an acknowledgement number, tracks the work through pending → accepted/rejected → completed → delivered, and records whatever payment comes in against it. The admin gets a dashboard on top of all that plus staff and service management.

This started as an internship project, so parts of it (marked below) are still scaffolding rather than finished features. A Flutter frontend is being built separately against this API — folder structure notes for that live in `docs/Frontend_docs`.

## Stack

- Node.js + Express (ESM, no TypeScript)
- Prisma ORM with SQLite (single-file DB, meant to run offline on a counter PC — swappable to Postgres/MySQL later by changing the datasource)
- JWT-based auth
- Swagger / OpenAPI for API docs

## What's actually working

- **Auth** — login, logout, `/me`, change password. JWT issued on login, `protect` middleware guards everything else.
- **Customer intake** — create/list/update/soft-delete a work intake, with type-ahead customer suggestions (matches on name/surname/phone) and previews for the next acknowledgement/receipt number before saving.
- **Works** — list/filter, view one, update status, soft-delete. Acknowledgement numbers follow `ACK-<year>-<seq>`, generated per-year via `AckCounter` so the sequence resets every January.
- **Payments** — one work can have partial payments; `remaining` and `paymentStatus` (PENDING / BALANCE / COMPLETED) are derived from `charge - discount - paid`.
- **Services** — the catalog of certificate/document types and their default charges. Staff only see active ones; admin can create, edit, deactivate.
- **Staff management** (admin only) — create staff accounts, fetch login credentials, activate/deactivate, list.
- **Activity logs** (admin only) — append-only audit trail of who did what (staff created, work created, payment collected, backup taken, etc).
- **Dashboard** (admin only) — summary KPIs, works-by-service breakdown, and an export endpoint.

## Scaffolded but not wired up yet

`business-profile`, `backups`, `reports`, and `form-fields` have controllers/routes/repositories already written in the same pattern as everything else, but they're not mounted in `src/app.js` yet — they're next in line, not dead code.

## A couple of known rough edges

- `User.passwordHash` is currently stored as plain text (see the comment in `auth.service.js` / `prisma/seed.js`). Fine for local dev, not something to ship as-is — hashing is on the list before this touches real data.
- `role` and a few status fields (`Work.status`, `Payment.paymentMethod/paymentStatus`) are plain strings rather than DB enums, because Prisma's SQLite connector doesn't support `enum` blocks. They're enforced at the application layer instead — see the notes in `prisma/schema/*.prisma`.

## Getting started

```bash
# 1. install deps
npm install

# 2. set up env
cp .env.example .env
# edit .env if you need to change the port, DB path, or JWT secret

# 3. generate the Prisma client and create the SQLite db
npm run generate
npm run db

# 4. (optional) seed some sample data — 1 admin, 4 staff, services, customers, works, payments
npm run seed

# 5. run it
npm run dev
```

Server comes up on `http://localhost:3000` by default. Interactive API docs (Swagger UI) are served at `/docs`.

If you seeded the database, you can log in with:

| Role  | User ID  | Password |
|-------|----------|----------|
| Admin | ADMIN001 | admin123 |
| Staff | STAFF001 | staff123 |

(obviously not real credentials for anything beyond local testing)

## Project layout

```
prisma/
  schema/          one .prisma file per model, merged automatically (Prisma 6 schema-folder feature)
  seed.js
src/
  config/          app, auth, database, swagger config
  middleware/       auth, role-based authorize, validation, error handling
  modules/          one folder per feature — controller / service / repository / routes / swagger (+ validation)
  utils/
  app.js           express app, route mounting
server.js          entry point
docs/
  Backend_docs/    setup notes, folder structure
  Frontend_docs/   Flutter app structure (separate repo/effort)
```

Each module follows the same shape: `*.routes.js` → `*.controller.js` → `*.service.js` → `*.repository.js`, with `*.validation.js` for request validation and `*.swagger.js` for the OpenAPI annotations that feed `/docs`.

## Useful scripts

| Command | What it does |
|---|---|
| `npm run dev` | start with nodemon (auto-reload) |
| `npm start` | start normally |
| `npm run generate` | regenerate the Prisma client after touching schema |
| `npm run db` | push the schema to the SQLite file |
| `npm run migrate` | create a proper Prisma migration |
| `npm run seed` | wipe and reseed sample data |

## Roles

Two roles right now: `ADMIN` and `STAFF`. Staff can handle day-to-day intake/works/payments; anything involving staff accounts, activity logs, the dashboard, or service management is admin-only, enforced via the `authorize()` middleware on each route.
