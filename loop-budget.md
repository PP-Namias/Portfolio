# Loop Budget — PP Namias Portfolio

> Budget guardrails for loops that maintain this portfolio.

## Daily limits

| Loop               | Max runs/day | Max tokens/day | Max sub-agent spawns/run |
| ------------------ | ------------ | -------------- | ------------------------ |
| Daily Triage       | 1            | 100k           | 0 (L1)                   |
| PR Babysitter      | 20           | 500k           | 0                        |
| Dependency Sweeper | 4            | 200k           | 0                        |

## On budget exceed

1. Pause schedulers / disable high-cadence workflows
2. Append event to `loop-run-log.md`
3. Open maintainer issue

## Kill switch

- Label: `loop-pause-all`
- Resume only after cleared in `STATE.md`

## Estimate spend

Check current loop readiness:

```bash
cat STATE.md
tail -20 loop-run-log.md
```
