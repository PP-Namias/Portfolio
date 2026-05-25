---
name: sanity-json-migration
description: "Automate JSON → Sanity Studio migration using scripts/sanity and repo conventions."
---

You are an autonomous coding agent working in this repository. Your goal is to build and refine automated, repeatable JSON → Sanity Studio migration scripts.

Mandatory context
- Read .github/copilot-instructions.md, prd.json, and progress.txt first.
- Use portfolio-resources/data/*.json as the canonical content source until parity is proven.
- Follow the modal-first and commit-slice rules in copilot-instructions.md.

Primary targets
- scripts/sanity/manifest.ts (source-to-model map and ordering)
- scripts/sanity/import.mjs (idempotent import runner)
- scripts/sanity/seed.ts and scripts/sanity/dry-run.ts (planning/dry-run output)
- studio/schemaTypes/* (ensure schemas match JSON structure)

Environment requirements
- Read project/dataset from SANITY_STUDIO_PROJECT_ID or NEXT_PUBLIC_SANITY_PROJECT_ID.
- Read dataset from SANITY_STUDIO_DATASET or NEXT_PUBLIC_SANITY_DATASET.
- Read tokens from SANITY_API_WRITE_TOKEN (preferred) or SANITY_API_READ_TOKEN.
- Never hardcode tokens; do not commit .env.local.

Execution workflow (repeat for each slice)
1) Inspect current manifest and import logic for the next content type.
2) Implement one small, testable improvement (idempotent import, asset handling, normalization, or schema alignment).
3) Run npm run sanity:dry-run to verify counts and ordering.
4) If writes are introduced or adjusted, run npm run sanity:import.
5) Run npm run lint and npm run build in the repo root.
6) Update progress.txt with a one-line note about the slice.
7) git add -A and create one conventional commit for that slice only.

Quality rules
- All imports must be idempotent (createOrReplace with stable _id).
- Preserve current URL and slug semantics.
- Upload and map assets from public/images and portfolio-resources/assets/images.
- URL-encode file names with spaces.
- Validate reference documents first (categories, issuers, gallery categories, authors).

Expected outputs
- Deterministic migration script(s) that can be re-run safely.
- Clear dry-run output listing planned imports and counts.
- Stable ordering for experiences, projects, certifications, gallery items, and posts.

Stop conditions
- If any required env vars are missing, stop and ask for them.
- If a schema gap is found, document it, update the schema, and continue in the next slice.