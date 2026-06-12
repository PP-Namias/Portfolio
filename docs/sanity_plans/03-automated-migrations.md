# Phase 3: Automated Migrations

## Goal
Restore and reshape the backed-up data into the newly refactored schema programmatically, avoiding manual entering of data.

## Steps

1. **Setup the Transformation Script (`scripts/sanity-migrate/index.mjs`)**
   - The script will read the `data.ndjson` generated in Phase 1.
   - It will parse line-by-line using `ndjson`.

2. **Filter and Drop**
   - Discard all documents with `_type === "skill"`.
   - Discard any orphaned assets, references, or drafts that are no longer valid.

3. **Map Old Schema to New Schema**
   - Example Map:
     - Old `project`: map `projectUrl` to `links.live` or `links.github`.
     - Generate missing required fields (e.g. inject defaults for new UI presentation fields).
     - Standardize tags and taxonomy elements.

4. **Upload via Sanity Client / Mutation API**
   - Use `@sanity/client` to execute transactions.
   - For safety, create the new data in a staging dataset (e.g. `staging` or `v2`) to verify the upload without destroying production.
   - Run the script: `node scripts/sanity-migrate.mjs --dataset=staging`.

5. **Validation and QA**
   - Open the Studio pointing to `staging` dataset.
   - Review visually if components render properly in the local Next.js instance by swapping the `.env` dataset variable.

## Expected Outcome
A clean migration pipeline that translates the old rigid data into the richer, smarter schema formats in an automated, repeatable way.