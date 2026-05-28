---
name: sanity-cms-complete-autopilot
description: "Autonomously complete the full Sanity CMS studio + migration workflow: structure, preview, Vision, resume, import parity, docs, and maintenance cleanup."
---

You are an autonomous coding agent working inside this repository.

Your mission is to complete the Sanity CMS migration program end-to-end so the Studio, preview/presentation flow, import pipeline, resume handling, parity checks, and maintenance docs are all aligned and production-ready.

## Mandatory first reads

1. `.github/copilot-instructions.md`
2. `SANITY_CMS_PR.md`
3. `progress.txt`
4. `scripts/sanity/README.md`
5. `studio/README.md`
6. `studio/VISION_QUERIES.md`
7. Archived migration fixture notes
8. `scripts/sanity/*.mjs`
9. `src/app/**`
10. `studio/sanity.config.ts`

## Source-of-truth rules

- Sanity is the source of truth for runtime content.
- Archived migration fixtures are historical migration references only.
- Do not invent content, links, achievements, certificates, or dates.
- Preserve the existing public fallback behavior unless a slice explicitly removes it.
- Keep media filenames valid and use existing repo assets before introducing new ones.
- Preserve stable IDs, slugs, ordering fields, and reference semantics.

## Scope of this completion prompt

This prompt is for the entire Sanity CMS completion effort, including:

- Studio structure/navigation parity
- Presentation/preview parity for localhost
- Vision query pack and inspection workflow
- Resume upload/runtime wiring
- Resume-driven source data refresh
- Import verification and parity reporting
- Operational documentation and maintenance cleanup
- Future prompt/agent planning if needed

## Slice order to follow

1. Studio structure and navigation parity
2. Preview and Presentation parity
3. Vision query pack and inspection docs
4. Resume upload and runtime wiring
5. Resume baseline data refresh
6. Import verification and parity reporting
7. Operational docs and maintenance workflow cleanup
8. Final AI-agent prompt / handoff refinement if still needed

## Execution protocol (strict)

For every slice:

1. Read the controlling files for that slice.
2. Make the smallest focused change that satisfies the slice.
3. Run the narrowest relevant validation first.
4. If the slice affects migration output, run `npm run sanity:dry-run`.
5. If the slice affects live data import, run `npm run sanity:import`.
6. Run `npm run sanity:parity` and address any mismatches that matter.
7. Run `npm run lint`.
8. Run `npm run build`.
9. Update `progress.txt` with the completed slice and validation results.
10. `git add -A`.
11. Create exactly one conventional commit for that slice.
12. Continue immediately to the next eligible slice.

## Hard constraints

- Keep Studio structure aligned with the localhost website composition.
- Keep Preview / Presentation links aligned with local routes and draft mode behavior.
- Keep the resume flow Sanity-driven while preserving `/resume.pdf` fallback until cutover is safe.
- Keep JSON source files intact unless a slice explicitly refreshes them from the latest resume.
- Keep import logic idempotent with stable `_id` behavior and `createOrReplace` semantics.
- Do not bundle unrelated changes into one commit.
- Do not skip validation or progress logging.

## Parity resolution policy

When `npm run sanity:parity` reports mismatches, resolve them in this order:

1. Singleton drift: `profile`, `resume`, `heroSection`, `techStack`
2. Duplicated collections: `experience`, `project`, `certification`, `membership`
3. Taxonomy/reference mismatches: `category`, `certificationIssuer`, `certificationCategory`, `galleryCategory`
4. Asset mismatches or missing upload references
5. Remaining content drift in blog, gallery, socials, or recommendations

## Resume refresh policy

When resume content changes:

1. Update the relevant Sanity documents first.
2. Keep the latest resume wording, titles, and dates in Sanity.
3. Preserve existing assets unless a real replacement asset is available.
4. Re-run `sanity:dry-run`, `sanity:import`, and `sanity:parity`.
5. Fix count drift before moving on.

## Studio / preview policy

- Keep homepage, blog, and resume previews aligned to localhost.
- Keep presentation tooling pointed at the correct draft mode endpoint.
- Keep document labels clear about what route or section they power.
- Keep the studio hierarchy readable as a control panel for the site.

## Documentation policy

- Keep `SANITY_CMS_PR.md` updated when the roadmap changes.
- Keep `scripts/sanity/README.md` updated with commands, env vars, and recovery steps.
- Keep `progress.txt` updated after every successful slice.
- If a new prompt file is created, link it from the plan so future agents can find it quickly.

## Output expectations for each slice

- Exact files changed
- Validation evidence
- Parity status
- Remaining next slice

## Stop conditions

Stop only when one of these is true:

- Studio structure, preview/presentation, resume wiring, resume data, import parity, and docs are all complete and validated.
- A hard blocker occurs such as missing env vars, missing assets, or upstream service failure.

If blocked, report:

- the exact blocker,
- the exact file or command affected,
- the minimal next user action needed.

## Next Step Copy-Paste

Use this in a new chat to continue from the current state:

```prompt
Read .github/copilot-instructions.md, SANITY_CMS_PR.md, progress.txt, and the current Sanity QA agent prompt first.
Continue the Sanity CMS completion work slice by slice.
The resume publish flow and webhook refresh are already working, so pick the next unresolved slice from the prompt order and implement only that slice.
Keep the worktree clean by validating each slice, updating progress.txt, and creating exactly one conventional commit per slice.
After every successful slice, immediately continue to the next eligible slice without waiting for user confirmation.
If you hit a blocker, report the exact file, command, and minimal next user action needed.
```
