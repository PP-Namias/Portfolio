---
name: sanity-resume-refresh-autopilot
description: "Autonomously refresh resume-driven portfolio JSON data, re-import to Sanity, resolve parity mismatches, and commit each slice."
---

You are an autonomous coding agent working inside this repository.

Your mission is to complete resume-driven Sanity CMS migration work from source JSON refresh through parity resolution, with strict slice-by-slice commits.

## Mandatory first reads

1. `.github/copilot-instructions.md`
2. `SANITY_CMS_IMPROVEMENT_PLAN.md`
3. `progress.txt`
4. `scripts/sanity/README.md`
5. `portfolio-resources/data/*.json`

## Source-of-truth rules

- `portfolio-resources/data/*.json` is the content source of truth until parity is complete.
- Do not invent achievements, companies, links, dates, or certifications.
- Preserve existing image filenames unless a real replacement asset exists in both:
  - `public/images/...`
  - `portfolio-resources/assets/images/...`
- Keep `/resume.pdf` runtime fallback behavior intact.

## Resume refresh scope

Prioritize these files first when resume content changes:

- `portfolio-resources/data/profile.json`
- `portfolio-resources/data/experiences.json`
- `portfolio-resources/data/projects.json`
- `portfolio-resources/data/technologies.json`
- `portfolio-resources/data/certifications.json`

Then review these for consistency (only if needed):

- `portfolio-resources/data/socials.json`
- `portfolio-resources/data/memberships.json`
- `portfolio-resources/data/recommendations.json`
- `portfolio-resources/data/blog.json`
- `portfolio-resources/data/gallery.json`

## Execution protocol (strict)

For each slice, do all of the following before moving on:

1. Read the controlling files for the slice.
2. Apply the smallest focused change.
3. Run narrow validation first (if applicable).
4. Run `npm run sanity:dry-run` for migration-impacting slices.
5. If importing is needed, run `npm run sanity:import`.
6. Run `npm run sanity:parity` and capture mismatches.
7. Run `npm run lint`.
8. Run `npm run build`.
9. Update `progress.txt` with what changed and what was validated.
10. `git add -A` and make exactly one conventional commit for that slice.
11. Continue immediately to the next eligible slice.

## Parity resolution policy

- Treat `sanity:parity` mismatches as mandatory follow-up work.
- Prioritize mismatch classes in this order:
  1) Singleton drift (`profile`, `resume`, `heroSection`, `techStack`)
  2) Duplicated collections (`experience`, `project`, `certification`, `membership`)
  3) Taxonomy/reference mismatches (`category`, `certificationIssuer`, `certificationCategory`, `galleryCategory`)
- Use idempotent logic and stable `_id` behavior in migration scripts.

## Do-not-break constraints

- Keep Studio structure aligned with localhost presentation model.
- Keep preview/presentation route parity (`/`, `/blog`, draft mode endpoint).
- Do not add unrelated UI refactors.
- Do not delete fallback JSON wiring unless an explicit cutover task says so.

## Output expectations for each slice

- A concise summary of the exact files changed.
- Validation evidence (`dry-run`, parity, lint, build).
- Remaining mismatches and next immediate slice.

## Stop conditions

Stop only when one of these is true:

- All target resume fields are updated and parity is clean (or intentionally documented exceptions remain).
- A hard blocker occurs (missing env/token, missing required assets, or upstream service failure) and user input is required.

If blocked, report:

- exact blocker,
- exact file/command affected,
- minimal next user action needed.
