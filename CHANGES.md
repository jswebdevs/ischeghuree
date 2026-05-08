# Changes — Custom-order products + dynamic Stripe/PayPal

## To apply

Schema changes need to be pushed to your Postgres before the new endpoints work.

```powershell
cd d:\Projects\ginag\ginag-backend
npx prisma generate
npx prisma db push
```

`db push` is appropriate here because the project has no `prisma/migrations/` folder yet (no migration history). If you'd rather start tracking migrations, run `npx prisma migrate dev --name dynamic_payments_and_custom_orders` instead and it will create the first migration.

## What changed

### Schema (`ginag-backend/prisma/schema.prisma`)
- `Product.basePrice` → nullable
- `Product.isCustomOrder` (Boolean, default false)
- `Product.priceNote` (String, optional)
- `Order.isCustomOrder` (Boolean, default false)
- `Order.customNotes` (Text, optional)
- `Order.totalAmount`, `deliveryFee`, `finalAmount`, `paymentMethod` → nullable (custom orders have no price at intake)
- `OrderItem.variationId`, `price`, `totalPrice` → nullable
- `OrderItem.isCustomOrder`, `customDetails` (Json) added
- `SiteSettings.stripeEnabled`, `stripeSecretKey`, `paypalEnabled`, `paypalSecret`, `paypalEnv`

### Backend (read keys from DB on every request)
- New `src/utils/payment.ts` — `getPaymentConfig()`, `getStripeClient()`, `capturePaypalOrder()`, `getPaypalOrder()`. Each call rereads settings, so toggling providers in the admin takes effect immediately without a restart.
- `payment.controller.ts` — dynamic Stripe + new endpoints:
  - `GET /payments/config` — public, returns enabled flags + publishable identifiers (no secrets)
  - `POST /payments/stripe/create-intent` — uses dynamic config
  - `POST /payments/paypal/capture` — server-side capture for verification
  - `GET /payments/paypal/order/:id` — verify a PayPal order
- `settings.controller.ts` — strips `stripeSecretKey` / `paypalSecret` from public responses (admins still get them); update accepts new fields and only writes secrets when caller actually sent them (so leaving them blank in the form preserves stored values).
- `product.controller.ts` — accepts `isCustomOrder` + `priceNote`; allows null `basePrice` when custom.
- `order.controller.ts`:
  - `createOrder` — handles cart items with null prices (sets order amounts to null and `isCustomOrder=true`)
  - `POST /orders/custom-request` (new) — quote intake; creates a pending order with no payment
  - `PATCH /orders/:id/custom-price` (new, admin) — converts a custom request into a payable order

### Frontend
- `lib/axios` flow already in place — components now call `/payments/config` for the public flags.
- **Checkout** (`app/checkout/page.tsx`) — branches on `?customOrder=<productId>`:
  - Quote flow: hides cart summary, hides payment, shows "Request Quote" CTA, posts to `/orders/custom-request`.
  - Regular flow: reads `stripeEnabled`/`paypalEnabled`, hides disabled providers, falls back to "We'll invoice you" panel when both are off.
- `_components/PaymentSection.tsx` — accepts `stripeEnabled`/`paypalEnabled`; method switcher only shown when both providers are on.
- **Product card / detail** — when `isCustomOrder`:
  - Card: shows amber "CUSTOM" badge + "Quote on request" copy + "On Order" status
  - Detail: replaces price block with "Custom Order" panel, replaces "Add to Cart" with "Request a Quote" link to `/checkout?customOrder=<id>`
- **Admin → Storefront → Payments** (new page at `/dashboard/admin/storefront/payments`) — toggles + key fields for Stripe and PayPal, with sandbox/live switcher and "leave blank to keep stored secret" UX.
- **Admin → Products → Create/Edit** — `BasicInfoPart` gets the custom-order toggle + a `priceNote` input that appears only when the toggle is on.

## Where the brand images live

`/images/Hero.jpeg` and `/images/checkout.jpeg` are reference designs — they describe the look you want for the GinaG hero and order form, not images that get embedded as-is. The existing `app/checkout/page.tsx` already mirrors the order-form fields from the reference (Name, Cell, Charm color/style, Initial Y/N, Pickup/Mailing). Move them into `ginag-frontend/public/images/` if you want to ship them as actual asset files for a branded hero on the homepage.
