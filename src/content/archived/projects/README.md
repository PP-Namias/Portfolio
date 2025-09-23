This folder archives the original `src/content/projects/` content. The files have been preserved in place for now. If you want these files removed from the active build, move the original folder to this location and update any content collection logic in `src/utils` or `astro.config.mjs` to stop collecting from `projects`.

Recommended next steps:
- Move `src/content/projects/` into this folder to fully archive.
- Update `src/utils/content-utils.ts` and any collection references to avoid `projects` collection.
- Run a local build and fix any remaining references.
