# Sanity CMS Full Integration Master Plan

Last updated: 2026-05-27
Status: In progress (slice execution started)

## Objective

Migrate the portfolio to a fully Sanity-driven architecture so all content and media come from Sanity Studio.
After successful migration and parity verification, remove local hardcoded and local JSON/public content dependencies that are no longer needed.

## End State (Definition of Done)

- Website content is loaded from Sanity only (with explicit fallback policy removed at final cutover).
- Images/media rendered by the site come from Sanity assets/CDN.
- Local source content files are removed (or archived outside runtime path) after parity proof.
- No section relies on hardcoded static content for production rendering.
- Studio workflow is sufficient for non-developer content edits.
- Build, lint, tests, and smoke checks pass.
- Git working tree is clean at the end (no untracked/uncommitted files).

## Guardrails

- Work in small slices; one logical slice per commit.
- Validate each slice before commit.
- Do not delete legacy local data until parity checklist passes.
- Keep rollback points (tag or commit markers) before destructive deletion slices.
- Keep schema changes backward compatible until cutover phase.

## Migration Tracking Table

| Slice ID | Scope | Status | Commit |
| --- | --- | --- | --- |
| SANITY-FULL-001 | Audit and map all runtime content sources | Complete | 288d26b |
| SANITY-FULL-002 | Finalize missing schema fields/types | Complete | 63db28d |
| SANITY-FULL-003 | Harden parity-report output and strict mode | Complete | 9c02227 |
| SANITY-FULL-004 | Cut over profile/hero/about runtime loaders | Complete | d22c2218c7086cd275525e233c5cd8fd3801b616 |
| SANITY-FULL-005 | Cut over projects/experience/certifications loaders | Complete | 82288da |
| SANITY-FULL-006 | Cut over gallery/memberships/recommendations/socials loaders | Complete | f522400 |
| SANITY-FULL-007 | Cut over blog and resume runtime path | Complete | 5f000e2 |
| SANITY-FULL-008 | Cut over media helpers and remove local image runtime refs | Complete | local:SANITY-FULL-008 |
| SANITY-FULL-009 | Remove legacy local data modules and fallback code | Not started | - |
| SANITY-FULL-010 | Final QA, docs, and handoff cleanup | Not started | - |

## Phase-by-Phase Plan

## Phase 0: Baseline and Safety

Goals:
- Establish a safe migration baseline and inventory what is currently local.

Tasks:
- Freeze current content inventory from `portfolio-resources/data`, `public/images`, `src/data`, and related adapters.
- Confirm canonical Sanity project ID/dataset and required env vars.
- Add migration tracking table (slice ID, scope, status, commit hash).
- Capture current page snapshots for visual parity baseline.

Exit criteria:
- Complete migration inventory exists.
- Environment and project connection are stable.
- A repeatable pre-flight checklist is documented.

## Phase 1: Schema and Model Parity

Goals:
- Ensure every runtime content domain has a complete Sanity schema.

Tasks:
- Verify parity for profile, hero/about, projects, experience, certifications, technologies, socials, memberships, recommendations, gallery, blog, resume, site settings.
- Add/adjust schema fields to preserve all needed source metadata.
- Confirm references and slugs for linked content.
- Add clear editor-facing field descriptions.

Exit criteria:
- All website content domains are represented in Studio.
- No required runtime field is missing from schema.

## Phase 2: Migration Pipeline Hardening

Goals:
- Make import deterministic, idempotent, and diagnosable.

Tasks:
- Finalize dry-run/import/parity scripts.
- Guarantee stable document IDs and reference wiring.
- Implement robust asset upload handling and dedup logic.
- Add migration summary report (created/updated/skipped/failed).

Exit criteria:
- Re-running import does not create duplicates.
- Parity report can explain any mismatch quickly.

## Phase 3: Runtime Data-Layer Cutover (Read Path)

Goals:
- Move website reads from local data modules to Sanity-backed loaders.

Tasks:
- Replace local data imports in app runtime with CMS access layer.
- Ensure section components consume Sanity-fed normalized data.
- Keep temporary fallback only where migration is incomplete.
- Add tests for loader normalization and missing field handling.

Exit criteria:
- Primary content rendering is Sanity-backed.
- Temporary fallback is isolated and documented.

