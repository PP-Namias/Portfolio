---
trigger: always_on
---

# UI System

## Intent

Keep portfolio UI work consistent, premium, and easy to maintain across agent-guided tasks.

## Visual Standards

- Use the established Tailwind token classes instead of hardcoded colors whenever possible.
- Keep contrast strong and readable.
- Prefer calm, technical, and professional presentation.
- Avoid noisy decoration that does not support the user task.

## Typography

- Use the project font stack already established in the app.
- Keep typography restrained, legible, and hierarchy-driven.
- Use clear heading levels and avoid competing display styles.

## Layout

- Prefer simple responsive grids and flexible containers.
- Keep spacing consistent across related components.
- Preserve section boundaries when a page or component grows.
- Separate presentation from business logic.
- Do not add a new header or footer when an existing section can carry the change.

## Motion

- Use purposeful motion only when it helps understanding.
- Keep transitions smooth and avoid sudden snaps.
- Favor subtle, fluid animation over decorative movement.
- Respect reduced-motion preferences.

## Component Rules

- Use shared UI primitives when they already exist.
- Keep component APIs small and composable.
- Avoid duplicate styling patterns across nearby features.
- Expanded content should use modals, except the Projects section, which should stay hover-first with image-zoom-only and click-through navigation.

## Anti-patterns

- Hardcoded hex colors or literal layout values when tokens exist.
- Repeating the same visual pattern in multiple places without a shared primitive.
- Mixing data fetching, state control, and styling inside one block.
- Designing for effect instead of clarity.

## Checks

- The UI should be readable at common desktop, tablet, and mobile widths.
- Interactive states should stay clear and accessible.
- New UI should align with the existing premium technical tone.
