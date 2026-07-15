# Portfolio V1 — Vercel Deployment Plan

## Overview

Deploy `portfolio-v1` as the main production site on Vercel at `namias.tech`.

---

## 1. Pre-Deployment Checklist

### Security (CRITICAL)

- [ ] **Rotate ALL exposed tokens** — `.env.local` was previously committed with real keys. Every Sanity token, Gemini key, and media gateway secret must be regenerated in the Sanity dashboard before deploying.
- [ ] **Verify `.env.local` is gitignored** — confirmed in `.gitignore` (line 69-71), not tracked by git.
- [ ] **Set `ADMIN_API_KEY`** — generate a new strong key for `/api/performance/cache` and canary endpoints.
- [ ] **Enable Vercel Firewall** — block unauthorized access to canary honeypot routes.

### Environment Variables

Set these in **Vercel Dashboard → Settings → Environment Variables**:

| Variable | Scope | Value |
|----------|-------|-------|
| `NEXT_PUBLIC_SITE_URL` | Production | `https://namias.tech` |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | All | `nl0qw78w` |
| `NEXT_PUBLIC_SANITY_DATASET` | All | `production` |
| `SANITY_API_READ_TOKEN` | Production | *(regenerated token)* |
| `SANITY_API_WRITE_TOKEN` | Production | *(regenerated token)* |
| `SANITY_REVALIDATE_SECRET` | Production | *(new random secret)* |
| `SANITY_MEDIA_GATEWAY_SECRET` | Production | *(regenerated token)* |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Production | *(Umami dashboard ID)* |
| `NEXT_PUBLIC_UMAMI_SCRIPT_URL` | Production | `https://cloud.umami.is/script.js` |
| `NEXT_PUBLIC_UMAMI_HOST_URL` | Production | `https://api-gateway.umami.dev` |
| `NEXT_PUBLIC_UMAMI_DOMAINS` | Production | `namias.tech` |
| `GOOGLE_GEMINI_API_KEY` | Production | *(regenerated key)* |
| `CHAT_MULTI_PROVIDER_ENABLED` | Production | `false` |
| `ADMIN_API_KEY` | Production | *(new strong key)* |
| `CACHE_TTL_DEFAULT` | Production | `300000` |
| `CACHE_TTL_STALE` | Production | `60000` |

**Never commit these to git. Use Vercel's environment variable UI.**

---

## 2. Vercel Project Setup

### Import

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `PP-Namias/Portfolio` repository
3. **Root Directory**: `portfolio-v1`
4. **Framework Preset**: Next.js (auto-detected)

### Build Settings

| Setting | Value |
|---------|-------|
| Build Command | `npx patch-package && npx next build` |
| Output Directory | `.next` |
| Install Command | `npm install --ignore-scripts && npx patch-package && npm install --prefix studio --ignore-scripts` |
| Node.js Version | `20.x` |

### Why `--ignore-scripts`?

The `postinstall` script runs `patch-package && npm install --prefix studio`. On Vercel, we handle this explicitly in the install command to avoid double-execution and ensure patch-package runs before the build.

---

## 3. Domain Configuration

### DNS Records (at your registrar)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | `@` | `76.76.21.21` | Auto |
| CNAME | `www` | `cname.vercel-dns.com` | Auto |
| CNAME | `namias.tech` | `cname.vercel-dns.com` | Auto |

### Vercel Domain Settings

