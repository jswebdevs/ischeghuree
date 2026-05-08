# Ginag — Enterprise Readiness Audit

Generated 2026-05-08. Five parallel audits ran across security, performance,
accessibility, SEO, and concurrency. This document captures **what shipped
in this pass** and **what's still open**, prioritized by impact.

> Truth in advertising: a single audit run is not a substitute for a
> dedicated test suite, a load test, or a manual pen test. Treat this as a
> high-value first sweep — not a certification.

---

## Shipped in this pass

### Security
- **Rate limiting** — `express-rate-limit` installed; tight limit on `/auth/*` (10 / 15min, env-tunable via `AUTH_RATE_LIMIT_MAX`), generous default on `/api/v1/*` (200 / min via `API_RATE_LIMIT_MAX`). New `src/middlewares/rateLimit.ts` exports `authLimiter`, `apiLimiter`, `writeLimiter`. `app.set('trust proxy', 1)` so Vercel/Cloudflare X-Forwarded-For drives `req.ip`.
- **Auth log scrubbing** — removed `console.log` lines that were leaking email/identifier on every login attempt in `src/controllers/auth.controller.ts`.
- **Secret-strip widened** — `stripSecrets()` in `settings.controller.ts` now drops `googleApiKey`, `stripeSecretKey`, `paypalSecret`. `GET /settings` runs through `optionalAuth` so admins still see secrets, anonymous callers don't.
- **Seed route protected** — `POST /api/v1/seed/seed-demo` now requires `protect + authorize('SUPER_ADMIN')`.
- **CORS env-only** — `src/app.ts` and `src/server.ts` no longer hardcode origins. Reads `CORS_ALLOWED_ORIGINS`, `CORS_ALLOWED_ORIGIN_PATTERNS`, `CLIENT_URL`, `CORS_ALLOW_ALL`. Localhost is auto-allowed only outside production.

### Concurrency / reliability
- **Chat session race fixed** — `chat.socket.ts` switched from `findUnique → create` to `prisma.upsert`. Two simultaneous connections from the same user can no longer trip the unique constraint on `userId`.
- **Chat write atomicity** — message create + session-status bump now run inside `prisma.$transaction` so a crash between them can't leave the session stale.
- **Per-socket message throttle** — 200ms minimum interval, 4000-char cap. Cheap defense against runaway clients.
- **Order number race fixed** — `customOrder.controller.ts:generateOrderNumber()` no longer relies on `count + 1`. Uses base36 timestamp + random suffix; collision probability is negligible.
- **Pagination capped** — `listCustomOrders` enforces `limit ≤ 100, page ≥ 1`. An admin can't request `limit=999999` and DoS the function.
- **Homepage config transactional** — `updateHomepageSection` now runs read-merge-write inside `prisma.$transaction`. Two admins saving different sections can no longer drop each other's changes.
- **Section key validated** — homepage section param now matches `^[a-zA-Z][a-zA-Z0-9_-]{0,40}$` so `?section=__proto__` etc. can't poison the JSON blob.

