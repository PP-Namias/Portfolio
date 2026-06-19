---
name: impeccable
description: Quick repo-hygiene and consistency checks before committing.
---

# Impeccable Skill

Quick hygiene and consistency checks to run before any commit. Catches common issues fast.

## When to use this skill

- Before every commit
- After large merges or refactors
- When asked to "check everything is clean"

## Workflow

1. **Git status** — `git status` — no untracked files that should be gitignored, no staged files with secrets
2. **Unused imports** — Check new/changed files for unused imports
3. **console.log** — No `console.log` in production source files (guarded ones OK)
4. **TypeScript** — `npx tsc --noEmit` passes
5. **Lint** — `npm run lint` passes
6. **Tests** — `npm run test -- --run` passes
7. **Doctor** — `npm run doctor` score 100/100
8. **Comments** — No code comments unless explicitly asked for
