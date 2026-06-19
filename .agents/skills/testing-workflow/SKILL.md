---
name: testing-workflow
description: Write, run, and maintain tests using Vitest with proper isolation patterns and coverage targets.
---

# Testing Workflow Skill

Guides the process of writing and maintaining tests for the portfolio using Vitest, React Testing Library, and the established testing patterns in the codebase.

## When to use this skill

- Adding a new feature that needs tests
- Fixing a failing test
- Increasing test coverage
- Setting up test infrastructure for a new component or utility
- Before committing changes that could break existing tests

## Workflow

1. **Understand the test target** — Check if it's a component, utility function, hook, or API route. Each has different testing patterns.

2. **Find existing test patterns** — Look at neighboring test files (`*.test.ts`, `*.test.tsx`, `__tests__/` directories) to understand naming conventions and setup patterns.

3. **Test structure** — Follow AAA pattern (Arrange, Act, Assert). Group related tests with `describe`. Use clear, descriptive test names.

4. **SWR isolation** — Any test exercising a SWR consumer must wrap it in `SWRConfig` with `provider: () => new Map()` to prevent cache leaks between tests.

5. **Component testing** — Use `@testing-library/react` with `render`, `screen` queries. Prefer `getByRole`, `getByText`, `getByLabelText` over test IDs. Test behavior, not implementation.

6. **Run the test suite** — `npm run test -- --run`. Ensure all 266 tests pass (29 test files). No `.only` or `.skip` left in committed code.

7. **Coverage** — Aim for meaningful coverage, not 100% for its own sake. Studio, scripts, and generated code are excluded.

## Test patterns in this codebase

- Tests live in `tests/` directory at the root
- Component tests use `@testing-library/react`
- SWR tests use `SWRConfig` provider isolation
- Utility/helper tests are plain Vitest tests
- Snapshot tests are avoided (too brittle)

## Delivery Checks

- [ ] All existing tests pass
- [ ] New features have corresponding tests
- [ ] SWR tests properly isolated with provider Map
- [ ] No `.only` or `.skip` in committed tests
- [ ] Test names describe expected behavior clearly
- [ ] Coverage is meaningful for the changed code
