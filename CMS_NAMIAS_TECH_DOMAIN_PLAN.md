# CMS Subdomain Deployment Plan - `cms.namias.tech`

## Goal

Stand up `cms.namias.tech` as the production home for the Sanity CMS, mirroring the deployment shape of `namias.tech` but scoped to editorial workflows. Once complete, the CMS is reachable at its own first-class URL, the marketing site keeps its own URL, and the two share one Cloudflare worker + one DNS zone.

## Current State (verified)

- Cloudflare worker `namias` is **live and green** (version `ce4f72fd`, deployed ~38m ago from `feature/sanity-cloudflare-deploy`).
- PR #248 checks all pass: Quality, Security, Vercel Preview, Workers Builds.
- `Workers & Pages -> namias` has **no custom domains or routes enabled** today (only the default `namias.jkrbn99.workers.dev` subdomain, disabled).
- `src/app/studio/page.tsx` is a landing route that, in production, redirects to the hosted Sanity studio at `https://namias-cms.sanity.studio/`.
- `wrangler.jsonc` is wired with `compatibility_date`, `nodejs_compat`, `global_fetch_strictly_public`, and the pinned build command.
- The marketing site is currently served from Vercel (per PR checks), so the Cloudflare worker is the natural place to host the CMS subdomain.

## Strategy

Two acceptable shapes; pick **A** (recommended) unless the team has a hard requirement for a stand-alone deploy.

| | A. Route the subdomain to the existing `namias` worker (recommended) | B. Stand up a separate `namias-cms` Cloudflare Pages project |
|---|---|---|
| Deploys | One worker, one DNS zone | Two deployments |
| Maintenance | Single OpenNext build pipeline | Independent studio build pipeline |
| Custom domain | One CNAME + one worker route | One Pages custom domain |
| Redirect logic | Middleware detects host, redirects to hosted studio | Direct host of static studio bundle |
| Reversibility | Trivial (remove the custom domain) | Requires a Pages teardown |

This plan covers **A**. The corresponding `B` section is at the bottom as a fallback.

---

## Step 1 - Confirm the Cloudflare worker is healthy

Do not touch DNS until the worker is provably green.

1. Open `dash.cloudflare.com -> Workers & Pages -> namias`.
2. Confirm the top of the page shows the latest version (`ce4f72fd` or newer) with status **Deployed**.
3. Confirm **No active incidents** under the build history.
4. Hit the worker's preview URL (`https://namias.jkrbn99.workers.dev/`) and check the home page returns 200 and renders portfolio content.
5. Hit `https://namias.jkrbn99.workers.dev/studio` and confirm it lands on the studio landing (or redirects to `namias-cms.sanity.studio`).
6. Verify PR #248 still shows all checks green before merging if it is not yet on `main`.

If any of these fail, **stop** and fix the worker first. The rest of this plan assumes a green worker.

---

## Step 2 - DNS prerequisites

The zone for `namias.tech` must already be on Cloudflare (or moved to Cloudflare) so that the `cms` subdomain can be added cheaply.

1. In Cloudflare, open the account that owns `namias.tech` (account id `4bd772a73fb69e405e81422ee07a34a6` per `.env.example`).
2. Confirm the zone is **Active** (orange-clouded) on Cloudflare.
3. If the zone is on a different registrar:
   - Point the registrar nameservers to the Cloudflare-assigned pair.
   - Wait for the zone to go **Active** (this can take up to 24h but usually minutes).
4. Decide the apex setup:
   - `namias.tech` continues to serve the marketing site (today: Vercel).
   - `cms.namias.tech` is a new record pointing at the Cloudflare worker.

No DNS records are added in this step - just verify the zone is in the right place.

---

## Step 3 - Add `cms.namias.tech` to the Cloudflare worker

1. In the Cloudflare dashboard, open **Workers & Pages -> namias -> Settings -> Triggers -> Custom Domains**.
2. Click **Add Custom Domain**.
3. Enter `cms.namias.tech`.
4. Cloudflare will:
   - Create a `cms` CNAME in the `namias.tech` zone pointing at the worker's `*.workers.dev` route.
   - Issue the SSL/TLS certificate automatically.
   - Bind the domain to the `namias` worker.
5. Wait for **Active** status. Usually under a minute, but certificate provisioning can take longer on first add.
6. Repeat for the `www`-style alias if needed (skip for now - `cms.www.namias.tech` is not part of the spec).

This is the only Cloudflare-dashboard step required. Everything else is repo work.

---

## Step 4 - Repo: route the new host to the studio

The current `/studio` page is a landing route that redirects in production. We need host-aware routing so that:

- `https://namias.tech/studio` -> existing landing page (no change).
- `https://cms.namias.tech/` and `https://cms.namias.tech/<anything>` -> redirect (or rewrite) to the hosted Sanity studio, preserving the path.

### 4.1 - Add a hostname-aware middleware

Create `src/middleware.ts` (or extend the existing one) that intercepts requests whose host is `cms.namias.tech` and rewrites them to the hosted studio.

```ts
import { NextResponse, type NextRequest } from 'next/server';

const CMS_HOST = 'cms.namias.tech';
const STUDIO_ORIGIN =
  process.env.SANITY_STUDIO_URL ||
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL ||
  'https://namias-cms.sanity.studio/';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host')?.toLowerCase() ?? '';
  if (host !== CMS_HOST && host !== `www.${CMS_HOST}`) {
    return NextResponse.next();
  }

  const target = new URL(request.nextUrl.pathname, STUDIO_ORIGIN);
  target.search = request.nextUrl.search;
  return NextResponse.redirect(target, { status: 308 });
}

export const config = {
  matcher: ['/((?!_next/|favicon.ico).*)'],
};
```

