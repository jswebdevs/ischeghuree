---
name: next-app-router
description: "Next.js 16 App Router conventions for ginag-frontend. Use when creating pages/layouts, server components, fetching data on the server, configuring metadata, or wiring providers. Encodes this project's specific port (5173), provider stack, and theme bootstrap."
trigger: nextjs page changes
---

# Next.js 16 App Router (ginag-frontend)

Stack: **Next 16 + React 19 + Tailwind v4**. Dev server runs on **port 5173** (not 3000) — see [package.json](../../../ginag-frontend/package.json) `dev` script.

## Project layout

- App routes live in [ginag-frontend/src/app/](../../../ginag-frontend/src/app/) (App Router, not Pages Router).
- The root layout is [src/app/layout.tsx](../../../ginag-frontend/src/app/layout.tsx) — it's an **async server component** that fetches store settings + active theme on each render (revalidated every 60s via `export const revalidate = 60`).
- Shared UI lives in [src/components/](../../../ginag-frontend/src/components/) (subfolders: `shared/`, `home/`, `dashboard/`, `templates/`).
- Dashboard routes are nested: `app/dashboard/{customer,admin,super-admin}/...`.

## Provider stack (top → bottom inside `<body>`)

```
<TanstackProvider>            // TanStack Query
  <AuthProvider>               // user state + JWT cookie
    <SettingsProvider>         // store settings (server-fetched, hydrated)
      <ThemeProvider>          // light/dark + dynamic CSS variables from active StoreTheme
        {children}
        <Toaster /> from "sonner"  // global toast root
```

When adding a new global provider, insert it inside `ThemeProvider` so theme tokens are available, unless it itself controls theming.

## Server vs client components

- Default to **server components** (no `"use client"`). Pages that fetch data on the server can be `async function Page()`.
- Add `"use client"` only when you need state, effects, or browser APIs.
- Avoid mixing: don't import a client component's hook into a server component.

## Data fetching

- **Server side:** call the backend directly via the helpers in [src/lib/getSettings.ts](../../../ginag-frontend/src/lib/getSettings.ts) (and similar). Use `fetch` with `next: { revalidate: N }` for ISR.
- **Client side:** use the axios instance from [src/lib/axios.ts](../../../ginag-frontend/src/lib/axios.ts) (already configured with base URL + auth header) and TanStack Query for caching.
- Never call `axios` from a server component — it skips Next's caching layer.

## Metadata

The root layout exports a dynamic `generateMetadata()` that pulls store name, tagline, favicon, and OG image from `SiteSettings`. Per-page metadata: export `metadata` (static) or `generateMetadata` (dynamic) from the page file. The `title.template` in root layout auto-prefixes child page titles.

## Theme bootstrap (no flash)

Root layout injects an inline script in `<head>` that reads `localStorage['dreamshop-theme-storage']` BEFORE first paint and adds the `dark` class to `<html>` if the saved state is dark. Don't move this — moving it back to a `useEffect` causes a light/dark flash on every navigation.

## File conventions

- `page.tsx` — route's UI
- `layout.tsx` — wrapping layout
- `loading.tsx` — Suspense fallback for the segment
- `not-found.tsx` — 404 for the segment
- `_components/` — colocated, NOT a route segment (leading underscore)
- `[slug]` — dynamic segment
- `(group)` — route group, doesn't appear in URL

When deleting routes (e.g. removing `/cart`, `/checkout`), delete the entire folder under `app/`. Also grep for `<Link href="/that-route">` and `router.push("/that-route")` to remove dead navigation.
