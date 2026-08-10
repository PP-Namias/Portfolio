
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