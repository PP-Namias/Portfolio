# Sanity CMS Cloudflare Deployment Plan

## Goal

Deploy the Sanity CMS integration on Cloudflare so this portfolio has a working Sanity Studio plus live CMS/CRM showcase content.

## Current State

- The repo already includes Sanity migration tooling in `scripts/sanity/`.
- There is a Sanity webhook route at `src/app/api/sanity/webhook/route.ts`.
- The current Cloudflare build is failing during `npx opennextjs-cloudflare build`.
- The existing app uses Next.js 14, which is already a deployment constraint to validate against Cloudflare/OpenNext compatibility.

## Working Status

- Root app Cloudflare build is wired through OpenNext.
- `/studio` exists as a portfolio landing route for the CMS.
- Automated deployment is configured in GitHub Actions.
- The remaining blocker is Cloudflare/Sanity secret and dashboard setup.
- The root website build passes.
- The Studio build passes.
- Hosted Studio URL: `https://namias-cms.sanity.studio/`

## What Needs To Exist

- A deployable Cloudflare app build.
- A working Sanity Studio deployment or studio route.
- Sanity environment variables configured in Cloudflare.
- Webhook revalidation wired to the deployed domain.
- A content flow that clearly demonstrates CMS and CRM capability in the portfolio.

## Execution Plan

1. Confirm the exact Cloudflare deployment mode being used.
   - Identify whether the project is deployed as Workers, Pages, or a hybrid OpenNext target.
   - Align the build output with that target.

2. Fix the Cloudflare build blocker first.
   - Inspect the full failing build log around `opennextjs-cloudflare build`.
   - Resolve any Next/OpenNext version mismatch.
   - Add or adjust Cloudflare-specific config only if required.

3. Define the Sanity deployment shape.
   - Decide whether Sanity Studio will live inside the same Next app or as a separate route/app.
   - Keep the setup minimal if the goal is a fast showcase deployment.

4. Wire environment variables.
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `SANITY_API_READ_TOKEN`
   - `SANITY_API_WRITE_TOKEN`
   - `SANITY_REVALIDATE_SECRET`

5. Validate data flow.
   - Run the Sanity dry run.
   - Run the import.
   - Run parity checks.
   - Confirm the portfolio pages render Sanity-backed content.

6. Connect webhook revalidation.
   - Point Sanity webhook calls at the deployed Cloudflare endpoint.
   - Confirm content updates trigger cache refresh.

7. Showcase the CMS and CRM value.
   - Expose curated content blocks, testimonials, projects, blog entries, and contact/lead-style content.
   - Make the editorial flow visibly useful on the live site.

8. Final deployment verification.
   - Confirm build success.
   - Confirm production route availability.
   - Confirm Studio access.
   - Confirm content updates propagate.

## Runbook

### Local website

```bash
npm run build
```

### Local Studio

```bash
npm --prefix studio run build
```

### Cloudflare worker build

```bash
npm run cloudflare:build
```

### Cloudflare worker deploy

```bash
npm run cloudflare:deploy
```

### Sanity Studio deploy

```bash
npm --prefix studio run deploy
```

## Required GitHub Secrets

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `SANITY_STUDIO_DEPLOY_TOKEN`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_REVALIDATE_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SANITY_STUDIO_URL`

## Best Practice Notes

- Keep real secrets out of the repository.
- Use `.env.example` for copy-paste defaults.
- Revoke and replace any exposed token before deploying.
- Prefer a dedicated hosted Studio URL when you are ready to present the CMS publicly.

## Verification Checklist

- `npm run sanity:dry-run`
- `npm run sanity:import`
- `npm run sanity:parity:strict`
- Cloudflare deployment build succeeds
- Deployed site loads without runtime errors
- Sanity-powered content is visible
- Webhook revalidation works after content edits
- GitHub Actions deploy workflow runs on `main`
- Cloudflare workers.dev URL is enabled or a custom domain is attached

## Dashboard Steps

1. Add the GitHub secrets listed above.
2. Revoke any exposed Cloudflare token and replace it with the new one.
3. In Cloudflare, ensure the `namias` Worker has an active URL.
4. In Sanity, confirm the studio deploy token and webhook secret.
5. Update `NEXT_PUBLIC_SANITY_STUDIO_URL` to `https://namias-cms.sanity.studio/`.
6. Merge the branch to `main` to trigger auto-deploy.

## Risks

- OpenNext may require a specific Next.js version or build shape.
- Missing Cloudflare environment variables will block Sanity reads/writes.
- Studio routing may need separation from the main portfolio app if build constraints appear.

## AI Agent Prompt

Use this prompt with an implementation agent:

```text
You are working in the PP Namias portfolio repo.

Objective:
Get the Sanity CMS deployment working on Cloudflare and make the portfolio clearly showcase CMS and CRM capability.

Important context:
- The repo already contains Sanity migration scripts in `scripts/sanity/`.
- There is a webhook handler at `src/app/api/sanity/webhook/route.ts`.
- Cloudflare deployment is currently failing during `npx opennextjs-cloudflare build`.
- The app uses Next.js 14.

Your tasks:
1. Inspect the current Cloudflare/OpenNext deployment setup.
2. Find the cause of the build failure and fix the minimum necessary code/config.
3. Ensure Sanity env vars are supported and documented.
4. Make sure Sanity Studio can be deployed or exposed cleanly for production use.
5. Verify webhook revalidation and content refresh behavior.
6. Keep changes small, direct, and production-safe.

Required output:
- List the exact files changed.
- Explain the build issue and the fix.
- Confirm the verification commands you ran.
- Call out anything still blocked or needing a Cloudflare dashboard change.
```

## Next Agent Prompt

```text
Continue from the current feature/sanity-cloudflare-deploy branch.

Goal:
Keep the Cloudflare and Sanity Studio deployment working, then verify the repo is ready for PR and auto-deploy.

Tasks:
1. Verify the root website build.
2. Verify the Sanity Studio build.
3. Confirm the docs match the actual deployment flow.
4. Keep the deployment plan updated with any new blockers or dashboard steps.
5. Do not store any real secrets in the repo.

Output:
- What passed.
- What still needs dashboard changes.
- Whether the branch is PR-ready.
```
