# Platform Hardening PR Guide

## Summary

This PR hardens platform reliability, security posture, and maintainability on branch `feat/platform-hardening-pass`.

## What changed

### 1) Dependency and supply-chain hardening

- Upgraded `next` and `eslint-config-next` to `14.2.35`.
- Refreshed `package-lock.json` via `npm install`.
- Applied safe transitive updates via `npm audit fix`.

### 2) CI and monitoring noise reduction

- Removed duplicate PR trigger from `.github/workflows/build.yml` to avoid duplicated checks.
- Added `/blog` monitor gating in `.github/workflows/monitoring-health.yml` using:
  - `BLOG_MONITOR_ENABLED` (default: `false`)

### 3) Chat API modularization + durable throttling

- Refactored monolithic chat route into composable modules:
  - `src/app/api/chat/lib/types.ts`
  - `src/app/api/chat/lib/intentClassifier.ts`
  - `src/app/api/chat/lib/fallbackResponder.ts`
  - `src/app/api/chat/lib/promptBuilder.ts`
  - `src/app/api/chat/lib/rateLimiter.ts`
- Added durable rate limiting path using Upstash Redis when configured:
  - `UPSTASH_REDIS_REST_URL`
  - `UPSTASH_REDIS_REST_TOKEN`
- Kept automatic in-memory fallback when Upstash is unavailable.

### 4) Environment hygiene

- Updated `.env.example` and `README.md` with private-secret guidance and Upstash vars.

### 5) Medium-priority UX/a11y/test quality

- Improved timeline item accessibility:
  - keyboard/focusable button semantics
  - `aria-expanded` + `aria-controls`
- Replaced deprecated brand icons with non-deprecated alternatives in key sections.
- Stabilized keys and explicit button types in interactive sections.
- Reduced noisy DOM warnings in test mocks for Framer Motion and `next/image`.
- Updated chat API tests for sanitization path (`replaceAll`).

### 6) Approval-gated problem detection and remediation

- Added `.github/workflows/problem-detection-advisor.yml` to automatically:
  - detect failed monitored workflows
  - post failed-job analysis + suggested solutions to PR comments or repository issues
  - mark reports with an approval instruction
- Added `.github/workflows/remediation-approval-gate.yml` so remediation reruns require explicit approval via:
  - PR comment command (exact): `/approve-remediation`
  - approver must be owner/member/collaborator
  - command is ignored for bots and non-exact variants
  - reruns failed checks and posts result acknowledgment back to the PR

## Validation run

- `npm run lint` ✅
- `npm run build` ✅
- `npm run test` ✅ (226 passed)

## Remaining security note

`npm audit` still reports vulnerabilities that require **breaking upgrades** (`next@16.x` / `eslint-config-next@16.x`) to fully clear.

This PR intentionally avoids forced major upgrades to keep compatibility with the current Next.js 14 architecture.

## Reviewer checklist

- [ ] Confirm CI check deduplication behaves as expected on PRs
- [ ] Confirm `/blog` monitor can be toggled via `BLOG_MONITOR_ENABLED`
- [ ] Confirm chat endpoint behavior is unchanged for user-facing intents
- [ ] Confirm Upstash rate limiting works when env vars are set
- [ ] Confirm no regressions in homepage interactions (Hero, HubMenu, Timeline)
- [ ] Confirm problem reports are auto-posted when a monitored workflow fails
- [ ] Confirm `/approve-remediation` reruns failed checks only for authorized approvers
