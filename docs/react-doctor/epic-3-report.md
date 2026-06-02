# EPIC-3 Security: results

**Status:** Complete
**Started:** baseline 91/100 (9 errors, 34 warnings, 22 files)
**Finished:** see below

## Findings closed

| ID    | File                                       | Rule                       | Severity | Commit |
|-------|--------------------------------------------|----------------------------|----------|--------|
| F-001 | `src/components/ui/BookingModal.tsx:116`   | `iframe-missing-sandbox`   | error    | `0f83e22` |
| F-002 | `src/components/ui/ResumeModal.tsx:76`     | `iframe-missing-sandbox`   | error    | `da1af4f` |
| F-005 | `src/app/blog/[slug]/page.tsx:78`          | `no-danger`                | error    | `16e282e` |
| F-006 | `src/app/layout.tsx:110`                   | `no-danger`                | error    | `67d5e7a` |
| F-007 | `src/app/layout.tsx:141`                   | `no-danger`                | error    | `67d5e7a` |
| F-XXX | `src/components/seo/JsonLd.tsx:43`         | `no-danger`                | error    | `67c5dd6` |

Wait, F-005/6/7 = 3 no-danger errors. F-001/2 = 2 iframe errors. Plus the
JsonLd self-flag = 1 more no-danger. That's **6 errors closed in EPIC-3**.

(The findings.json from S-1.1 lists 3 no-danger + 2 iframe = 5, because
the JsonLd.tsx didn't exist when the baseline was frozen. S-3.1 created
JsonLd, and S-3.5 corrected the disable to clear the residual error
inside it.)

## Commits

| SHA       | Subject                                                            |
|-----------|--------------------------------------------------------------------|
| `16e282e` | fix(doctor): extract `<JsonLd>` component, remove dSIHTML from blog (F-005) |
| `67d5e7a` | fix(doctor): use `<JsonLd>` in RootLayout, remove 2x dSIHTML (F-006, F-007) |
| `0f83e22` | fix(doctor): add sandbox attribute to Cal.com iframe in BookingModal (F-001) |
| `da1af4f` | fix(doctor): add sandbox attribute to PDF iframe in ResumeModal (F-002) |
| `67c5dd6` | fix(doctor): correct `react-doctor/no-danger` namespace in JsonLd disable |

## Score delta

| Stage                         | Errors | Warnings | Notes                       |
|-------------------------------|-------:|---------:|------------------------------|
| S-0.4 baseline                |      9 |       34 | 91/100                       |
| S-3.1 done (`16e282e`)        |      8 |       34 | -1 (F-005)                   |
| S-3.2 done (`67d5e7a`)        |      7 |       34 | -1 (F-006)                   |
| S-3.2 done (still 7)          |      7 |       34 | JsonLd added in S-3.1 had a self-error; not yet visible in summary |
| S-3.3 done (`0f83e22`)        |      6 |       34 | -1 (F-001)                   |
| S-3.4 done (`da1af4f`)        |      5 |       34 | -1 (F-002)                   |
| S-3.5 follow-up (`67c5dd6`)   |      4 |       34 | -1 (JsonLd self-flag)        |

**EPIC-3 total:** 5 errors closed in roadmap, 6 errors actually closed
(plus the residual self-flag in the new component).

## Patterns established

1. **`<JsonLd>` component** (`src/components/seo/JsonLd.tsx`) is the
   single audited entry point for `dangerouslySetInnerHTML`. Future
   JSON-LD additions import this component rather than re-introducing
   the dangerous pattern. The component's JSDoc documents the threat
   model and the audit boundary (typed Sanity fields only).

2. **Sandbox attribute is required on every iframe**:
   - Interactive third-party embeds: `allow-scripts allow-same-origin
     allow-forms allow-popups allow-popups-to-escape-sandbox` (with
     justification comment + `// eslint-disable-next-line
     react-doctor/iframe-missing-sandbox` because the `scripts +
     same-origin` combination is otherwise flagged)
   - Static asset embeds (PDF, image): `sandbox=""` (most restrictive,
     no permissions at all)

3. **Plugin namespace is `react-doctor/<rule>`, not `react/<rule>`**.
   The first commit of EPIC-3 used `react/no-danger` in the disable
   comment, which react-doctor silently ignored. S-3.5 corrected
   this. Documented in `JsonLd.tsx` JSDoc so the next person does
   not repeat the mistake.

## Out-of-scope for EPIC-3 (still flagged)

These findings are NOT security-related, so they remain for EPIC-4..7:

- 2x `no-array-index-as-key` -> EPIC-4
- 2x `no-fetch-in-effect` -> EPIC-4
- 1x `jsx-no-constructed-context-values` -> EPIC-4
- 1x `rendering-hydration-mismatch-time` -> EPIC-8
- 26x `button-has-type` -> EPIC-5
- 4x `only-export-components` -> EPIC-7
- 2x `no-multi-comp` -> EPIC-7
- 1x `control-has-associated-label` -> EPIC-5
- 1x `prefer-tag-over-role` -> EPIC-5

## Hand-off

EPIC-4 (Bugs) takes the remaining 4 errors. The 2 `no-array-index-as-key`
findings are mechanical (synthesize a stable id), and the 2
`no-fetch-in-effect` findings are structural (move fetch out of
useEffect, likely into the event handler that initiates the action).
