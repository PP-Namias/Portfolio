# OSV-Scanner Baseline and Triage

This document is the canonical review of OSV-Scanner findings for the Namias portfolio. The workflow runs on every PR, every push to `main`, and on a weekly schedule. Every finding, every ignore, and every decision lives here.

## What OSV-Scanner does

OSV-Scanner matches `package-lock.json` against the [OSV.dev](https://osv.dev/) database, which aggregates advisories from GitHub Security Advisories, the npm Security Advisories DB, the Python Packaging Advisory DB, the Go Vulnerability DB, the Rust Advisory DB, and many more. It is the canonical source for open-source vulnerability data, and it is API-backed by the same database that GitHub's Dependabot uses.

## Why this is not a duplicate of Trivy

Trivy and OSV-Scanner overlap on CVE detection in npm dependencies, but they differ on three dimensions:

1. **Data source**: Trivy uses its own vulnerability database (NVD, multiple distro feeds). OSV-Scanner uses OSV.dev, which is fed by the projects' own security teams. OSV.dev is more current for first-party language advisories (npm, Go, Rust, PyPI); Trivy is more current for distro-level CVEs (Debian, Alpine, RHEL).
2. **Format**: OSV-Scanner produces a single, portable, machine-readable SARIF that integrates with GitHub Code Scanning. Trivy produces SARIF too, but its rule IDs are Trivy-specific.
3. **Scope**: Trivy also scans filesystem configurations (Dockerfile, Kubernetes, Terraform, etc.) and SBOMs. OSV-Scanner focuses on dependency CVEs.

We run both because they catch different things. The OSV-Scanner finding is the authoritative "is this dependency vulnerable" answer; the Trivy finding adds the "is this container image vulnerable" answer.

## Configuration

`osv-scanner.toml` at the repo root. Only `package-lock.json` is scanned. Recursive scanning is disabled (no workspaces). Ignored vulnerabilities are listed with a written reason and an `expired_at` date.

## Triage workflow

1. **On a finding**: read the advisory. The OSV-Scanner output links to the OSV.dev advisory page.
2. **Determine reachability**: is the vulnerable code path actually exercised by this app? For a portfolio site, most first-party code is server-rendered React; the attack surface is HTTP-in, not arbitrary code.
3. **Determine fix path**: run `npm update <package>` to get the fix version. If the fix is in a transitive dep, use an `overrides` entry in `package.json`.
4. **If no fix is available**: add the CVE to `osv-scanner.toml` with a written reason and an `expired_at` date. The expiry forces a re-review.
5. **If the finding is a false positive**: same as above. False positives are still documented and time-bounded.

## Current state

At the time of writing, the workflow has been added but has not yet run on a real push. The first run on the next push to `main` will establish the baseline. Add any finding that survives triage to the table below.

| Date | Advisory | Package | Installed | Fixed | Reason for action | Action taken |
|------|----------|---------|-----------|-------|-------------------|--------------|
|      |          |         |           |       |                   |              |

## How to add an ignore

In `osv-scanner.toml`:

```toml
[IgnoredVulnerabilities]
  [IgnoredVulnerabilities."GHSA-xxxx-xxxx-xxxx"]
    id = "GHSA-xxxx-xxxx-xxxx"
    reason = "Transitive dep we do not use; parent will be bumped in Q3 2026"
    expired_at = "2026-12-31"
```

`expired_at` is mandatory. After the expiry, OSV-Scanner will start failing again, forcing a re-review.

## How to read the SARIF

The workflow uploads `osv.sarif` to the Security > Code Scanning tab. The Code Scanning UI shows:

- The rule ID (the GHSA or CVE number)
- The package and the vulnerable version
- The fixed version
- A link to the advisory
- A code location (the `node_modules/<package>/package.json` line)

## How to re-run locally

```bash
osv-scanner --config=osv-scanner.toml -r ./
```

For JSON output: `--format json --output osv.json`. For SARIF output (matches the CI artifact): `--format sarif --output osv.sarif`.

## Related documents

- `docs/security/pipeline.md` - the seven-stage gate
- `osv-scanner.toml` - the configuration
- `.github/workflows/osv-scanner.yml` - the workflow
