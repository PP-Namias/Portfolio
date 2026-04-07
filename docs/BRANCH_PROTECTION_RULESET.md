# Branch Protection Ruleset Blueprint (`main`)

This document defines the exact branch protection settings to apply before making the repository public.

## Target

- **Ruleset name:** `main-production-protection`
- **Enforcement:** `Active`
- **Target branch:** `main`

## Bypass List (recommended)

Keep bypass minimal.

- Repository owner/admin only
- No broad team bypass
- No app bypass unless required for release automation

## Rules to Enable

### Core safety

- [x] Block force pushes
- [x] Restrict deletions
- [x] Require linear history

### Pull request requirements

- [x] Require a pull request before merging
- [x] Require at least 1 approval (2 if collaborating actively)
- [x] Dismiss stale approvals on new commits
- [x] Require conversation resolution before merge
- [x] Require approval of the most recent reviewable push
- [x] Require Code Owner review (after adding `.github/CODEOWNERS`)

### Checks and quality gates

- [x] Require status checks to pass
- [x] Require branches to be up to date before merging (strict mode)

Recommended required checks (exact names from workflows):

- `⚡ Quality Check`
- `🔒 Security Scan`
- `🔍 Lint & Type Check`
- `🏗️ Build Application`
- `🧪 Run Tests`
- `🕵️ CodeQL Analysis`

### Security and intelligence

- [x] Require code scanning results
  - Tool: **CodeQL**
  - Severity threshold: **High/Critical** blocking (recommended)
- [x] Enable automatic Copilot code review requests

## Rules to Keep Disabled (unless strictly needed)

- [ ] Restrict creations
- [ ] Restrict updates
- [ ] Require signed commits (enable only after team keys/signing policy is ready)
- [ ] Require deployments to succeed (enable later if you add preview/prod env protections)

---

## Post-Setup Verification Checklist

- [ ] Direct push to `main` is blocked for non-bypass users
- [ ] PR cannot merge without required checks
- [ ] PR cannot merge with unresolved review threads
- [ ] PR cannot merge if CodeQL reports blocking severity findings
- [ ] Squash/rebase merge works while preserving linear history

---

## Why this matters for a public portfolio repo

These rules ensure your public repository demonstrates professional engineering practice:

- safer collaboration,
- auditable quality gates,
- security-first default behavior,
- reproducible CI expectations for outside contributors.
