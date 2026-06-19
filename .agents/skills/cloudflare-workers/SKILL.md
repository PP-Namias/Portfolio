---
name: cloudflare-workers
description: Deploy and manage the portfolio on Cloudflare Workers via OpenNext adapter.
---

# Cloudflare Workers Skill

Deploy and manage the portfolio on Cloudflare Workers using the `@opennextjs/cloudflare` adapter. The portfolio is a Next.js 16 app compiled to Cloudflare Workers via OpenNext.

## When to use this skill

- Deploying the portfolio to Cloudflare Workers
- Troubleshooting Cloudflare build failures
- Configuring `wrangler.jsonc` or `open-next.config.ts`
- Debugging Worker-specific issues (middleware, edge runtime, assets)
- Updating the `@opennextjs/cloudflare` or `wrangler` packages

## Current setup

| File | Purpose |
|------|---------|
| `wrangler.jsonc` | Worker config: name, compatibility_date, build command, assets |
| `open-next.config.ts` | OpenNext Cloudflare config (minimal, uses `defineCloudflareConfig`) |
| `package.json` | Scripts: `cloudflare:build`, `cloudflare:dev`, `cloudflare:deploy` |

## Key configuration

**wrangler.jsonc:**
```jsonc
{
  "name": "namias",
  "main": ".open-next/worker.js",
  "compatibility_date": "2026-05-29",
  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
  "build": {
    "command": "npx opennextjs-cloudflare build --dangerouslyUseUnsupportedNextVersion"
  },
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  }
}
```

**Note:** `--dangerouslyUseUnsupportedNextVersion` is required because `@opennextjs/cloudflare` v1.19.x does not officially support Next.js 16.

## Workflow

### 1. Local development

```bash
npm run cloudflare:dev
```

This starts the Worker locally via `wrangler dev`. Note: may have issues on Windows — use WSL for best results.

### 2. Build for Cloudflare

```bash
npm run cloudflare:build
```

This runs `opennextjs-cloudflare build` which:
1. Runs `next build` (generates `.next/` output)
2. Bundles the Worker (`.open-next/worker.js`)
3. Bundles static assets (`.open-next/assets/`)
4. Applies OpenNext code patches

### 3. Deploy to Cloudflare

```bash
npm run cloudflare:deploy
```

Requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` environment variables.

### 4. CI/CD deployment

The `cloudflare-deploy.yml` workflow:
1. Triggers on push to `main` or `workflow_dispatch`
2. Runs `npm ci` → SBOM generation → Cosign signing → `npm run cloudflare:deploy`
3. Also deploys Sanity Studio separately

## Known limitations

| Issue | Status |
|-------|--------|
| Next.js 16 `middleware.ts` convention | Deprecated; use `proxy.ts` instead. OpenNext detects `middleware.ts` as Node.js middleware. |
| `output: 'standalone'` | Set conditionally (`isWindows ? undefined : 'standalone'`) — OpenNext handles its own output |
| `next-sanity` peer dependency | Requires `next ^14.2 \|\| ^15.0.0` but works with 16.x via the danger flag |
| Windows builds | OpenNext warns about Windows; use WSL for production builds |

## Troubleshooting

**Build fails with "Node.js middleware is not currently supported":**
- Ensure `src/middleware.ts` is the file (not `src/proxy.ts`)
- The OpenNext adapter detects proxy.ts as Node.js middleware
- Rename to `middleware.ts` and export `middleware` function

**Build fails with TypeScript errors:**
- Clear `.next/` directory: `Remove-Item -Path .next -Recurse -Force`
- Re-run build

**Worker deployment fails:**
- Check `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are set
- Verify the Worker name in `wrangler.jsonc` matches the Cloudflare dashboard
- Check Cloudflare Workers dashboard for build logs

## Checklist

- [ ] `wrangler.jsonc` configured correctly
- [ ] `open-next.config.ts` uses `defineCloudflareConfig`
- [ ] `--dangerouslyUseUnsupportedNextVersion` flag is present
- [ ] `nodejs_compat` compatibility flag is set
- [ ] Build passes locally (`npm run cloudflare:build`)
- [ ] Deploy succeeds (`npm run cloudflare:deploy`)
- [ ] Worker responds correctly in Cloudflare dashboard
