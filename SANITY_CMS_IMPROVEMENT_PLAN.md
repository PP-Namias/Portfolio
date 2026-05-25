# Sanity CMS Improvement Plan

Last updated: 2026-05-25  
Project: PP Namias Portfolio (`namias.tech`)

## Goal

Make the Sanity CMS easier to maintain, safer to re-run, and more useful for ongoing content operations without breaking the current portfolio architecture.

## What Is Already Working Well

- The CMS is connected to the same project and dataset as the portfolio app.
- The migration runner already supports dry-run and live import modes.
- Core content types are mapped from `portfolio-resources/data/*.json` into Sanity documents.
- Assets are uploaded from the repo, including file names with spaces.
- The Studio opens locally and uses the shared root environment configuration.

## Areas To Improve Next

### 1. Make the import pipeline more resilient

Use the current `scripts/sanity/import.mjs` foundation to reduce failure risk during live runs.

Recommended improvements:

- Add per-file asset caching across the entire import run.
- Keep transient retry logic for 5xx upstream failures.
- Add a clearer progress summary for each content phase.
- Track created, updated, skipped, and failed document counts.

Why this matters:

- It reduces duplicate uploads.
- It makes stalled imports easier to diagnose.
- It gives clearer feedback when Sanity or the network is unstable.

### 2. Tighten schema parity with the JSON source

Keep aligning Studio schemas with the repository source data so the import stays lossless.

Recommended improvements:

- Keep verifying `portfolio-resources/data/*` against `studio/schemaTypes/*` one collection at a time.
- Preserve optional source fields instead of dropping them during normalization.
- Add missing schema fields only when the source data already contains meaningful content.
- Keep stable ordering fields for experience, projects, certifications, gallery items, and posts.

Why this matters:

- It keeps Sanity authoritative without losing source context.
- It prevents silent content loss when the import is re-run.

### 3. Improve editorial UX inside Studio

Make the content editing experience simpler for future updates.

Recommended improvements:

- Add better document previews for homepage singletons.
- Group documents in the Studio structure by content lifecycle: singleton, taxonomy, collection.
- Add description copy in schema fields so editors know which data is authoritative.
- Surface references like issuers, categories, and authors more clearly in the Studio UI.

Why this matters:

- Editors can find the right document faster.
- The Studio becomes easier to use without reading the import scripts.

### 4. Make resume management Sanity-driven

Make the resume easy to upload and switch from inside Studio instead of relying on a hardcoded file path.

Recommended improvements:

- Upgrade the `resume` document so editors can upload a PDF file directly in Sanity Studio.
- Keep a single active resume document rule so the website always knows which resume to use.
- Preserve the existing `/resume.pdf` fallback path for backward compatibility until the upload flow is fully stable.
- Expose the active resume URL in the site settings or resume modal wiring so the website reads it dynamically.

Why this matters:

- It lets the resume be updated from the CMS without editing the codebase.
- It reduces manual file replacement in the public folder.
- It makes the resume flow match the rest of the CMS-managed content.

### 5. Add import verification and parity checks

Create a repeatable way to confirm Sanity matches the JSON source.

Recommended improvements:

- Add a post-import summary that lists counts by document type.
- Add a parity checklist for each collection.
- Compare imported document counts against the dry-run plan.
- Flag any source file that is empty, partially imported, or missing references.

Why this matters:

- It turns migration work into a measurable process.
- It makes future re-imports safer.

### 6. Improve operational documentation

Write the minimum docs needed so the CMS can be run again without re-analysis.

Recommended improvements:

- Document required env vars for app, Studio, and import scripts.
- Document how to run `npm run sanity:dry-run` and `npm run sanity:import`.
- Document what to do when asset uploads fail with transient upstream errors.
- Document which collection should be improved next after parity is reached.

Why this matters:

- It lowers the support burden for future CMS changes.
- It keeps the migration path reproducible.

### 7. Add safer maintenance workflows

Use a slice-by-slice approach for future CMS improvements.

Recommended improvements:

- Keep one content type or one small schema improvement per commit.
- Validate every slice with dry-run before any live write.
- Keep `progress.txt` updated after each successful step.
- Avoid mixing docs, schema refactors, and app data-layer changes in the same slice unless necessary.

Why this matters:

- Smaller slices are easier to debug and revert.
- The repo history stays clear enough to audit later.

## Priority Order

1. Import resilience and diagnostics
2. Schema parity and lossless data mapping
3. Studio editorial UX improvements
4. Sanity-managed resume upload flow
5. Parity checks and verification summaries
6. Operational documentation
7. Maintenance workflow cleanup

## Suggested Near-Term Backlog

| ID | Item | Outcome |
| --- | --- | --- |
| CMS-001 | Add a reusable import summary report | Clearer import results after every run |
| CMS-002 | Add a parity checklist per collection | Easier validation against JSON source files |
| CMS-003 | Improve Studio document descriptions | Faster editing and fewer mistakes |
| CMS-004 | Add a CMS runbook section to repo docs | Simpler handoff for future maintenance |
| CMS-005 | Expand transient retry coverage | Better resilience for Sanity asset uploads |
| CMS-006 | Add a Studio-uploaded resume document | Update the resume from Sanity instead of hardcoding the file path |

## Definition Of Done

- The CMS import runner can be re-run safely.
- Dry-run and live import outputs are easy to compare.
- The Studio schema stays aligned with the JSON source.
- The resume can be updated from Sanity Studio without editing application code.
- Editors can update content without needing to inspect the migration code first.
- The repo includes enough documentation to continue the CMS work without re-analysis.

## Immediate Next Step

Start with import resilience and reporting, then add a Sanity-managed resume upload flow before continuing collection-by-collection parity checks.