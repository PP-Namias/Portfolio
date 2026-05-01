# CMS Deployment Architecture: Separate Domains vs Integrated

## Recommendation

Deploy Sanity Studio to a dedicated subdomain (cms.namias.tech) and keep the main portfolio on namias.tech. This preserves separation of concerns, security boundaries, and independent scalability.

## Why Separate Deployments

- **Security isolation**: Studio requires authenticated access and should not ship with the public app.
- **Independent release cadence**: content operations can update without redeploying the portfolio.
- **Smaller public bundle**: removes Studio dependencies from the main site runtime.
- **Cleaner operational surface**: distinct logs, access policies, and uptime profiles.

## Deployment Outline

- Studio build and deploy from the `studio/` folder (standalone Sanity configuration).
- Main app continues to build from the Next.js root with `safeFetchSanity` fallback.
- Use the same project ID and dataset across both deployments, or split datasets for staging vs production.

## Environment and Access Controls

- Keep `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` in both deployments.
- Restrict Sanity CORS origins to the main site and the Studio domain.
- Require Sanity authentication for all Studio access.

## DNS and Routing

- Map cms.namias.tech to the Sanity Studio deployment host.
- Keep /studio route in the main app for local development only, not for production use.

## Rollback Strategy

- If CMS issues occur, keep JSON fallback active in the main app.
- Maintain a documented switch to temporarily disable Sanity reads.

---

## Studio Deployment Pipeline (NEW)

### Confirmed Sanity Project Context

- Organization ID: `oBQP4vpxm`
- Project ID: `nl0qw78w`
- Dataset: `production`
- Studio local origin already configured: `http://localhost:3333`

### Token Strategy (Least Privilege)

- Portfolio runtime reads: no write token in browser; keep public dataset reads to `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`.
- Migration script (`scripts/migrate-to-sanity.ts`): use `SANITY_API_WRITE_TOKEN` with write-capable scope (Contributor/Editor).
- Studio deployment pipeline: use dedicated deploy token (`SANITY_STUDIO_DEPLOY_TOKEN`) in CI only.
- Revalidation API route: protect with `SANITY_REVALIDATE_SECRET`.
- Do not commit any raw token values in repository files or docs.
- If any token appears in chat, logs, or screenshots, revoke it in Sanity immediately and replace it in your secret manager.

### Prerequisites

1. **Sanity Project Setup** (owner/admin task)
   - Create Sanity project at sanity.io
   - Note project ID and dataset name
   - Create API token for programmatic access
   - Configure CORS origins: https://namias.tech, https://cms.namias.tech, http://localhost:3000, http://localhost:3333

2. **Environment Variables**
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=nl0qw78w
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_CUTOVER_ENABLED=false
   SANITY_API_WRITE_TOKEN=<write-token>  # Keep secret, never commit
   SANITY_STUDIO_DEPLOY_TOKEN=<deploy-token>  # Keep secret, never commit
   SANITY_REVALIDATE_SECRET=<random-secret>
   ```

### Environment Variables by Deployment Target

| Variable | Portfolio App | Studio | Notes |
| --- | --- | --- | --- |
| NEXT_PUBLIC_SANITY_PROJECT_ID | Required | Required | Public identifier (safe to expose). |
| NEXT_PUBLIC_SANITY_DATASET | Required | Required | Usually `production`. |
| SANITY_CUTOVER_ENABLED | Required | Not used | Feature flag for primary Sanity reads. |
| SANITY_REVALIDATE_SECRET | Required | Not used | Protects revalidation endpoint. |
| SANITY_API_WRITE_TOKEN | Local only | Not used | Migration script only; do not set in app runtime. |
| SANITY_STUDIO_DEPLOY_TOKEN | Not used | CI only | Used to deploy Studio builds. |

For Vercel, set Production + Preview values in each project (portfolio app vs studio). Store migration-only secrets locally in `.env.local` or a CI job, not in the app runtime.

### Version Compatibility (Sanity + Next.js)

- Keep Next.js pinned to the 15.x line and explicitly below 16 for Sanity compatibility.
- The repo enforces this with the `next` range `>=15 <16` in package.json.

### Build and Deployment (Dual Vercel Setup)

We use a **Single Repository, Two Vercel Projects** pattern.

#### 1. Primary Portfolio App (namias.tech)
Create a Vercel project connected to the root of the repository.
- **Framework Preset**: Next.js
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (default)
- **Environment Variables**:
  - `NEXT_PUBLIC_SANITY_PROJECT_ID=nl0qw78w`
  - `NEXT_PUBLIC_SANITY_DATASET=production`
  - `SANITY_CUTOVER_ENABLED=false` (toggle to `true` when ready)
  - `SANITY_REVALIDATE_SECRET=<random-secret>`
- **Domains**: Assign `namias.tech` and `www.namias.tech`

#### 2. Sanity Studio (cms.namias.tech)
Create a *second* Vercel project connected to the exact same repository.
- **Framework Preset**: Vite (or Other, since it's a SPA)
- **Root Directory**: `studio`
- **Build Command**: `npm install && npm run build` (Note: Ensure dependencies are installed in the root if not handled automatically, or just `npm run build` if the lockfile works)
- **Output Directory**: `dist`
- **Environment Variables**:
  - `NEXT_PUBLIC_SANITY_PROJECT_ID=nl0qw78w`
  - `NEXT_PUBLIC_SANITY_DATASET=production`
- **Domains**: Assign `cms.namias.tech`

*(Note: Vercel might warn about multiple projects on the same repo; this is intentional and safe for our architecture.)*

#### Pre-Deployment Checklist
- [ ] Ensure Vercel environment variables are securely set.
- [ ] Sanity CORS origins updated (`https://namias.tech`, `https://cms.namias.tech`).
- [ ] API tokens created and securely stored.
- [ ] No tokens committed to Git.

