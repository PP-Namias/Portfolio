
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