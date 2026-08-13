---
name: prisma
description: "Prisma 7 + Supabase PostgreSQL workflow for backend. Use when adding/changing models in prisma/schema.prisma, generating the client, or syncing the DB. Catches Prisma 7 gotchas (datasource block must NOT contain url/directUrl)."
trigger: prisma changes
---

# Prisma 7 (backend)

This project uses **Prisma 7** with **Supabase Postgres**. Schema lives at [backend/prisma/schema.prisma](../../../backend/prisma/schema.prisma). DB connection lives in [backend/prisma.config.ts](../../../backend/prisma.config.ts), NOT in the schema file.

## Prisma 7 gotcha — datasource block

In Prisma 7 the `datasource db { ... }` block **must only declare `provider`**. Putting `url` or `directUrl` there fails validation:

```prisma
// ✅ correct (Prisma 7)
datasource db {
  provider = "postgresql"
}
```

Connection URL is configured in `prisma.config.ts`:

```ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: { url: env("DATABASE_URL") },
});
```

## Migration workflow

This project never had a `prisma/migrations/` folder — schema was originally synced via `db push`. Stick with `db push` for changes; do **not** run `prisma migrate dev` (it will demand a baseline reset and try to wipe the Supabase DB).

```bash
cd backend

# Validate schema + regenerate client (always run after editing schema)
npx prisma generate

# Sync schema to Supabase (DESTRUCTIVE on dropped columns/tables — confirm with user first)
npx prisma db push

# Force-accept data loss when dropping fields/models the user has authorized
npx prisma db push --accept-data-loss
```

`--accept-data-loss` is destructive — never run without explicit user confirmation in the same conversation.

## Connection strings

`.env` has two URLs from Supabase:
- `DATABASE_URL` — pooled (port 5432, `pgbouncer=true` style). Use for the runtime PrismaClient.
- `DIRECT_URL` — direct connection. Required by `migrate` operations; not currently wired in `prisma.config.ts` because we use `db push` only.

## Current models (post-pivot to catalog + custom orders)

Live: `User`, `Address`, `Media`, `Category`, `Product` (`priceMin`/`priceMax` decimals, no variations), `CustomOrder` (the order-form submissions), `HeroSection`, `SiteReview`, `SiteSettings`, `StoreTheme`, `Blog`/`BlogCategory`, `StorefrontPage`, `ChatSession`/`ChatMessage`, `AuditLog`, `PhoneVerification`, `SocialLink`.

Dropped (do NOT reintroduce without checking with the user): `Order`, `OrderItem`, `Cart`, `CartItem`, `Wishlist`, `WishlistItem`, `ProductVariation`, `Coupon`, `Review`, `DailyStat`, plus `StockStatus`/`OrderStatus`/`PaymentMethod`/`PaymentStatus`/`DiscountType` enums.

## After changing the schema

1. `npx prisma generate` (mandatory — TS won't compile until the client matches).
2. Update affected controllers in [backend/src/controllers/](../../../backend/src/controllers/).
3. Run `npx prisma db push` (with user approval if destructive).
4. If a new model needs admin CRUD, add a routes file under [backend/src/routes/](../../../backend/src/routes/) and register it in [routes/index.ts](../../../backend/src/routes/index.ts).
