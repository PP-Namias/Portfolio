# Sanity Migration Scaffolding

This folder holds the first-pass scaffolding for the Sanity CMS migration.

## Files

- `manifest.ts` - source-to-model mapping and Phase 1 ordering.
- `dry-run.ts` - console dry-run output for the Phase 1 plan.
- `seed.ts` - seed-plan builder for future import automation.
- `import.mjs` - executable runner that prints a dry-run plan or writes normalized documents to Sanity.
- `parity-report.mjs` - compares expected source-derived document counts against current Sanity dataset counts and runs strict readiness checks.

## Intended workflow

1. Update the manifest when the source schema map changes.
2. Keep the dry-run output aligned with the manifest.
3. Expand the seed planner into real Sanity client writes once the connection contract is finalized.
4. Use `npm run sanity:dry-run` before `npm run sanity:import` to verify the current import batch.
5. Use `npm run sanity:parity` (or `npm run sanity:parity:strict`) after import to verify collection parity and readiness.

## Required environment variables

At minimum, set these values in root `.env.local` (the scripts also read `.env` as fallback):

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_READ_TOKEN` (required for private dataset reads/parity checks)
- `SANITY_API_WRITE_TOKEN` (required for `sanity:import`)

## Operational runbook

Use this sequence for every migration or maintenance cycle:

1. `npm run sanity:dry-run`
2. `npm run sanity:import`
3. `npm run sanity:parity`
4. `npm run sanity:parity:strict` (recommended gate when you need CI-style enforcement)

## Parity and readiness modes

- `npm run sanity:parity`
	- Runs document-count parity checks plus readiness checks.
	- Prints mismatches and readiness blockers/warnings, but does not fail on blockers by default.

- `npm run sanity:parity:strict`
	- Runs the same checks.
	- Exits non-zero when either:
		- parity mismatches exist, or
		- critical readiness blockers exist.

- `node ./scripts/sanity/parity-report.mjs --readiness`
	- Runs readiness checks only (skips expected-vs-actual count comparisons).

Current readiness checks cover:

- Project detail URL presence (`detailUrl`) and primary-link availability.
- Hero WhatsApp social link integrity (`url` or `whatsappNumber`).
- Published blog cover source integrity (`mainImage` or `coverImagePath`).
- About/site settings singleton existence as pre-cutover signals.

## Transient upload failure recovery

The importer already retries transient `502/503/504` upload and mutation failures, and it now retires stale managed documents after a successful live write so legacy duplicates do not linger in parity checks.
If a live run still fails:

1. Re-run `npm run sanity:import` (the importer uses deterministic IDs and `createOrReplace`).
2. Run `npm run sanity:parity` and check which types still mismatch.
3. Re-run `npm run sanity:import` once more if mismatch counts indicate a partial write.

## Next collection to improve

Based on the latest parity output, prioritize cleanup for duplicated collection types:

- `experience`
- `project`
- `certification`
- `membership`

Then reconcile singleton drift for `profile` and `resume`.
