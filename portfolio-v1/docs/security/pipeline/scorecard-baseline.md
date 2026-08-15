# Scorecard Baseline and Improvement Plan

This document is the canonical answer to "what is the current Scorecard score, and how do we improve it?" The workflow runs weekly on a Monday 04:00 UTC cron. Every run, every score, and every improvement plan lives here.

## What Scorecard measures

OpenSSF Scorecard evaluates a repository against 18 security checks:

| Check | What it measures |
|-------|------------------|
| Binary-Artifacts | Are binary artifacts checked into the repo? |
| Branch-Protection | Is the default branch protected? |
| CI-Tests | Do PRs run tests before merge? |
| Code-Review | Are PRs reviewed before merge? |
| Contributing | Is there a CONTRIBUTING file? |
| Dangerous-Workflow | Do workflows use dangerous patterns (`pull_request_target`, script injection, etc.)? |
| Dependency-Update-Tool | Is a tool like Dependabot or Renovate enabled? |
| Fuzzing | Is the project fuzzed? |
| License | Is there a LICENSE file? |
| Pinned-Dependencies | Are dependencies pinned to a digest/SHA? |
| SAST | Is static analysis run? |
| Security-Policy | Is there a SECURITY.md? |
| Signed-Releases | Are releases signed? |
| Token-Permissions | Are workflow permissions minimal? |
| Vulnerabilities | Are there open vulnerabilities? |
| Webhooks | Are webhooks validated? |
| Maintained | Is the project actively maintained? |
| SAST (continued) | (continued) |

The portfolio gets a score from 0 to 10 in each check. The aggregate score is the average, weighted by the check's importance.

## Baseline (at the time of writing)

The workflow has been added but has not yet run on a real push. The first run on the next scheduled scan will establish the baseline. Add the per-check scores to the table below.

| Date | Score | Notable findings |
|------|-------|------------------|
|      |       |                  |

## Expected strong checks (post-PR)

These checks should score high after the ci-cd-security PRD lands:

- **Binary-Artifacts**: 10 (no binaries in the repo)
- **Branch-Protection**: 10 (default branch requires reviews, status checks, and no force-push)
- **CI-Tests**: 10 (PR Validation workflow runs vitest)
- **Code-Review**: 10 (PRs require at least one approval)
- **Contributing**: 10 (CONTRIBUTING.md exists)
- **Dangerous-Workflow**: 10 (no `pull_request_target`; `${{ }}` in `run:` blocks routed through `env:`; zizmor workflow enforces this)
- **Dependency-Update-Tool**: 10 (Dependabot enabled in `.github/dependabot.yml`)
- **License**: 10 (MIT LICENSE exists)
- **Pinned-Dependencies**: 10 (every `uses:` is pinned to a SHA; this PRD added explicit pinning to the audit)
- **Token-Permissions**: 10 (every workflow has an explicit `permissions:` block; this PRD added `id-token: write` only where needed)
- **Vulnerabilities**: depends on the npm audit result; OSV-Scanner and Trivy workflows catch issues

## Expected weak checks (improvement plan)

- **Fuzzing**: 0-3. Fuzzing is not set up. Adding it is a non-trivial commitment (choose a fuzzer, set up CI integration, write fuzz targets). Defer until a real security incident motivates it.
- **Signed-Releases**: 0. The portfolio does not have releases (no tagged versions, no release notes). The SBOM is signed with Cosign, which is a different kind of signing. If a release process is added in the future, releases should be signed.
- **SAST**: 9-10. The repo has Trivy fs + OSV-Scanner + Checkov + zizmor + Gitleaks. Scorecard's SAST check looks for any of these; this PRD's pipeline should pass.
- **Webhooks**: 10. No webhooks are configured.

## How to read the SARIF

The Scorecard workflow uploads `results.sarif` to the Security > Code Scoring tab. The Code Scanning UI shows:

- The check name (e.g. `Dangerous-Workflow`, `Token-Permissions`)
- The score (0-10)
- The reason for the score
- A link to the Scorecard documentation for that check

The aggregate score is also published as a step summary in the workflow run.

## How to re-run locally

```bash
# Install: https://github.com/ossf/scorecard
scorecard --repo=github.com/PP-Namias/Portfolio --format=table
```

For JSON output: `--format=json --output=scorecard.json`. For SARIF output (matches the CI artifact): `--format=sarif --output=scorecard.sarif`.

## How to improve a specific check

1. Look up the check in the [Scorecard documentation](https://scorecard.dev/viewer/).
2. The doc page lists the failure mode and the remediation.
3. Apply the remediation, open a PR, the Scorecard workflow re-runs and updates the score.

## Review cadence

The Scorecard baseline is reviewed quarterly. Trends (over 12 weeks) are more important than absolute scores. A drop in any check is treated as a regression and must be addressed in the same PR if possible, or in a follow-up issue.

## Related documents

- `docs/security/pipeline.md` - the seven-stage gate
- `.github/workflows/scorecard.yml` - the workflow
