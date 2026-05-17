---
description: Structured sequence to prepare and finalize Pull Request documentation, including summaries, feature lists, and clickable file changes.
---

# PR Workflow

**Description**: Structured sequence to prepare and finalize Pull Request documentation, including summaries, feature lists, and clickable file changes.

## Steps

1. **Pre-flight check**: Run the repository validation commands and fix all errors.

   - Commands (run from repo root):

     ```powershell
     npm run lint
     npm run build
     npm run test
     ```

   - For UI or routing changes, also run `npm run test:e2e`.

2. **Run done criteria**: Execute the checklist in `.agents/workflows/done-criteria.md` and record pass/fail for each item.

3. **Draft PR metadata**: Use a one-line technical title and keep the summary, changes, features, tests, and QA steps copy-paste ready.

4. **Generate clickable file links**: List the changed files and include repository-relative links in the `Changes` section.

5. **Content review when relevant**: Use the content-review skill when the change affects copy, tone, or user-facing text.

6. **Final review and snapshot**: Ensure lint/build pass and attach screenshots if the change affects the UI.

7. **Finalize and commit**: Present the proposed `git commit` command and wait for user approval before execution unless the task explicitly requested the automated commit path.

## Templates

**PR Title**: `feat(scope): short-description & correlated-detail`

**PR Summary**:

> One-sentence goal. One-sentence outcome.

**Changes**:

- [file path](path/to/file#L1-L20): brief technical note about change.

**How to QA**:

1. Start dev server: `npm run dev`
2. Visit the affected route or section
3. Run the relevant tests for the change

## Notes

- Keep PR descriptions technical and copy-paste ready for GitHub.
- Keep the checklist tied to the actual portfolio repo, not a monorepo template.
