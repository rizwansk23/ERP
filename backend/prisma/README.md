# Prisma schema — ERP DB Design v1

One model file per entity from `ERP_DB_Design_v1.docx`, using Prisma's
multi-file schema folder feature (all `.prisma` files in this directory are
merged automatically — no manual `import`s needed).

## Files

| File | Table | Notes |
|---|---|---|
| `schema.prisma` | — | generator + datasource only |
| `User.prisma` | `users` | `role` is a checked String (see "Enums on SQLite"); self-relation for `deleted_by` |
| `ActivityLog.prisma` | `activity_logs` | append-only, no `updatedAt` |
| `LoginSession.prisma` | `login_sessions` | |
| `Customer.prisma` | `customers` | |
| `Service.prisma` | `services` | |
| `Work.prisma` | `works` | `status` is a checked String; `finalAmount` computed field |
| `Payment.prisma` | `payments` | `paymentMethod`/`paymentStatus` are checked Strings; `finalAmount` & `remaining` computed fields |
| `BusinessSetting.prisma` | `business_settings` | typically a single-row table |
| `BackupLog.prisma` | `backup_logs` | `backupDate` is the sole timestamp |

## Setup

```bash
npm install prisma @prisma/client
```

`.env`:
```
DATABASE_URL="file:./dev.db"
```

`package.json` (tell Prisma the schema is a folder, not a single file):
```json
{
  "prisma": {
    "schema": "prisma/schema"
  }
}
```

Then:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

The `prismaSchemaFolder` preview feature (declared in `schema.prisma`) is
what lets Prisma read a directory of `.prisma` files instead of one
monolithic file.

## Generated / computed columns — important caveat

The design doc specifies three `GENERATED ALWAYS AS (...) STORED` columns:

- `works.final_amount` = `charge - discount_amount`
- `payments.final_amount` = `charge - discount_amount`
- `payments.remaining` = `charge - discount_amount - paid`

**Prisma's schema language has no concept of a native, always-recomputed
generated column.** `@default(dbgenerated(...))` only sets a value *once*,
at insert time — it won't update when `charge`, `discount_amount`, or `paid`
change later, so it can't reproduce `STORED` semantics.

Two ways to handle this; pick one:

**Option A — compute in the app layer (used in this schema).**
The fields above are plain, writable `Float` columns. Your service/repo
layer recalculates and sets them on every create/update alongside
`charge`/`discountAmount`/`paid`. Simplest to work with from Prisma Client,
easy to unit test, and what most Prisma+SQLite projects do in practice.

**Option B — true DB-enforced generated columns.**
After `prisma migrate dev` creates the tables, run a follow-up manual
migration that drops and recreates the column (SQLite can't `ALTER COLUMN`
directly, so recreate the table via SQLite's 12-step procedure, or use
`prisma migrate dev --create-only` and hand-edit the generated SQL) to add:

```sql
-- example for works.final_amount
ALTER TABLE works ADD COLUMN final_amount REAL
  GENERATED ALWAYS AS (charge - discount_amount) STORED;
```

If you go this route, Prisma Client must **never** include these fields in
`create`/`update` payloads (SQLite rejects explicit writes to a `STORED`
column) — enforce that with a thin wrapper around Prisma Client, or use
`Unsupported("...")` field types so Prisma ignores them entirely and you
read them back with `$queryRaw`.

> The doc's change log (#3) mentions "remaining formula confirmed: charge −
> discount_amount − advance" but the PAYMENTS table itself defines
> `remaining = charge − discount_amount − paid`. This schema follows the
> table definition (`paid`); flag this to whoever owns the doc if "advance"
> was meant to be a distinct field.

## Enums on SQLite

**Prisma's SQLite connector does not support `enum` blocks at all** (this
was tried and confirmed with Prisma CLI 5.22 — `enum` declarations fail
schema validation with "the current connector does not support enums").
So every CHECK-constrained column from the design doc is a plain `String`
field instead. The allowed values are:

- `users.role`: `"ADMIN"` | `"STAFF"`
- `works.status`: `"PENDING"` | `"ACCEPTED"` | `"REJECTED"` (`completed`/
  `delivered` are separate booleans, not part of this field, matching the
  doc's status-flow note: PENDING → ACCEPTED/REJECTED → COMPLETED →
  DELIVERED)
- `payments.paymentMethod`: `"CASH"` | `"ONLINE"` | `"CHEQUE"` | `"LOAN"`
- `payments.paymentStatus`: `"PENDING"` | `"BALANCE"` | `"COMPLETED"`

Nothing enforces these values at the database level. Enforce them in your
application layer — e.g. a TypeScript union type plus a `zod` schema on
every write path — and, if you want a hard DB-level guarantee, add real
`CHECK (role IN ('ADMIN','STAFF'))`-style constraints via a manual
migration after `prisma migrate dev` creates the tables.

If you later move this schema to Postgres or MySQL, both support Prisma
`enum` blocks natively — at that point it's worth switching these back to
real enums for the extra type safety.

## Indexes

Applied per the doc's "Recommended indexes" section:
`works.customer_id`, `works.service_id`, `works.status`, `payments.work_id`,
`payments.payment_status`, `activity_logs.user_id`,
`activity_logs.(entity_type, entity_id)`.

## Soft-delete / audit pattern

Every table except `business_settings` and `backup_logs` carries
`createdAt`/`updatedAt`/`deletedAt` + a `deletedBy → users.id` relation
(nullable), matching the doc. `users.deletedBy` is a self-relation;
the doc notes that only an `ADMIN` may soft-delete a `STAFF` user — that
rule is **not** enforceable in the schema itself and must be checked in
your service layer before the delete.
