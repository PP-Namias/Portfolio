# Skill: ci-cd-security

Use when asked to add, modify, debug, or re-run any of the seven security tools in the portfolio's CI/CD pipeline. Covers Gitleaks, OSV-Scanner, Trivy, Checkov, zizmor, Cosign, and Scorecard.

## When to use this skill

- A workflow check failed and you need to interpret the error
- You need to add a new workflow without breaking the gate
- You need to re-run a security check locally
- You need to update a third-party action version (pin to SHA, not tag)
- You need to suppress a false positive with documented justification
- You need to verify a deploy artifact's signature before deploy
- You need to read the Scorecard report and find which checks can be improved

## The seven tools at a glance

| Tool | Stage | Catches | Workflow file |
|------|-------|---------|---------------|
| Gitleaks | PR + history | Hardcoded secrets, API keys, tokens | `.github/workflows/gitleaks.yml` |
| OSV-Scanner | PR + push to main | Known CVEs in npm dependencies | `.github/workflows/osv-scanner.yml` |
| Trivy (fs) | PR | CRITICAL CVEs in source tree | `.github/workflows/trivy-fs.yml` |
| Trivy (image) | Pre-push | CRITICAL CVEs in container image | embedded in `cloudflare-deploy.yml` |
| zizmor | PR | Template injection, unpinned actions, dangerous triggers | `.github/workflows/zizmor.yml` |
| Checkov | PR | IaC misconfigs (wrangler, workflows, Dockerfiles) | `.github/workflows/checkov.yml` |
| Cosign | Post-build, pre-deploy | Substituted or tampered artifacts | embedded in `cloudflare-deploy.yml` |
| Scorecard | Weekly | Aggregate repo posture (0-10) | `.github/workflows/scorecard.yml` |

Full rationale: `docs/security/pipeline.md`.

## Pre-requisites (already in place)

Before any of the seven tools were added, the pipeline was hardened:

- Every third-party action is pinned to a commit SHA (not a floating tag)
- Every workflow declares explicit `permissions:` at the workflow level
- The audit baseline is in `docs/security/pipeline/audit.md`

If you add a new workflow, follow the same patterns.

## How to add a new workflow

1. Pin every `uses:` to a commit SHA, not a tag. Use the GitHub API to resolve: `https://api.github.com/repos/<owner>/<repo>/git/refs/tags/<tag>` returns the commit SHA.
2. Add an explicit `permissions:` block. Default to `contents: read`. Grant `write` only for the specific scope you need (e.g., `pull-requests: write` to comment on PRs, `issues: write` to file issues).
3. If the workflow is one of the seven tools, follow the canonical workflow file in this skill's "How to re-run locally" section.
4. If the workflow is new, add an entry to the audit document.
5. Verify the workflow passes on a test PR before relying on it for the gate.

## How to re-run each tool locally

### Gitleaks

```bash
# Install: https://github.com/gitleaks/gitleaks/releases
gitleaks detect --source . --report-path gitleaks.json --redact
```

Exit code 0 = no findings. Exit code 1 = findings. Use `--no-banner` to suppress the banner.

### OSV-Scanner

```bash
# Install: https://github.com/google/osv-scanner/releases
osv-scanner --lockfile=package-lock.json --format=table
```

For JSON output (matching the CI artifact): `--format json --output osv.json`.

### Trivy (filesystem)

```bash
# Install: https://github.com/aquasecurity/trivy/releases
trivy fs --severity CRITICAL,HIGH --exit-code 1 --no-progress .
```

### Trivy (image)

```bash
trivy image --severity CRITICAL,HIGH --exit-code 1 --no-progress <image-ref>
```

To build the image first: follow the steps in `cloudflare-deploy.yml` (use the same Dockerfile and build args).

### zizmor

```bash
# Install: https://github.com/woodruffw/zizmor
zizmor --persona=auditor .github/workflows/*.yml
```

Persona `auditor` is the strictest. Use `--persona=regular` for less noise.

### Checkov

```bash
# Install: https://github.com/bridgecrewio/checkov
checkov -d . --framework github_actions --framework dockerfile --framework terraform
```

For JSON output (matching the CI artifact): `--output json --output-file-path checkov.json`.

### Cosign

Cosign runs as part of the deploy workflow. To verify an already-deployed artifact:

```bash
COSIGN_EXPERIMENTAL=1 cosign verify \
  --certificate-identity-regexp 'https://github.com/PP-Namias/Portfolio' \
  --certificate-oidc-issuer 'https://token.actions.githubusercontent.com' \
  <image-ref>
```

### Scorecard

```bash
# Install: https://github.com/ossf/scorecard
scorecard --repo=github.com/PP-Namias/Portfolio --format=table
```