## Phase 4: Media Cutover (Image/Asset Path)

Goals:
- Switch runtime image usage to Sanity-hosted assets.

Tasks:
- Ensure all section media fields resolve via Sanity image/file helpers.
- Validate responsive image behavior and performance.
- Replace hardcoded `public/images/*` references used by runtime content.
- Add checks for missing/broken image refs.

Exit criteria:
- Runtime content media is served from Sanity.
- No required runtime content image depends on local public data files.

## Phase 5: Live Update and Editorial Workflow

Goals:
- Demonstrate full CMS capability: edit, preview, publish, and reflect.

Tasks:
- Verify draft/preview flow for critical pages.
- Verify publish -> site refresh/revalidation path.
- Validate Studio editorial usability for each content type.
- Document day-to-day editor workflow.

Exit criteria:
- Content team can update site through Studio only.
- Publish behavior is predictable and verified.

## Phase 6: Deletion and Cleanup Cutover

Goals:
- Remove old local data/media dependencies after parity lock.

Tasks:
- Run final parity gate (strict) and manual smoke checks.
- Remove obsolete local JSON runtime sources.
- Remove obsolete local media dependencies that are replaced by Sanity assets.
- Delete dead adapters, fallback-only code, and unused types.
- Update docs to reflect Sanity-only architecture.

Exit criteria:
- No production runtime dependence on local hardcoded content files.
- Repo passes lint/build/tests after cleanup.

## Phase 7: Final Verification and Handoff

Goals:
- Close migration cleanly with a clean git tree and handoff docs.

Tasks:
- Run final validation suite (lint, build, tests, smoke checks).
- Confirm zero untracked and zero uncommitted files.
- Produce completion report: what was removed, what remains, how to operate.

Exit criteria:
- Migration complete and demonstrable.
- Git status clean.

## Slice Execution Protocol (Commit Every Slice)

For every slice:
1. Implement only one logical scope.
2. Run relevant checks (at minimum lint + targeted tests; full build on integration slices).
3. Update progress log/checklist.
4. Commit with conventional message and slice ID.

Commit format examples:
- `feat(cms): SANITY-FULL-001 normalize schema parity for profile and social links`
- `refactor(data): SANITY-FULL-010 cutover homepage loaders to sanity`
- `chore(cleanup): SANITY-FULL-030 remove legacy local content sources`

## Validation Gates by Phase

- Phase 0-2: script verification + lint + targeted tests.
- Phase 3-5: lint + build + targeted tests + page smoke checks.
- Phase 6-7: full lint + full build + tests + manual CMS publish demo.

## Deletion Checklist (Must Be True Before Removal)

- Final parity report is green for all required content types.
- Visual smoke checks pass for homepage, blog list, blog detail, modals.
- Asset references resolve from Sanity without fallback.
- Rollback point exists (commit/tag).
- Team confirms local content source retirement.

## Risks and Mitigation

- Risk: Silent field mismatch during cutover.
  Mitigation: strict normalization tests + parity report diffs.

- Risk: Broken media after local image removal.
  Mitigation: media audit + broken-link/image smoke run before deletion.

- Risk: Runtime instability while deleting fallbacks.
  Mitigation: staged fallback removal by section, not one big delete.

## Suggested Slice Backlog (Initial)

- SANITY-FULL-001: Audit and map all runtime content sources.
- SANITY-FULL-002: Finalize missing schema fields/types.
- SANITY-FULL-003: Harden parity-report output and strict mode.
- SANITY-FULL-004: Cut over profile/hero/about runtime loaders.
- SANITY-FULL-005: Cut over projects/experience/certifications loaders.
- SANITY-FULL-006: Cut over gallery/memberships/recommendations/socials loaders.
- SANITY-FULL-007: Cut over blog and resume runtime path.
- SANITY-FULL-008: Cut over media helpers and remove local image runtime refs.
- SANITY-FULL-009: Remove legacy local data modules and fallback code.
- SANITY-FULL-010: Final QA, docs, and handoff cleanup.

## Deliverables

- This master plan file.
- `SANITY_RUNTIME_CONTENT_AUDIT.md`.
- `SANITY_SCHEMA_TYPE_PARITY_AUDIT.md`.
- Slice-by-slice commits in git history.
- Final completion report with clean working tree proof.
