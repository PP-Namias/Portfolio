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
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3333

RUN addgroup --system --gid 1001 sanity
RUN adduser --system --uid 1001 sanity

COPY --from=builder --chown=sanity:sanity /app/dist ./dist
COPY --from=builder --chown=sanity:sanity /app/node_modules ./node_modules
COPY --from=builder --chown=sanity:sanity /app/package.json /app/package-lock.json ./
COPY --from=builder --chown=sanity:sanity /app/sanity.config.ts /app/sanity.cli.ts /app/tsconfig.json ./

USER sanity

EXPOSE 3333

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3333 || exit 1

CMD ["npm", "start"]
