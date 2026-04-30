# CMS Deployment Architecture: Separate Domains vs Integrated

## Recommendation

Deploy Sanity Studio to a dedicated subdomain (cms.namias.tech) and keep the main portfolio on namias.tech. This preserves separation of concerns, security boundaries, and independent scalability.

## Why Separate Deployments

- Security isolation: Studio requires authenticated access and should not ship with the public app.
- Independent release cadence: content operations can update without redeploying the portfolio.
- Smaller public bundle: removes Studio dependencies from the main site runtime.
- Cleaner operational surface: distinct logs, access policies, and uptime profiles.

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
