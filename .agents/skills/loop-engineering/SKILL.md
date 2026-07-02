# Loop Engineering Skill

## Purpose

Coordinate automated maintenance loops that run on a cadence. This skill covers the loop-engineering patterns used in this portfolio: Daily Triage, PR Babysitter, and Dependency Sweeper.

## When to Use

- Before starting work: read `STATE.md` to understand what loops are active and what needs attention
- After completing automated tasks: append to `loop-run-log.md`
- When asked about loop status: read `STATE.md` and `loop-run-log.md`
- When loops need to be paused: use the `loop-pause-all` label

## Core Files

| File              | Purpose                                                    |
| ----------------- | ---------------------------------------------------------- |
| `STATE.md`        | Live loop state — what is active, blocked, or watch-listed |
| `LOOP.md`         | Documents all active loops, cadence, and gates             |
| `loop-budget.md`  | Daily token caps per loop                                  |
| `loop-run-log.md` | Append-only run history                                    |

## Active Loops

### Daily Triage (L1 — report-only)

- **Cadence**: Weekday mornings at 8am UTC
- **Workflow**: `.github/workflows/daily-triage.yml`
- **What it does**: Runs lint, test, react-doctor, npm audit. Updates STATE.md with findings.
- **Agent action**: Read STATE.md to see what passed/failed. Fix any failures.

### PR Babysitter (L2 — assisted)

- **Cadence**: On PR open/sync/reopen
- **Workflow**: `.github/workflows/pr-babysitter.yml`
- **What it does**: Runs quality checks on PRs. Posts comment with failures and fix suggestions.
- **Agent action**: Read the PR comment to see what needs fixing. Apply suggested fixes.

### Dependency Sweeper (L2 — patch-only)

- **Cadence**: Every 6 hours
- **Workflow**: `.github/workflows/dependency-sweeper.yml`
- **What it does**: Checks for vulnerable/outdated deps. Creates PRs for patch updates. Logs majors to STATE.md.
- **Agent action**: Review created PRs. Check STATE.md watch list for major updates needing manual review.

## Kill Switch

- Label: `loop-pause-all`
- When present on the repo, all loop workflows skip execution
- To resume: remove the label and clear the pause in `STATE.md`

## Budget

Check `loop-budget.md` for daily token caps per loop. If a loop exceeds its budget:

1. Pause the scheduler
2. Append event to `loop-run-log.md`
3. Open maintainer issue

## Run Log Format

Append entries to `loop-run-log.md` using this format:

```
## YYYY-MM-DD — loop-name
- **Status**: pass | fail | skip
- **Findings**: summary of what was found
- **Actions**: what was done
- **Tokens**: estimated token cost
```

## Safety Rules

1. No auto-merge on main except trivial dependency patches
2. Worktrees for any code-change experiments
3. Human gates on major decisions
4. Respect denylist (next, react, sanity packages)
5. Read STATE.md before starting work
6. Append to loop-run-log.md after completing work
