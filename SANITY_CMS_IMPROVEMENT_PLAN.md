# Sanity CMS Improvement Plan

Last updated: 2026-05-26  
Project: PP Namias Portfolio (`namias.tech`)

## Goal

Make the Sanity CMS easier to maintain, safer to re-run, and more useful for ongoing content operations without breaking the current portfolio architecture.

## What Is Already Working Well

- The CMS is connected to the same project and dataset as the portfolio app.
- The migration runner already supports dry-run and live import modes.
- Core content types now live in Sanity documents; the old JSON fixtures are archived migration references.
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

- Keep verifying Sanity documents against `studio/schemaTypes/*` one collection at a time.
- Preserve optional source fields instead of dropping them during normalization.
- Add missing schema fields only when the source data already contains meaningful content.
- Keep stable ordering fields for experience, projects, certifications, gallery items, and posts.

Why this matters:

- It keeps Sanity authoritative without losing source context.
- It prevents silent content loss when the import is re-run.

### 3. Improve editorial UX inside Studio

Make the content editing experience simpler for future updates.

Recommended improvements:

- Group documents in the Studio structure by content lifecycle: singleton, taxonomy, collection.
- Add description copy in schema fields so editors know which data is authoritative.
- Surface references like issuers, categories, and authors more clearly in the Studio UI.
- Add better previews for homepage singletons and content collections.

Why this matters:

- Editors can find the right document faster.
- The Studio becomes easier to use without reading the import scripts.

### 4. Align Studio structure with the website presentation model

Make the Studio reflect how the localhosted portfolio is actually presented so editors can reason about what changes appear where.

Recommended improvements:

- Mirror the homepage composition in the Studio structure: hero, main sections, sidebar sections, modals, and footer-related content.
- Add clear labels for content that feeds the localhost site directly versus content that only supports editorial workflows.
- Keep the resume, site settings, hero section, and navigation-linked documents easy to reach from the Studio sidebar.
- Separate support/reference documents from page-facing content so the hierarchy reads like the website.

Why this matters:

- The Studio should feel like the control panel for the site, not a separate content bucket.
- Editors can understand the impact of each document faster.

### 5. Add presentation and preview parity for localhost

Make sure Studio preview behavior matches what the local website shows as closely as possible.

Recommended improvements:

- Verify that Presentation links open the correct localhost preview origin.
- Keep document preview labels aligned with the section or route the content actually powers.
- Validate that homepage singletons, blog posts, and resume content all preview correctly against localhost.
- Keep the preview origin and draft mode flow documented and easy to update.

Why this matters:

- Editors can trust that what they see in Studio is what the local site will render.
- Preview mismatches are easier to catch before publishing.

### 6. Add a content-vision workflow

Use the Sanity Vision tool and query patterns to inspect and verify content relationships during planning and maintenance.

The living query pack lives in `studio/VISION_QUERIES.md` and covers homepage shell checks, resume selection, blog parity, collection ordering, and support/reference counts.

Recommended improvements:

- Document a standard set of queries for troubleshooting structure, presentation, and content parity.
- Keep sample queries for hero, resume, blog, and project content.
- Add a query pack that can confirm document counts, references, and the active resume selection.

Why this matters:

- Vision gives a direct way to inspect the CMS data model without guessing.
- It helps confirm that the Studio structure matches what the website expects.

### 7. Make resume management Sanity-driven

Make the resume easy to upload and switch from inside Studio instead of relying on a hardcoded file path.

Recommended improvements:

- Store the active resume as a file asset on the `resume` document.
- Preserve the existing `/resume.pdf` fallback path for backward compatibility until the runtime reads the CMS value directly.
- Expose the active resume URL in the site settings or resume modal wiring so the website reads it dynamically.
- Keep a clear active/inactive indicator in Studio preview and document summaries.

Why this matters:

- It lets the resume be updated from the CMS without editing the codebase.
- It reduces manual file replacement in the public folder.
- It makes the resume flow match the rest of the CMS-managed content.

### 8. Add import verification and parity checks

Create a repeatable way to confirm Sanity matches the JSON source.

