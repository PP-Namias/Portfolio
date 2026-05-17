---
trigger: always_on
---

# Development Standards

## Intent

Keep the portfolio codebase clean, resilient, and easy to ship.

## Personality

- **Technical and direct**: Use precise technical language.
- **Premium but restrained**: Keep polish high without visual noise.
- **Efficient**: Follow KISS and DRY.

## Decision Making

- MUST prioritize reliability and data integrity in every change.
- MUST favor modularity over monolithic blocks of code.
- MUST solve the root cause rather than applying temporary fixes.
- MUST avoid assumptions when a requirement is unclear.

## Architecture Standards

- MUST keep UI, data, and motion concerns separated.
- MUST use existing section and UI primitives before adding new ones.
- MUST keep Sanity schema, migration scripts, and typed data modules aligned.

## Rules

- MUST use React/Next.js with TypeScript.
- MUST prefer Tailwind utilities and shared token classes.
- MUST keep client components only where interaction requires them.
- MUST avoid `any` unless a boundary truly needs it.
- MUST remove dead code and unused imports promptly.
- MUST resolve diagnostics before merging.

## Linting & Formatting

- **ESLint**:
  - Keep `src` free of lint errors.
  - Avoid broad suppressions unless the code path is genuinely isolated.
- **TypeScript**:
  - Keep strict mode assumptions intact.
  - Prefer safe narrowing over assertion-heavy code.

## Guidelines

- **Environment Variables**: Use the existing env validation pattern and avoid undeclared keys.
- **Git**: Follow the one-line commit convention with `+` and `&` connectors.
- **UI**: Use the established design tokens and shared UI primitives.

## Anti-patterns

- Bloated logic or repetitive code blocks.
- Hardcoding sensitive data or magic strings.
- Bypassing the type system with `any` or excessive non-null assertions outside of tests.
