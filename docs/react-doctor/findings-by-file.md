# react-doctor findings by file

**Source:** [findings.json](./findings.json) (43 findings, 22 affected files, 91/100 score)

**Sort:** by count desc, then by file path asc. Hot files surface first.

Within each file, findings are sorted by line asc, column asc.

---

## src/components/ui/ChatPanel.tsx (8 findings: 1 error, 7 warn)

| ID | Line:Col | Rule | Severity | Title |
|----|---------:|------|----------|-------|
| F-008 | 144:3 | `no-fetch-in-effect` | error | Data fetching inside an effect |
| F-024 | 313:12 | `button-has-type` | warning | Button missing explicit type |
| F-025 | 359:14 | `button-has-type` | warning | Button missing explicit type |
| F-026 | 369:12 | `button-has-type` | warning | Button missing explicit type |
| F-027 | 425:22 | `button-has-type` | warning | Button missing explicit type |
| F-028 | 457:16 | `button-has-type` | warning | Button missing explicit type |
| F-029 | 478:16 | `button-has-type` | warning | Button missing explicit type |
| F-036 | 506:11 | `control-has-associated-label` | warning | Control missing accessible label |

## src/components/sections/GallerySection.tsx (5 findings: 0 error, 5 warn)

| ID | Line:Col | Rule | Severity | Title |
|----|---------:|------|----------|-------|
| F-014 | 129:12 | `button-has-type` | warning | Button missing explicit type |
| F-015 | 194:12 | `button-has-type` | warning | Button missing explicit type |
| F-016 | 222:14 | `button-has-type` | warning | Button missing explicit type |
| F-017 | 236:14 | `button-has-type` | warning | Button missing explicit type |
| F-018 | 245:14 | `button-has-type` | warning | Button missing explicit type |

## src/components/sections/CertificationsSection.tsx (3 findings: 0 error, 3 warn)

| ID | Line:Col | Rule | Severity | Title |
|----|---------:|------|----------|-------|
| F-011 | 63:12 | `button-has-type` | warning | Button missing explicit type |
| F-012 | 119:10 | `button-has-type` | warning | Button missing explicit type |
| F-013 | 151:16 | `button-has-type` | warning | Button missing explicit type |

## src/components/ui/BookingModal.tsx (3 findings: 1 error, 2 warn)

| ID | Line:Col | Rule | Severity | Title |
|----|---------:|------|----------|-------|
| F-001 | 116:10 | `iframe-missing-sandbox` | error | iframe missing sandbox attribute |
| F-020 | 68:16 | `button-has-type` | warning | Button missing explicit type |
| F-021 | 92:12 | `button-has-type` | warning | Button missing explicit type |

## src/components/ui/ResumeModal.tsx (3 findings: 2 error, 1 warn)

| ID | Line:Col | Rule | Severity | Title |
|----|---------:|------|----------|-------|
| F-002 | 76:10 | `iframe-missing-sandbox` | error | iframe missing sandbox attribute |
| F-009 | 17:3 | `no-fetch-in-effect` | error | Data fetching inside an effect |
| F-033 | 64:12 | `button-has-type` | warning | Button missing explicit type |

## src/app/layout.tsx (2 findings: 2 error, 0 warn)

| ID | Line:Col | Rule | Severity | Title |
|----|---------:|------|----------|-------|
| F-006 | 110:13 | `no-danger` | error | Use of dangerouslySetInnerHTML |
| F-007 | 141:11 | `no-danger` | error | Use of dangerouslySetInnerHTML |

## src/components/cms/SanityField.tsx (2 findings: 0 error, 2 warn)

| ID | Line:Col | Rule | Severity | Title |
|----|---------:|------|----------|-------|
| F-040 | 25:17 | `only-export-components` | warning | Non-component export in component file |
| F-041 | 37:17 | `only-export-components` | warning | Non-component export in component file |

## src/components/ui/Modal.tsx (2 findings: 0 error, 2 warn)

| ID | Line:Col | Rule | Severity | Title |
|----|---------:|------|----------|-------|
| F-031 | 109:18 | `button-has-type` | warning | Button missing explicit type |
| F-032 | 121:16 | `button-has-type` | warning | Button missing explicit type |

## src/components/ui/ThemeToggle.tsx (2 findings: 0 error, 2 warn)

| ID | Line:Col | Rule | Severity | Title |
|----|---------:|------|----------|-------|
| F-034 | 13:8 | `button-has-type` | warning | Button missing explicit type |
| F-035 | 23:6 | `button-has-type` | warning | Button missing explicit type |

## src/app/blog/[slug]/page.tsx (1 findings: 1 error, 0 warn)

| ID | Line:Col | Rule | Severity | Title |
|----|---------:|------|----------|-------|
| F-005 | 78:11 | `no-danger` | error | Use of dangerouslySetInnerHTML |

## src/app/error.tsx (1 findings: 0 error, 1 warn)

| ID | Line:Col | Rule | Severity | Title |
|----|---------:|------|----------|-------|
| F-010 | 58:10 | `button-has-type` | warning | Button missing explicit type |

## src/app/opengraph-image.tsx (1 findings: 0 error, 1 warn)

| ID | Line:Col | Rule | Severity | Title |
|----|---------:|------|----------|-------|
| F-038 | 4:14 | `only-export-components` | warning | Non-component export in component file |

