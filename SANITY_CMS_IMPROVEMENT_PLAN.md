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

### 4. Align Studio structure with the website presentation model

Make the Studio reflect how the localhosted portfolio is actually presented so editors can reason about what changes appear where.

Recommended improvements:

- Mirror the homepage composition in the Studio structure: hero, main sections, sidebar sections, modals, and footer-related content.
- Group reusable singletons and section-level documents in the same order the website renders them.
- Add clear labels for content that feeds the localhost site directly versus content that only supports editorial workflows.
- Keep the resume, site settings, hero section, and navigation-linked documents easy to reach from the Studio sidebar.

Why this matters:

- The Studio should feel like the control panel for the site, not a separate content bucket.
- Editors can understand the impact of each document faster.

### 5. Add presentation and preview parity for localhost

Make sure Studio preview behavior matches what the local website shows as closely as possible.

Recommended improvements:

- Verify that presentation links from Studio open the localhost site in the correct preview mode.
- Make document preview labels match the site section names and modal names.
- Validate that homepage singletons, blog posts, and resume content all preview correctly against localhost.
- Keep the preview origin and draft mode flow documented and easy to update.

Why this matters:

- Editors can trust that what they see in Studio is what the local site will render.
- Preview mismatches are easier to catch before publishing.

### 6. Add a content-vision workflow

Use the Sanity Vision tool and query patterns to inspect and verify content relationships during planning and maintenance.

Recommended improvements:

- Add a Vision-backed verification step for singleton documents and referenced collections.
- Use Vision queries to confirm document counts, references, and active resume selection.
- Document a standard set of queries for troubleshooting structure, presentation, and content parity.
- Keep sample queries for hero, resume, blog, and project content.

Why this matters:

- Vision gives a direct way to inspect the CMS data model without guessing.
- It helps confirm that the Studio structure matches what the website expects.

### 7. Make resume management Sanity-driven

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

### 8. Add import verification and parity checks

Create a repeatable way to confirm Sanity matches the JSON source.

Recommended improvements:

- Add a post-import summary that lists counts by document type.
- Add a parity checklist for each collection.
- Compare imported document counts against the dry-run plan.
- Flag any source file that is empty, partially imported, or missing references.

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
11. AI-agent slice prompt planning

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

Start with import resilience and reporting, then align Studio structure and localhost presentation before adding the Sanity-managed resume upload flow and finally the future AI-agent slice prompt.