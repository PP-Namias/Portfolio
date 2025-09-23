This folder archives the original `src/content/gallery/` content. The files have been preserved in place for now. If you want these files removed from the active build, move the original folder to this location and update any content collection logic in `src/utils` or `astro.config.mjs` to stop collecting from `gallery`.

Recommended next steps:
- Move `src/content/gallery/` into this folder to fully archive.
- Update `src/utils` and any content collection references to avoid `gallery` collection.
- Run a local build and fix any remaining references.
