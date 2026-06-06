# CI/CD Security Pipeline

The portfolio's CI/CD pipeline is hardened against the specific class of supply-chain attacks that hit `trivy-action` in March 2026 and `tj-actions` in March 2025: compromised third-party GitHub Actions, template injection in workflows, hardcoded secrets in commits, vulnerable dependencies, and unsigned build artifacts.

This document describes the seven-stage security gate and the rationale for each tool.

## Motivating incidents

### trivy-action (March 2026)

Attackers exploited a `pull_request_target` misconfiguration in the `trivy-action` GitHub Action. The misconfiguration allowed the action to read repository secrets from the workflow's environment. The attackers exfiltrated organization secrets and used them to backdoor `LiteLLM` on PyPI.

Root causes:
- `pull_request_target` triggered with untrusted PR code
- Workflow secrets exposed to the action's execution context
- No artifact signing to detect a substituted build

### tj-actions (March 2025)

A widely-used GitHub Action (`tj-actions/changed-files`) was compromised via a tag re-point attack. The attacker pushed a malicious commit to the action's tag, which was then pulled by every workflow that referenced `@v1` or similar floating tags. The malicious code exfiltrated runner secrets and printed them in workflow logs.

Root causes:
- Third-party actions pinned to floating tags, not commit SHAs
- No workflow-file linting to catch dangerous patterns
- No artifact signing to detect a substituted build

## The seven-stage gate

Every PR and every push to `main` runs through these seven stages. Any HIGH or CRITICAL finding blocks the merge or the deploy.

```
PR opened / push to main
        |
        v
+-------------------+
| 1. Gitleaks       |  secrets in commits and git history
+-------------------+
        |
        v
+-------------------+
| 2. OSV-Scanner    |  known CVEs in npm dependencies
+-------------------+
        |
        v
+-------------------+
| 3. Trivy (fs)     |  CRITICAL CVEs in the source tree
+-------------------+
        |
        v
+-------------------+
| 4. zizmor         |  workflow-file security (template
|                   |  injection, unpinned actions, dangerous
|                   |  triggers, excess permissions)
+-------------------+
        |
        v
+-------------------+
| 5. Checkov        |  IaC misconfigs (wrangler.toml,
|                   |  workflows, Dockerfiles)
+-------------------+
        |
        v
+-------------------+
| 6. Build + Trivy  |  CRITICAL CVEs in the container image
|    (image) +      |  before it is pushed to the registry
|    Cosign sign    |  and signed with the workflow's OIDC
|                   |  identity (keyless, Sigstore Fulcio)
+-------------------+
        |
        v
+-------------------+
| 7. Cosign verify  |  the deploy job verifies the artifact
|    + Scorecard    |  signature matches the expected
|                   |  workflow identity, then Scorecard
|                   |  records the repo's posture score
+-------------------+
        |
        v
     Deploy / Merge allowed
```

## Tools

### 1. Gitleaks

- **Stage**: Pre-commit and PR
- **Purpose**: Scan commits and full git history for hardcoded secrets (200+ rule types)
- **Catches**: API keys, tokens, passwords, private keys in source or history
- **Cost**: Free, open source, runs in <30s on this repo size
- **Action**: `gitleaks/gitleaks-action`
- **Config**: `.gitleaks.toml`
- **Workflow**: `.github/workflows/gitleaks.yml`

**Trigger matrix**: `pull_request` (all branches), `push` to `main`, weekly Monday 06:00 UTC cron (full-history re-scan), and `workflow_dispatch` for manual runs.

**Detection surface**: 200+ default rules from the Gitleaks ruleset covering AWS, GitHub, GitLab, Slack, Stripe, Google, OpenAI, generic private keys, generic API keys, and many more. The workflow uses `fetch-depth: 0` on checkout so the action sees the full git history, not just HEAD - this is critical for catching secrets that were removed from the working tree but still exist in older commits.

**Failure handling**: On a finding, the job exits non-zero and the SARIF and JSON reports are uploaded as workflow artifacts with 14-day retention. The default branch protection rule on `main` is set to require this check.

**False-positive policy**: The allowlist in `.gitleaks.toml` is intentionally minimal. It covers:
- The `tests/fixtures/gitleaks/` path, which contains a planted-secret fixture used to verify the workflow
- Doc-only placeholders (`EXAMPLE_API_KEY`, `<YOUR_*>`, etc.)
- The Sanity studio's local-only `projectId="development"` literal

Every allowlist entry has a one-line comment in the TOML explaining why it is allowlisted. Adding a new entry requires updating that comment.

**Tested**: `src/__tests__/gitleaks-fixture.test.ts` asserts the config file exists, the allowlist has a description, the planted fixture contains the documented secret patterns, and the planted fixture path is correctly covered by the allowlist regex.

