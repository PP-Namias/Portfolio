# react-doctor score: S-0.4 baseline

The current state of the codebase as captured at S-0.4. This is the
"before" snapshot for the clinic slice. S-16.2 will produce
[scoreboard.md](./scoreboard.md) as the "after" snapshot.

## Headline

| Metric                | Value     |
|-----------------------|-----------|
| **Score**             | **91/100** |
| **Label**             | **Great**  |
| **Total findings**    | **43**     |
| **Errors**            | **9**      |
| **Warnings**          | **34**     |
| **Affected files**    | **22**     |
| **react-doctor**      | **0.2.16** (pinned) |

Source: `npx react-doctor` at HEAD `1b20e73` (S-0.4 commit).

## How the score is computed

react-doctor's score is a weighted function of:

- **Error count** (each error removes ~1 point)
- **Warning count** (each warning removes ~0.1-0.3 points)
- **Affected-file count** (penalty for spread; many files = bigger problem)
- **Category distribution** (security/bugs weigh more than maintainability)

The 9 errors account for ~7 of the 9 missing points. Clearing all 9
errors puts the score at 98-99/100. Clearing the 34 warnings adds the
remaining 1-2 points.

## Category breakdown

| Category        | Errors | Warnings | Files affected |
|-----------------|-------:|---------:|---------------:|
| Bugs            |      4 |       27 |             14 |
| Security        |      5 |        0 |              4 |
| Performance     |      0 |        1 |              1 |
| Accessibility   |      0 |        2 |              2 |
| Maintainability |      0 |        4 |              2 |
| **Total**       |  **9** |   **34** |         **22** |

## Rule breakdown (the EPIC-2..13 fix list)

| Rule                                | Count | Severity | Epic    |
|-------------------------------------|------:|----------|---------|
| `button-has-type`                   |    26 | warning  | EPIC-5  |
| `no-danger`                         |     3 | error    | EPIC-3  |
| `iframe-missing-sandbox`            |     2 | error    | EPIC-3  |
| `no-array-index-as-key`             |     2 | error    | EPIC-4  |
| `no-fetch-in-effect`                |     2 | error    | EPIC-4  |
| `only-export-components`            |     4 | warning  | EPIC-7  |
| `no-multi-comp`                     |     2 | warning  | EPIC-7  |
| `control-has-associated-label`      |     1 | warning  | EPIC-5  |
| `prefer-tag-over-role`              |     1 | warning  | EPIC-5  |
| `jsx-no-constructed-context-values` |     1 | warning  | EPIC-4  |
| `rendering-hydration-mismatch-time` |     1 | warning  | EPIC-8  |

## File impact (top 5 hot files)

| File                                                | Total | Errors | Warnings |
|-----------------------------------------------------|------:|-------:|---------:|
| `src/components/ui/ChatPanel.tsx`                   |     8 |      1 |        7 |
| `src/components/sections/GallerySection.tsx`        |     5 |      0 |        5 |
| `src/components/sections/CertificationsSection.tsx` |     3 |      0 |        3 |
| `src/components/ui/BookingModal.tsx`                |     3 |      2 |        1 |
| `src/components/ui/ResumeModal.tsx`                 |     3 |      1 |        2 |

Full per-file table: [findings-by-file.md](./findings-by-file.md).

## Out-of-scope (NOT counted in 91/100)

| Source                                | Count | Reason |
|---------------------------------------|------:|--------|
| `unused-file` (deslop, false positive) |  270 | App Router / Studio conventions not traced. |
| `design-no-redundant-size-axes`       |   236 | Tag: `design`. Out of gate. |
| `use-lazy-motion`                     |    54 | Tag: `design`. Out of gate. |
| `no-tiny-text`                        |    30 | Tag: `design`. Out of gate. |
| `no-scale-from-zero`                  |     8 | Tag: `design`. Out of gate. |
| Studio lint (excluded via ignore.files)|     9 | Separate ESLint lane. |
| Seed script lint (excluded)           |     3 | `sanity exec` entry points. |
| Test file lint (excluded)             |     6 | Vitest-owned. |

## Trajectory to 100

| Stage | Score | Findings | What unlocks it |
|-------|------:|---------:|-----------------|
| **S-0.4 baseline** | 91 | 43 | (this snapshot) |
| EPIC-3 done         | 96-97 | ~20  | All 5 errors gone; warnings still count |
| EPIC-4 done         | 98    | ~10  | Bug-category errors and warnings gone |
| EPIC-5 done         | 99    | ~5   | Accessibility warnings gone |
| EPIC-7 done         | 100   | 0    | All maintainability warnings gone |
| **EPIC-16 S-16.2 scoreboard** | **100** | **0** | **Goal** |

The +1-2 points from clearing warnings is non-linear; react-doctor
rewards "no findings" with the final scoring boost.

## Reproducing this snapshot

```bash
# Pinned tool (0.2.16, S-0.6)
npm run doctor:baseline     # writes .react-doctor/baseline.json
# or for the human-readable terminal report:
npm run doctor              # writes the TTY gauge to stdout
```

The two reference files in this directory were generated by both commands
at the time of S-0.4 (commit `1b20e73`). They are immutable historical
record; the live tool may produce different numbers as the codebase
evolves, but those diffs are tracked per-commit in the EPIC-2..13
commit messages (F-NNN cross-references).
