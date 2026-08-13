# Changes — Ische Ghuree rebrand (2026-08-12)

Full rebrand of the copied jewelry storefront ("ginag" / "dreamecommerce") into
**ইচ্ছে ঘুড়ি — Ische Ghuree**: jute bags + hair accessories, Dhaka. This file
replaces the stale payments changelog — that Stripe/PayPal work was removed
along with the whole checkout model; the site is now a catalog + custom-order
**quote** flow only.

## Brand source

- Brand data extracted from the official Facebook page
  (facebook.com/iccheghureeofficial) on 2026-08-12 into **BRAND.md** (identity,
  contact, product lines, voice) and **DESIGN.md** (palette, typography,
  content plan). Curated photos live in `images/facebook/`; the 8 production
  product photos were renamed into `frontend/public/images/products/`.
- New logo assets: `frontend/public/ische-ghuree.svg` (vector kite —
  navbar/footer/favicon) and `frontend/public/ische-ghuree-logo.jpg`
  (photo logo — hero/about/OG).
- Contact everywhere: phone 01820-417426 · ischeghuree@gmail.com ·
  Dhaka Uddan, Mohammadpur, Dhaka 1207 · hours "Always open" (সবসময় খোলা).

## Schema (`backend/prisma/schema.prisma`)

- **CustomOrder** rebuilt for the jute/accessories quote flow:
  - `charmColorAndStyle` → **`productDetails`** (String, required — "কী বানাতে/নিতে চান — Product details")
  - `addInitial` and `initial` **deleted** (jewelry engraving fields)
  - **`quantity`** (Int, optional) added
  - **`orderType`** added — new enum `OrderType { RETAIL WHOLESALE }`, default
    `RETAIL` (labels "খুচরা — Retail" / "পাইকারী — Wholesale") — jute bags sell
    both wholesale and retail
  - `name/phone/email/deliveryMethod/mailingAddress/notes` unchanged
- **SiteReview** model dropped (unused jewelry-era testimonials table).
- `SiteSettings.orderPrefix` default changed to **`IG-`** — custom-order
  numbers are now `IG-…`.
- Homepage config: section key **`ginaGHero` → `kiteHero`**; component
  `GinaGHero.tsx` → `KiteHero.tsx`.

## Public-surface bug fixes

- **DRAFT/ARCHIVED product leaks**: public product listing, detail, and search
  endpoints now exclude `DRAFT` and `ARCHIVED` statuses
  (`HIDDEN_STATUSES` in `backend/src/controllers/product.controller.ts`) —
  previously unpublished products were visible to everyone.
- **`/dashboard` 404**: added `frontend/src/app/dashboard/page.tsx`, which
  role-redirects to the correct dashboard area instead of 404ing after login.
- **Auth cookie mismatch**: the route proxy (`frontend/src/proxy.ts`) accepts
  both `token` and `auth_token` cookies, so login state set by the API is
  recognized by the middleware (previously users bounced back to login).
- Added `frontend/src/app/error.tsx` and `not-found.tsx` (branded error/404
  pages) and `frontend/src/app/icon.svg` (kite favicon).

## Dead code / dead config deleted

- `backend/src/routes/seed.routes.ts` (HTTP-exposed seeding endpoint) and
  `backend/src/utils/cron.ts` (orphan cron util).
- `frontend/src/context/AuthContext.tsx`, `frontend/src/services/auth.service.ts`,
  `frontend/src/store/useLangaugeStore.ts`, `frontend/src/store/useProductStore.ts`,
  `frontend/src/components/shared/navbar/PCCategoryBar.tsx` — unreferenced.
- `frontend/public/.htaccess` (Apache config, dead in Next.js — carried the old
  `dreamback.jswebdevs.com` API host) and `frontend/public/dreamecommerce.svg`
  (old logo).
- `ENTERPRISE_AUDIT.md` (stale audit of the donor codebase).
- No payments code remains: no Stripe/PayPal utils, endpoints, or admin pages.

## Seeds

- `backend/prisma/seed.ts` — super-admin user (run: `pnpm run prisma:seed`).
- `backend/src/scripts/seed_pages.ts` — bilingual storefront pages (About,
  Contact, Shipping/Delivery, Return & Exchange, Privacy, Terms…) rewritten
  for a small Dhaka delivery business
  (run: `pnpm exec ts-node src/scripts/seed_pages.ts`).

## Theming, fonts, currency

- Tailwind v4 theme tokens per DESIGN.md §1: sky-blue primary
  (hsl 204 80% 40%), jute-tan secondary, kite-magenta accent; dark theme is
  deep night blue. Decorative kite facet colors as CSS vars `--kite-cyan`,
  `--kite-orange`, `--kite-magenta`, `--kite-green` in `globals.css`.
  Components use only token classes (`bg-primary`, `text-foreground`, …).
- Fonts via next/font Google: **Noto Serif Bengali** (headings,
  `--font-heading` / `font-heading`) + **Hind Siliguri** (body, `--font-body`).
- Marquee CSS renamed `ginag-marquee-*` → `ig-marquee-*`.
- Currency is ৳ / BDT everywhere, read from `SettingsContext` `useCurrency` —
  no hardcoded `$`.

## Tooling / repo state

- Package manager standardized on **pnpm** (`pnpm-lock.yaml` +
  `pnpm-workspace.yaml` with `allowBuilds` for bcrypt/sharp/prisma-engines/
  ffmpeg-static in both subprojects); npm `package-lock.json` files removed
  from use. All docs now show pnpm commands.
- `.env.example` templates added for both subprojects; README.md, CLAUDE.md and
  backend/README.md rewritten (both READMEs were UTF-16 Dream-era garbage).
- `graphify-out/cost.json` and `graphify-out/.graphify_labels.json` gitignored
  (tool-local artifacts; the rest of graphify-out stays tracked).

## Required operator steps (deploy checklist)

1. **Install**: fresh `pnpm install` in `backend/` and `frontend/` (the copied
   node_modules trees were repaired in place but should be reinstalled).
2. **Database**: from `backend/` run `pnpm exec prisma generate` then
   `pnpm exec prisma db push` against the new Supabase project (no migration
   history — db push is the sync mechanism). The CustomOrder changes are
   destructive for the old charm/initial columns.
3. **Seeds**: `pnpm run prisma:seed`, then
   `pnpm exec ts-node src/scripts/seed_pages.ts`.
4. **Vercel env — frontend**: set `NEXT_PUBLIC_API_URL` to the new backend
   deployment (`…/api/v1`) and `NEXT_PUBLIC_CLIENT_URL` to the new storefront
   origin (old values pointed at ginag-backend.vercel.app / ggpursedecor.com).
5. **Vercel env — backend**: set `CLIENT_URL`, `CORS_ALLOWED_ORIGINS`, and
   `CORS_ALLOWED_ORIGIN_PATTERNS` to the Ische Ghuree domains + Vercel preview
   patterns (remove the ginag-frontend*.vercel.app / ggpursedecor.com
   patterns).
6. **Supabase storage host**: verify `images.remotePatterns` in
   `frontend/next.config.ts` allows the **new** Supabase project host
   (the DB moved projects — an old host entry there blocks product images
   through next/image).
7. Change the seeded super-admin password immediately after first login.

## Known design decisions

- **Dark-pinned theme**: the storefront intentionally ships only the dark
  "রাতের প্রশান্তি" (night-calm) palette — `layout.tsx` adds the `dark` class
  before paint and there is no runtime toggle. The seeded `lightVariables`
  (Sky Kite palette, DESIGN.md §1) are reserved for a future light-mode
  toggle and are not rendered today.
