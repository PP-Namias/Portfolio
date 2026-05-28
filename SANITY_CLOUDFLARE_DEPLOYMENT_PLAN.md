# Sanity CMS Cloudflare Deployment Plan

## Goal

Deploy the Sanity CMS integration on Cloudflare so this portfolio has a working Sanity Studio plus live CMS/CRM showcase content.

## Current State

- The repo already includes Sanity migration tooling in `scripts/sanity/`.
- There is a Sanity webhook route at `src/app/api/sanity/webhook/route.ts`.
- The current Cloudflare build is failing during `npx opennextjs-cloudflare build`.
- The existing app uses Next.js 14, which is already a deployment constraint to validate against Cloudflare/OpenNext compatibility.

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

## Verification Checklist

- `npm run sanity:dry-run`
- `npm run sanity:import`
- `npm run sanity:parity:strict`
- Cloudflare deployment build succeeds
- Deployed site loads without runtime errors
- Sanity-powered content is visible
- Webhook revalidation works after content edits

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
