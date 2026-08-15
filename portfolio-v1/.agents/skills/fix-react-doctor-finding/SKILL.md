---
name: fix-react-doctor-finding
description: Use when asked to fix a specific react-doctor finding on the Namias portfolio. Reads the report, locates the file, applies the canonical fix pattern, re-runs the tool, and commits the slice.
---

# fix-react-doctor-finding

The fix is always: **read → locate → apply the canonical pattern → re-run → commit**.

## Step 1 — read the report

```bash
npm run doctor:json
node -e "
  const r = require('./.react-doctor/report.json');
  console.log(r.summary.errorCount, 'err,', r.summary.warningCount, 'warn');
  r.diagnostics.forEach(d =>
    console.log(d.filePath + ':' + d.line + ':' + d.column + ' [' + d.severity + '] ' + d.rule + ' — ' + d.title)
  );
"
```

## Step 2 — locate the file

The `filePath` in the report is relative to the repo root. Open it with the `read` tool, jump to the line number from the report.

## Step 3 — apply the canonical pattern

See `.agents/skills/run-react-doctor/SKILL.md` for the 12-rule catalog. The patterns:

| Rule | One-liner |
|---|---|
| `no-danger` | `import { JsonLd } from '@/components/seo/JsonLd'` and replace `<script dangerouslySetInnerHTML={...}>` with `<JsonLd data={...} />` |
| `iframe-missing-sandbox` | add `sandbox=""` (or `sandbox="allow-scripts ..."` with a justification comment for Cal.com) |
| `no-array-index-as-key` | replace `key={i}` with `key={item.slug ?? item._key ?? item.id ?? item.name}` |
| `no-fetch-in-effect` | `const { data } = useSWR(key, fetcher)` and move the fetch into a module-level function |
| `rendering-hydration-mismatch-time` | hoist `const X = computeAtModuleLoad()` and use `useState(X)` + `useEffect` to refresh |
| `button-has-type` | add `type="button"` (or `submit`/`reset`) as the first prop |
| `control-has-associated-label` | add `aria-label="..."` to the input |
| `prefer-tag-over-role` | swap `<div role="x">` for the native element OR add a documented `eslint-disable-next-line` on the same line as the `role` attribute |
| `only-export-components` | move helpers to `*.lib.ts` and types to `*.types.ts`; keep a barrel `index.ts` |
| `no-multi-comp` | extract a sibling file |
| `jsx-no-constructed-context-values` | `const value = useMemo(() => ({...}), [deps])` |
| `react-hooks/exhaustive-deps` | add the dep, or memoize the value with `useMemo` / `useCallback` |

## Step 4 — re-run

```bash
npm run doctor:json
```

Expect the targeted finding to be gone. The summary should drop by 1.

## Step 5 — run the full test suite

```bash
npm run test -- --run
```

All 266 tests across 29 files must pass. The fix must not change visual or functional parity.

## Step 6 — commit

One commit per fix. Message format:

```
fix(doctor): <one-line description> (<rule>, EPIC-<n> S-<x.y>)

Closes:
  - F-NNN file:line: <one-line context>
  - ...

Verified:
- vitest: 29/29 test files, 266/266 tests pass
- doctor:check findings drop from N to N-1
```

Use the F-NNN id from `docs/react-doctor/findings.json` (the historical baseline); for findings introduced after baseline, omit the cross-reference and describe the file/line directly.

## When NOT to disable a rule

- If a rule fires on a false positive that is unavoidable (e.g. CSS selector string containing the token `button` in `FOCUSABLE_SELECTOR`), the disable comment must:
  1. Sit on the line the rule reports, not the line above
  2. Include a one-paragraph justification that names the alternative and why it was rejected
  3. Use the `react-doctor/<rule>` namespace (NOT `react/<rule>`)
- If you find yourself disabling more than 2 rules per file, stop and ask — the configuration is probably wrong, not the code.

## Reference documents

- `docs/react-doctor/scoreboard.md` — full journey from 91/100 baseline to 100/100, with the commit hash that closed each category
- `docs/react-doctor/findings.json` — frozen F-NNN catalog from the baseline
- `docs/react-doctor/triage.md` — strategy for each rule
- `docs/react-doctor/epic-N-report.md` — per-epic narrative
