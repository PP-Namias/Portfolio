---
name: frontend-design
description: Build beautiful, responsive, accessible UIs using React, Tailwind CSS, Framer Motion, and the Vercel Web Interface Guidelines.
---

# Frontend Design Skill

Provides structured guidance for building production-quality frontend UI components and pages. Covers component architecture, responsive design, animations, accessibility, and design system adherence for the PP Namias portfolio.

## When to use this skill

- Building a new UI component or page section
- Styling and layout decisions
- Implementing responsive design patterns
- Adding animations or transitions
- Ensuring design consistency with the existing codebase
- Reviewing UI code against best practices

## Workflow

1. **Understand the design intent** — Read the existing component patterns in `src/components/`. Identify the section type (hero, about, projects, skills, experience, certifications, blog, contact).

2. **Choose the right primitives** — Use Tailwind CSS utility classes for styling. Use Framer Motion for animations. Use Lucide React for icons. Follow the repo's existing patterns.

3. **Apply the Vercel Web Interface Guidelines** — See `docs/design/vercel-web-interface-guidelines.md`. Key checks:
   - Full keyboard support with visible `:focus-visible` rings
   - Hit targets ≥ 24px (mobile ≥ 44px)
   - `touch-action: manipulation` on controls
   - Links use `<a>`/`<Link>` — never `<div onClick>` for navigation
   - Images have explicit width/height
   - Animations use `transform`/`opacity` only; never `transition: all`
   - `prefers-reduced-motion` respected

4. **Implement with the existing design system** — Use the project's Tailwind theme tokens (colors, spacing, typography from `tailwind.config.ts`). Match the existing component API patterns.

5. **Responsive design** — Test at mobile (375px), tablet (768px), laptop (1280px), and ultra-wide (1920px+).

6. **Accessibility** — Semantic HTML, ARIA labels where needed, proper heading hierarchy, skip-to-content link, color contrast compliance.

7. **Validate** — Run `npm run test -- --run`, `npx tsc --noEmit`, `npm run lint`, and `npm run doctor` to ensure quality gates pass.

## Design Principles

- **Modal-first architecture** — Minimize route navigation; use modals for detail views
- **Subtle motion** — Framer Motion with `whileInView` for scroll-triggered animations
- **Dark theme first** — The portfolio uses dark mode as default; ensure new components render correctly in both modes
- **Consistent spacing** — Use Tailwind's spacing scale (p-4, p-6, p-8, gap-4, gap-6, etc.)
- **Performance** — Lazy-load below-fold content, avoid layout shift, keep bundle size small

## Delivery Checks

- [ ] Responsive on mobile, tablet, laptop, ultra-wide
- [ ] Light and dark theme both look correct
- [ ] `prefers-reduced-motion` respected
- [ ] Keyboard navigable with visible focus rings
- [ ] No layout shift (CLS)
- [ ] TypeScript strict mode passes
- [ ] ESLint passes
- [ ] Tests pass
- [ ] React-doctor score 100/100