Notes:

- Use `308 Permanent Redirect` so the redirect survives crawlers and clients.
- Keep `matcher` narrow to avoid intercepting static assets.
- Allow `www.cms.namias.tech` as an alias only if/when the DNS record is added.

### 4.2 - Update the studio landing page

`src/app/studio/page.tsx` keeps the existing behavior on `namias.tech` (landing + button). No content change required there, but ensure the env check uses the production guard from the previous PR work.

### 4.3 - Update CSP and security headers

`next.config.js` currently sets a CSP that whitelists `self`, Sanity assets, and a couple of analytics origins. Add the new host to the relevant directives:

- `frame-src` already includes `cdn.sanity.io` - keep as is.
- `connect-src` already includes `'self'` and the Umami host. The new domain is same-origin to the worker, so no change needed.
- Confirm `Cross-Origin-Resource-Policy` is `cross-origin` so the studio iframe embeds (used by the live preview) keep working.

No code change expected, but re-verify in the response headers after deploy.

---

## Step 5 - Sanity CORS and project allowlist

The hosted Sanity studio at `namias-cms.sanity.studio` is what the redirect lands on. CORS only matters if `cms.namias.tech` makes XHR/fetch calls directly to the Sanity API, but the studio SPA does.

1. In the Sanity manage console (`sanity.io/manage`) for project `nl0qw78w`:
   - **API -> CORS Origins**: add `https://cms.namias.tech`.
   - **API -> CORS Origins**: also keep `https://namias-cms.sanity.studio` and the Vercel preview hosts.
2. Confirm the dataset is `production` and the deploy bot has write access (already in `.env.example`).

---

## Step 6 - Secrets, env, and CI

1. Add `NEXT_PUBLIC_SANITY_STUDIO_URL=https://namias-cms.sanity.studio/` to the existing `SANITY_STUDIO_URL` GitHub Actions secret (or keep the per-PR override).
2. Confirm `NEXT_PUBLIC_SITE_URL` includes the new domain so absolute URLs (OG tags, sitemap, webhook callbacks) generate against `https://namias.tech` (and that the studio env points at `https://cms.namias.tech` where the studio SPA is served).
3. No change to `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` - the same token deploys the same worker.

---

## Step 7 - Deploy

1. Commit the middleware and any config tweaks in a follow-up PR.
2. Wait for the PR validation suite (Quality Check, Security, Vercel, Workers Builds) to go green.
3. Merge to `main`. The Cloudflare and Sanity Deploy workflow runs on `push: main` and rolls the worker.
4. The new custom domain (`cms.namias.tech`) is bound at the Cloudflare layer and does not require a new wrangler deploy - but the worker must be on a version that includes the new middleware, so merge before testing the redirect.

---

## Step 8 - Verification

Run all of the following from a clean machine or incognito tab:

1. `curl -I https://cms.namias.tech/` -> 308 to `https://namias-cms.sanity.studio/`.
2. `curl -I https://cms.namias.tech/structure` -> 308 to `https://namias-cms.sanity.studio/structure`.
3. `curl -I https://namias.tech/studio` -> 200, renders the landing page (not a redirect).
4. `curl -I https://namias.tech/` -> 200, renders the portfolio.
5. Open `https://cms.namias.tech/` in a browser, sign in, edit a document, confirm Sanity accepts the write and the on-demand revalidation webhook fires.
6. In the Cloudflare dashboard, **Workers & Pages -> namias -> Metrics** shows non-zero requests for host `cms.namias.tech`.
7. Run `npx wrangler tail namias --format=pretty` while browsing the subdomain to confirm clean logs (no 5xx, no CORS rejections).

If any of the above fails:

- 5xx -> check the worker logs and middleware.
- 404 from the studio -> check that the path is being preserved on the redirect.
- CORS rejection -> re-check step 5.

---

## Step 9 - Rollback

- **DNS rollback:** delete the `cms` CNAME in the `namias.tech` zone. Takes effect at TTL expiry (Cloudflare default 5 min for proxied records).
- **Worker rollback:** in the Cloudflare dashboard, **Workers & Pages -> namias -> Deployments -> Rollback** to the previous version. The custom domain stays bound; only the code changes.
- **Repo rollback:** revert the middleware commit. PR validation re-runs.

---

## Fallback - Approach B (separate Pages project)

If Approach A cannot ship (for example, because the team wants a totally isolated studio deploy with its own CI):

1. Run `sanity build` in the `studio/` workspace. Output is static files in `studio/dist/`.
2. Create a new Cloudflare Pages project named `namias-cms`, connected to the same repo, build command `npm --prefix studio run build`, output dir `studio/dist`.
3. In **Pages -> namias-cms -> Custom domains**, add `cms.namias.tech`. Cloudflare issues the cert and binds the domain.
4. Update the `NEXT_PUBLIC_SANITY_STUDIO_URL` env on the marketing worker to `https://cms.namias.tech` so the landing page button points at the new domain.
5. Delete the middleware from Approach A; the Pages project serves the SPA directly.

This path is heavier but gives the studio its own deploy lifecycle, separate cache, and independent rollback.

---

## Open questions

- Will the team own the `namias.tech` DNS zone in Cloudflare, or is it on the registrar today? (Drives Step 2.)
- Is the hosted studio at `namias-cms.sanity.studio` the long-term CMS, or do we plan to self-host the static studio build via Pages later? (Drives Approach A vs B.)
- Should `https://namias.tech/studio` keep the landing page, or 308 to `cms.namias.tech`? (Drives whether the marketing worker also gets a tiny redirect in `next.config.js` rewrites.)
