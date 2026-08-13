---
name: tailwind-v4-theme
description: "Tailwind CSS v4 with @theme tokens for frontend. Use when adding utility classes, theme-aware colors, or new design tokens. Encodes this project's HSL CSS variable system so generated UI uses theme colors (text-primary, bg-card) instead of hard-coded hex/rgb."
trigger: tailwind styling
---

# Tailwind v4 + Dynamic Theme (frontend)

This project uses **Tailwind v4** (no `tailwind.config.js`) with the `@theme` directive in CSS. All design tokens are HSL CSS variables that get swapped at runtime by `ThemeProvider` based on the active `StoreTheme` row.

## Where things live

- Tokens + base styles: [frontend/src/app/globals.css](../../../frontend/src/app/globals.css)
- Active theme variables: pushed onto `<html>` by [src/components/ThemeProvider.tsx](../../../frontend/src/components/ThemeProvider.tsx) (sets `--background`, `--primary`, etc.)
- PostCSS plugin: configured in `postcss.config.mjs` via `@tailwindcss/postcss`

## Tokens you actually use

Always prefer these over hardcoded colors:

| Class | Token | Notes |
| --- | --- | --- |
| `bg-background`, `text-foreground` | base page surface + text | |
| `bg-card`, `text-card-foreground` | elevated surfaces | |
| `bg-primary`, `text-primary-foreground` | brand actions / links | |
| `bg-muted`, `text-muted-foreground` | secondary text, subtle backgrounds | |
| `border-border`, `outline-ring` | borders + focus rings | |
| `bg-destructive` | errors only | |

Theme-aware shadows: `shadow-theme-sm`, `shadow-theme-md`, `shadow-theme-lg` (use `--shadow-color` so shadows tint with the active theme).

Gradient: `bg-gradient-theme` (uses `--gradient-from` → `--gradient-to`).

## When NOT to use raw colors

Avoid `bg-white`, `text-black`, `text-zinc-500`, `bg-[#1A1A1A]`, etc. They look fine in dark mode but break light mode (and vice versa). Use the tokens above. Exception: opacity overlays like `bg-black/40` for image scrims are fine.

## Tailwind v4 syntax differences

- No `tailwind.config.js` — declare tokens in CSS via `@theme { --color-foo: ... }`. Tailwind generates `bg-foo`, `text-foo`, etc. automatically.
- `@apply` still works inside `@layer base { ... }`.
- Arbitrary values: `bg-[hsl(var(--primary))]` works, but the named utility (`bg-primary`) is preferred.
- Container queries are first-class: `@container` + `@md:` style prefixes.

## Adding a new token

1. Add the CSS variable to `globals.css` under `@theme` AND under each theme variant in the database (light + dark in `StoreTheme.lightVariables` / `darkVariables`).
2. Restart the dev server — token additions in `@theme` need a fresh Tailwind scan.

## Dark mode

The project uses **class-based** dark mode (`<html class="dark">`). The class is set:
- Pre-paint by an inline script in [layout.tsx](../../../frontend/src/app/layout.tsx) reading `localStorage`
- At runtime by `useThemeStore` (Zustand)

Don't add `prefers-color-scheme` media queries — the user toggle takes precedence.
