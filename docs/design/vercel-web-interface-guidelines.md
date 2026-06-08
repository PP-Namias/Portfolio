# Vercel Web Interface Guidelines

Source: [vercel.com/design/guidelines](https://vercel.com/design/guidelines)
AGENTS.md: [raw AGENTS.md](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/AGENTS.md)
Review command: [command.md](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md)

These guidelines are a living, non-exhaustive list of interface decisions from Vercel's design team.
Most are framework-agnostic; some are React/Next.js specific.

---

## Interactions

- **Keyboard works everywhere** — All flows are keyboard-operable & follow [WAI-ARIA Authoring Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/).
- **Clear focus** — Every focusable element shows a visible focus ring. Prefer `:focus-visible` over `:focus`. Set `:focus-within` for grouped controls.
- **Manage focus** — Use focus traps, move & return focus per [WAI-ARIA Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/).
- **Match visual & hit targets** — If visual < 24px, expand hit target to ≥ 24px. On mobile: 44px.
- **Mobile input size** — `<input>` font size ≥ 16px to prevent iOS Safari auto-zoom.
- **Respect zoom** — Never disable browser zoom.
- **Hydration-safe inputs** — Inputs must not lose focus or value after hydration.
- **Don't block paste** — Never disable paste in `<input>` or `<textarea>`.
- **Loading buttons** — Show a loading indicator & keep the original label.
- **Minimum loading-state duration** — ~150-300ms show-delay & ~300-500ms min visible time. React `<Suspense>` does this automatically.
- **URL as state** — Persist state in the URL for share, refresh, Back/Forward (e.g., [nuqs](https://nuqs.dev)).
- **Optimistic updates** — Update UI immediately when success is likely; reconcile on server response.
- **Ellipsis for further input & loading states** — Menu options like "Rename…" and loading states like "Loading…" end with `…`.
- **Confirm destructive actions** — Require confirmation or provide Undo with a safe window.
- **Prevent double-tap zoom on controls** — `touch-action: manipulation`.
- **Tap highlight follows design** — Set `-webkit-tap-highlight-color`.
- **Design forgiving interactions** — Generous hit targets, clear affordances, predictable interactions.
- **Tooltip timing** — Delay first tooltip; subsequent peers have no delay.
- **Overscroll behavior** — `overscroll-behavior: contain` in modals/drawers.
- **Scroll positions persist** — Back/Forward restores prior scroll.
- **Autofocus for speed** — On desktop with single primary input, autofocus. Rarely on mobile.
- **No dead zones** — If part of a control looks interactive, it should be interactive.
- **Deep-link everything** — Filters, tabs, pagination, expanded panels.
- **Clean drag interactions** — Disable text selection & apply `inert` while dragging.
- **Links are links** — Use `<a>` or `<Link>` for navigation. Never `<button>` or `<div>` for nav.
- **Announce async updates** — Use polite `aria-live` for toasts & inline validation.
- **Locale-aware keyboard shortcuts** — Internationalize for non-QWERTY layouts.

## Animations

- **Honor `prefers-reduced-motion`** — Provide a reduced-motion variant.
- **Implementation preference** — CSS > Web Animations API > JS libraries (e.g., [motion](https://www.npmjs.com/package/motion)).
- **Compositor-friendly** — Use `transform` & `opacity` only. Never `width`, `height`, `top`, `left`.
- **Necessity check** — Only animate to clarify cause & effect or add deliberate delight.
- **Easing fits the subject** — Choose easing based on what changes (size, distance, trigger).
- **Interruptible** — Animations cancelable by user input.
- **Input-driven** — Avoid autoplay; animate in response to actions.
- **Correct transform origin** — Anchor motion to where it "physically" starts.
- **Never `transition: all`** — List only the properties intended to animate.
- **Cross-browser SVG transforms** — Apply to `<g>` wrappers with `transform-box: fill-box; transform-origin: center;`.

## Layout

- **Optical alignment** — Adjust ±1px when perception beats geometry.
- **Deliberate alignment** — Every element aligns with something (grid, baseline, edge, optical center).
- **Balance contrast in lockups** — Adjust weight/size/spacing/color when text & icons sit together.
- **Responsive coverage** — Verify on mobile, laptop, & ultra-wide (simulate at 50% zoom).
- **Respect safe areas** — Account for notches & insets with `env(safe-area-inset-*)`.
- **No excessive scrollbars** — Fix overflow issues. Test with "Show scroll bars: Always" on macOS.
- **Let the browser size things** — Prefer flex/grid/intrinsic layout over JS measurement.

## Content

- **Inline help first** — Prefer inline explanations; tooltips as last resort.
- **Stable skeletons** — Skeletons mirror final content exactly to avoid layout shift.
- **Accurate page titles** — `<title>` reflects the current context.
- **No dead ends** — Every screen offers a next step or recovery path.
- **All states designed** — Empty, sparse, dense, & error states.
- **Typographic quotes** — Prefer curly quotes (" ") over straight quotes (" ").
- **Avoid widows/orphans** — Use `text-wrap: balance` or `text-pretty` on headings.
- **Tabular numbers for comparisons** — `font-variant-numeric: tabular-nums`.
- **Redundant status cues** — Don't rely on color alone; include text labels.
- **Icons have labels** — Convey same meaning with text for non-sighted users.
- **Don't ship the schema** — Accessible names/labels exist even when visuals omit labels.
- **Use the ellipsis character** — `…` over three periods `...`.
- **Anchored headings** — `scroll-margin-top` for headers when linking to sections.
- **Resilient to user-generated content** — Handle short, average, & very long content.
- **Locale-aware formats** — Format dates, times, numbers, currencies for user's locale.
- **Prefer language settings over location** — Use `Accept-Language` header & `navigator.languages`.
- **Shield verbatim content from translation** — `translate="no"` on brand names, code tokens, identifiers.
- **Accessible content** — `aria-label`, `aria-hidden`, verify in accessibility tree.
- **Icon-only buttons are named** — Descriptive `aria-label`.
- **Semantics before ARIA** — Prefer native elements (`button`, `a`, `label`, `table`).
- **Headings & skip link** — Hierarchical `<h1–h6>` & a "Skip to content" link.
- **Brand resources from the logo** — Right-click nav logo for brand assets.
- **Non-breaking spaces for glued terms** — `&nbsp;` to keep units, shortcuts & names together.

## Forms

- **Enter submits** — When text input focused, Enter submits if sole control. On textarea, ⌘/Ctrl+Enter submits.
- **Labels everywhere** — Every control has a `<label>` or is associated with one.
- **Label activation** — Clicking a `<label>` focuses the associated control.
- **Submission rule** — Submit enabled until submission starts; then disable with spinner & idempotency key.
- **Don't block typing** — Allow any input, validate after. Blocking keystrokes confuses users.
- **Don't pre-disable submit** — Allow submitting incomplete forms to surface validation.
- **No dead zones on controls** — Checkboxes/radios: label & control share one hit target.
- **Error placement** — Show errors next to fields; on submit, focus first error.
- **Autocomplete & names** — Set `autocomplete` & meaningful `name` values.
- **Spellcheck selectively** — Disable for emails, codes, usernames.
- **Correct types & input modes** — Right `type` & `inputmode` for better keyboards & validation.
- **Placeholders signal emptiness** — End with `…`.
- **Placeholder value** — Example value or pattern (e.g., `+1 (123) 456-7890`).
- **Unsaved changes** — Warn before navigation when data could be lost.
- **Password managers & 2FA** — Ensure compatibility; allow pasting one-time codes.
- **Don't trigger password managers for non-auth fields** — `autocomplete="off"` or specific token.
- **Text replacements & expansions** — Trim values to avoid confusing errors from trailing whitespace.
- **Windows `<select>` background** — Explicitly set `background-color` & `color` for dark-mode contrast.

## Performance

- **Device/browser matrix** — Test iOS Low Power Mode & macOS Safari.
- **Measure reliably** — Disable extensions that add overhead.
- **Track re-renders** — Use React DevTools or [React Scan](https://react-scan.com/).
- **Throttle when profiling** — CPU & network throttling.
- **Minimize layout work** — Batch reads/writes; avoid reflows/repaints.
- **Network latency budgets** — POST/PATCH/DELETE complete in <500ms.
- **Keystroke cost** — Prefer uncontrolled inputs; make controlled loops cheap.
- **Large lists** — Virtualize (e.g., [virtua](https://github.com/inokawa/virtua)) or `content-visibility: auto`.
- **Preload wisely** — Preload above-fold images; lazy-load the rest.
- **No image-caused CLS** — Set explicit image dimensions & reserve space.
- **Preconnect to origins** — `<link rel="preconnect">` for asset/CDN domains.
- **Preload fonts** — For critical text to avoid flash & layout shift.
- **Subset fonts** — Ship only needed code points via `unicode-range`.
- **Don't use the main thread for expensive work** — Move long tasks to Web Workers.

## Design

- **Layered shadows** — Mimic ambient + direct light with at least two layers.
- **Crisp borders** — Combine borders & shadows; semi-transparent borders improve edge clarity.
- **Nested radii** — Child radius ≤ parent radius & concentric.
- **Hue consistency** — On non-neutral backgrounds, tint borders/shadows/text toward the same hue.
- **Accessible charts** — Use color-blind-friendly palettes.
- **Minimum contrast** — Prefer [APCA](https://apcacontrast.com/) over WCAG 2.
- **Interactions increase contrast** — `:hover`, `:active`, `:focus` have more contrast than rest state.
- **Browser UI matches your background** — Set `<meta name="theme-color">`.
- **Set the appropriate color-scheme** — `color-scheme: dark` on `<html>` in dark themes.
- **Text anti-aliasing & transforms** — Animate a wrapper instead of text node.
- **Avoid gradient banding** — Use background images when fading to dark colors.

## Vercel-specific Copywriting

- **Active voice** — "Install the CLI" not "The CLI will be installed."
- **Headings & buttons use Title Case** (Chicago style). Marketing pages use sentence case.
- **Be clear & concise** — Use as few words as possible.
- **Prefer `&` over `and`**
- **Action-oriented language**
- **Keep nouns consistent** — Introduce as few unique terms as possible.
- **Write in second person** — Avoid first person.
- **Use consistent placeholders** — Strings: `YOUR_API_TOKEN_HERE`. Numbers: `0123456789`.
- **Use numerals for counts** — "8 deployments" not "eight deployments."
- **Consistent currency formatting** — 0 or 2 decimal places, never mix.
- **Separate numbers & units with a space** — e.g., `10&nbsp;MB`.
- **Default to positive language**
- **Error messages guide the exit** — Tell user how to fix it, not just what's wrong.
- **Avoid ambiguity** — "Save API Key" not "Continue."
