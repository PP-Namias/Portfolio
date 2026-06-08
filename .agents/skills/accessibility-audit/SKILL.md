---
name: accessibility-audit
description: Audit and fix accessibility issues across the portfolio to ensure WCAG 2.1 AA compliance.
---

# Accessibility Audit Skill

Ensures the portfolio meets WCAG 2.1 AA standards. Covers semantic HTML, ARIA, keyboard navigation, color contrast, screen reader compatibility, and focus management.

## When to use this skill

- Before shipping any UI change
- When adding interactive components (modals, dropdowns, tabs, forms)
- When adding new images, icons, or media
- When fixing a reported accessibility issue
- During code review of UI components

## Workflow

1. **Scan for semantic issues** — Check that interactive elements use correct HTML (`<button>`, `<a>`, `<input>`, `<select>`, `<textarea>`). Never use `<div>` or `<span>` with click handlers for actions/navigation.

2. **Verify keyboard support** — Every interactive element must be reachable and operable via keyboard (Tab, Enter, Space, Escape, Arrow keys per WAI-ARIA APG patterns).

3. **Check focus indicators** — All focusable elements must have a visible `:focus-visible` style. Never use `outline: none` without providing a visible replacement.

4. **Audit ARIA usage** — Icon-only buttons need descriptive `aria-label`. Decorative icons need `aria-hidden="true"`. Announce async updates with `aria-live="polite"`.

5. **Validate color contrast** — Use [APCA](https://apcacontrast.com/) or WCAG 2.1 AA contrast ratios. Text needs 4.5:1 (normal) / 3:1 (large). Interactive states should increase contrast.

6. **Test screen reader flow** — Verify heading hierarchy (`<h1>`–`<h6>`), skip-to-content link, form label associations, and image alt text.

7. **Run automated tools** — Use browser DevTools Lighthouse audit, axe DevTools, or WAVE.

## Common fixes in this codebase

- **Missing `aria-label` on icon buttons** — Add `aria-label="Description"` to buttons with only icon children
- **Missing image alt text** — Add `alt="Descriptive text"` or `alt=""` for decorative images
- **Non-semantic click handlers** — Replace `<div onClick>` with `<button>` or `<a>`/`<Link>`
- **Low contrast text** — Adjust text color or background to meet 4.5:1 ratio
- **Missing form labels** — Add `<label htmlFor="id">` or `aria-label` to form controls

## Delivery Checks

- [ ] All interactive elements are keyboard accessible
- [ ] Focus rings visible on `:focus-visible`
- [ ] Color contrast meets WCAG 2.1 AA
- [ ] Screen reader announces content correctly
- [ ] Skip-to-content link present and functional
- [ ] Heading hierarchy is logical (`<h1>`–`<h6>`)
- [ ] No `outline: none` without replacement
