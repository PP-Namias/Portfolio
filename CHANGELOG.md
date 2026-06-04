# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **react-doctor 0.2.16** (pinned) as a dev dependency; surfaces 12 React quality rules across Security, Bugs, Performance, Accessibility, and Maintainability.
- 6 npm scripts: `doctor`, `doctor:verbose`, `doctor:json`, `doctor:baseline`, `doctor:check`, `doctor:diff`.
- `doctor.config.json` at the repo root with per-rule severity, `deadCode: false` (deslop), and `ignore.tags: ["design"]` for design-debt findings.
- `<JsonLd>` component at `src/components/seo/JsonLd.tsx` — the single audited entry point for `dangerouslySetInnerHTML`.
- **SWR 2.4** as a runtime dependency; replaces `useEffect + fetch` for component-scoped data. Test isolation via `SWRConfig` with a per-test `provider`.
- `.github/workflows/react-doctor.yml` — fails any PR that introduces a finding. Threshold = 0 findings = 100/100.
- `.agents/skills/run-react-doctor/SKILL.md` and `.agents/skills/fix-react-doctor-finding/SKILL.md` — agent runbooks.
- `AGENTS.md` — top-level guide for agents and contributors.
- `docs/react-doctor/scoreboard.md` — the journey from 91/100 to 100/100, with closing commits, per-rule ledger, and documented disables.
- `docs/react-doctor/PR_NOTES.md` — showcase PR description.
- `docs/react-doctor/epic-3-report.md`, `epic-4-report.md`, `epic-5-report.md` — per-category narratives.

### Changed

- `next.config.js` — no functional change in this slice, but documented alongside the clinic.
- Every JSX `<button>` now has an explicit `type` attribute.
- Every iframe now has a `sandbox` attribute (Cal.com = `allow-scripts allow-same-origin` with justification; PDF = empty most-restrictive).
- All list children use stable keys from data (not array indices).
- `SanityField` split into `SanityField.tsx` (component) + `sanity-field.lib.ts` (helpers) + `sanity-field.types.ts` (types) with a barrel `index.ts`.
- `Footer` year now hoisted to a module-level constant to avoid hydration drift.
- `.github/workflows/pr-validation.yml` — `comment` job now depends on the new `react-doctor` job; PR status table includes a "React Doctor (100/100)" row.

### Security

- 3× `dangerouslySetInnerHTML` findings routed through the audited `<JsonLd>` component.
- 2× iframe `sandbox` findings closed.

### Documentation

- `README.md` — quality-gates table; react-doctor score badge.
- New `AGENTS.md` with the agent skill index and the react-doctor quality gate.
- New agent skills for running and fixing react-doctor findings.