Recommended improvements:

- Add a post-import summary that lists counts by document type.
- Add a parity checklist for each collection.
- Compare imported document counts against the dry-run plan.
- Flag any source file that is empty, partially imported, or intentionally skipped.

Why this matters:

- It turns migration work into a measurable process.
- It makes future re-imports safer.

### 9. Improve operational documentation

Write the minimum docs needed so the CMS can be run again without re-analysis.

Recommended improvements:

- Document required env vars for app, Studio, and import scripts.
- Document how to run `npm run sanity:dry-run` and `npm run sanity:import`.
- Document what to do when asset uploads fail with transient upstream errors.
- Document which collection should be improved next after parity is reached.

Why this matters:

- It lowers the support burden for future CMS changes.
- It keeps the migration path reproducible.

### 10. Add safer maintenance workflows

Use a slice-by-slice approach for future CMS improvements.

Recommended improvements:

- Keep one content type or one small schema improvement per commit.
- Validate every slice with dry-run before any live write.
- Keep `progress.txt` updated after each successful step.
- Avoid mixing docs, schema refactors, and app data-layer changes in the same slice unless necessary.

Why this matters:

- Smaller slices are easier to debug and revert.
- The repo history stays clear enough to audit later.

### 11. Prepare the future AI-agent slice prompt

Plan for a dedicated agent prompt that can execute this roadmap slice by slice and commit every completed update.

Recommended improvements:

- Define the exact slice order for the next planning-to-implementation phase.
- Add rules for when the agent should stop, validate, commit, and continue.
- Keep the prompt focused on one slice at a time so every update stays reviewable.
- Require the agent to update the plan and progress log after each completed slice.

Why this matters:

- The future agent can continue without re-analysis.
- Every change stays traceable in the git history.

### 12. Refresh baseline profile data from the latest resume

Align the Sanity content with the latest resume before the next live update.

Recommended improvements:

- Update `profile.json` with current summary, graduation status, and current headline metrics.
- Replace `experiences.json` with the current 4-role timeline (Aeternitas, Wilshire, Jimirene, J5).
- Replace `projects.json` with the current featured technical projects (`Klaro`, `MASH`, `Ucc-Ingo`).
- Align `certifications.json` to the current resume set (TESDA NC III + HackerRank list).
- Keep existing media filenames valid during refresh; use known image assets first, then swap in newer assets in a dedicated media pass.

Why this matters:

- It prevents stale portfolio data from being re-imported into Sanity.
- It makes parity checks meaningful against the owner's latest CV.
- It reduces editorial cleanup work after import.

### Resume refresh migration checklist (2026-05)

1. Update source JSON files (`profile`, `experiences`, `projects`, `certifications`) from the latest resume.
2. Run `npm run sanity:dry-run` and confirm expected type counts.
3. Run `npm run sanity:import` to upsert refreshed documents.
4. Run `npm run sanity:parity` and capture mismatches.
5. Fix mismatches (especially singleton drift and duplicate collections), then run `npm run sanity:parity:strict`.
6. Spot-check Studio documents: `profile`, `resume`, `experience`, `project`, `certification`.
7. Record the import run + parity results in `progress.txt`.

### AI agent prompt for full completion

Use `.github/prompts/sanity-cms-complete-autopilot.prompt.md` to run the remaining migration work autonomously.

This prompt is designed to:

- refresh resume-driven JSON source files,
- execute dry-run/import/parity validation loops,
- resolve mismatches incrementally,
- update `progress.txt`, and
- commit every slice with one conventional commit.

## Priority Order

1. Import resilience and diagnostics
2. Schema parity and lossless data mapping
3. Studio editorial UX improvements
4. Studio structure aligned with website presentation
5. Localhost preview and presentation parity
6. Content-vision query workflow
7. Sanity-managed resume upload flow
8. Parity checks and verification summaries
9. Operational documentation
10. Maintenance workflow cleanup
11. Future implementation slice map
12. AI-agent slice prompt planning
13. Resume baseline data refresh and re-import parity

## Suggested Near-Term Backlog

