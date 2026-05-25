# Sanity Migration Scaffolding

This folder holds the first-pass scaffolding for the Sanity CMS migration.

## Files

- `manifest.ts` - source-to-model mapping and Phase 1 ordering.
- `dry-run.ts` - console dry-run output for the Phase 1 plan.
- `seed.ts` - seed-plan builder for future import automation.
- `import.mjs` - executable runner that prints a dry-run plan or writes normalized documents to Sanity.
- `parity-report.mjs` - compares expected source-derived document counts against current Sanity dataset counts.

## Intended workflow

1. Update the manifest when the source schema map changes.
2. Keep the dry-run output aligned with the manifest.
3. Expand the seed planner into real Sanity client writes once the connection contract is finalized.
4. Use `npm run sanity:dry-run` before `npm run sanity:import` to verify the current import batch.
5. Use `npm run sanity:parity` (or `npm run sanity:parity:strict`) after import to verify collection parity.
