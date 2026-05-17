---
name: tests
description: Generates and manages unit and end-to-end tests for the portfolio. Use when ensuring code quality or verifying user flows in Next.js components.
---

# Tests Skill

This skill ensures that the portfolio remains robust through consistent testing patterns.

## When to use this skill

- Use this when creating new features that require verification.
- Use this when debugging component interactions or route behavior.
- Use this to generate mock data for testing UI states.

## How to use it

### 1. Component testing

- Use Vitest and React Testing Library for unit tests.
- Focus on user interactions, rendering states, and accessibility.

### 2. End-to-end testing

- Use Playwright for critical user flows such as project navigation, modal dismissal, theme toggling, and blog routes.
- Ensure tests run across multiple screen sizes to verify responsiveness.

### 3. Standards

- Keep tests simple, direct, and deterministic.
- Use the repo scripts: `npm run test` and `npm run test:e2e`.
- Prefer clear assertions over implementation-heavy snapshots.

## Example command

```sh
npm run test
```