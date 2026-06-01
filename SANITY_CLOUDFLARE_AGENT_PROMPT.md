# Sanity Cloudflare Agent Prompt

Use this prompt to continue the deployment work:

```text
You are working in the PP Namias portfolio repo on the `feature/sanity-cloudflare-deploy` branch.

Objective:
Finish the Cloudflare deployment for the portfolio and the Sanity CMS showcase.

Context:
- The root app deploys through OpenNext + Cloudflare Workers.
- The Studio lives in `studio/` as a separate Sanity app.
- The repo has a `/studio` landing page in the main app.
- Cloudflare config uses `wrangler.jsonc` with `nodejs_compat` and `.open-next` assets.
- Sanity webhook revalidation already exists at `src/app/api/sanity/webhook/route.ts`.
- The hosted Studio URL is `https://namias-cms.sanity.studio/`.
- The studio CLI config should include `appId: 'rpjnth2yentmovjzzw6tx0xe'`.

Tasks:
1. Install dependencies and refresh `package-lock.json`.
2. Run the Cloudflare build and fix any remaining errors.
3. Verify the root app still builds and the new `/studio` page renders.
4. Verify the Studio package still builds and can be deployed separately.
5. Confirm the new docs match the real deployment flow.
6. Ensure the portfolio `/studio` landing page points to the hosted Studio URL.

Deliverables:
- Exact files changed.
- Build output or test results.
- Any remaining Cloudflare dashboard steps.
- Whether the Studio should use a dedicated hosted URL.
```
