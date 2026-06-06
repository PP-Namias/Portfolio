# Workflow Audit - Baseline

Generated as part of S-0.1 (EPIC-0) of the CI/CD security pipeline PRD (`prd.ci-cd-security.json`).

## Scope

All workflow files in `.github/workflows/`:

| File | Purpose |
|------|---------|
| `build.yml` | Build verification |
| `cloudflare-deploy.yml` | Deploy to Cloudflare Workers |
| `daily-health-check.yml` | Daily health check |
| `monitoring-health.yml` | Monitoring health check |
| `pentestagent-ci.yml` | PentestAgent CI scan |
| `pentestagent-pr-check.yml` | PentestAgent PR check |
| `pentestagent-scheduled.yml` | PentestAgent scheduled scan |
| `pr-validation.yml` | PR validation |
| `problem-detection-advisor.yml` | Problem detection advisor |
| `react-doctor.yml` | React quality gate |
| `remediation-approval-gate.yml` | Remediation approval gate |
| `security-compliance.yml` | Security compliance check |

## Third-party action references (baseline)

Every `uses:` line in every workflow that references a third-party action. None are pinned to a commit SHA - all use floating tags.

| Action | Current ref | Risk |
|--------|-------------|------|
| `actions/checkout` | `@v4` | Tag can be re-pointed by the action owner |
| `actions/github-script` | `@v7`, `@v8` | Tag can be re-pointed |
| `actions/setup-node` | `@v4` | Tag can be re-pointed |
| `actions/setup-python` | `@v5` | Tag can be re-pointed |
| `actions/upload-artifact` | `@v4` | Tag can be re-pointed |
| `github/codeql-action/init` | `@v3` | Tag can be re-pointed |
| `github/codeql-action/analyze` | `@v3` | Tag can be re-pointed |

This is the exact class of risk behind the trivy-action (March 2026) and tj-actions (2025) incidents. A compromised tag becomes a compromised build.

## Permission declarations (baseline)

10 workflows declare `permissions:`. 2 workflows declare it twice (one at workflow level, one at job level). 2 workflows do not declare permissions at all (defaulting to the repo's default token permissions, which is typically write-all on older repos).

Workflows with NO explicit `permissions:` block:
- `pentestagent-ci.yml`
- `pentestagent-pr-check.yml`
- `pentestagent-scheduled.yml`

## Findings

| ID | Finding | Severity | Fix story |
|----|---------|----------|-----------|
| F-1 | All 7 third-party actions pinned to floating tags, not commit SHAs | CRITICAL | S-0.2 |
| F-2 | 3 workflows have no explicit `permissions:` block | HIGH | S-0.3 |
| F-3 | No security gate workflow (no Gitleaks, OSV-Scanner, Trivy, Checkov, zizmor, Cosign, Scorecard) | HIGH | EPIC-1 through EPIC-7 |
| F-4 | No documentation of the security pipeline | MEDIUM | S-0.4 |
| F-5 | No agent skill for the security pipeline | MEDIUM | S-0.5 |

## Remediation order

1. F-1: Pin every action to its commit SHA (S-0.2)
2. F-2: Add explicit `permissions: read-all` at workflow level on the 3 missing workflows (S-0.3)
3. F-3: Add the 7 security gate workflows (EPIC-1 through EPIC-7)
4. F-4: Write `docs/security/pipeline.md` (S-0.4)
5. F-5: Write `.agents/skills/ci-cd-security/SKILL.md` (S-0.5)