### 2. OSV-Scanner

- **Stage**: PR and push to main
- **Purpose**: Match `package-lock.json` against OSV.dev (30+ ecosystems) and print the minimal fix version for every CVE
- **Catches**: Known CVEs in npm dependencies (direct and transitive)
- **Cost**: Free, open source, API-backed
- **Action**: `google/osv-scanner-action`
- **Workflow**: `.github/workflows/osv-scanner.yml`

### 3. Trivy

- **Stage**: Build (filesystem) and pre-push (image)
- **Purpose**: Scan the source filesystem and the built container image for CRITICAL/HIGH CVEs
- **Catches**: Vulnerable OS packages, application dependencies with known CVEs, misconfigured image layers
- **Cost**: Free, open source, runs in <2min on a typical Next.js image
- **Action**: `aquasecurity/trivy-action`
- **Workflow**: `.github/workflows/trivy-fs.yml` and embedded in `cloudflare-deploy.yml`

### 4. zizmor

- **Stage**: PR (workflow files only)
- **Purpose**: Audit the workflows themselves for the exact flaws behind `trivy-action` and `tj-actions`
- **Catches**: `pull_request_target` misuse, `${{ github.event.* }}` in `run:` blocks, actions pinned to tags, implicit write-all permissions
- **Cost**: Free, open source, runs in <10s on 12 workflows
- **Action**: `woodruffw/zizmor-action`
- **Workflow**: `.github/workflows/zizmor.yml`

### 5. Checkov

- **Stage**: PR and push to main
- **Purpose**: Static analysis of IaC: Terraform, Dockerfiles, Kubernetes manifests, GitHub Actions workflows, and Cloudflare wrangler config
- **Catches**: Public S3 buckets, security groups open to `0.0.0.0/0`, missing encryption, unencrypted secrets in workflows
- **Cost**: Free, open source, runs in <1min on this repo size
- **Action**: `bridgecrewio/checkov-action`
- **Workflow**: `.github/workflows/checkov.yml`

### 6. Cosign

- **Stage**: Post-build, pre-deploy
- **Purpose**: Keyless signing and verification of build artifacts, backed by Sigstore Fulcio. Binds the artifact to the OIDC identity of the GitHub Actions workflow that built it
- **Catches**: Substituted or tampered artifacts between build and deploy, compromised runners
- **Cost**: Free, open source, no key management overhead (keyless)
- **Action**: `sigstore/cosign-installer` + `cosign` CLI
- **Config**: Embedded in `cloudflare-deploy.yml`

### 7. Scorecard

- **Stage**: Weekly schedule and on-demand
- **Purpose**: Score the repo's security posture from 0 to 10 across 18 checks (dangerous workflow, token permissions, dependency update tool, branch protection, pinned dependencies, etc.)
- **Catches**: Aggregate posture issues that no single check catches
- **Cost**: Free, open source, runs in <2min on this repo size
- **Action**: `ossf/scorecard-action`
- **Workflow**: `.github/workflows/scorecard.yml`

## Threat model

Five scenarios, each tied to a real incident:

| ID | Scenario | Defended by |
|----|----------|-------------|
| TM-1 | `trivy-action` style attack on this repo | zizmor + cosign + Gitleaks |
| TM-2 | `tj-actions` style supply-chain attack | cosign + Trivy |
| TM-3 | Hardcoded secret pushed to a public branch | Gitleaks (PR scan + full-history scan) |
| TM-4 | Vulnerable dependency merged | OSV-Scanner + Trivy filesystem |
| TM-5 | Misconfigured Cloudflare Workers deploy | Checkov + zizmor + cosign |

## Pre-requisites (already in place)

Before any of the seven tools were added, the existing pipeline was hardened:

- **S-0.1**: Every workflow audited (see `docs/security/pipeline/audit.md`)
- **S-0.2**: Every third-party action pinned to a commit SHA (not a floating tag)
- **S-0.3**: Every workflow declares minimum permissions explicitly

## Related documents

- `docs/security/pipeline/audit.md` - workflow audit baseline
- `docs/security/pipeline/signing.md` - Cosign keyless signing policy
- `docs/security/pipeline/scorecard-baseline.md` - Scorecard baseline and improvement plan
- `docs/security/pipeline/osv-baseline.md` - OSV-Scanner baseline and triage
- `docs/security/pipeline/checkov-policy.md` - Checkov skip/fix policy
- `docs/security/pipeline/iac-inventory.md` - IaC surface inventory
- `.agents/skills/ci-cd-security/SKILL.md` - agent skill for the pipeline
- `prd.ci-cd-security.json` - the PRD that plans this work
