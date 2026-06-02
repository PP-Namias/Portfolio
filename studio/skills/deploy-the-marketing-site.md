---
title: Deploy the Marketing Site
trigger: "deploy site", "cloudflare deploy", "wrangler deploy"
audience: devs
time: 5 min
---

# Deploy the Marketing Site

## Steps

```bash
# from repo root
npm run cloudflare:build    # build with OpenNext
npm run cloudflare:deploy   # deploy to Cloudflare Workers
```

## Prerequisites
- `CLOUDFLARE_API_TOKEN` env var with Workers deployment scope.
- `CLOUDFLARE_ACCOUNT_ID` env var.
- `wrangler.jsonc` configured with project name + main entry.

## The `--dangerouslyUseUnsupportedNextVersion` flag
Next.js 16 is newer than OpenNext officially supports. The flag
short-circuits OpenNext's version check. We pin it in
`package.json` for `cloudflare:build` and `cloudflare:deploy`.

## Verify
Open `https://namias.tech/` in a browser. Check the
`/api/sanity/webhook` route by sending a test POST.

## Common issues
- **`CLOUDFLARE_API_TOKEN not set`** — set the env var or run
  `wrangler login` for OAuth.
- **`Module not found: studio/env`** — the marketing site reads
  env from `process.env` directly (no cross-tree import). See
  `src/sanity/lib/client.ts`.