## src/app/twitter-image.tsx (1 findings: 0 error, 1 warn)

| ID | Line:Col | Rule | Severity | Title |
|----|---------:|------|----------|-------|
| F-039 | 4:14 | `only-export-components` | warning | Non-component export in component file |

## src/components/layout/Footer.tsx (1 findings: 0 error, 1 warn)

| ID | Line:Col | Rule | Severity | Title |
|----|---------:|------|----------|-------|
| F-043 | 62:19 | `rendering-hydration-mismatch-time` | warning | Time or random value in JSX |

## src/components/sections/AboutSection.tsx (1 findings: 1 error, 0 warn)

| ID | Line:Col | Rule | Severity | Title |
|----|---------:|------|----------|-------|
| F-003 | 39:15 | `no-array-index-as-key` | error | Array index used as a key |

## src/components/sections/RecommendationsCarousel.tsx (1 findings: 1 error, 0 warn)

| ID | Line:Col | Rule | Severity | Title |
|----|---------:|------|----------|-------|
| F-004 | 108:15 | `no-array-index-as-key` | error | Array index used as a key |

## src/components/sections/TechStackSection.tsx (1 findings: 0 error, 1 warn)

| ID | Line:Col | Rule | Severity | Title |
|----|---------:|------|----------|-------|
| F-019 | 61:10 | `button-has-type` | warning | Button missing explicit type |

## src/components/ui/Button.tsx (1 findings: 0 error, 1 warn)

| ID | Line:Col | Rule | Severity | Title |
|----|---------:|------|----------|-------|
| F-022 | 61:6 | `button-has-type` | warning | Button missing explicit type |

## src/components/ui/ChatMessage.tsx (1 findings: 0 error, 1 warn)

| ID | Line:Col | Rule | Severity | Title |
|----|---------:|------|----------|-------|
| F-023 | 88:18 | `button-has-type` | warning | Button missing explicit type |

## src/components/ui/ColorSchemePicker.tsx (1 findings: 0 error, 1 warn)

| ID | Line:Col | Rule | Severity | Title |
|----|---------:|------|----------|-------|
| F-042 | 73:11 | `prefer-tag-over-role` | warning | Role used instead of HTML tag |

## src/components/ui/HubMenu.tsx (1 findings: 0 error, 1 warn)

| ID | Line:Col | Rule | Severity | Title |
|----|---------:|------|----------|-------|
| F-030 | 278:10 | `button-has-type` | warning | Button missing explicit type |

## src/hooks/useAccentColor.tsx (1 findings: 0 error, 1 warn)

| ID | Line:Col | Rule | Severity | Title |
|----|---------:|------|----------|-------|
| F-037 | 70:34 | `jsx-no-constructed-context-values` | warning | Unstable context provider value |

---

## File impact summary

| File | Total | Errors | Warnings |
|------|------:|-------:|---------:|
| `src/components/ui/ChatPanel.tsx` | 8 | 1 | 7 |
| `src/components/sections/GallerySection.tsx` | 5 | 0 | 5 |
| `src/components/sections/CertificationsSection.tsx` | 3 | 0 | 3 |
| `src/components/ui/BookingModal.tsx` | 3 | 1 | 2 |
| `src/components/ui/ResumeModal.tsx` | 3 | 2 | 1 |
| `src/app/layout.tsx` | 2 | 2 | 0 |
| `src/components/cms/SanityField.tsx` | 2 | 0 | 2 |
| `src/components/ui/Modal.tsx` | 2 | 0 | 2 |
| `src/components/ui/ThemeToggle.tsx` | 2 | 0 | 2 |
| `src/app/blog/[slug]/page.tsx` | 1 | 1 | 0 |
| `src/app/error.tsx` | 1 | 0 | 1 |
| `src/app/opengraph-image.tsx` | 1 | 0 | 1 |
| `src/app/twitter-image.tsx` | 1 | 0 | 1 |
| `src/components/layout/Footer.tsx` | 1 | 0 | 1 |
| `src/components/sections/AboutSection.tsx` | 1 | 1 | 0 |
| `src/components/sections/RecommendationsCarousel.tsx` | 1 | 1 | 0 |
| `src/components/sections/TechStackSection.tsx` | 1 | 0 | 1 |
| `src/components/ui/Button.tsx` | 1 | 0 | 1 |
| `src/components/ui/ChatMessage.tsx` | 1 | 0 | 1 |
| `src/components/ui/ColorSchemePicker.tsx` | 1 | 0 | 1 |
| `src/components/ui/HubMenu.tsx` | 1 | 0 | 1 |
| `src/hooks/useAccentColor.tsx` | 1 | 0 | 1 |

**Total:** 43 findings, 22 files, score 91/100.

## Hot files (>= 3 findings)

- `src/components/ui/ChatPanel.tsx` (8 findings: 1 error, 7 warn)
- `src/components/sections/GallerySection.tsx` (5 findings: 0 error, 5 warn)
- `src/components/sections/CertificationsSection.tsx` (3 findings: 0 error, 3 warn)
- `src/components/ui/BookingModal.tsx` (3 findings: 1 error, 2 warn)
- `src/components/ui/ResumeModal.tsx` (3 findings: 2 error, 1 warn)

## Clean files (0 findings)

_Not applicable: this doc lists only affected files. Run `npx react-doctor` to list clean files._
