---
description: Optional autocommit workflow for generated portfolio docs and agent artifacts. Disabled by default.
---

# Autocommit Workflow (opt-in)

This workflow documents how to safely enable automated commits of generated agent artifacts and cleanup docs for this portfolio repo. Autocommit is strictly opt-in and requires explicit configuration in `.agents/autocommit.json`.

## Design goals

- Keep the agent docs aligned without scattering stale guidance across the repo.
- Respect `git-policy`: do not commit without explicit user request.
- Keep the helper script deterministic and easy to audit.

## Files involved

- `.agents/autocommit.json` — opt-in config (default: `enabled: false`).
- `.agents/scripts/auto_commit.ps1` — PowerShell helper to stage and commit files, interactive by default.

## How it works (local)

1. Run the relevant validation for the touched files.
2. Update `.agents/autocommit.json` with the curated file list for the current cleanup slice.
3. Run `.agents/scripts/auto_commit.ps1` to stage those files and create the configured commit message.

## Safety rules

- Autocommit will not run if `.agents/autocommit.json` sets `enabled:false`.
- Non-interactive commits require `AUTOCOMMIT_ALLOW=true` in the environment.
- Keep the file list narrow so the commit stays scoped to the requested slice.
- If the task touches source code, confirm the user explicitly asked for the automated commit before running it.

## Recommended use

- Use autocommit for generated docs, audits, and repository cleanup snapshots only.
- Keep source-code commits manual unless the user explicitly requested an automated run.
