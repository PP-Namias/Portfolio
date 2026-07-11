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
- **Action**: `google/osv-scanner-action` (called as a reusable workflow)
- **Config**: `osv-scanner.toml`
- **Workflow**: `.github/workflows/osv-scanner.yml`

**Why both OSV-Scanner and Trivy**: OSV.dev is fed by the projects' own security teams and is more current for first-party language advisories (npm, Go, Rust, PyPI). Trivy is more current for distro-level CVEs. We run both because they catch different things. See `docs/security/pipeline/osv-baseline.md` for the full rationale and triage workflow.

**Trigger matrix**: `pull_request`, `push` to `main`, weekly Monday 07:00 UTC cron (full-history re-scan), and `workflow_dispatch`.

**Failure handling**: Findings are uploaded to the Security > Code Scanning tab with `tool=osv-scanner`. SARIF output is preserved. The workflow fails the build on any finding; the `fail-on-vuln: true` input to the reusable workflow enforces this.

**Triage policy**: Every finding is triaged in `docs/security/pipeline/osv-baseline.md`. Ignores require a written reason and an `expired_at` date in `osv-scanner.toml`; the expiry forces a re-review.

**Configuration surface**: `osv-scanner.toml` defines the lockfile paths and the ignore list. The workflow passes `--config=osv-scanner.toml` and `-r ./` to the scanner.

### 3. Trivy

- **Stage**: Build (filesystem) and pre-push (image)
- **Purpose**: Scan the source filesystem and the built container image for CRITICAL/HIGH CVEs
- **Catches**: Vulnerable OS packages, application dependencies with known CVEs, misconfigured image layers
- **Cost**: Free, open source, runs in <2min on a typical Next.js image
- **Action**: `aquasecurity/trivy-action`
- **Workflow**: `.github/workflows/trivy-fs.yml` and SBOM embedded in `cloudflare-deploy.yml`

**Why filesystem scan, not image scan**: The portfolio deploys as a Cloudflare Worker (serverless). There is no container image to scan. The source-tree filesystem scan (`.github/workflows/trivy-fs.yml`) is the equivalent CVE gate; the SBOM step in `cloudflare-deploy.yml` is the artifact inventory used for incident response. If the deploy target changes to a container, a new `.github/workflows/trivy-image.yml` would be added; it would be a copy of the fs workflow with `scan-type: image` and a `image-ref` input.

**Trigger matrix**: `pull_request`, `push` to `main`, weekly Monday 08:00 UTC cron, and `workflow_dispatch`.

**Severity policy**: `CRITICAL,HIGH` only. `MEDIUM` and `LOW` are not gating. They are visible in the SARIF but do not block merges. The OSV-Scanner workflow is the authoritative source for npm CVEs; the Trivy fs scan adds the distro-CVE layer.

**Failure handling**: The workflow runs the SARIF step with `exit-code: "0"` and `continue-on-error: true` so the SARIF is always uploaded even if the table step (which fails on findings) fails. The table step uses `exit-code: "1"` to gate the build.

**Ignore policy**: `.trivyignore` at the repo root. Every ignore must have a written reason and an expiry date. After the expiry, the ignore is removed and the CVE will fail the build again. This is the "no forever-ignores" rule.

### 4. zizmor

- **Stage**: PR (workflow files only)
- **Purpose**: Audit the workflows themselves for the exact flaws behind `trivy-action` and `tj-actions`
- **Catches**: `pull_request_target` misuse, `${{ github.event.* }}` in `run:` blocks, actions pinned to tags, implicit write-all permissions, missing concurrency groups, impostor commits, persisted credentials
- **Cost**: Free, open source, runs in <10s on 19 workflows
- **Action**: `zizmorcore/zizmor-action`
- **Config**: none (zizmor has no config file; all rules are enabled by default with persona=auditor)
- **Workflow**: `.github/workflows/zizmor.yml`

**Trigger matrix**: `pull_request`, `push` to `main`, weekly Monday 10:00 UTC cron, and `workflow_dispatch`.

**Audit catalog**: zizmor runs dozens of audits grouped by attack class. The full policy is in `docs/security/pipeline/zizmor-policy.md`. Key audits: `template-injection`, `unpinned-uses`, `excessive-permissions`, `pull_request_target-misconfiguration`, `concurrency-missing`, `impostor-commit`, `forbidden-uses`.

**Failure handling**: Findings are uploaded to the Security > Code Scanning tab with `tool=zizmor`. The workflow fails the build on any finding at HIGH confidence. LOW and MEDIUM confidence findings are visible in the SARIF but do not gate the build (to reduce noise on stylistic issues).

**Suppression policy**: zizmor has no built-in suppression mechanism. "Fix, don't suppress" is the only policy. If a finding is genuinely inapplicable, the workflow must be redesigned or removed. The full policy is in `docs/security/pipeline/zizmor-policy.md`.

**Why zizmor over alternatives**: zizmor is the only static analyzer that covers the full attack surface of GitHub Actions workflows. Checkov's `github_actions` framework overlaps on `unpinned-uses` and a few `excessive-permissions` checks, but zizmor is more comprehensive on `template-injection` and `pull_request_target`. We run both.

### 5. Checkov

