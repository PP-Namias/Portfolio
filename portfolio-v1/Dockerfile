FROM node:22-alpine AS base
RUN corepack enable && corepack prepare npm@10 --activate
RUN apk add --no-cache libc6-compat

FROM base AS deps
WORKDIR /app
COPY package.json ./
RUN npm install

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

RUN mkdir -p /app/.next/cache && chown -R nextjs:nodejs /app/.next/cache

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
