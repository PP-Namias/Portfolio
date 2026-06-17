---
name: opennext-cloudflare
description: Deploy Next.js to Cloudflare Workers using OpenNext adapter
---

# OpenNext Cloudflare Skill

Deploy Next.js applications to Cloudflare Workers using the `@opennextjs/cloudflare` adapter.

## When to use this skill

- Deploying to Cloudflare Workers
- Troubleshooting Cloudflare deployment issues
- Configuring Cloudflare-specific features (KV, R2, D1)
- Setting up CI/CD for Cloudflare

## Current setup

- **Adapter:** `@opennextjs/cloudflare` v1.19.11
- **Next.js:** v16.2.9 (`--dangerouslyUseUnsupportedNextVersion`)
- **Worker name:** `namias`
- **Compatibility flags:** `nodejs_compat`

## Files

| File | Purpose |
|------|---------|
| `wrangler.jsonc` | Cloudflare Workers configuration |
| `open-next.config.ts` | OpenNext build configuration |
| `src/middleware.ts` | Middleware (renamed from proxy.ts for compatibility) |

## Build and deploy

### Local build
```bash
npx @opennextjs/cloudflare build
```

### Deploy to Cloudflare
```bash
npx wrangler deploy
```

### CI/CD
Deployment happens via GitHub Actions on push to `main`:
- `.github/workflows/cloudflare-deploy.yml`
- Uses `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`

## Common issues

### "Cloudflare worker does not have a proxy.ts"
- **Cause:** `src/proxy.ts` is not supported in newer OpenNext versions
- **Fix:** Rename to `src/middleware.ts`

### "Unsupported version of Next.js detected"
- **Cause:** OpenNext doesn't officially support Next.js 16 yet
- **Fix:** Add `--dangerouslyUseUnsupportedNextVersion` flag to build command

### "Node.js compatibility mode is required"
- **Cause:** Missing `nodejs_compat` compatibility flag
- **Fix:** Add `"compatibility_flags": ["nodejs_compat"]` to `wrangler.jsonc`

### "Global fetch is not available"
- **Cause:** Missing `global_fetch_strictly_public` flag
- **Fix:** Add `"compatibility_flags": ["global_fetch_strictly_public"]` to `wrangler.jsonc`

## Environment variables

Set in Cloudflare dashboard or `wrangler.jsonc`:

| Variable | Purpose |
|----------|---------|
| `NEXT_RUNTIME` | Set to `edge` |
| `SANITY_API_CDN` | Sanity CDN URL |
| `SANITY_API_WRITE` | Sanity write API URL |
| `SANITY_AUTH_TOKEN` | Sanity auth token |
| `SANITY_REVALIDATE_SECRET` | Revalidation webhook secret |
| `CANARY_SLACK_WEBHOOK` | Canary notification webhook |
| `CANARY_DISCORD_WEBHOOK` | Canary notification webhook |
| `CANARY_EMAIL` | Canary notification email |
| `CANARY_HONEYTOKEN` | Canary token value |
| `HONEYPOT_USERNAME` | Honeypot form field |
| `HONEYPOT_WEBSITE` | Honeypot form field |

## Checklist

- [ ] `wrangler.jsonc` has correct compatibility flags
- [ ] `src/middleware.ts` exists (not `proxy.ts`)
- [ ] Environment variables set in Cloudflare dashboard
- [ ] CI/CD workflow has correct secrets
- [ ] Build succeeds with `npx @opennextjs/cloudflare build`
