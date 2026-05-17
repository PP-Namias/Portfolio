---
description: Automated process to run the portfolio repo's lint and build checks and resolve diagnostics before committing.
---

# Format and Lint Workflow

**Description**: Automated process to run the portfolio repo's lint and build checks and resolve diagnostics before committing.

## Steps

1. **Scope the change**: Identify the touched files and whether the work is docs, UI, data, or Sanity-related.
2. **Run lint**: Execute `npm run lint` from the repository root.
3. **Resolve diagnostics**: Fix any remaining lint or type issues in the touched files.
4. **Run build**: Execute `npm run build` to confirm the app still compiles cleanly.
5. **Run tests when relevant**: Use `npm run test` for logic/data changes and `npm run test:e2e` for routed or UI-flow changes.
6. **Final check**: Re-run the relevant commands until the touched area is clean.

## Notes

- Keep the workflow rooted in the repo's actual scripts.
- Do not assume a subpackage or monorepo layout when validating this portfolio.
