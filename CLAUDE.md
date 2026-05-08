# Ginag

Monorepo with two sibling projects:

- **`backend/`** — Node.js / Express 5 API with Prisma 7 + PostgreSQL (Supabase). Auth (bcrypt + JWT), file uploads (multer + Cloudinary + sharp), realtime (socket.io), media transcoding (fluent-ffmpeg), email (nodemailer via Gmail), cron jobs (node-cron). Entrypoint: `backend/src/server.ts`. App wiring: `backend/src/app.ts`.
- **`frontend/`** — Next.js 16 (App Router) + React 19 + Tailwind v4. State via Zustand + TanStack Query. Forms with react-hook-form + zod. 3D via @react-three/fiber/drei. Catalog + custom-order form (no checkout). Dev port 5173.

## Common commands

| Where | Command | What it does |
| --- | --- | --- |
| backend | `npm run dev` | nodemon + ts-node on `src/server.ts` |
| backend | `npm run build` | `prisma generate && tsc` |
| backend | `npm run prisma:migrate` | run a Prisma migration in dev |
| backend | `npm run prisma:seed` | seed via `prisma/seed.ts` |
| frontend | `npm run dev` | Next dev server on port 5173 |
| frontend | `npm run build` | Next production build |
| frontend | `npm run lint` | ESLint |

## Conventions

- Backend is CommonJS (`"type": "commonjs"`) — TS compiled with ts-node in dev, `tsc` in prod.
- Frontend uses the new Next.js App Router (Next 16).
- The **repo root is the single git repo** — both `backend/` and `frontend/` are committed and pushed together from the root. There is one root `.gitignore` covering both subprojects (no per-subproject `.git`).

## Skills

Project-level skills live under `.claude/skills/`. The `Skills/skills.sh` script installs / verifies / removes them.

| Skill | When to invoke |
| --- | --- |
| `graphify` | Any architecture / codebase question — builds the queryable graph under `graphify-out/`. |
| `prisma` | Editing `prisma/schema.prisma`, generating the client, or syncing the DB (Prisma 7 + Supabase). |
| `nodemailer-gmail` | Sending transactional email from any backend controller. |
| `next-app-router` | Adding/removing pages, layouts, providers, or metadata in `frontend/src/app/`. |
| `tailwind-v4-theme` | Styling UI — keeps generated classes on the project's theme tokens (`bg-primary`, `text-foreground`, etc.). |
| `react-hook-form-zod` | Building any form (order form, contact, admin CRUD). |
| `cloudinary-media` | New media upload endpoints or changes to image/video processing. |

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- For cross-module "how does X relate to Y" questions, prefer `graphify query "<question>"`, `graphify path "<A>" "<B>"`, or `graphify explain "<concept>"` over grep — these traverse the graph's EXTRACTED + INFERRED edges instead of scanning files
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)
