# GitHub Actions CI/CD Pipeline

Automated workflows for code quality, security, and monitoring.

## Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| [build.yml](workflows/build.yml) | Push to `main`, PRs | Lint, type check, build, tests |
| [pr-validation.yml](workflows/pr-validation.yml) | PRs to `main` | Quality checks + security audit + PR comment |
| [daily-health-check.yml](workflows/daily-health-check.yml) | Daily 6 AM UTC, manual | Full health check (lint, build, tests, audit) |
| [monitoring-health.yml](workflows/monitoring-health.yml) | Every 6 hours, manual | Site uptime + SSL certificate monitoring |
| [security-compliance.yml](workflows/security-compliance.yml) | Push, PRs, weekly, manual | Dependency audit + CodeQL analysis |

## Dependencies

- **Dependabot** ([dependabot.yml](dependabot.yml)): Daily patch/minor updates, ignores major versions

## Required Setup

No additional secrets are needed beyond the default `GITHUB_TOKEN`. Deployment is handled by **AWS Amplify** (configured in `amplify.yml`), not GitHub Actions.

## Local Commands

```bash
npm run dev      # Dev server
npm run build    # Production build
npm run lint     # ESLint
npm test         # Vitest (129 tests)
```

## Troubleshooting

```bash
# Locally replicate what CI runs:
npm ci
npm run lint
npx tsc --noEmit
npm run build
npm test
```
