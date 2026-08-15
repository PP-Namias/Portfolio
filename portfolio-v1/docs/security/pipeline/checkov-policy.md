# Checkov Skip/Fix Policy

This document is the canonical answer to "why is this Checkov finding suppressed?" Every skip, every global config choice, and every decision lives here.

## The two ways to skip a Checkov finding

1. **Global skip in `.checkov.yaml`** (`skip-check: [CKVx_Y]`): applies to the whole repo. Used only for checks that are genuinely inapplicable to every file in the repo.
2. **Inline skip comment** (`# checkov:skip=CKVx_Y:Justification`): applies to a single resource, on the line of the finding. Used for per-file, per-resource exceptions.

Both mechanisms require a written justification. Suppressions without a reason are not allowed and will be reverted.

## When to skip vs when to fix

- **Fix** is the default. If the finding is real and the remediation is small, fix the source.
- **Skip with reason** is acceptable when:
  - The check is genuinely inapplicable to this codebase (e.g. CKV_SECRETS_1 on a file that legitimately holds a non-secret literal)
  - The finding is a known false positive for a specific pattern (e.g. a documented placeholder in a test fixture)
  - The check's remediation would break a documented constraint (e.g. a workflow that must `pull-requests: write` to comment on a PR)
- **Skip without reason** is never acceptable. If you can't write the reason, you can't suppress the finding.

## Current global skips

| Check ID | Reason | Documented in |
|----------|--------|---------------|
| `CKV2_GHA_1` | "GitHub Action workflows must use minimal permissions" - the check is too broad for workflows that need a specific write scope (e.g. `pull-requests: write` to comment on a PR). We enforce minimum permissions manually in every workflow file with an explicit `permissions:` block. The check would false-positive on every workflow that needs to write a single scope. | `.checkov.yaml` |

## Current inline skips

| File | Line | Check ID | Reason | Expires |
|------|------|----------|--------|---------|
| (none) | | | | |

## How to add an inline skip

For a single finding on a specific line:

```yaml
some-resource:
  # checkov:skip=CKV_AWS_53:S3 bucket is public for static site hosting
  public_access: true
```

Or for a multi-line resource:

```yaml
some-resource:
  # checkov:skip=CKV_AWS_53:S3 bucket is public for static site hosting
  # checkov:skip=CKV_AWS_18:S3 bucket access is logged via CloudFront
  public_access: true
  logging: enabled
```

The reason is on the same line as the skip directive, after the colon. The reason is part of the inline annotation; Checkov does not enforce a specific format, but the format used here is the one reviewers will look for.

## How to add a global skip

1. Add the check ID to `skip-check:` in `.checkov.yaml`
2. Add a one-line comment in `.checkov.yaml` explaining why the check is globally skipped
3. Add an entry to the "Current global skips" table above
4. Open a PR; the Checkov workflow will run on it
5. Reviewers must approve the skip explicitly

## Review cadence

Every skip (global or inline) is reviewed annually as part of the Checkov baseline refresh. If a skip is no longer needed, it is removed. Skips that survive review have their `Expires` date pushed forward by one year.

## How to read the SARIF

The Checkov workflow uploads the SARIF to the Security > Code Scanning tab. The Code Scanning UI shows:

- The rule ID (the CKV_xxx number)
- The file and line
- The description and remediation hint
- The framework (github_actions, dockerfile, etc.)

## How to re-run locally

```bash
checkov -d . --config-file .checkov.yaml --output cli --output json --output-file-path console,checkov.json
```

For SARIF output (matches the CI artifact): `--output sarif --output-file-path checkov.sarif`.

## Related documents

- `docs/security/pipeline/iac-inventory.md` - the IaC surface that Checkov scans
- `.checkov.yaml` - the global config
- `.github/workflows/checkov.yml` - the workflow
