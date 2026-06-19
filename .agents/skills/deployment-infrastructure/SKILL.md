---
name: deployment-infrastructure
description: Deploy to Vercel/Cloudflare, manage environment variables, troubleshoot builds, and handle rollbacks.
---

# Deployment & Infrastructure

## When to use this skill

- Deploying the portfolio to Vercel or Cloudflare
- Troubleshooting failed builds or deployments
- Managing environment variables across environments
- Rolling back to a previous deployment
- Configuring domains, SSL, or edge functions
- Debugging build-time vs runtime errors

## Workflow

### 1. Pre-deployment checks

Run the full verification suite before any deployment:

```bash
npx tsc --noEmit          # TypeScript must pass
npm run lint               # ESLint must pass
npm run test -- --run      # Tests must pass
npm run doctor             # React-doctor must be 100/100
npm run build              # Build must succeed
```

If any step fails, fix it before deploying. Never deploy broken code.

### 2. Vercel deployment

**Local preview (production-like):**

```bash
npm run build && npm run start
```

**Vercel CLI deploy:**

```bash
npx vercel --prod          # Production deployment
npx vercel                 # Preview deployment (branch)
```

**Vercel environment variables:**

| Variable | Environment | Required |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | All | Yes |
| `NEXT_PUBLIC_SANITY_DATASET` | All | Yes |
| `SANITY_API_READ_TOKEN` | All | Yes |
| `SANITY_REVALIDATE_SECRET` | All | Yes |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Production | No |
| `NEXT_PUBLIC_UMAMI_SCRIPT_URL` | Production | No |
| `NEXT_PUBLIC_UMAMI_HOST_URL` | Production | No |

**Check env vars are set:**

```bash
npx vercel env ls
```

### 3. Cloudflare deployment

The repo uses `opennextjs-cloudflare` for Cloudflare compatibility:

```bash
npm run cloudflare:build     # Build for Cloudflare
npm run cloudflare:dev       # Local Cloudflare dev
npm run cloudflare:deploy    # Deploy to Cloudflare
```

**Cloudflare-specific notes:**

- `output: 'standalone'` is disabled on Windows (`isWindows` check in `next.config.js`)
- Edge runtime is NOT used -- the repo uses Node.js runtime for API routes
- `wrangler.toml` configures Workers bindings

### 4. Build troubleshooting

**Common build errors:**

| Error | Cause | Fix |
|---|---|---|
| `Module not found` | Missing dependency | `npm install` |
| `Type error` | TypeScript strict mode | Fix the type error in the source |
| `Hydration mismatch` | Server/client HTML differ | Check `useEffect` guards, `mounted` state |
| `Circular dependency` | Import cycle | Refactor to break the cycle |
| `ENOMEM` | Out of memory | Increase Node memory: `NODE_OPTIONS="--max-old-space-size=4096"` |

**Build analysis:**

```bash
ANALYZE=true npm run build   # Bundle analyzer (if configured)
```

### 5. Rollback procedure

**Vercel rollback:**

```bash
npx vercel rollback          # Roll back to previous deployment
npx vercel rollback <url>    # Roll back to specific deployment
```

**Git rollback:**

```bash
git log --oneline -10        # Find the commit to roll back to
git revert <commit-hash>     # Create a revert commit
git push                     # Trigger redeployment
```

**Emergency: force deploy last known good:**

```bash
git checkout <good-commit> -- .
git commit -m "chore: emergency rollback to <good-commit>"
git push
```

### 6. Domain and SSL

Vercel manages SSL automatically. For custom domains:

```bash
npx vercel domains add <domain>
```

Verify DNS records point to Vercel's nameservers or use CNAME to `cname.vercel-dns.com`.

## Common mistakes

- Deploying without running `npm run build` locally first
- Forgetting to set environment variables in the Vercel dashboard
- Using `console.log` in production code (use `reportWebVitals` instead)
- Not testing the production build locally before pushing

## Delivery checks

- [ ] `npm run build` succeeds locally
- [ ] All environment variables are set in the target environment
- [ ] Production URL loads correctly
- [ ] No console errors in browser DevTools
- [ ] Service worker registers correctly (if applicable)
- [ ] Sanity data loads and revalidation works
- [ ] OG images and meta tags render correctly
