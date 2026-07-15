---
title: 'Building a Portfolio with 278 Tests and a 100/100 Score'
slug: 'building-a-portfolio-with-278-tests-and-100-score'
excerpt: 'The architecture, testing strategy, and engineering decisions behind a portfolio that ships with 278 tests, 19 CI/CD workflows, and a perfect react-doctor score.'
featured: false
publishedAt: '2026-05-10T10:00:00Z'
published: true
author: 'PP Namias'
tags: [ nextjs, testing, react ]
readTime: '8 min read'
---

Most portfolios are static HTML pages with a few animations. Mine has 278 tests, 19 CI/CD workflows, and a perfect 100/100 react-doctor score.

This is the story of why I built it that way — and what it taught me about production software engineering.

## Why Over-Engineer a Portfolio?

Because a portfolio isn't just a gallery of finished work — it's a **working demonstration** of how you build software. Every line of code, every test, every workflow is evidence of engineering practices.

When a hiring manager looks at my portfolio, they don't just see my projects. They see my testing philosophy, my CI/CD discipline, my accessibility awareness, and my code quality standards.

## Architecture Overview

```typescript
// The stack
const stack = {
  framework: 'Next.js 15 (App Router)',
  language: 'TypeScript (strict)',
  styling: 'Tailwind CSS',
  animations: 'Framer Motion',
  cms: 'Sanity CMS',
  testing: 'Vitest + React Testing Library',
  quality: 'react-doctor + ESLint + Prettier',
  ci: '19 GitHub Actions workflows',
  security: 'PentestAgent + gitleaks + CSP headers',
};
```

### Component Architecture

I built the UI with a clear component hierarchy:

- **UI primitives:** Card, Button, Badge, OptimizedImage
- **Section components:** HeroSection, ProjectsSection, BlogSection
- **Page components:** HomePage, BlogPage, ProjectDetailPage
- **Feature components:** AI Chat, CollageGallery, ReadingProgress

Each component has a single responsibility and is testable in isolation.

## The 278 Tests

The test suite covers:

| Category | Tests | What It Tests |
|----------|-------|---------------|
| Components | 120+ | UI rendering, props, states |
| Hooks | 45+ | Custom hooks, state management |
| Utils | 30+ | Date formatting, media URLs |
| Pages | 40+ | Page rendering, navigation |
| API Routes | 25+ | Endpoint responses, errors |
| Integration | 18+ | Cross-component workflows |

### Testing Philosophy

1. **Test behavior, not implementation** — I test what the user sees, not internal methods
2. **Component isolation** — each component test provides only the props it needs
3. **Accessibility by default** — tests verify ARIA labels, keyboard navigation, focus management
4. **Edge cases matter** — empty states, error states, loading states are all tested

```typescript
// Example: testing a Card component
describe('Card', () => {
  it('renders children correctly', () => {
    render(<Card><p>Hello</p></Card>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('applies hover styles when hover prop is true', () => {
    render(<Card hover>Content</Card>);
    expect(screen.getByText('Content').closest('div')).toHaveClass('group');
  });
});
```

## The 100/100 React-Doctor Score

react-doctor is a static analysis tool that checks React code quality across 12 rules. A perfect score means:

1. **No unnecessary re-renders** — proper use of hooks, memo, and keys
2. **Accessible components** — semantic HTML, ARIA attributes, focus management
3. **Performance optimized** — no expensive computations in render, proper image sizing
4. **Component composition** — proper component splitting and prop drilling avoidance

## 19 CI/CD Workflows

Every push triggers automated checks:

- **TypeScript check** — `tsc --noEmit` catches type errors
- **ESLint** — code quality and consistency
- **Vitest** — all 278 tests must pass
- **react-doctor** — score must be at least 100/100
- **Build test** — `next build` must succeed
- **Security scans** — gitleaks for secrets, dependency audit

```yaml
# Simplified CI workflow
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run test -- --run
      - run: npm run doctor:check
      - run: npm run build
```

## Security by Design

Security isn't an afterthought — it's built into the pipeline:

- **CSP headers** — Content Security Policy configured for all routes
- **gitleaks** — prevents secret commits
- **PentestAgent** — AI-powered security scanning in CI
- **Canary tokens** — honeypot system detects scanners
- **Dependency audit** — automated vulnerability checking

## What This Proves

Building a portfolio this way demonstrates:

1. **Testing discipline** — I don't just write code, I verify it works
2. **CI/CD knowledge** — I understand automated quality gates
3. **Code quality focus** — I care about maintainability and readability
4. **Security awareness** — I think about threats, not just features
5. **Performance consciousness** — I optimize for real users

## Key Takeaways

1. **Treat your portfolio like production software** — because it is
2. **Automate everything** — if it can be checked by a machine, it should be
3. **Tests are documentation** — they show how components should behave
4. **Quality gates prevent regressions** — catch issues before they reach production
5. **Your code speaks for you** — make sure it says what you want it to say

---

*This portfolio is open source. The code, tests, and workflows are all on GitHub. Up next: a reflection on imposter syndrome at 50+ repositories.*
