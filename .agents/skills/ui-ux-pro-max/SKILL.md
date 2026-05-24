---
name: ui-ux-pro-max
description: Provides advanced UI/UX design intelligence for portfolio and app work, including design system selection, palette and typography guidance, and implementation checks.
---

# UI UX Pro Max Skill

Use this skill for UI/UX tasks that need stronger design reasoning, clearer system selection, or more deliberate interaction guidance.

This skill mirrors the upstream repo's design-system workflow in a repo-safe way: identify the target, generate a system, persist reusable rules when needed, then implement against the existing portfolio tokens and constraints.

## When to use this skill

- Use this when planning or implementing a polished interface.
- Use this when you need a design system recommendation before coding.
- Use this when choosing patterns, colors, typography, or motion for a specific product type.

## Workflow

1. Identify the product type, stack, and user goal.
2. Check whether an existing design-system source of truth already exists for the page or feature.
3. Recommend a matching pattern, visual style, color mood, typography mood, and key interaction effects.
4. List anti-patterns to avoid for the target industry or use case.
5. Produce a concise pre-delivery checklist for accessibility, responsiveness, motion preferences, and content clarity.
6. Apply the result using the repo's existing design system and shared UI primitives.

## Design System Generation

When a UI task has enough context, generate a focused design system before coding:

- Target: name the product, page, or feature.
- Pattern: choose the structure that best fits the user goal.
- Style: select the visual direction and interaction tone.
- Colors: define the palette using the repo's theme tokens and accent system.
- Typography: choose the font mood and hierarchy approach.
- Effects: define hover, reveal, transition, and motion rules.
- Anti-patterns: list what not to do for the context.
- Checklist: list the delivery checks that should pass before handoff.

Keep the output concise enough to act on immediately. If the task is broad, prefer a single recommended direction over several competing options.

## Persisted Rules

If a feature or page needs repeatable guidance across sessions, write the result as layered rules:

- `design-system/MASTER.md` for global visual decisions.
- `design-system/pages/<page>.md` for page-specific overrides.

Use the page file only for deviations from the master system. If no page file exists, rely on the master rules alone.

Recommended retrieval order:

1. Read the page-specific rules first if they exist.
2. Fall back to `design-system/MASTER.md`.
3. Apply the repo's existing modal-first and token-based conventions.

## Output structure

Keep the output practical and implementation-ready:

- Recommended pattern.
- Style direction.
- Palette guidance.
- Typography pairing.
- Motion and interaction notes.
- Anti-patterns.
- Delivery checklist.

If persistence is useful, also include:

- Master rules to keep.
- Page-specific overrides.
- Any values that should stay shared across the system.

## Repo alignment

- Follow the portfolio's token classes and existing modal-first rules.
- Keep expanded content in modals unless the project architecture explicitly says otherwise.
- Avoid hardcoded styling when repo tokens already cover the need.
- Keep the Projects section hover-first with image-zoom-only and click-through navigation.
- Favor subtle motion and strong readability over decorative treatment.

## Delivery Checks

Before handoff, verify:

- The recommendation works at mobile, tablet, and desktop widths.
- The palette respects the existing light and dark token system.
- Motion remains subtle and respects reduced-motion preferences.
- The implementation uses shared primitives instead of duplicate ad hoc UI.
- Expanded content still follows modal-first behavior unless explicitly exempted.