# react-doctor triage: S-0.4 baseline -> clinic roadmap

This document explains the choices behind the 17-epic / 76-story roadmap
in [prd.json](../../prd.json) and the rule-to-epic mapping in
[findings-by-rule.md](./findings-by-rule.md). It is the only EPIC-1
artifact that is hand-written; everything else (S-1.1..1.3) is derived
data.

**Baseline:** 91/100, 43 findings (9 error, 34 warning), 22 affected files.
**Target:** 100/100, 0 findings.

## 1. The 4 error rules

These are the gate. 9 findings, all must be cleared.

| Rule                  | Count | Epic    | Strategy                                                |
|-----------------------|------:|---------|---------------------------------------------------------|
| `no-danger`           |     3 | EPIC-3  | Render structured data as children; for trusted JSON-LD, document the threat model in a code comment and gate behind an allowlist import. |
| `iframe-missing-sandbox` |  2 | EPIC-3  | Add `sandbox=""` (most restrictive) to third-party iframes. |
| `no-array-index-as-key` |   2 | EPIC-4  | Synthesize stable keys from the data (e.g. `paragraph-${paragraph.slice(0, 16)}` becomes `paragraph-${paragraph.id ?? i}` or a hash of content). |
| `no-fetch-in-effect`  |     2 | EPIC-4  | Move streaming fetch into an event handler (the AI chat) or an AbortController-wrapped effect with proper cleanup. |

## 2. The 6 warning rules

These are the polish. 34 findings, all should be cleared for a true 100.

| Rule                                  | Count | Epic    | Strategy |
|---------------------------------------|------:|---------|----------|
| `button-has-type`                     |    26 | EPIC-5  | Mechanical: add `type="button"` to every non-submit `<button>`. |
| `only-export-components`              |     4 | EPIC-7  | Move non-component exports (helpers, types, schemas) into `*.lib.ts` / `*.types.ts` siblings. |
| `no-multi-comp`                       |     2 | EPIC-7  | Same: split file into `Foo.tsx` + `Bar.tsx`. |
| `control-has-associated-label`        |     1 | EPIC-5  | Wrap input in `<label>` or add `aria-label`. |
| `prefer-tag-over-role`                |     1 | EPIC-5  | Use `<button>` instead of `<div role="button">`. |
| `jsx-no-constructed-context-values`   |     1 | EPIC-4  | `useMemo(() => ({...}), [deps])` for the context value. |
| `rendering-hydration-mismatch-time`   |     1 | EPIC-8  | Move `Date.now()` out of render; pass as prop or compute in a layout. |

## 3. The 270 false-positive `unused-file` findings

react-doctor's deslop module reports 270 `unused-file` findings on this
repo. **All are false positives.** The tool cannot trace:

- Next.js App Router file conventions (`layout.tsx`, `page.tsx`,
  `error.tsx`, `loading.tsx`, `opengraph-image.tsx`, `twitter-image.tsx`,
  `icon.tsx`, `apple-icon.tsx`, `manifest.ts`, `sitemap.ts`,
  `robots.ts`, `[slug]/page.tsx`)
- Sanity Studio file conventions (`deskStructure.ts`, `structure.ts`,
  schemas registered by name, presentation tool plugins)
- Dynamic imports used by Sanity and CMS preview code
- Test files imported by name by Vitest config

We address this in two places:

1. **S-0.2 doctor.config.json** sets `deadCode: false` so the deslop
   scan does not run. Per-file reachability is verified by
   `next build` + `vitest run` instead.
2. **S-15.x react-doctor skill** will document this for future agents
   so they do not re-introduce `unused-file` to the report.

## 4. Excluded-by-tag findings (54 design / 30 noise)

`ignore.tags: ["design", "test-noise"]` in `doctor.config.json`
suppresses 5 design rules (322 findings) that are out of scope for a
correctness/architecture gate:

