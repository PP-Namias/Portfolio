---
trigger: always_on
description: Established rules for technical one-line commits, PowerShell usage, and structured PR documentation. Apply this rule when staging changes, creating commits, or preparing pull requests.
---

# Git Policy

Established rules for technical one-line commits, PowerShell usage, and structured PR documentation. Apply this rule when staging changes, creating commits, or preparing pull requests.

## Intent

Maintain a clean, technical, and descriptive commit/PR history following a strict one-line and structured format, enforced by automated tooling.

## Rules

- MUST only commit when the USER explicitly requests the commit or the current task explicitly enables the autocommit workflow.
- MUST use a single-line commit message format (enforced by Commitlint).
- MUST NOT include "Summary:" or any multi-line descriptions in commits.
- MUST use `+` to connect distinct features/changes.
- MUST use `&` to connect correlated details within a change.
- MUST wrap long messages immediately after a `+` or `&` (Max 120 chars).

## Automated Enforcement

- **Remote**: GitHub Actions validates PR titles and runs the CI pipeline (`build`, `lint`, `format`).
- **CI**: Commitlint validates commit messages.

## Pull Request Style

- When requested, provide PR content as markdown that can be copied/pasted.
- PR Titles MUST follow the commit style (one-line, technical).
- PR Descriptions MUST include:
  - `### Summary`: High-level overview.
  - `### Features`: Bulleted list of new functionality.
  - `### Changes`: All commits message in bullet list.
  - `### Configuration`: (If applicable) code snippets for setup.

## Guidelines

- Make commit messages technical and descriptive.
- Prefer `feat(scope):`, `fix(scope):`, etc.
- Use lowercase for simple, direct descriptions.
- Use PowerShell for all Git operations.

## Autocommit (opt-in)

- Autocommit is allowed only when explicitly enabled by the repository owner.
  - Non-interactive / CI commits require environment variable `AUTOCOMMIT_ALLOW=true` to avoid accidental runs.
  - Autocommit scripts or GitHub Actions must present the proposed `git commit` command in the run logs before committing.

- Agents or scripts MUST NOT automatically commit source-code changes or apply design rewrites without explicit user request.
- Any automated commit that touches source code requires a clear audit trail and must stay within the user-approved scope.
- By default, avoid staging `.agents/` unless the current task explicitly targets agent guidance or workflow cleanup.

## Samples

- `feat(portfolio): refine hero transitions & improve card hover polish`
- `fix(nextjs): resolve build regression & tighten blog metadata rendering`

## Anti-patterns

- Committing without explicit "go ahead" from the USER.
- Using multi-line commit messages with summaries.
- Merging PRs with failing CI checks (Red ❌).
