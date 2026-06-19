---
name: code-review
description: Review code changes for correctness, consistency, performance, accessibility, and adherence to repo conventions.
---

# Code Review Skill

Performs systematic code review across the portfolio, covering TypeScript correctness, React best practices, accessibility, performance, styling consistency, and security.

## When to use this skill

- Before committing code changes
- When reviewing a PR
- When asked to audit code quality
- After implementing a new feature or fixing a bug

## Workflow

1. **TypeScript correctness** — Verify strict mode passes (`npx tsc --noEmit`). No `any` types unless explicitly justified. Proper generics and type narrowing.

2. **React best practices** — Components are properly structured. No missing `key` props in lists. No `useState` where derived state suffices. No `useEffect` for derived state. Hooks follow rules of hooks.

3. **Accessibility** — See `accessibility-audit` skill. All interactive elements are keyboard-operable. Proper ARIA attributes. Semantic HTML.

4. **Performance** — See `performance-optimization` skill. No unnecessary re-renders. Proper memoization. Optimized images and fonts.

5. **Styling** — Follows Tailwind conventions. Uses project theme tokens. Responsive design verified. Dark/light mode handled.

6. **Security** — No XSS vectors (sanitized user input). No exposed secrets in client code. Proper CSP headers. Sandbox attribute on iframes.

7. **Testing** — New features include tests. Existing tests not broken. Run `npm run test -- --run`.

8. **Quality gates** — Run `npm run lint`, `npx tsc --noEmit`, `npm run doctor`.

## Code style checklist

- No comments in code unless asked
- Follows existing patterns for SWR, JsonLd, iframe sandbox, React keys
- Proper error boundaries
- Loading and error states handled
- Exports follow the `only-export-components` pattern

## Delivery Checks

- [ ] TypeScript strict mode passes
- [ ] ESLint passes
- [ ] Tests pass
- [ ] React-doctor score 100/100
- [ ] No accessibility regressions
- [ ] Performance metrics maintained
- [ ] No security vulnerabilities introduced
