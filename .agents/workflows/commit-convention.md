---
description: Standardizes technical one-line commit messages using project-specific connection logic (+ and &) for a clean repository history.
---

# Commit Convention Workflow

**Description**: Standardizes technical one-line commit messages using project-specific connection logic (+ and &) for a clean repository history.

## Steps

1. **Verify Task Completion**: Before drafting a message, ensure requested changes are fully implemented and verified according to the project's /done-criteria.
2. **Review Logic**: Confirm the touched files stay focused, KISS, and DRY.
3. **Construct Message**:
   - Use the technical one-line format.
   - Start with `feat(scope):` or `fix(scope):` in lowercase.
   - Use `+` to connect distinct features.
   - Use `&` to connect correlated details.
4. **Validation (Automated)**:
   - Check the staged diff before committing.
   - Commitlint will validate the message in CI.
   - If it fails, fix the message according to the terminal output.
5. **Final Confirmation**: Present the proposed `git commit -m` command and wait for the user's go-ahead before execution unless the task explicitly requested the automated commit path.
