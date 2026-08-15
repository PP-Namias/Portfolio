# React Doctor — PR Notes

PR: `feature/react-doctor-clinic` → `main`

## Title

`feat(doctor): integrate react-doctor and reach 100/100 (clinic)`

## Body

This PR integrates [react-doctor](https://react.doctor) into the Namias
portfolio and walks the codebase from a 91/100 baseline to a perfect
100/100 score, with a CI gate that locks the score on every future PR.

### Score

| | Before | After |
|---|---:|---:|
| **Score** | 91/100 | 100/100 |
| **Errors** | 9 | 0 |
| **Warnings** | 34 | 0 |
| **Files affected** | 22 | 0 |

### What this PR ships

1. **react-doctor 0.2.16** (pinned to exact version) as a devDep, with 6
   npm scripts (`doctor`, `doctor:verbose`, `doctor:json`,
   `doctor:baseline`, `doctor:check`, `doctor:diff`).
2. **doctor.config.json** with per-rule severity, `deadCode: false`
   (deslop), and ignore globs for `studio/`, `scripts/`, tests, and
   design-tagged findings.
3. **Fixes across 9 epics**, 33 commits:
   - **Security** (5): all `dangerouslySetInnerHTML` routed through
     `<JsonLd>`; every iframe gets a `sandbox` attribute
     (Cal.com = `allow-scripts allow-same-origin` justified; PDF =
     empty most-restrictive).
   - **Bugs** (5): stable React keys from data (not indices); SWR
     replaces `useEffect + fetch`; `useMemo` on the
     `<AccentColorContext.Provider>` value.
   - **Accessibility** (25): every JSX `<button>` gets `type="button"`
     (or `submit`/`reset`); icon-only controls get `aria-label`; the
     `ColorSchemePicker` `role="listbox"` is documented and disabled
     with a justification.
   - **Maintainability** (4): `SanityField` is split into
     `SanityField.tsx` (component) + `sanity-field.lib.ts` (helpers) +
     `sanity-field.types.ts` (types) with a barrel; the two Next.js
     metadata files (`opengraph-image.tsx`, `twitter-image.tsx`) get
     a file-level `only-export-components` disable because the
     `runtime`/`size`/`contentType` named exports are required by the
     framework.
   - **Performance** (1): `Footer`'s `new Date().getFullYear()` is
     hoisted to a module-level constant so SSR and client see the
     same value.
4. **CI gate** at `.github/workflows/react-doctor.yml` (threshold = 0
   findings = 100/100) and an extension to `.github/workflows/
   pr-validation.yml` that lists react-doctor in the PR status table.
5. **Agent skills** at `.agents/skills/run-react-doctor/SKILL.md` and
   `.agents/skills/fix-react-doctor-finding/SKILL.md`, plus an
   `AGENTS.md` entry so future agents know the gate exists.
6. **Scoreboard** at `docs/react-doctor/scoreboard.md` — the full
   journey, the per-epic closing commits, the per-rule ledger, the
   list of documented disables, and the out-of-scope buckets.

### New runtime dependency

- `swr@^2.4.1` — replaces `useEffect + fetch` for component-scoped
  data. Test isolation via `SWRConfig` with a per-test `provider` so
  the cache does not leak between vitest cases.

### New dev dependency

- `@testing-library/dom@^10.4.1` — needed for SWR test setup.

### Verification (local)

```
npm run doctor:check
# No issues found!

npm run test -- --run
# 29 passed (29) | 266 passed (266)

npm run lint
# (clean)

npx tsc --noEmit
# (clean)
```

### Verification (CI)

- `.github/workflows/react-doctor.yml` (new) — fails on any
  `report.json` finding > 0
- `.github/workflows/pr-validation.yml` (extended) — `comment` job
  now depends on `react-doctor`; "Ready to merge" requires both
  `quality-check` and `react-doctor` to be green
- The score badge in `README.md` will turn green on the merge of this
  PR

### Migration notes for future contributors

- When adding a new component, run `npm run doctor:check` and resolve
  every finding in the same PR. The score is the contract.
- If you hit a false positive, the disable must be on the same line
  the rule reports, must use the `react-doctor/<rule>` namespace
  (NOT `react/<rule>`), and must include a one-paragraph
  justification. The bar is high — if you find yourself disabling
  more than 2 rules per file, the config is probably wrong.
- The `<JsonLd>` component at `src/components/seo/JsonLd.tsx` is the
  single audited entry point for `dangerouslySetInnerHTML`. JSON-LD
  is the only accepted use case.
- Every iframe gets a `sandbox` attribute. The only acceptable
  combination with `allow-scripts` is `allow-scripts
  allow-same-origin`, and only for the Cal.com embed. The PDF viewer
  gets empty sandbox.

### Out of scope (intentional)

- 270× `unused-file` (deslop): `deadCode: false` — react-doctor does
  not trace App Router / Studio entry points; `next build` +
  `vitest run` prove reachability.
- 322× `design-*` findings: `ignore.tags: ["design"]` — design debt
  is tracked separately, not in the score.

### What does NOT change in this PR

- No visual changes. No new components. No new pages. No new
  dependencies beyond `swr` and `@testing-library/dom`. No Sanity
  schema changes. No env var changes.
