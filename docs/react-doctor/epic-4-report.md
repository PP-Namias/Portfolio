# EPIC-4 Bugs: results

**Status:** Complete
**Started:** post-EPIC-3 (4 errors, 34 warnings, 22 files)
**Finished:** see below

## Findings closed

| ID    | File                                              | Rule                                  | Severity | Commit |
|-------|---------------------------------------------------|---------------------------------------|----------|--------|
| F-003 | `src/components/sections/AboutSection.tsx:39`    | `no-array-index-as-key`               | error    | `0abf62b` |
| F-004 | `src/components/sections/RecommendationsCarousel.tsx:108` | `no-array-index-as-key`     | error    | `cdd1719` |
| F-008 | `src/components/ui/ChatPanel.tsx:144`             | `no-fetch-in-effect`                  | error    | `a9e8062` |
| F-009 | `src/components/ui/ResumeModal.tsx:17`            | `no-fetch-in-effect`                  | error    | `94f7bd9` |
| F-039 | `src/hooks/useAccentColor.tsx:70`                 | `jsx-no-constructed-context-values`   | warning  | `a74e71c` |

**5 findings closed in EPIC-4.** All 4 remaining errors are now gone;
the warning count is down by 1 (the only EPIC-4 warning).

## Commits

| SHA       | Subject                                                       |
|-----------|---------------------------------------------------------------|
| `0abf62b` | fix(doctor): stable keys for paragraphs and education in AboutSection (F-003) |
| `cdd1719` | fix(doctor): stable keys for carousel dot navigation (F-004)  |
| `a9e8062` | fix(doctor): replace useEffect availability probe with SWR (F-008) |
| `94f7bd9` | fix(doctor): replace useEffect resume lookup with SWR + isolate test cache (F-009) |
| `a74e71c` | fix(doctor): memoize AccentColorContext value to prevent re-renders (F-039) |

## Score delta

| Stage                          | Errors | Warnings | Score |
|--------------------------------|-------:|---------:|------:|
| S-0.4 baseline                 |      9 |       34 |   91  |
| EPIC-3 done                    |      4 |       34 |  ~96  |
| EPIC-4 S-4.1 done              |      3 |       34 |  ~97  |
| EPIC-4 S-4.2 done              |      2 |       34 |  ~97  |
| EPIC-4 S-4.3 done              |      1 |       34 |  ~98  |
| EPIC-4 S-4.4 done              |      0 |       34 |  ~99  |
| EPIC-4 S-4.5 done (this commit)|      0 |       33 |  ~99  |

The score formula is nonlinear; clearing the last error unlocks a
"no errors" bonus that pushes the score into the 99-100 range. The
remaining 1-2 points come from clearing the 33 warnings across
EPIC-5, EPIC-7, and EPIC-8.

## Patterns established

1. **Stable React keys from data, not from array indices.**
   - Paragraphs (text content): use the full paragraph string
   - Education (typed CMS objects): use
     `${institution}-${degree}-${startedAt}` -- the data already
     has a unique identity
   - Carousel dots (button navigation): use the underlying
     recommendation's `name` field; the `index` stays in the click
     handler closure, not the key
   - The pattern: if you find yourself writing `${...}-${i}`,
     the data probably has a stable identity. Use it.

2. **SWR for component-scoped data fetching.**
   - The `swr@^2.4.1` package was added (S-4.3 commit `a9e8062`).
   - Pattern: `useSWR(key, fetcher, opts)` where:
     - `key` is the URL when fetching, `null` when skipping
     - `fetcher` calls `fetch(url)` and throws on `!res.ok`
     - `opts.refreshInterval` for periodic re-fetch
     - `opts.revalidateOnReconnect: true` to replicate the old
       `online` event handler
     - `opts.revalidateOnFocus: false` for non-critical data
     - `opts.dedupingInterval` to dedupe in-flight requests
   - Test isolation: wrap renders in
     `<SWRConfig value={{ provider: () => new Map() }}>` to
     avoid SWR's module-level default cache leaking across tests
   - No useEffect for data fetching anywhere in the codebase
     after EPIC-4

3. **Memoize the value passed to `<Context.Provider>`.**
   - Use `useMemo(() => ({ ... }), [deps])` with the actual state
     dependencies
   - Already-memoized callbacks (e.g. via `useCallback`) keep
     their reference, so the memo only updates when the state
     changes
   - Without this, every consumer re-renders on every parent
     render, defeating the point of context

## Out-of-scope for EPIC-4 (still flagged)

These findings remain for EPIC-5, EPIC-7, EPIC-8:

- 26x `button-has-type` -> EPIC-5
- 4x `only-export-components` -> EPIC-7
- 2x `no-multi-comp` -> EPIC-7
- 1x `control-has-associated-label` -> EPIC-5
- 1x `prefer-tag-over-role` -> EPIC-5
- 1x `rendering-hydration-mismatch-time` -> EPIC-8

## Hand-off

EPIC-5 (Accessibility) is next: 28 warnings. The work is
mechanical -- add `type="button"` to 26 buttons, add a label
or aria-label to 1 input, swap a `<div role="button">` for a
real `<button>`. Each fix is small and isolated, so the EPIC
should be quick to land.