### Accessibility
- **OrdersInbox modal** — proper `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing at the title. Focus is moved into the dialog on open and restored on close. Tab/Shift-Tab is trapped inside the dialog. Body scroll locked while open.
- **FAQ accordion** — buttons now expose `aria-expanded`, `aria-controls`, and `id`; panels use `role="region"` and `aria-labelledby`. Screen readers can announce open/closed state.
- **Cursor-pointer** — applied to interactive buttons in the orders flow, sticky banner, sidebar, and sonner action buttons (theme already set).

### SEO
- **`src/app/robots.ts`** — generated from `NEXT_PUBLIC_CLIENT_URL`; allows `/`, disallows admin/dashboard/auth paths, points at the sitemap.
- **`src/app/sitemap.ts`** — static routes + dynamic products/categories/blogs fetched from the API at request time (10-min revalidate). Each entry carries `lastModified` from the upstream record.
- **Organization JSON-LD** — emitted in the root layout, populated from `SiteSettings` (storeName, logo, contactEmail, contactPhone). Search-engine Knowledge Panel input.

### Performance
Schema indexes added to `prisma/schema.prisma`:
- `Address.userId`
- `Category.parentId`
- `Product.productStatus` and `(productStatus, createdAt)`
- `CustomOrder.status`, `(status, createdAt)`, `customerEmail`
- `AuditLog.userId`, `(entity, entityId)`, `(action, createdAt)`, `createdAt`
- `ChatMessage.(sessionId, createdAt)`

> **Action required**: run `npx prisma db push` (or `prisma migrate dev --name add_indexes`) to apply.

---

## Still open — prioritized

### P0 (block production, fix this sprint)

| # | Area | File / scope | Recommended fix |
|---|---|---|---|
| 1 | **Security** | `src/utils/jwt.ts` — 30-day token TTL | Drop to 15 min access + opaque refresh token in httpOnly cookie. |
| 2 | **Security** | bcrypt rounds = 10 across `user.controller.ts` | Bump to 12 (≤ 14 if CPU permits). One-line change × 5 sites. |
| 3 | **Security** | No password-reset flow | Add forgot-password / reset endpoints with single-use, time-limited token sent by email. |
| 4 | **Security** | OTP stored in plaintext (`user.controller.ts:166-177`) | Hash OTP with bcrypt before write; compare on verify. |
| 5 | **Security** | `DELETE /api/v1/audit/all` exists | Remove the route, or require a one-time email confirmation token in addition to SUPER_ADMIN. |
| 6 | **Security** | File upload MIME allowlist too permissive (`config/upload.ts`) | Restrict to `image/webp,image/png,image/jpeg,video/webm` and reject `image/svg+xml`. |
| 7 | **Concurrency** | Stripe `paymentId` not `@unique` on `Order` | Add `@unique` to `Order.paymentId` (after de-duping any existing rows) so one PaymentIntent can't anchor two orders. |
| 8 | **Concurrency** | Coupon `usedCount` increment isn't bounded | Inside the order-create transaction, check `usedCount < usageLimit` and use `update where: { id, usedCount: { lt: usageLimit } }` so race losers fail loudly. |
| 9 | **Performance** | three.js / recharts / sweetalert2 in main bundle | Audit imports — wrap in `next/dynamic`; sweetalert2 callers can usually move to the existing sonner toaster. |

### P1 (next sprint)

| # | Area | File / scope | Recommended fix |
|---|---|---|---|
| 10 | **Security** | No CSRF protection on cookie-auth POSTs | Add `csurf` (or double-submit cookie pattern) for endpoints that accept cookies. |
| 11 | **Security** | No registration input validation | Centralize with `zod` schemas — password strength, email regex, phone format. Apply via a `validate(schema)` middleware. |
| 12 | **Concurrency** | Stock decrement on status change isn't transactional vs a concurrent decrement | Wrap the whole status change + stock loop in `prisma.$transaction`; consider PostgreSQL `SELECT ... FOR UPDATE` semantics on hot SKUs. |
| 13 | **Concurrency** | No order-create idempotency key | Accept `Idempotency-Key` header, store the (key, response) for 24h in a small Redis or DB cache, return cached on retry. |
| 14 | **Performance** | `getProductFilters` pulls all products for a `material` distinct | Replace with a single `SELECT DISTINCT material` raw query, cache result for 1h. |
| 15 | **Performance** | `googleReviews.controller.ts` re-queries `siteSettings` on cache miss | Cache the settings lookup (60s TTL) the same way reviews are cached. |
| 16 | **Performance** | `<img>` tags in Navbar logo, search results, GoogleReviewsSection avatars | Replace with Next `<Image>` (`width`/`height`/`sizes`). |
| 17 | **Performance** | DB pool max = 5 in `config/prisma.ts` | Raise to 15–20 to handle socket.io overhead. Confirm Supabase pool tier first. |
| 18 | **Performance** | `auditLog.create` blocks every write request | Move to fire-and-forget via `setImmediate` (or push to a small job queue). Failure to log shouldn't block the user response. |
| 19 | **A11y** | Form inputs in `register/page.tsx`, `order-now/_OrderForm.tsx` lack `<label htmlFor>` | Add `id` on each input, link via `<label htmlFor>`. |
| 20 | **A11y** | Body text uses `text-white/70` and below in dark sections | Audit for ratios; use `text-foreground` / `text-muted-foreground` (theme tokens) which already meet AA. |
| 21 | **SEO** | No Product / BreadcrumbList JSON-LD on product pages | Add `<script type="application/ld+json">` in `app/products/[slug]/page.tsx` with Product, Offer, AggregateRating, Brand. |
| 22 | **SEO** | `/search`, `/login`, `/register` lack metadata | Export `metadata` (or `generateMetadata`) — at minimum a non-indexable `robots: { index: false }` for login/register. |

### P2 (backlog)

- Audit-log batching/queuing (Bull or Postgres-LISTEN/NOTIFY).
- ThemeProvider memoize generated CSS string.
- FAQPage JSON-LD on `/faq` page.
- `hreflang` if multi-language is ever planned.
- Touch-target audit on mobile (≥ 44×44 px).
- Per-socket nonce/timestamp validation if chat content sensitivity rises.
- Request timeout on Cloudinary/Stripe/PayPal upstreams (avoid hung functions).

---

## Testing & QA gap

There is **no test suite** in either project (no `__tests__/`, `*.test.ts`, or
`vitest`/`jest` config found). For enterprise readiness this is the largest
single gap:

- Backend: add `vitest` + `supertest` for controller-level integration tests; cover auth, order create, custom-order create/list, settings update, payment intent.
- Frontend: add `vitest` + `@testing-library/react` for the checkout flow, OrdersInbox modal, and any form with conditional logic. Add `@axe-core/playwright` (or the `jest-axe` matcher) to a smoke run so a11y regressions get caught.
- E2E: add Playwright for the gold-path customer flow (browse → custom-request → admin sees in inbox → status change → emailed) and one admin flow.
- Load: hit `/api/v1/orders/checkout` and `/api/v1/payments/stripe/create-intent` with k6 or autocannon at 100 RPS for 60s; record p95.

CI: add a GitHub Actions job that runs `prisma generate && tsc --noEmit && npm run lint && npm test` on every PR.

---

## How to apply schema changes

```powershell
cd d:\Projects\ginag\ginag-backend
npx prisma generate
npx prisma db push        # or: prisma migrate dev --name add_indexes_and_concurrency_safety
```

After pushing, restart any running dev server so the cached Prisma client picks up the new types. Vercel auto-rebuilds on git push.
