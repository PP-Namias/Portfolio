---
name: run-react-doctor
description: Use when asked to run, read, or interpret react-doctor output on the Namias portfolio. Covers the npm scripts, the doctor.config.json schema, the score model, the 12-rule catalog, and which findings are real vs false-positive by design.
---

# run-react-doctor

react-doctor (https://react.doctor) is pinned to **0.2.16** in `package.json` and configured via `doctor.config.json` at the repo root. It runs against `src/**` only — studio code, scripts, and test files are excluded by config (see `ignore.files`).

## Scripts (use these, not the raw CLI)

| Script | What it writes | When to use |
|---|---|---|
| `npm run doctor` | TTY report to stdout | Local check while iterating |
| `npm run doctor:verbose` | TTY + extra context | When a finding is unclear |
| `npm run doctor:json` | `.react-doctor/report.json` | When you need to parse or diff |
| `npm run doctor:baseline` | `.react-doctor/baseline.json` + `docs/react-doctor/baseline.{json,txt}` | Recapture the baseline (only at release branches) |
| `npm run doctor:check` | Same as `npm run doctor` but `set -e` | Used by CI |
| `npm run doctor:diff` | diff against HEAD | Comparing branches |

The CI gate is `.github/workflows/react-doctor.yml` (threshold = 0 findings = 100/100).

## The 12-rule catalog (and what to fix vs ignore)

`doctor.config.json` declares the per-rule severity. The rules, in score order:

### Security (errors)
- `no-danger` — `dangerouslySetInnerHTML` without a sandbox. **Fix:** route through the `<JsonLd>` component at `src/components/seo/JsonLd.tsx` (the single audited entry point).
- `iframe-missing-sandbox` — every `<iframe>` must set `sandbox`. **Fix:** add the attribute with the minimum capability set. Cal.com is the only one that needs `allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox`; the PDF viewer gets empty sandbox.

### Bugs (errors)
- `no-array-index-as-key` — re-orderable list using the index as the React key. **Fix:** use a stable id from the data (`slug`, `_key`, `name`, `id`).
- `no-fetch-in-effect` — `useEffect` + `fetch` is a footgun (no abort, no dedupe, no retry). **Fix:** use SWR (`swr@^2.4.1`) with a `null` key to skip; in tests, wrap the tree in `<SWRConfig value={{ provider: () => new Map() }}>` to isolate the cache.

### Performance (warnings)
- `rendering-hydration-mismatch-time` — calling `new Date()` or similar in render. **Fix:** hoist to a module-level constant; only re-derive in a `useEffect` if the value can change during the lifetime of the tab.

### Accessibility (warnings)
- `button-has-type` — `<button>` without an explicit `type`. **Fix:** add `type="button"` (or `submit`/`reset` for forms). For icon-only buttons, add an `aria-label` too.
- `control-has-associated-label` — input without a label. **Fix:** add `aria-label` or a `<label htmlFor>`.
- `prefer-tag-over-role` — `role="..."` on a div when a native element would do. **Fix:** use the native element. **Exception:** ARIA patterns without a native equivalent (`role="listbox"`, `role="dialog"` inside a `useDialog` hook) need a documented disable — `// eslint-disable-next-line react-doctor/prefer-tag-over-role` on the same line as the `role` attribute.

### Maintainability (warnings)
- `only-export-components` — file exports a component plus utilities/types. **Fix:** move non-component exports to `*.lib.ts` and `*.types.ts` siblings; keep a barrel `index.ts`.
- `no-multi-comp` — multiple components in one file. **Fix:** extract to a sibling file.
- `jsx-no-constructed-context-values` — `<MyContext.Provider value={{...}}>` allocates a new object on every render. **Fix:** wrap the value in `useMemo` and include the dependencies.
- `exhaustive-deps` / `react-hooks/exhaustive-deps` — ESLint's hook-deps rule, surfaced through react-doctor. **Fix:** add the dep; if intentional, memoize the value with `useMemo` or `useCallback`.

## What is intentionally NOT in the score

`doctor.config.json` excludes these by design:

- **270× `unused-file`** (`deadCode: false`) — react-doctor does not trace Next.js App Router conventions or Sanity Studio entry points. Per-file reachability is proven by `next build` + `vitest run`.
- **322× `design-*`** (`ignore.tags: ["design"]`) — design-debt findings, not correctness. They are tracked in the design backlog, not the score.
- **Studio / scripts / tests** (`ignore.files`) — separate lint lanes.

If a finding appears in one of those buckets, do not fix it; it is a deslop false positive.

## Reading the JSON report

```js
const r = require('./.react-doctor/report.json');
console.log(r.summary.errorCount, 'err,', r.summary.warningCount, 'warn');
r.diagnostics.forEach(d => console.log(d.filePath + ':' + d.line + ':' + d.column + ' [' + d.severity + '] ' + d.rule + ' — ' + d.title));
```

## Score model

- 9 errors ≈ 9 points (each error ~1 point)
- 34 warnings ≈ 1-2 points (warnings are non-linear; the score has a "no findings" bonus)
- The threshold in CI is **0 findings = 100/100**. The local `npm run doctor` shows the score from the share API; if it is unreachable, the local report still says "No issues found!" and the PR gate still passes.
