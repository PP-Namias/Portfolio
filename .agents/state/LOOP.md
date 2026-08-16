# LOOP.md — Loop Engineering Reference

This file documents how the **PP Namias Portfolio** is maintained with loop engineering patterns.

The goal is to move from ad-hoc agent prompting to designed loops that prompt agents on a cadence.

## Active Loops

### Daily Triage (L1 — automated + report)

- Cadence: 1d weekdays (`/.github/workflows/daily-triage.yml`)
- Skill: `loop-engineering` (from `.agents/skills/loop-engineering`)
- State: `.agents/state/STATE.md` (updated by workflow; human reviews weekly)
- Phase: Report-only. Human reviews and decides actions.
- Handoff: Design decisions, large refactors, new pattern acceptance.

### PR Babysitter (L2 — assisted, manual trigger)

- Cadence: on PR open/update (`/.github/workflows/pr-babysitter.yml`)
- Skill: `code-review`, `run-react-doctor`
- State: PR comments with findings
- Phase: Assisted. Suggests fixes, no auto-merge.
- Handoff: Human decides whether to apply suggested fixes.

### Dependency Sweeper (L2 — patch-only)

- Cadence: 6h (`/.github/workflows/dependency-sweeper.yml`)
- Skill: `dependency-audit`
- State: `.agents/state/STATE.md` watch list for majors; PRs for patches
- Phase: Patch-only auto-PR. Majors require human review.
- Handoff: Human reviews PRs and merges.

### Issue Triage (L2 — AI-informed classification)

- Cadence: on event (`issues.opened/edited`, `pull_request.opened/ready_for_review`)
- Workflow: `/.github/workflows/ai-triage.yml`
- Script: `scripts/ai-triage.mjs` (OpenAI-compatible or Anthropic; deterministic keyword fallback)
- State: triage labels + comment on the item
- Phase: Auto-classifies, prioritizes, flags duplicates, applies labels. No auto-response closure.
- Handoff: Human reviews classification and acts.
- Keys: `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` (optional `LLM_API_BASE`, `LLM_MODEL`). Graceful skip if absent.

## Multi-loop coordination

Priority: Issue Triage (on issue/PR event) → PR Babysitter (on PR event) → Dependency Sweeper (scheduled) → Daily Triage (report, off-peak).

## Worktrees

- Any unattended code-change experiment runs in an **isolated git worktree** per attempt.
- One worktree per fix; discard after verifier REJECT or human escalation.

## Budget & Observability

- Token caps: `.agents/state/loop-budget.md`
- Run history: `.agents/state/loop-run-log.md` (appended each run by workflows)
- Kill switch: `loop-pause-all` label or flag in `.agents/state/STATE.md`

## Safety & Gates (this repo)

- No auto-merge on main except trivial dependency patches (allowlist + verifier)
- Denylist: core Sanity schemas, deployment configs, security headers without human review
- Live loop state: `.agents/state/STATE.md`

## How to run locally

```bash
# Check loop status
cat .agents/state/STATE.md

# View run history
tail -20 .agents/state/loop-run-log.md

# Check budget
cat .agents/state/loop-budget.md
```

## Evolution

Target: solid L2 with excellent observability. Future loops: Changelog Drafter, Post-Merge Cleanup.

---

_This file is both documentation and the seed for the loops that maintain the portfolio._
