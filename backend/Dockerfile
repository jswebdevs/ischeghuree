# Ische Ghuree API — production image (deployed via Coolify, build context = backend/).
#
# Debian slim rather than Alpine: sharp, bcrypt, ffmpeg-static and
# @ffprobe-installer/linux-x64 all ship glibc prebuilt binaries.

FROM node:24-bookworm-slim AS base
ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable && corepack prepare pnpm@11.8.0 --activate
WORKDIR /app

# ── Build: full install, compile TS, then drop dev dependencies ─────────────
FROM base AS build

# prisma.config.ts resolves DATABASE_URL even for `prisma generate` (run by
# postinstall). Generation never connects, so any well-formed URL will do; the
# real one is injected at runtime.
ENV DATABASE_URL=postgresql://build:build@localhost:5432/build

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml prisma.config.ts ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile

COPY tsconfig.json ./
COPY src ./src
RUN pnpm run build \
 && pnpm prune --prod --ignore-scripts

# ── Runtime ─────────────────────────────────────────────────────────────────
FROM base AS runtime
ENV NODE_ENV=production \
    PORT=4000

COPY --from=build --chown=node:node /app/package.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/prisma ./prisma

USER node
EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||4000)+'/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "dist/server.js"]
