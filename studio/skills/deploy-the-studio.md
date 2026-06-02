---
title: Deploy the Studio
trigger: "deploy studio", "sanity deploy"
audience: devs
time: 2 min
---

# Deploy the Studio

## Steps

```bash
cd studio
npm run build     # builds to studio/dist
npm run deploy    # pushes dist to https://namias-cms.sanity.studio/
```

## Prerequisites
- `npx sanity@latest login` — must be authenticated.
- `SANITY_STUDIO_DEPLOY_TOKEN` in `studio/.env` (admin role).

## What `sanity deploy` does
- Builds the static bundle.
- Uploads `dist/` to the Sanity CDN.
- Updates the `deployment.appId` target in `sanity.cli.ts`.

## Verify
Open `https://namias-cms.sanity.studio/` in a browser.

## Troubleshooting
- **`Failed to fetch remote version`** — set
  `deployment.autoUpdates: false` in `sanity.cli.ts`. The CDN
  check is non-essential.
- **Permission denied** — your auth token doesn't have admin role.
  Use `SANITY_STUDIO_DEPLOY_TOKEN` env var instead.
