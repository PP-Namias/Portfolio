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
   SANITY_API_WRITE_TOKEN=<write-token>  # Keep secret, never commit
   SANITY_STUDIO_DEPLOY_TOKEN=<deploy-token>  # Keep secret, never commit
   SANITY_REVALIDATE_SECRET=<random-secret>
   ```

### Build and Deployment

#### Option 1: AWS Amplify (Recommended for consistency)

1. **Primary Portfolio App** (namias.tech)
   - Repository: PP-Namias/Portfolio
   - Root directory: `/`
   - Build command: `npm ci && npm run build`
   - Output directory: `.next`
   - Environment variables: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`

2. **Sanity Studio** (cms.namias.tech)
   - Same repository
   - Base directory: `studio/`
   - Build command: `npm ci && npm run build --prefix studio/`
   - Output directory: `studio/dist`
   - Environment variables: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`
   - Subdomain: `cms` on `namias.tech` domain

#### Option 2: Vercel (Alternative)

- **Portfolio**: Deploy root directory to production
- **Studio**: Deploy `studio/` directory to subdomain via Vercel project settings

#### Option 3: Self-Hosted / Docker

```dockerfile
# Dockerfile for studio/
FROM node:20-alpine
WORKDIR /app
COPY studio/ ./
RUN npm ci
RUN npm run build
EXPOSE 3333
CMD ["npm", "run", "start"]
```

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
