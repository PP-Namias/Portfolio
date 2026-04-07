# GitHub Automation and Governance Guide

This document describes what the `.github/` directory controls in this repository.

## What is in this folder

- `workflows/` — CI, security, uptime, and scheduled health automations
- `ISSUE_TEMPLATE/` — guided issue templates and contact links
- `PULL_REQUEST_TEMPLATE.md` — pull request checklist and validation template
- `CODEOWNERS` — review ownership rules
- `dependabot.yml` — dependency update automation
- `copilot-instructions.md` — project-specific Copilot agent instructions

## Workflows overview

### `workflows/build.yml`

- Trigger: push and pull request to `main`
- Jobs:
  - `🔍 Lint & Type Check`
  - `🏗️ Build Application`
  - `🧪 Run Tests`

### `workflows/pr-validation.yml`

- Trigger: active pull request events targeting `main`
- Jobs:
  - `⚡ Quality Check`
  - `🔒 Security Scan`
  - `💬 PR Status` (posts/updates PR validation comment)

### `workflows/security-compliance.yml`

- Trigger: push, pull request, weekly schedule, manual dispatch
- Jobs:
  - `🔍 Dependency Audit`
  - `🕵️ CodeQL Analysis`
  - `📊 Security Summary`

### `workflows/daily-health-check.yml`

- Trigger: daily schedule and manual dispatch
- Performs lint, type check, audit, build, and tests
- Creates an issue automatically if the health check fails

### `workflows/monitoring-health.yml`

- Trigger: every 6 hours and manual dispatch
- Checks production uptime for:
  - `https://namias.tech`
  - `https://namias.tech/blog`
- Checks SSL certificate status and outputs a summary

## Branch protection required checks

For `main`, use these check names in branch protection/rulesets:

- `⚡ Quality Check`
- `🔒 Security Scan`
- `🔍 Lint & Type Check`
- `🏗️ Build Application`
- `🧪 Run Tests`
- `🕵️ CodeQL Analysis`

See `docs/BRANCH_PROTECTION_RULESET.md` for complete settings.

## Issue and pull request governance

- `ISSUE_TEMPLATE/config.yml` disables blank issues and links to:
  - `SECURITY.md`
  - `SUPPORT.md`
- `PULL_REQUEST_TEMPLATE.md` enforces validation checklist in every PR
- `CODEOWNERS` ensures review routing for critical paths

## Local pre-checks before opening a PR

Run from repository root:

```bash
npm run lint
npm run build
npm run test
```

## Related documentation

- [`../README.md`](../README.md)
- [`../CONTRIBUTING.md`](../CONTRIBUTING.md)
- [`../SECURITY.md`](../SECURITY.md)
- [`../SUPPORT.md`](../SUPPORT.md)
- [`../docs/REPO_PUBLICATION_PLAN.md`](../docs/REPO_PUBLICATION_PLAN.md)
- [`../docs/PUBLIC_REPO_SETTINGS_CHECKLIST.md`](../docs/PUBLIC_REPO_SETTINGS_CHECKLIST.md)
