---
name: design
description: Guides the implementation of high-fidelity, premium UI designs for the portfolio. Use when styling components or shaping motion in the Next.js/Tailwind UI.
---

# Design Skill

This skill ensures UI implementations match the portfolio's premium aesthetic, modal-first interaction model, and responsive design system.

## When to use this skill

- Use this when building or restyling Next.js/Tailwind components.
- Use this when refining hover/focus motion or Framer Motion interactions.
- Use this when applying the established token classes and card-based layout patterns.

## How to use it

### 1. Style awareness

Always refer to the existing design system and token classes in the app:

- **Colors**: Use the established light/dark token classes instead of hardcoded hex values.
- **Typography**: Use the project font stack already established in the app.
- **Layout**: Keep the current section-based, card-driven structure intact.

### 2. Motion guidelines

- Prefer Framer Motion and local CSS transitions for interactions.
- Keep motion subtle and intentional.
- Respect reduced-motion preferences.

### 3. Component patterns

- Reuse shared UI primitives when they already exist.
- Keep component APIs small and composable.
- Expanded content uses modals; the Projects section should stay hover-first with image-zoom-only and click-through navigation.

## Examples

```tsx
<section className="rounded-3xl border border-border-light bg-white p-6 shadow-sm dark:border-border-dark dark:bg-card-bg-dark">
  <h2 className="text-text-primary-light dark:text-text-primary-dark">Featured Work</h2>
</section>
```

## Anti-patterns

- Hardcoding colors, spacing, or layout values when tokens exist.
- Reintroducing noisy effects that distract from content.
- Assuming framework-specific patterns that do not match the portfolio stack.
- Creating a new header or footer when the current layout already serves the task.