1. Add `namias.tech` as primary domain in Vercel project settings
2. Add `www.namias.tech` as redirect to `namias.tech`
3. Enable **HTTPS** (automatic via Let's Encrypt)
4. Enable **Force HTTPS** redirect

---

## 4. Security Configuration

### Headers (already in `next.config.js`)

The following headers are configured and will be applied automatically:

- `Content-Security-Policy` — restricts scripts, styles, frames, connections
- `Strict-Transport-Security` — HSTS with 2-year max-age, includeSubDomains, preload
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — blocks camera, microphone, geolocation
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Resource-Policy: cross-origin`

### CSP Adjustments for Vercel

Update `next.config.js` CSP to include Vercel domains if needed:

```
connect-src 'self' https://api-gateway.umami.dev https://namias-cms.sanity.studio https://*.sanity.studio https://*.api.sanity.io https://cal.com https://*.cal.com https://vitals.vercel-insights.com;
```

### Canary Honeypot Routes

These routes (`/phpmyadmin-canary`, `/wp-admin-canary`, `/.env-canary`, etc.) are intentional honeypots. Ensure:

- Vercel Firewall blocks crawlers from indexing them
- `robots.txt` already disallows these paths
- Monitor via canary stats API

---

## 5. Sanity Studio Deployment

The Sanity Studio is a sub-project at `studio/` (root level).

### Option A: Vercel (same project)

Add a second build step or use Vercel's monorepo support:

```
# In Vercel project settings, add a second output:
cd studio && npx sanity build
```

### Option B: Sanity Hosting (recommended)

Deploy studio separately via Sanity:

```bash
cd studio
npx sanity deploy
```

This gives you `namias-cms.sanity.studio` as the studio URL.

### Recommended: Option B

Keep the studio separate from the portfolio deployment. The studio has its own build pipeline and doesn't need to be bundled with the Next.js app.

---

## 6. ISR & Revalidation

### On-Demand Revalidation

Configure the revalidation webhook in Sanity:

1. Go to Sanity Manage → Webhooks
2. Create webhook:
   - **URL**: `https://namias.tech/api/sanity/webhook`
   - **Trigger on**: Create, Update, Delete
   - **Filter**: `_type == "post" || _type == "project" || _type == "certification"`
3. Set `SANITY_REVALIDATE_SECRET` in Vercel env vars

### ISR Cache

- Static pages: ISR with 1-hour revalidation
- Blog posts: ISR with 1-hour revalidation
- Project pages: ISR with 1-hour revalidation
- API routes: No cache (dynamic)

---

## 7. Analytics (Umami)

1. Deploy Umami cloud or self-hosted instance
2. Get Website ID from Umami dashboard
3. Set `NEXT_PUBLIC_UMAMI_WEBSITE_ID` in Vercel env vars
4. Analytics script loads from `https://cloud.umami.is/script.js`
5. Data sent to `https://api-gateway.umami.dev`

---

## 8. Performance Optimization

### Already Configured

- `output: 'standalone'` — smaller Docker/deployment images
- Image optimization with Sanity CDN patterns
- Font caching (`/fonts/:path*` with 1-year cache)
- Static asset caching (`/_next/static/:path*` with 1-year immutable cache)
- `poweredByHeader: false` — hides Next.js fingerprint
- `devIndicators.buildActivity: false` — no build indicators in prod

### Vercel-Specific

- **Edge Runtime**: Not needed for this project (SSR with Node.js runtime is fine)
- **ISR**: Enabled via `revalidate` exports in page files
- **Image Optimization**: Vercel handles this automatically via `next/image`
- **Analytics**: Enable Vercel Web Analytics if desired (separate from Umami)

---

## 9. Deployment Commands

### First Deploy

```bash
# 1. Clone and install
git clone https://github.com/PP-Namias/Portfolio.git
cd Portfolio/portfolio-v1
npm install --ignore-scripts
npx patch-package
npm install --prefix studio --ignore-scripts

# 2. Set environment variables in Vercel dashboard (not .env.local)

# 3. Deploy
npx vercel --prod
```

### Subsequent Deploys

Push to `main` branch → Vercel auto-deploys via Git integration.

### Manual Deploy

```bash
npx vercel --prod
```

---

## 10. Post-Deployment Verification

### Checklist

- [ ] Site loads at `https://namias.tech`
- [ ] SSL certificate valid (green padlock)
- [ ] All pages render correctly (/, /blog, /projects, /studio)
- [ ] Sanity content loads (hero, projects, certifications, blog posts)
- [ ] Images load from Sanity CDN
- [ ] Chat widget functional (if enabled)
- [ ] Cal.com booking modal opens
- [ ] Umami analytics tracking active
- [ ] Security headers present (check via securityheaders.com)
- [ ] CSP violations reported to `/api/csp-violation`
- [ ] Canary routes return 403/honeypot content
- [ ] Sitemap generates at `/sitemap.xml`
- [ ] Robots.txt blocks canary paths
- [ ] OG images generate for social sharing

### Security Audit

```bash
# Check security headers
curl -I https://namias.tech

# Verify CSP
curl -I https://namias.tech | grep -i content-security-policy

# Check canary routes are blocked
curl -I https://namias.tech/phpmyadmin-canary
```

---

## 11. Rollback Plan

If something breaks:

1. **Instant rollback**: Vercel Dashboard → Deployments → promote previous deployment
2. **Code rollback**: `git revert` to previous commit, push to `main`
3. **Env rollback**: Revert environment variable changes in Vercel dashboard

---

## 12. Cost Estimation

### Vercel (Hobby Plan — Free)

- 100GB bandwidth/month
- 1000 build minutes/month
- Serverless function execution included
- Custom domain with SSL

### Vercel (Pro Plan — $20/month)

- 1TB bandwidth/month
- 6000 build minutes/month
- Password protection
- Team collaboration

**Recommendation**: Start with Hobby. Upgrade if bandwidth or build limits are hit.

---

## 13. Known Issues & Fixes

### `patch-package` Fails on Vercel

The `postinstall` script runs `patch-package`. If it fails:

1. Ensure `patches/` directory is committed
2. Use explicit install command: `npm install --ignore-scripts && npx patch-package`

### Sanity Studio Not Building

If studio build fails in the same project:

1. Deploy studio separately via `npx sanity deploy`
2. Or create a separate Vercel project for the studio

### CSP Blocking Sanity Images

If images don't load, add to CSP in `next.config.js`:

```
img-src 'self' data: blob: https://cdn.sanity.io https://*.sanity.io;
```

---

## 14. Files to Modify Before Deploy

| File | Change | Why |
|------|--------|-----|
| `next.config.js` | Add Vercel insights to CSP | Enable Vercel analytics |
| `.env.example` | Update with Vercel-specific notes | Documentation |
| `package.json` | Verify build script works on Vercel | Build compatibility |

---

## 15. Summary

| Item | Status |
|------|--------|
| Repository | `PP-Namias/Portfolio` |
| Branch | `main` |
| Root Directory | `portfolio-v1` |
| Framework | Next.js 16 |
| CMS | Sanity |
| Analytics | Umami |
| Domain | `namias.tech` |
| Hosting | Vercel |
| SSL | Automatic (Let's Encrypt) |
| ISR | Enabled (1-hour revalidation) |
| Security | CSP + HSTS + canary honeypots |

**Estimated time to deploy**: 30 minutes (excluding token regeneration)
