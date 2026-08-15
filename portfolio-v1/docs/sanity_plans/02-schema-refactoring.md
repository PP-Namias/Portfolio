# Phase 2: Schema Refactoring and Deprecation

## Goal
Design a smarter structre for the Sanity CMS schema. This includes refining existing types, supporting presentation mode natively, and sunsetting unnecessary documents like `skill`.

## Steps

1. **Remove deprecated `skill` Type**
   - Delete `schemaTypes/skill.ts` (or equivalent file).
   - Remove references to `skill` in `schemaTypes/index.ts`.
   - Update front-end frontend logic in Next.js to remove any fetching of Sanity `skill` data (if the front-end depends on it, migrating instead to local `.md` or a different approach as stated in agent skills).

2. **Enhance Core Schemas for "Smart Studio"**
   - **Projects**: Add Presentation features (e.g., `slug`, UI previews, hidden metadata).
   - **Blog Posts**: Integrate advanced block content, embedding, and split pane view support.
   - **Experiences/Certs**: Streamline fields, adding strict validation and initial values to reduce editor friction.

3. **Incorporate Presentation Mode Fields**
   - Introduce visual options within page/document schemas (i.e. SEO tabs, OpenGraph preview fields).
   - Group fields cleanly with fieldsets or advanced object types (Tabs, Arrays in Grids).

4. **Schema Validation Scripts**
   - Define structure testing logic (e.g. `scripts/sanity-schema-validator.mjs`) to ensure all required fields are present before committing the schema.

5. **Commit the Schema Update**
   - Ensure the new schema changes are saved and `npm run build` succeeds on the Next.js side before migrating data in Phase 3.

## Expected Outcome
A clean, `skill`-less, and presentation-ready schema architecture that acts as the foundation for the automated migrated data.
