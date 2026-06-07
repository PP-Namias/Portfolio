#!/usr/bin/env bash
#
# Pre-commit zizmor hook.
# This hook runs zizmor against any changed workflow files
# before commit. If zizmor is not installed, the hook is a
# no-op (the CI workflow runs zizmor on every PR, so a
# missing local install does not weaken the gate).
#
# Install: copy this file to .git/hooks/pre-commit and
# `chmod +x` it, or add it to your pre-commit framework of
# choice (husky, pre-commit, lefthook).
#
# The script exits 0 on success, non-zero on a zizmor
# finding, with the finding printed to stderr.

set -euo pipefail

if ! command -v zizmor >/dev/null 2>&1; then
  echo "zizmor not installed; skipping pre-commit check (CI will catch it)."
  exit 0
fi

changed_workflows=$(git diff --cached --name-only --diff-filter=ACMR | grep -E '^\.github/workflows/.*\.ya?ml$' || true)

if [ -z "$changed_workflows" ]; then
  exit 0
fi

echo "Running zizmor on changed workflow files..."
zizmor --persona=auditor --format=github $changed_workflows