| ID | Item | Outcome |
| --- | --- | --- |
| CMS-001 | Add a reusable import summary report | Clearer import results after every run |
| CMS-002 | Add a parity checklist per collection | Easier validation against JSON source files |
| CMS-003 | Improve Studio document descriptions | Faster editing and fewer mistakes |
| CMS-004 | Add a CMS runbook section to repo docs | Simpler handoff for future maintenance |
| CMS-005 | Expand transient retry coverage | Better resilience for Sanity asset uploads |
| CMS-006 | Add a Studio-uploaded resume document | Update the resume from Sanity instead of hardcoding the file path |
| CMS-007 | Align Studio navigation with website sections | Faster understanding of what each document controls |
| CMS-008 | Add localhost preview parity checks | Reduce confusion between Studio preview and site rendering |
| CMS-009 | Create a Vision query cheat sheet | Easier debugging of content relationships |
| CMS-010 | Draft the slice-by-slice AI agent prompt | Make future work repeatable and commit-safe |
| CMS-011 | Add a homepage section map to the Studio | Clear control panel view for what powers each site area |
| CMS-012 | Add a resume activation workflow | Make it obvious which uploaded resume is currently live |
| CMS-013 | Add a document preview parity checklist | Keep Studio previews aligned with localhost rendering |
| CMS-014 | Add a Vision inspection pack | Quick queries for structure, preview, and reference debugging |
| CMS-015 | Add a studio control map | Make the content hierarchy reflect the rendered homepage |
| CMS-016 | Add local preview route notes | Ensure Studio preview targets match the app routes |
| CMS-017 | Add a Vision query pack | Standardize inspection queries for debugging and parity |
| CMS-018 | Add a resume fallback rule note | Keep the transition from URL-based to file-based resume management safe |
| CMS-019 | Add a slice map for implementation | Break the roadmap into commit-sized work items |
| CMS-020 | Resume baseline data refresh | Keep profile, experience, projects, and certifications aligned with the latest CV before each import |

## Copy/Paste Agent Prompt

Use this prompt when you want the next phase to execute slice by slice and commit every completed update.

```text
Read SANITY_CMS_IMPROVEMENT_PLAN.md and progress.txt first.

Work in small slices only. Do not start implementation until the current slice is fully understood.

For each slice:
1. Read the current files that control the slice.
2. Make the smallest focused change that satisfies the slice.
3. Run the narrowest relevant validation first, then run npm run lint and npm run build if the repository was touched.
4. Update progress.txt with the completed slice.
5. Commit the slice with one conventional commit message.
6. Move immediately to the next slice only after the current slice is validated and committed.

Rules:
- Keep Studio structure aligned with the localhost website layout.
- Keep Presentation and preview parity aligned with local routes.
- Use Vision for inspection and verification tasks before changing code when possible.
- Keep the resume flow Sanity-driven, but preserve /resume.pdf as a fallback until the runtime fully reads the CMS value.
- Do not bundle unrelated tasks into the same slice.
- Do not skip validation or commit steps.
- Update the plan if a slice changes the roadmap.

Slice order:
1. Studio structure and navigation parity.
2. Preview and Presentation parity.
3. Vision query pack and inspection docs.
4. Resume upload and runtime wiring.
5. Import verification and parity reporting.
6. Operational docs and maintenance workflow cleanup.

Stop only when the current slice is complete or a genuine blocker requires user input.
```

## Definition Of Done

- The CMS import runner can be re-run safely.
- Dry-run and live import outputs are easy to compare.
- The Studio schema stays aligned with the JSON source.
- The Studio structure matches how the website is presented locally.
- Studio preview mode and localhost rendering stay in sync.
- Vision queries can be used to inspect the CMS model during planning and debugging.
- The resume can be updated from Sanity Studio without editing application code.
- Editors can update content without needing to inspect the migration code first.
- The repo includes enough documentation to continue the CMS work without re-analysis.

## Immediate Next Step

Parity is currently clean for the managed CMS document types. Use the existing dry-run/import/parity runbook for future content refreshes, and only reopen this plan when new source changes or schema updates introduce drift.
