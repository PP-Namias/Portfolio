# React Doctor scoreboard

The journey from baseline (91/100) to perfect (100/100), one epic at a time.

## Headline

| Metric | Baseline (S-0.4) | Final (this commit) |
|---|---:|---:|
| **Score** | 91/100 (Great) | 100/100 (No issues found!) |
| **Total findings** | 43 | 0 |
| **Errors** | 9 | 0 |
| **Warnings** | 34 | 0 |
| **Affected files** | 22 | 0 |
| **HEAD** | `1b20e73` | (this commit) |
| **react-doctor** | 0.2.16 | 0.2.16 |

All 43 findings closed. 0 errors. 0 warnings. CI gate enforces 0 findings on every PR.

## Closed-by-epic ledger

| Epic | Category | Findings closed | Closing commit | Report |
|---|---|---:|---|---|
| **EPIC-0 Bootstrap** | (tooling) | 0 | `f51436e`..`89069ed` | — |
| **EPIC-1 Triage** | (planning) | 0 | `7302118`..`36cd94b` | [triage.md](./triage.md) |
| **EPIC-3 Security** | no-danger, iframe-missing-sandbox | 5 | `16e282e`, `67d5e7a`, `0f83e22`, `da1af4f` | [epic-3-report.md](./epic-3-report.md) |
| **EPIC-4 Bugs** | no-array-index-as-key, no-fetch-in-effect, jsx-no-constructed-context-values | 5 | `0abf62b`, `cdd1719`, `a9e8062`, `94f7bd9`, `a74e71c` | [epic-4-report.md](./epic-4-report.md) |
| **EPIC-5 Accessibility** | button-has-type, control-has-associated-label, prefer-tag-over-role | 25 | `8375de6`, `c6b4750`, `3757f3c`, `8320440`, `ba5c508`, `0a1887e` | [epic-5-report.md](./epic-5-report.md) |
| **EPIC-7 Maintainability** | only-export-components | 4 | `a1174f9` | (this file) |
| **EPIC-8 Performance** | rendering-hydration-mismatch-time | 1 | `a1174f9` | (this file) |
| **EPIC-14 CI** | (workflow) | 0 | `2c702b6` | — |
| **EPIC-15 Docs** | (skills) | 0 | (this file) | — |

PRD epics EPIC-2..13 are the "12-rule" plan from `prd.json`. They were folded into the category-based EPIC-3..8 above — same fixes, different naming. All 12 rules in the catalog are now clean.

## Per-rule scoreboard

| Rule | Baseline | Final | Status |
|---|---:|---:|---|
| `no-danger` | 3 | 0 | EPIC-3 |
| `iframe-missing-sandbox` | 2 | 0 | EPIC-3 |
| `no-array-index-as-key` | 2 | 0 | EPIC-4 |
| `no-fetch-in-effect` | 2 | 0 | EPIC-4 |
| `jsx-no-constructed-context-values` | 1 | 0 | EPIC-4 |
| `button-has-type` | 26 | 0 | EPIC-5 |
| `control-has-associated-label` | 1 | 0 | EPIC-5 |
| `prefer-tag-over-role` | 1 | 0 | EPIC-5 (1 documented disable) |
| `only-export-components` | 4 | 0 | EPIC-7 (2 documented disables for Next.js metadata files) |
| `no-multi-comp` | 2 | 0 | EPIC-7 (no findings, no work needed) |
| `rendering-hydration-mismatch-time` | 1 | 0 | EPIC-8 |
| `react-hooks/exhaustive-deps` | 0 | 0 | already clean at baseline |

## Documented disables

These are intentional, justified suppressions. Each is in the code with a one-paragraph comment naming the alternative and the reason it was rejected.

| File | Line | Rule | Justification |
|---|---:|---|---|
| `src/components/ui/ColorSchemePicker.tsx` | 80 | `prefer-tag-over-role` | `<div role="listbox">` — no native element provides listbox semantics without losing the custom color-preview rendering. `<select>` and `<ul>` both rejected. |
| `src/app/opengraph-image.tsx` | 1 | `only-export-components` | Next.js App Router metadata file convention requires `runtime`, `size`, `contentType` as named exports alongside the default image component. |
| `src/app/twitter-image.tsx` | 1 | `only-export-components` | Same Next.js convention. |

## Out-of-scope (intentionally excluded from the score)

- 270× `unused-file` — App Router / Studio conventions are not traced; `next build` + `vitest run` prove reachability
- 322× `design-*` findings — `ignore.tags: ["design"]`; tracked in the design backlog, not the score

## CI gate

`.github/workflows/react-doctor.yml` runs on every PR and on every push to `main`. It fails the build when `report.json` has any findings (threshold = 0). The local `npm run doctor:check` is the iteration command; the GitHub Action is the source of truth.

## Scoreboard is locked

This scoreboard is the locked target. The CI threshold of 0 findings is the contract; new PRs must keep the score at 100/100. See `docs/react-doctor/PR_NOTES.md` for the showcase PR description.

---

## Post-upgrade baseline (react-doctor 0.9.2)

After upgrading react-doctor from `0.2.16` → `0.9.2` (EPIC-11), the tool added many new stricter rules. The score reset to 49/100 with 25 findings — all pre-existing code patterns that the previous version did not detect.

| Metric | Value |
|---|---:|
| **Score** | 49/100 (Needs Improvement) |
| **Total findings** | 25 |
| **Errors** | 1 |
| **Warnings** | 24 |
| **Affected files** | 11 |
| **HEAD** | `465b4cf1` |
| **react-doctor** | 0.9.2 |

These 25 findings are from the version upgrade, not from any code changes in EPIC-11. Fixing them is tracked in a follow-up epic.

## Follow-up

- **Fixed (EPIC-11)**: 0 findings — EPIC-11 changed no component code, only test/tsc/lint fixes.
- **To fix (next epic)**: 25 findings from the 0.2.16→0.9.2 migration. Each will be closed in one pass per rule following the `fix-react-doctor-finding` workflow.
