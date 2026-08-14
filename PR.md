
### 2026-08-10 - Update

  - 37ec300e fix(security): remediate trivy CVEs in tooling and studio lockfiles
  - Bump studio overrides to patched versions: brace-expansion 2.1.4 (CVE-2026-13149/14257), js-yaml 4.3.1 (CVE-2026-59869, GHSA-5p4m-2wfm-xmqj)
  - Add adm-zip 0.6.0 override (CVE-2026-39244) without requiring sanity major bump
  - npm audit fix at root: fast-uri (GHSA-v2hh-gcrm-f6hx etc.) and js-yaml (GHSA-52cp-r559-cp3m)
  - Regenerate studio pnpm-lock.yaml (frozen-lockfile verified) and package-lock.json (npm ci layout)
  - Verified: npm audit found 0 vulnerabilities in root and studio; studio lint 0 errors, typecheck clean, sanity build succeeds
### 2026-08-10 - Update

  - 80d824cf fix(ci): run studio deploy script instead of pnpm deploy subcommand
  - 'pnpm deploy' requires a pnpm workspace; the intent was the studio's
  - deploy script (sanity deploy). ERR_PNPM_CANNOT_DEPLOY broke the
  - Sanity Studio Deploy workflow on every studio change.
### 2026-08-10 - Update

  - 27fe0080 fix(ci): pin all actions to verified SHAs and remove inert nested workflow
  - Pin github/codeql-action init/analyze to v3.23.1 SHA in codeql.yml and security-compliance.yml (unpinned-uses)
  - Pin actions/checkout, setup-node, upload-artifact in playwright.yml
  - Pin pnpm/action-setup to v4.1.0 SHA in sanity-studio-deploy.yml and cloudflare-deploy-v2.yml
  - Fix dorny/paths-filter SHA in deploy.yml and oven-sh/setup-bun SHA in cloudflare-deploy-v2.yml (impostor-commit: SHAs did not belong to the referenced repos)
  - Replace corrupted upload-artifact SHA in cloudflare-deploy.yml
  - Delete nested portfolio-v1/.github/workflows/problem-detection-advisor.yml (inert; dangerous workflow_run trigger)
  - Resolves all 17 zizmor error-level findings blocking the code_quality gate
### 2026-08-10 - Update

  - 8392c277 fix(deploy): strip UTF-8 BOM from portfolio-v1 package.json
  - Remove EF BB BF BOM that Turbopack cannot parse ('package.json is not parseable'),
    crashing both Vercel (next build) and Cloudflare Workers (opennextjs-cloudflare build)
  - 9152a5e9 ci(quality): add next build smoke check to portfolio-v1 gate
  - Appends 'npx next build' to the quality matrix so JSON/config parse errors
    and build crashes are caught pre-merge
  - Verified: next build and opennextjs-cloudflare build exit 0 locally
### 2026-08-11 - Update

  - d391b7af fix(deploy): restore Cloudflare worker build and make Vercel config explicit
  - root wrangler.jsonc: main/assets back at repo root (shape Cloudflare git
  - integration builds successfully), build command delegates to new
  - scripts/cloudflare-build.mjs which installs, runs the OpenNext build in
  - portfolio-v1, then stages .open-next at repo root
  - add esbuild 0.25.4 devDependency: @opennextjs/cloudflare bundler imports
  - esbuild at top level; fresh npm ci no longer hoists it, which broke every
  - git-integration build after the monorepo restructure (ERR_MODULE_NOT_FOUND)
  - vercel.json: full explicit build/install/output overrides so dashboard
  - settings cannot reject the deployment at config-validation time
  - Verified locally: node scripts/cloudflare-build.mjs exit 0,
  - wrangler deploy --dry-run exit 0 (75 assets, ASSETS binding)
### 2026-08-11 - Update

  - cd13e139 ci(security): build app during custom CodeQL analysis and correct action pins
  - custom CodeQL run now installs and builds the app (was build-mode none),
  - giving the analyzer full type data for the monorepo
  - correct codeql-action pins to the real v3.23.1 commit f6c040146; the
  - previous sha was labeled v3.23.1 but points at a different revision
### 2026-08-14 - Update

  - 9549830c fix(ci): restore canonical Vercel root config and fix react-doctor expression
  - vercel.json: set rootDirectory to portfolio-v1 (standard monorepo pattern)
  - so Vercel's Next.js builder finds .next at the app root; remove the
  - cd-commands and outputDirectory('portfolio-v1/.next') combo that made
  - every deployment since Aug 9 fail on the missing .next directory
  - react-doctor.yml: single-quote the fallback string inside the GitHub
  - expression (double quotes are rejected by the workflow parser, making
  - the file invalid and producing a failure run on every push)
  - CodeQL '1 configuration not found' needs no YAML change: the
  - security-compliance.yml:codeql analysis simply never ran for the last
  - head SHA because the pull_request event was not delivered
  - Verified: npm run build and npx next build with VERCEL=1 pass locally;
  - js-yaml and JSON parsing clean
### 2026-08-14 - Update

  - b53ce571 chore(ci): merge origin/main into dev and resolve dependabot conflicts
  - main's root package.json is the legacy pre-monorepo app manifest;
  - dev repurposed it as tooling (husky, lint-staged, commitlint, prettier)
  - dependabot bumps on main targeted the legacy manifest; keep dev's
  - tooling package.json and lockfile (ours) as the canonical version
  - Required to restore pull_request event delivery and CI runs on the PR
  - head, and to make the PR mergeable