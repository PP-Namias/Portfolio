FROM node:22-alpine AS base
RUN corepack enable && corepack prepare npm@10 --activate
RUN apk add --no-cache libc6-compat

FROM base AS deps
WORKDIR /app
COPY studio/package.json ./
RUN npm install

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY studio/ ./

RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3333

RUN addgroup --system --gid 1001 sanity
RUN adduser --system --uid 1001 sanity

COPY --from=builder --chown=sanity:sanity /app/dist ./dist
COPY --from=builder --chown=sanity:sanity /app/node_modules ./node_modules
COPY --from=builder --chown=sanity:sanity /app/package.json ./

USER sanity

EXPOSE 3333

CMD ["npm", "start"]