For JSON output (matching the CI artifact): `--format json --output scorecard.json`.

## How to interpret a failed check

### Gitleaks finding

A Gitleaks finding means a secret pattern was matched. The output shows the file, line, and the rule that matched.

- If it's a real secret: rotate the secret immediately, then remove it from git history (use `git filter-repo` or BFG).
- If it's a false positive: add an allowlist entry to `.gitleaks.toml` with a documented reason. Keep the allowlist minimal.

### OSV-Scanner finding

An OSV-Scanner finding shows the package, the installed version, the fixed version, and the CVE/GHSA ID.

- If the vulnerability is real: update the package to the fixed version (`npm update <package>` or `npm install <package>@<version>`).
- If the vulnerability is in a transitive dep you don't directly use: either update the parent dep, add an `overrides` entry in `package.json`, or document the risk and add to allowlist.

### Trivy finding

A Trivy finding shows the file, the package, and the CVE.

- If it's in `package.json` or `package-lock.json`: same as OSV-Scanner.
- If it's in the container base image: update the base image in the Dockerfile.
- If it's a misconfiguration: fix the config.

### zizmor finding

A zizmor finding is a workflow-file security issue. Common findings:

- `unpinned-uses`: an action is pinned to a tag, not a SHA. Fix: pin to SHA (see S-0.2).
- `template-injection`: `${{ github.event.* }}` is used in a `run:` block. Fix: pass the value through an `env:` variable.
- `pull_request_target-misconfiguration`: `pull_request_target` is used with code checkout. Fix: use `pull_request` instead, or split the workflow.
- `excessive-permissions`: the workflow has more permissions than it needs. Fix: tighten the `permissions:` block (see S-0.3).

For each finding, the zizmor output shows the rule ID, the file, the line, and a remediation hint. Apply the hint and re-run.

### Checkov finding

A Checkov finding shows the file, the line, the check ID (e.g., `CKV2ID-1`), and a description.

- If the finding is real: fix the underlying issue.
- If the finding is a false positive: add a `checkov:skip=CKV2ID-1:Justification` comment to the line. Every skip MUST have a one-line reason. Document the policy in `docs/security/pipeline/checkov-policy.md`.

### Cosign verification failure

A Cosign verification failure means the artifact's signature does not match the expected workflow identity. This is either:

- A genuine supply-chain attack (the artifact was substituted between build and deploy). Treat as a security incident.
- A workflow refactor that changed the OIDC identity. Update the `--certificate-identity-regexp` in the verify step.

Always treat a Cosign failure as a security event first and a config issue second.

### Scorecard drop

A Scorecard score drop means one or more of the 18 checks regressed. The Scorecard report shows which check dropped and why. Common regressions:

- A new workflow added without an explicit `permissions:` block
- A new third-party action added without a SHA pin
- A new dependency added without updating `dependabot.yml` or `renovate.json`

Fix the regression in the same PR if possible, or open a follow-up issue.

## How to add a new third-party action

1. Resolve the action's tag to a commit SHA: `https://api.github.com/repos/<owner>/<action>/git/refs/tags/<tag>`
2. Pin the SHA in the workflow: `uses: <owner>/<action>@<sha> # <tag>`
3. The trailing comment (`# <tag>`) makes the version visible to humans without affecting the resolution
4. Renovate or Dependabot will keep the SHA up to date; the comment will show the new version
5. Verify the workflow still passes on a test PR

## How to suppress a false positive

Each tool has its own suppression mechanism. Keep suppressions minimal and documented.

- **Gitleaks**: `.gitleaks.toml` allowlist with a comment explaining the reason
- **OSV-Scanner**: `osv-scanner.toml` ignore list with a comment explaining the reason
- **Trivy**: `.trivyignore` file with a comment explaining the reason
- **zizmor**: no suppression mechanism - fix the issue instead
- **Checkov**: inline `checkov:skip=CKV2ID-1:Justification` comment with a one-line reason
- **Cosign**: no suppression - verification is binary
- **Scorecard**: no suppression - fix the underlying issue

Every suppression MUST have a written reason. Suppressions without reasons are not allowed.

## Related documents

- `docs/security/pipeline.md` - the seven-stage gate overview
- `docs/security/pipeline/audit.md` - workflow audit baseline
- `docs/security/pipeline/signing.md` - Cosign keyless signing policy
- `docs/security/pipeline/scorecard-baseline.md` - Scorecard baseline and improvement plan
- `docs/security/pipeline/osv-baseline.md` - OSV-Scanner baseline and triage
- `docs/security/pipeline/checkov-policy.md` - Checkov skip/fix policy
- `docs/security/pipeline/iac-inventory.md` - IaC surface inventory
- `prd.ci-cd-security.json` - the PRD that plans this work
