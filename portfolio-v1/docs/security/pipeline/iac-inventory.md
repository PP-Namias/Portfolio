# IaC Surface Inventory

This document enumerates every file in the Namias portfolio that constitutes "infrastructure as code" (IaC) for the purposes of static analysis by Checkov. It is the canonical answer to "what does Checkov scan?"

## IaC files

| Path | Framework | Purpose | Checkov-relevant checks |
|------|-----------|---------|-------------------------|
| `.github/workflows/build.yml` | github_actions | Build verification on PRs | permissions, secrets, unpinned actions |
| `.github/workflows/cloudflare-deploy.yml` | github_actions | Deploy Worker + Studio to Cloudflare/Sanity | permissions, secrets, unpinned actions |
| `.github/workflows/daily-health-check.yml` | github_actions | Daily cron health probe | permissions, schedule, secrets |
| `.github/workflows/monitoring-health.yml` | github_actions | Monitoring health check | permissions, secrets |
| `.github/workflows/pentestagent-ci.yml` | github_actions | PentestAgent CI gate | permissions, pull_request_target |
| `.github/workflows/pentestagent-pr-check.yml` | github_actions | PentestAgent PR comment | permissions, pull_request_target, scripts injection |
| `.github/workflows/pentestagent-scheduled.yml` | github_actions | PentestAgent weekly scan | permissions, schedule, secrets |
| `.github/workflows/pr-validation.yml` | github_actions | PR validation | permissions, scripts injection |
| `.github/workflows/problem-detection-advisor.yml` | github_actions | Problem detection | permissions, scripts injection |
| `.github/workflows/react-doctor.yml` | github_actions | React quality gate | permissions, scripts injection |
| `.github/workflows/remediation-approval-gate.yml` | github_actions | Remediation approval | permissions, pull_request_target |
| `.github/workflows/security-compliance.yml` | github_actions | Security compliance | permissions, secrets |
| `.github/workflows/gitleaks.yml` | github_actions | Gitleaks (this PRD) | permissions, scripts injection, unpinned actions |
| `.github/workflows/osv-scanner.yml` | github_actions | OSV-Scanner (this PRD) | permissions, secrets |
| `.github/workflows/trivy-fs.yml` | github_actions | Trivy fs (this PRD) | permissions, unpinned actions |
| `.github/workflows/checkov.yml` | github_actions | Checkov (this PRD) | permissions, scripts injection |
| `.github/workflows/zizmor.yml` | github_actions | zizmor (this PRD) | permissions, scripts injection |
| `.github/workflows/scorecard.yml` | github_actions | Scorecard (this PRD) | permissions, scripts injection |
| `wrangler.toml` | (Checkov has no Cloudflare framework; covered by the zizmor audit) | Cloudflare Worker config | n/a |
| `studio/sanity.config.ts` | (not IaC) | Sanity Studio config | n/a |
| `next.config.mjs` | (not IaC) | Next.js config | n/a |
| `package.json` | (not IaC; dependency manifest) | npm manifest | n/a |

## Frameworks not present

| Framework | Used? | Why not |
|-----------|-------|---------|
| Kubernetes manifests | No | Deploy target is Cloudflare Workers, not K8s |
| Terraform | No | Cloudflare config is in wrangler.toml, not Terraform |
| CloudFormation | No | AWS is not used |
| ARM / Bicep | No | Azure is not used |
| OpenAPI | No | The portfolio does not expose a public REST API |
| Dockerfiles | No (currently) | The deploy is serverless; if a Dockerfile is added, Checkov will scan it automatically |

## Checkov's dockerfile framework

Checkov's dockerfile framework is enabled by default in `.checkov.yaml`. There are no Dockerfiles in the repo today; the framework is enabled defensively in case one is added. The first run with no Dockerfiles will pass with 0 dockerfile findings.

## How to add a new IaC file

1. Add the file under the appropriate directory (`.github/workflows/` for actions, the repo root for a Dockerfile, etc.)
2. If the file is a new framework (e.g. the first Terraform file), update `.checkov.yaml` to remove the framework from `skip-framework`.
3. Run `checkov -d . --file <path>` locally to verify the new file is scanned
4. Update the table above
5. Open a PR; the Checkov workflow will run on it
