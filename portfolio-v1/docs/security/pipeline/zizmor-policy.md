# zizmor Findings Policy

This document is the canonical answer to "what does zizmor check, and how do we handle its findings?" Every zizmor audit has a known mitigation; this document maps each audit to the policy.

## The zizmor audit catalog

zizmor runs dozens of audits, grouped by attack class:

### Template injection (the most severe class)

- `template-injection`: a `${{ ... }}` expression is used inside a `run:` block or `script:` block where its expansion is treated as code. The expanded value can contain attacker-influenced content (e.g. `github.event.issue.body`), which is then executed by the shell or by Node.
- **Policy**: never expand a `${{ ... }}` expression in a `run:` or `script:` block. Pass the value through `env:` first, then reference the env var in the script (`$VAR` for shell, `process.env.VAR` for Node).

### Pinned dependencies

- `unpinned-uses`: an action is referenced by tag (`@v1`) or by branch (`@main`), not by a commit SHA. A tag or branch can be re-pointed (see `tj-actions` March 2025).
- **Policy**: every third-party `uses:` is pinned to a commit SHA, with a trailing comment that shows the resolved tag for human readability. Renovate or Dependabot updates the SHA; the comment changes too.

### Excessive permissions

- `excessive-permissions`: a workflow has more permissions than it uses. This is the surface that `trivy-action`'s March 2026 attackers exploited.
- **Policy**: every workflow declares an explicit `permissions:` block at the workflow level. The block is the minimum the workflow needs. Granting `write` requires a written reason in a code comment.

### Dangerous triggers

- `pull_request_target`: a workflow that uses `pull_request_target` and checks out the PR's code can be tricked into running attacker-controlled code with the workflow's permissions and secrets.
- `workflow_run`: a workflow that triggers on `workflow_run` from an untrusted workflow can inherit that workflow's permissions.
- **Policy**: `pull_request_target` is banned unless accompanied by a written justification in the workflow header. The portfolio has no `pull_request_target` workflows.

### Impostor commits

- `impostor-commit`: a workflow checks out a commit by ref without verifying the commit's signature. The attacker can substitute a different commit at the same ref.
- **Policy**: every checkout uses `persist-credentials: false` to prevent the runner's `GITHUB_TOKEN` from being persisted in the local git config. Actions that need to push use a short-lived deploy key or the OIDC token, not the persisted GITHUB_TOKEN.

### Concurrency

- `concurrency-missing`: a workflow can run multiple in-flight runs of the same job, which can race against itself (e.g. two cron runs of the same workflow, two push triggers).
- **Policy**: every workflow declares a `concurrency:` block. The group name is per-ref; `cancel-in-progress` is `false` for cron workflows (to preserve audit trails) and `true` for interactive workflows (e.g. the approval gate).

## Suppressions

zizmor has no built-in suppression mechanism. The "fix, don't suppress" policy is the only policy. This is intentional: every zizmor finding is a real attack surface. If a finding cannot be fixed, the workflow must be redesigned.

If a finding is genuinely inapplicable, the resolution is one of:

1. Refactor the workflow so the pattern doesn't apply (e.g. move `${{ }}` into `env:`)
2. Remove the workflow entirely
3. Accept the finding and document the risk in this file (with an expiry date)

There are no current "accept the finding" entries.

## How to fix the most common findings

### `template-injection`

```yaml
# Bad
- name: Read PR number
  run: |
    PR=${{ github.event.pull_request.number }}
    echo "PR is $PR"

# Good
- name: Read PR number
  env:
    PR: ${{ github.event.pull_request.number }}
  run: |
    echo "PR is $PR"
```

### `unpinned-uses`

```yaml
# Bad
- uses: actions/checkout@v4

# Good
- uses: actions/checkout@34e114876b0b11c390a56381ad16ebd13914f8d5 # v4.2.2
```

The trailing comment is for humans only; the SHA is what GitHub resolves.

### `excessive-permissions`

```yaml
# Bad (or missing)
permissions: write-all

# Bad
permissions:
  contents: write
  issues: write
  pull-requests: write
  # workflow only needs contents: read

# Good
permissions:
  contents: read
```

### `concurrency-missing`

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

## How to re-run locally

```bash
# Install: https://github.com/zizmorcore/zizmor
zizmor --persona=auditor .github/workflows/*.yml
```

For SARIF output: `--format=sarif --output=zizmor.sarif`. For GitHub-annotation output (used in pre-commit): `--format=github`.

## How to read the SARIF

The zizmor-action uploads to the Security > Code Scanning tab with `tool=zizmor`. The Code Scanning UI shows:

- The rule ID (e.g. `unpinned-uses`, `template-injection`)
- The file and line
- The description and remediation hint
- The audit confidence (Low, Medium, High)

## Related documents

- `docs/security/pipeline.md` - the seven-stage gate
- `docs/security/pipeline/audit.md` - workflow audit baseline
- `.github/workflows/zizmor.yml` - the workflow
