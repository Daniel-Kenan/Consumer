

# ─── Stage 1: Builder ─────────────────────────────────────────────────────────
FROM node:18-alpine AS builder
WORKDIR /app

ENV BASE_SERVER_URL_DEV=http://localhost
ENV PORT_DEV=8765

# 1. Install everything (including devDeps) but skip strict peer checks
COPY package.json package-lock.json pnpm-lock.yaml ./
RUN npm ci --legacy-peer-deps

# 2. Copy source & build
COPY . .
RUN npm run build

# 3. Prune out devDependencies, ignoring peer-dep errors
RUN npm prune --production --legacy-peer-deps


# ─── Stage 2: Runtime ─────────────────────────────────────────────────────────
FROM node:18-alpine AS runner
WORKDIR /app

# Only the built output + production deps come through
COPY --from=builder /app ./

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "run", "start"]