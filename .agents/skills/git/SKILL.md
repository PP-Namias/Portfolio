---
name: git
description: Git workflow, branch strategy, and commit hygiene for the portfolio.
---

# Git Skill

Standard git workflow for the portfolio. Always follow the commit hygiene rules in AGENTS.md.

## When to use this skill

- Creating branches
- Writing commit messages
- Preparing PRs
- Rebasing and squashing

## Workflow

1. **Branch** — `type/scope` pattern: `feat/`, `fix/`, `refactor/`, `docs/`, `chore/`
2. **Commit** — One commit per logical slice. Subject: `type(scope): <imperative summary>`
3. **Body** — Bullet list of what changed, why, and what was verified
4. **Verification** — Before commit, run: `npm run test -- --run`, `npx tsc --noEmit`, `npm run lint`, `npm run doctor`
5. **PR** — Rebase on main, no merge commits. ASCII-safe body via `--body-file`