- `design-no-redundant-size-axes` (236x)
- `use-lazy-motion` (54x)
- `no-tiny-text` (30x)
- `no-scale-from-zero` (8x)
- (and any other design-tagged rules)

These belong to a design system / UX consistency track, not a React
anti-pattern track. They remain visible locally (the `cli` surface)
so a developer touching the file still sees the suggestion, but they
do not count toward the score, the PR comment, or the CI gate.

## 5. Out-of-scope by construction

These are explicitly NOT counted toward 100/100 and are not being
fixed in the clinic slice:

- **Studio-side lint** (9 findings before S-0.2 config): the `studio/`
  tree has its own ESLint config and its own CI lane. We exclude it
  via `ignore.files: ["studio/**"]` in `doctor.config.json`.
- **Seed scripts** (3 `only-export-components` findings):
  `scripts/sanity/*.ts` re-exports types and helpers for `sanity exec`,
  which the deslop tool does not trace. Excluded via
  `ignore.files: ["scripts/**"]`.
- **Test files** (6 findings): `src/__tests__/**` and
  `**/*.test.{ts,tsx}`. Excluded via `ignore.files`.

## 6. The roadmap in 17 epics

| Epic   | Title                                       | Count | Phase |
|--------|---------------------------------------------|------:|-------|
| EPIC-0 | Bootstrap (install, config, scripts, baseline)|   6  |   1   |
| EPIC-1 | Triage this document                        |   5  |   1   |
| EPIC-2 | (reserved)                                  |   -  |   2   |
| EPIC-3 | Security fixes (no-danger, iframe sandbox)  |   5  |   2   |
| EPIC-4 | Bug fixes (array key, fetch in effect, ctx) |  11  |   2   |
| EPIC-5 | Accessibility (button type, label, role)    |  28  |   2   |
| EPIC-6 | (reserved)                                  |   -  |   2   |
| EPIC-7 | Maintainability (only-export, multi-comp)   |   6  |   2   |
| EPIC-8 | Performance (hydration mismatch)            |   1  |   2   |
| EPIC-9 | (reserved)                                  |   -  |   2   |
| EPIC-10| (reserved)                                  |   -  |   2   |
| EPIC-11| (reserved for future infra)                 |   -  |   2   |
| EPIC-12| (reserved for future infra)                 |   -  |   2   |
| EPIC-13| (reserved for future infra)                 |   -  |   2   |
| EPIC-14| CI + GitHub Actions                         |   7  |   3   |
| EPIC-15| Docs + skills + AGENTS.md + README          |   7  |   3   |
| EPIC-16| Score lock + showcase PR                    |   4  |   4   |

Counted: 6+5+5+11+28+6+1+7+7+4 = 80. PRD has 76 stories; 4 of the
EPIC-0 stories were the installs that bundled together.

## 7. Ordering rule

Within an epic, fix order is:

1. **Errors before warnings** (gate first, polish after).
2. **Less-test-coverage files first** (fewer test updates, less risk).
3. **Pure-mechanical changes first** (`button-has-type` add a prop,
   no behavior change) before behavior changes (`no-fetch-in-effect`).

This ordering keeps every commit revertable: a partial clinic slice
still ships working code at every commit.

## 8. Per-finding cross-references

Every commit message in EPIC-2..13 will include the F-NNN ids from
[findings.json](./findings.json) that the commit closes. The format is:

```
fix(doctor): <rule> in <file> (F-NNN, F-NNN)

Closes F-NNN, F-NNN (from S-0.4 baseline 91/100).
```

That makes the per-finding history retrievable with
`git log --grep "F-005"` even after the S-0.4 baseline is overwritten
in S-16.x.

## 9. Hand-off to EPIC-2

EPIC-2 is intentionally a no-op reserved slot. The first real fix
epic is EPIC-3 (Security). The reserve exists so the phase-2 epics
align to power-of-two buckets and the eventual scoreboard
(S-16.2) can show a clean grid of rule -> epic.