- **Stage**: PR and push to main
- **Purpose**: Static analysis of IaC: GitHub Actions workflows and Dockerfiles
- **Catches**: Public buckets, security groups open to `0.0.0.0/0`, missing encryption, unencrypted secrets in workflows, unpinned actions in workflows, dangerous workflow patterns
- **Cost**: Free, open source, runs in <1min on this repo size
- **Action**: `bridgecrewio/checkov-action`
- **Config**: `.checkov.yaml`
- **Workflow**: `.github/workflows/checkov.yml`

**Surface area**: 18 GitHub Actions workflows and any Dockerfile in the repo. See `docs/security/pipeline/iac-inventory.md` for the full enumeration. Frameworks not used by this repo (kubernetes, terraform, cloudformation, arm, bicep, openapi) are explicitly skipped to reduce noise.

**Trigger matrix**: `pull_request`, `push` to `main`, weekly Monday 09:00 UTC cron, and `workflow_dispatch`.

**Failure handling**: Output is CLI + SARIF. SARIF is uploaded to the Security > Code Scanning tab with `tool=checkov`. The CLI table is the run-log output.

**Skip policy**: Two mechanisms (global `.checkov.yaml` and inline `# checkov:skip=...:reason`) - both require a written reason. The full policy is in `docs/security/pipeline/checkov-policy.md`. The one current global skip is `CKV2_GHA_1` ("minimal permissions" check), with a written reason: the check is too broad for workflows that legitimately need a specific write scope, and we enforce minimum permissions manually in every workflow file.

**Complementarity with zizmor**: Checkov and zizmor overlap on workflow-file security (both flag unpinned actions, dangerous triggers, etc.). zizmor is more comprehensive on the workflow-file-specific attack patterns (template injection, pull_request_target misuse, etc.). Checkov is more comprehensive on the broader IaC surface (Dockerfile, Terraform, etc.). We run both.

### 6. Cosign

- **Stage**: Post-build, pre-deploy
- **Purpose**: Keyless signing and verification of build artifacts, backed by Sigstore Fulcio. Binds the artifact to the OIDC identity of the GitHub Actions workflow that built it
- **Catches**: Substituted or tampered artifacts between build and deploy, compromised runners
- **Cost**: Free, open source, no key management overhead (keyless)
- **Action**: `sigstore/cosign-installer` + `cosign` CLI
- **Config**: Embedded in `cloudflare-deploy.yml`

**Trigger**: only `cloudflare-deploy.yml` (on push to main and on `workflow_dispatch`). Other workflows do not produce deployable artifacts.

**What is signed**: the SBOM, not a container image. Cloudflare Workers is a serverless runtime with no container; the SBOM is the next-best audit trail. If a future deploy target is a container, the image would also be signed with `cosign sign --keyless` and a verify step would be added.

**Identity model**: the signing certificate is bound to the OIDC identity of the GitHub Actions workflow. The expected identity is `https://github.com/PP-Namias/Portfolio/.github/workflows/cloudflare-deploy.yml@refs/heads/main`. Verification requires the SBOM, the signature, the certificate, and a knowledge of the expected identity. No key, no secret, no KMS.

**Failure handling**: a Cosign verification failure is a security event, not a config issue. The full policy is in `docs/security/pipeline/signing.md`. There is no "ignore the failure" path.

**Transparency log**: every signing event is recorded in Sigstore Rekor. The cert, when verified, includes a Rekor inclusion proof. This is the public audit trail.

### 7. Scorecard

- **Stage**: Weekly schedule and on-demand
- **Purpose**: Score the repo's security posture from 0 to 10 across 18 checks (dangerous workflow, token permissions, dependency update tool, branch protection, pinned dependencies, etc.)
- **Catches**: Aggregate posture issues that no single check catches
- **Cost**: Free, open source, runs in <2min on this repo size
- **Action**: `ossf/scorecard-action`
- **Workflow**: `.github/workflows/scorecard.yml`

**Trigger matrix**: `branch_protection_rule` (re-evaluate when branch rules change), weekly Monday 04:00 UTC cron, and `workflow_dispatch`.

**Failure handling**: SARIF uploaded to the Security > Code Scanning tab with `tool=scorecard`. The workflow does not gate PRs or pushes; it is informational. The score trend (over weeks) is the signal, not the absolute score on any single run.

**Baseline and improvement plan**: `docs/security/pipeline/scorecard-baseline.md`. Reviewed quarterly. Drops in any check are treated as regressions and addressed in the same PR if possible.

**Complementarity with the other tools**: Scorecard is the only tool in the seven-stage gate that gives an aggregate score. The other tools gate on specific findings; Scorecard gives a posture view. We rely on Scorecard to catch the patterns that the other tools miss (e.g. missing branch protection, missing SECURITY.md, missing dependency update tool).

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
- `docs/security/pipeline/osv-baseline.md` - OSV-Scanner baseline and triage
- `docs/security/pipeline/signing.md` - Cosign keyless signing policy
- `docs/security/pipeline/scorecard-baseline.md` - Scorecard baseline and improvement plan
- `docs/security/pipeline/checkov-policy.md` - Checkov skip/fix policy
- `docs/security/pipeline/iac-inventory.md` - IaC surface inventory
- `docs/security/pipeline/zizmor-policy.md` - zizmor findings policy
- `.agents/skills/ci-cd-security/SKILL.md` - agent skill for the pipeline
- `prd.ci-cd-security.json` - the PRD that plans this work