#### Post-Deployment Verification Checklist

**Main App (namias.tech)**
- [ ] Loads without errors.
- [ ] JSON fallback or Sanity data correctly fetched.
- [ ] Playwright E2E smoke tests pass against production URL.

### Automated UI/UX Regression (Playwright)

Run Playwright smoke tests and review the HTML report during staging and after production deploys:

```bash
npm run test:e2e
npm run test:e2e:report
```

**Sanity Studio (cms.namias.tech)**
- [ ] Loads Studio login page.
- [ ] Login successful for authorized accounts.
- [ ] Can view and edit documents.
- [ ] Publishing triggers webhooks (if configured).

### Access Control & Security

1. **Studio Authentication**
   - Enable Sanity OAuth or JWT authentication
   - Restrict to owner and trusted editors
   - Use Sanity's built-in role-based access control (RBAC)

2. **CORS Configuration** (in Sanity dashboard)
   - Allowed origins:
      - `https://namias.tech` (main portfolio, read-only)
      - `https://cms.namias.tech` (Studio, admin)
      - `http://localhost:3000` (development)
      - `http://localhost:3333` (local Studio dev)
      - `https://www.namias.tech` (optional canonical host support)

   **CORS Origin Matrix**

   | Environment | Origin | Credentials | Notes |
   | --- | --- | --- | --- |
   | Production App | https://namias.tech | Disabled | Public read-only access. |
   | Production Studio | https://cms.namias.tech | Enabled | Requires authenticated Studio access. |
   | Preview (Vercel) | https://<preview>.vercel.app | Disabled | Add exact preview domains as needed. |
   | Local App | http://localhost:3000 | Disabled | Local development for the portfolio. |
   | Local Studio | http://localhost:3333 | Enabled | Local Studio authentication. |

   Sanity does not support wildcard origins. Add exact preview domains and remove old ones when no longer needed.

3. **API Token Security**
   - Create separate read-only token for portfolio app
   - Create admin token for migration script (migrate-to-sanity.ts)
   - Store in environment secrets, never in code
   - Rotate tokens periodically

### DNS Configuration

Add DNS records to `namias.tech`:
```
A record:       ns-123.awsamp.com (or your Amplify domain)
CNAME record:   cms.namias.tech -> cms-deploy-host.namias.tech
```

### Post-Deployment Verification

1. **Health Checks**
   ```bash
   curl https://namias.tech/api/health  # Main app
   curl https://cms.namias.tech/health  # Studio (if endpoint exists)
   ```

2. **Sanity Connectivity Test**
   - Check for fallback logs in CloudWatch/Amplify logs
   - Verify Sanity fetch success in portfolio logs
   - Monitor for any timeout/CORS errors

3. **Studio Accessibility**
   - Login to https://cms.namias.tech
   - Verify document editing works
   - Test publish/unpublish workflow

### Continuous Deployment

1. **Main Portfolio** (on push to main branch)
   - Amplify auto-builds and deploys to namias.tech
   - Triggers ISR revalidation via revalidateTag hooks

2. **Studio** (separate workflow)
   - On changes to `studio/` folder, rebuild studio deployment
   - Update cms.namias.tech subdomain

3. **Separate Deployments** (recommended)
   - Portfolio: auto-deploy on every main push
   - Studio: manual trigger or separate branch for safety

### Monitoring & Logging

- **CloudWatch Logs** (Amplify): Monitor Sanity fetch failures and JSON fallback usage
- **Sanity Analytics**: Track API usage, document updates
- **Error Tracking**: Sentry or similar for production issues

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Studio returns 404 | Verify subdomain DNS and Amplify routing |
| CORS errors | Check CORS origins in Sanity dashboard |
| Slow Sanity fetches | Increase timeout in safeFetchSanity (src/lib/sanity.ts) |
| Data not syncing | Re-run migration script: `npm run migrate:sanity` |
| Authentication fails | Verify API token has read/write permissions |

### Rollback Plan

1. **If Sanity becomes unavailable**
   - JSON fallback automatically engages (safeFetchSanity handles timeouts)
   - No manual intervention needed; portfolio continues serving JSON data

2. **If Studio deployment fails**
   - Main portfolio remains unaffected (separate deployments)
   - Rollback studio to previous version via Amplify console

3. **If data sync is corrupted**
   - Revert Sanity documents to backup
   - Re-run dry-run migration to validate: `npm run migrate:sanity -- --dry-run`
   - Run full migration once validated
