# AI Agent Prompt — Continue Test Coverage Work

Copy-paste the prompt below into your next AI coding session.

---

## Prompt

```
You are working on the PP Namias portfolio repo at C:\Users\ADMIN\Desktop\PP Namias\Portfolio.

## Context
We are executing a phased plan to achieve 90%+ test coverage. The PRD is at:
docs/prd/prd.test-coverage-2026.json

Phase 1 (Coverage Infrastructure) is COMPLETE with these 5 commits on dev:
- 7e2ad5c: vitest.config.ts thresholds at 69/54/71/70
- 2c8d74f: src/__tests__/helpers.ts (shared mock factories)
- 65ad235: package.json test:coverage scripts
- d8d1127: docs/test-coverage/baseline-2026-06-30.json
- caa7eea: .husky/pre-push hook

Current state: 505 tests passing, 46 test files, dev branch has 69 total commits.

## Your Task
Continue executing phases 2-11 from the PRD. Work through the slices in order.

### Rules
1. ALL commits go on the `dev` branch (never touch main)
2. One commit per slice — granular commits for history depth
3. Every test file you create MUST be committed individually
4. Use the shared helpers from src/__tests__/helpers.ts
5. Tests must pass before each commit: run `npx vitest run --run` to verify
6. Use PowerShell-compatible commands (no bash syntax)
7. Commit messages follow: `test(scope): description` format
8. Add `--no-verify` to commits to skip pre-commit hooks during this batch work

### Phase 2 — Security Layer (next up)
Start with slice 2a: middleware bot blocking tests.
Read src/middleware.ts and src/__tests__/lib/bot-blocker.test.ts for patterns.
Create src/__tests__/middleware/bot-blocking.test.ts

Then continue 2b through 2f, committing each slice.

### Phase 3 — CMS Data Layer
Then move to Phase 3 (cms-content.server.ts tests).

### Continue through all 11 phases
Work through phases 2-11 sequentially. Each slice = read the source file, write tests, verify they pass, commit.

### Coverage Targets
After each phase, run `npx vitest run --run 2>&1 | Select-Object -Last 5` to confirm tests pass.
After phases 3, 5, and 11, run `npx vitest run --coverage` to check progress toward 90/80/90/90.

### When Done
Report back with:
- Number of new test files created
- Number of new tests added
- Current coverage percentages
- Any files that were difficult to test and why
```

---

## Quick Start

1. Open a new opencode session
2. Paste the prompt above
3. The agent will read the PRD and continue from Phase 2
4. Each phase will produce multiple commits on `dev`
