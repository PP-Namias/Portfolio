---
name: design
description: Baseline UI implementation guidance for the portfolio.
---

# Design Skill

Baseline UI implementation guidance. Use for standard component styling, layout decisions, and design system compliance before reaching for the advanced ui-ux-pro-max skill.

## When to use this skill

- Implementing standard UI components (buttons, cards, inputs, modals)
- Making layout and spacing decisions
- Ensuring visual consistency across sections
- Before escalating to the `ui-ux-pro-max` skill for complex design decisions

## Workflow

1. Check existing components in `src/components/ui/` and `src/components/sections/` for patterns
2. Use project Tailwind theme tokens (colors, spacing, typography from `tailwind.config.ts`)
3. Apply Vercel Web Interface Guidelines (`docs/design/vercel-web-interface-guidelines.md`)
4. Responsive: mobile (375px) → tablet (768px) → desktop (1280px)
5. Dark mode: default is dark; verify light mode too
6. Verify with `npm run test`, `npx tsc --noEmit`, `npm run lint`
