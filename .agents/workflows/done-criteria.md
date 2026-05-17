---
description: Comprehensive quality checklist to verify portfolio standards, data consistency, and code cleanliness before task finalization.
---

# Done Criteria Workflow

**Description**: Comprehensive quality checklist to verify portfolio standards, data consistency, and code cleanliness before task finalization.

## Steps

1. **Scope Validation**:
   - Confirm the change stays within the requested portfolio slice.
   - Avoid adding routes, sections, or data paths that are not part of the task.
2. **Technical Polish**:
   - Run `/format-and-lint` to ensure all diagnostics are resolved.
   - Confirm that shared token classes, accessibility states, and responsive behavior stay intact.
   - Ensure lists and mapped UI have stable keys.
3. **Data Sync**:
   - If the change involves content, verify `portfolio-resources/data`, `src/data`, and Sanity-related files stay aligned.
   - Keep source assets and public assets in sync when images change.
4. **Cleanup**:
   - Remove placeholder text, temporary logs, and commented-out code blocks.
   - Delete dead imports and unused helper logic.
5. **Final Review**: Confirm the solution is KISS and DRY before proceeding to /commit-convention.
