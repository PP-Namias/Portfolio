FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN npm run typecheck && npm run lint

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV AI_SERVICE_HOST=0.0.0.0
ENV AI_SERVICE_PORT=8787

RUN addgroup --system --gid 1001 aiuser
RUN adduser --system --uid 1001 aiuser

COPY --from=builder --chown=aiuser:aiuser /app/node_modules ./node_modules
COPY --from=builder --chown=aiuser:aiuser /app/src ./src
COPY --from=builder --chown=aiuser:aiuser /app/package.json /app/package-lock.json /app/tsconfig.json ./

RUN mkdir -p /app/.ai-service-data && chown -R aiuser:aiuser /app/.ai-service-data

USER aiuser

EXPOSE 8787

VOLUME ["/app/.ai-service-data"]

HEALTHCHECK --interval=30s --timeout=10s --start-period=90s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8787/api/health || exit 1

CMD ["npx", "tsx", "src/server/index.ts"]
