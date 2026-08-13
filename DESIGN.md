# Ische Ghuree — Design System & Content Plan

Companion to [BRAND.md](BRAND.md). Drives the rebrand from ginag (gold-on-dark jewelry) to ইচ্ছে ঘুড়ি (sky, kite, jute — Bengali heritage).

## 1. Palette

Derived from the logo (sky + multicolour kite) and products (jute, satin).

### Light theme ("দিনের আকাশ" — day sky)
| Token | HSL | Use |
| --- | --- | --- |
| `--background` | `204 45% 98%` | cloud-white with a cool tint |
| `--foreground` | `215 45% 15%` | deep slate-navy text |
| `--primary` | `204 80% 40%` | kite-sky blue — buttons, links |
| `--primary-foreground` | `0 0% 100%` | |
| `--secondary` | `33 45% 62%` | jute tan — badges, secondary buttons |
| `--accent` | `330 72% 52%` | kite magenta — highlights, sale/CTA accents |
| `--muted` | `204 30% 92%` | section alt background |
| `--card` | `0 0% 100%` | |
| `--border` | `204 25% 86%` | |
| `--success` | `145 55% 38%` | eco/green (jute line) |

### Dark theme ("রাতের প্রশান্তি" — night tranquility, matches their night-line marketing)
| Token | HSL | Use |
| --- | --- | --- |
| `--background` | `215 50% 8%` | deep night blue (not black) |
| `--foreground` | `204 40% 94%` | |
| `--primary` | `204 75% 55%` | brighter sky blue |
| `--secondary` | `33 40% 55%` | jute |
| `--accent` | `330 70% 60%` | magenta |
| `--card` | `215 45% 12%` | |
| `--border` | `215 30% 20%` | |

Kite facet colours (decorative only — gradients, dividers, category chips): cyan `#22b8cf`, orange `#f76707`, magenta `#e64980`, green `#37b24d`.

## 2. Typography

- **Headings**: `Noto Serif Bengali` (Google Fonts, via next/font) — elegant serif that renders both Bangla and Latin; carries the "আভিজাত্যের ছোঁয়া / elegance" tone.
- **Body/UI**: `Hind Siliguri` — clean humanist sans with first-class Bangla support.
- Latin-only fallbacks stay in the stack (`ui-serif` / `ui-sans-serif`).
- Bilingual pattern: Bangla line first, English echo second in smaller/muted style (mirrors their post voice).

## 3. Logo & Assets

- Master logo: `images/facebook/profile-logo.jpg` (kite on sky). Derive:
  - `frontend/public/ische-ghuree-logo.jpg` (as-is, hero/about)
  - square favicon/PWA icon set from the kite crop
  - replace `frontend/public/dreamecommerce.svg` usage with a new `ische-ghuree.svg` (diamond kite mark, 4 facets + tail) so navbar/footer get a crisp vector.
- Product/marketing photos: `images/facebook/feed_*.jpg` — curated into `frontend/public/images/products/` with descriptive names during development (scrunchies-leopard, headbands-satin, jute-tote-riverside, night-scrunchies-creative, …).

## 4. Content Plan

### Categories (seed)
1. **জুট ব্যাগ — Jute Bags** (eco/heritage; wholesale + retail)
2. **হেয়ার অ্যাক্সেসরিজ — Hair Accessories** (scrunchies, headbands, bows)
3. **নাইট কেয়ার — Night Comfort** (satin scrunchie night line)

### Products (seed, from FB photos)
- Leopard-print scrunchie stand set · Satin scrunchies (emerald/purple/champagne/navy/peach) · Velvet scrunchie multi-pack · Satin headbands (10-colour set) · Gingham bow bands · Night-care satin scrunchie trio · Jute tote (orange handle) · Jute shopper (natural) · Custom jute bag (wholesale, quote-only)
- All products flow through the **custom-order/quote** model (no checkout): "Request a Quote" / "কল করুন: 01820-417426".

### Pages (seed via pages table)
- About (story: 2020, Mohammadpur, kite & wishes, golden fibre of Bengal), Contact (phone/address/FB/hours "Always open"), Shipping/Delivery, Return & Exchange, Privacy, Terms — rewritten for a small Dhaka delivery business, bilingual tone.

### Homepage composition
1. Hero — sky gradient + kite motif; "আভিজাত্যের ছোঁয়া…" / "A touch of elegance…" + CTA (Shop / Request quote)
2. Featured categories (3 cards, kite-facet accent colours)
3. New arrivals / featured products grid
4. Story strip — "আবহমান বাংলার ঐতিহ্য" (jute heritage, eco line)
5. How it works — browse → call/quote → confirm → delivery
6. Night-line spotlight (dark panel — mirrors their night creative)
7. Testimonials (real FB comment vibes, e.g. "অনেক সুন্দর হয়েছে") + trust bar (eco-friendly · wholesale & retail · delivery all over Dhaka · always open)
8. Newsletter/contact CTA

### Site settings (seed)
- Name: ইচ্ছে ঘুড়ি — Ische Ghuree · Phone: 01820-417426 · Address: Dhaka Uddan, Mohammadpur, Dhaka 1207 · FB: facebook.com/iccheghureeofficial · Hours: Always open · Founded: 25 Aug 2020.

## 5. Voice Rules

- Bangla-first, English echo. Warm, poetic, heritage-proud.
- No luxury-jewelry vocabulary (carat, gemstone, gold). Elegance yes — gold-plated no.
- CTAs: "পছন্দেরটি বেছে নিন" (pick your favourite), "কল করুন", "Request a Quote".

## 6. Jewelry Remnant Policy

Sections that are jewelry-specific (gemstone palettes, charm/initial order fields, 3D ring viewers, gold-dust decorations) are **rewritten or removed**, not left dormant — the gap-analysis map is the checklist.
