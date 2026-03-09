# Interactivity & Mouse Effects Plan — Portfolio

> **Owner:** PP Namias  
> **Domain:** namias.tech  
> **Stack:** Next.js 14 · Framer Motion · Tailwind CSS  
> **Last updated:** 2025-01-XX

---

## 🎯 Goal

Transform the portfolio from a **static showcase** into a **living, interactive experience** by adding tasteful cursor effects, micro-interactions, and physics-based animations that delight visitors without sacrificing performance or accessibility.

---

## 1. Custom Cursor / Mouse Effects

### 1.1 ✅ Dot + Ring Cursor (Global)

Replace the default system cursor with a custom two-part cursor:

| Element | Size | Behavior |
|---------|------|----------|
| **Inner dot** | 6px | Follows cursor instantly, accent-pink |
| **Outer ring** | 32px | Follows with spring lag (stiffness: 500, damping: 28) |

**States:**
- **Default:** Small dot + thin ring
- **Hovering link/button:** Ring expands to 48px, fills with accent-pink at 10% opacity
- **Hovering text:** Ring morphs into vertical I-beam shape
- **Clicking:** Both shrink 20%, then spring back
- **Hovering image:** Ring expands to 64px, shows "View" label inside

**Implementation:**
- New component: `src/components/ui/CustomCursor.tsx`
- Uses `framer-motion` with `useMotionValue` + `useSpring` for mouse tracking
- Hidden on touch devices (`@media (pointer: coarse)`)
- Respects `prefers-reduced-motion` — falls back to default cursor
- Render in `providers.tsx` (global, outside layout)

**Priority:** Medium  
**Complexity:** Medium  
**Dependencies:** None

---

### 1.2 Magnetic Buttons

Interactive elements (CTAs, social icons, nav items) subtly pull toward the cursor when it enters a proximity zone (~50px radius).

**Behavior:**
- Enter proximity → button translates toward cursor (max 8px offset)
- Leave proximity → spring back to original position
- Click → slight scale-down (0.95) then spring to 1.0

**Target elements:**
- Hero CTAs (Download Resume, Book a Call)
- Social icon buttons in Hero
- FloatingHub FAB
- Blog link button
- Card hover areas

**Implementation:**
- New hook: `src/hooks/useMagnetic.ts`
- Uses `useRef` + `onMouseMove` + `framer-motion` springs
- Wrap target elements with `<Magnetic>` component or apply hook directly

**Priority:** High — most impactful micro-interaction  
**Complexity:** Low-Medium  
**Dependencies:** None

---

### 1.3 Spotlight / Glow Effect on Cards

Cards emit a soft radial glow that follows the cursor position within the card bounds.

**Behavior:**
- Mouse enters card → subtle radial gradient appears at cursor position
- Gradient color: accent-pink at 5-8% opacity
- Mouse leaves → gradient fades out (200ms)
- Gradient size: ~300px radius, soft falloff

**Implementation approach:**
- CSS `radial-gradient` on a pseudo-element or overlay div
- Track mouse position relative to card with `onMouseMove`
- Update CSS custom properties `--mouse-x`, `--mouse-y`
- Apply to `Card.tsx` component (opt-in via `spotlight` prop)

**Target cards:**
- Project cards
- Certification cards
- About section card
- Experience timeline card
- Tech stack card

**Priority:** High — modern portfolio standard  
**Complexity:** Low  
**Dependencies:** Card component refactor (add `spotlight` prop)

---

### 1.4 Cursor Trail Particles (Optional / Festive)

Tiny particles trail behind the cursor for special occasions (portfolio anniversary, holidays).

**Behavior:**
- Small accent-colored dots spawn at cursor position
- Particles drift with slight gravity + random spread
- Fade out over 600ms, max 20 active particles

**Implementation:**
- Canvas overlay with `requestAnimationFrame`
- Toggle via secret keyboard shortcut or seasonal auto-enable
- Disabled by default — purely decorative Easter egg

**Priority:** Low  
**Complexity:** Medium  
**Dependencies:** None

---

## 2. Profile Picture Interactions

### 2.1 ✅ Hover Scale + Glow (Implementing Now)

**Current state:** 120×120 container, spinning gradient ring, 114×114 photo  
**Enhancement:**

| Effect | On Hover | Transition |
|--------|----------|------------|
| Scale | 1.0 → 1.08 | Spring (stiffness: 300, damping: 20) |
| Gradient ring | Speed up spin (8s → 3s) | CSS transition 0.4s |
| Outer glow | None → accent-pink/30 box-shadow 0 0 25px | 0.3s ease |
| Photo brightness | 1.0 → 1.05 | 0.3s ease |
| Ring thickness | 3px → 4px | 0.3s ease |

**Implementation:**
- CSS `:hover` pseudo-class + Framer Motion `whileHover`
- Apply to the 120×120 container div
- Gradient ring hover: `animation-duration: 3s` on parent hover

---

### 2.2 3D Tilt on Profile Photo

Photo tilts based on cursor position within the photo bounds (parallax effect).

**Behavior:**
- Mouse enters photo → subtle 3D perspective tilt (max ±10deg)
- Cursor at top-left → tilts away from top-left
- Cursor leaves → springs back to flat (0, 0)
- Uses CSS `perspective` + `rotateX/rotateY`

**Implementation:**
- Track mouse position relative to photo center
- Map to rotation values: `rotateY = (x - centerX) / width * 20`
- Apply via `framer-motion` `useMotionValue` + `useTransform`
- Add `perspective: 600px` to parent container

**Priority:** Medium  
**Complexity:** Low  
**Dependencies:** Profile hover effect (2.1)

---

### 2.3 Click Easter Egg

Clicking the profile photo triggers a fun micro-animation:
- Confetti burst from the photo (5-8 small accent-colored dots)
- Photo does a brief wiggle/bounce
- Optional: tooltip appears "Hey, that tickles! 👋"

**Priority:** Low  
**Complexity:** Low  
**Dependencies:** None

---

## 3. Card & Section Interactions

### 3.1 Tilt Effect on Project Cards

Project cards tilt slightly based on mouse position (3D parallax).

**Behavior:**
- Max tilt: ±5 degrees
- Perspective: 1000px
- Smooth spring transition
- Inner content shifts slightly opposite to tilt (depth illusion)

**Implementation:**
- New hook: `src/hooks/useTilt.ts`
- Reusable across any component
- Applies `transform: perspective(1000px) rotateX(Xdeg) rotateY(Ydeg)`

**Priority:** Medium  
**Complexity:** Low  
**Dependencies:** None

---

### 3.2 Stagger Reveal on Scroll (Already Partially Done)

Current state: `whileInView` animations exist but are basic fade-up.

**Enhancement:**
- Add staggered children reveals (each child delays by 50ms)
- Cards slide in from alternating directions (left/right)
- Tech stack icons pop in with scale spring
- Gallery images reveal with clip-path wipe

**Priority:** Low (partially implemented)  
**Complexity:** Low  
**Dependencies:** None

---

### 3.3 Parallax Depth Layers

Subtle parallax scrolling where background elements move slower than foreground:
- Section backgrounds shift at 0.5x scroll speed
- Profile photo floats slightly on scroll (translateY based on scroll position)
- Cards have micro-parallax between border and content

**Implementation:**
- `framer-motion` `useScroll` + `useTransform`
- Apply to Hero section and Gallery section

**Priority:** Low  
**Complexity:** Medium  
**Dependencies:** Lenis smooth scroll (already configured)

---

## 4. Text & Typography Interactions

### 4.1 Character-by-Character Name Reveal

On initial page load, the name "Jhon Keneth Ryan Namias" types out character by character.

**Behavior:**
- Each character appears with slight delay (30ms per char)
- Cursor blinks at end
- Triggers once on mount, not on re-scroll

**Priority:** Low  
**Complexity:** Low  
**Dependencies:** None

---

### 4.2 Hover Text Scramble

When hovering over the name or role text, characters briefly scramble through random chars before settling.

**Behavior:**
- Hover triggers scramble animation (100ms per char)
- Characters cycle through random glyphs
- Resolves back to correct text left-to-right
- Accent-pink color during scramble

**Priority:** Low  
**Complexity:** Medium  
**Dependencies:** None

---

## 5. Navigation & UI Interactions

### 5.1 Smooth Section Indicator

A small dot or line on the side of the viewport indicates which section is currently in view.

**Behavior:**
- Tracks scroll position
- Highlights current section
- Clickable to jump to section
- Fades in after scrolling past Hero

**Priority:** Medium  
**Complexity:** Medium  
**Dependencies:** Intersection Observer

---

### 5.2 Page Transition Effects

Smooth transitions when navigating between `/` and `/blog`:
- Content fades out with slight scale-down
- New content fades in from bottom
- Uses `framer-motion` `AnimatePresence` in layout

**Priority:** Low  
**Complexity:** Medium  
**Dependencies:** App Router layout structure

---

## 6. Performance & Accessibility

### 6.1 Performance Budget

| Metric | Target | How |
|--------|--------|-----|
| FCP | < 1.5s | Defer cursor/effects to after hydration |
| LCP | < 2.5s | Profile photo already has `priority` |
| CLS | < 0.1 | No layout shifts from effects |
| JS bundle | +15KB max | Tree-shake, no heavy physics libs |

### 6.2 Accessibility Requirements

- **prefers-reduced-motion:** All cursor effects, parallax, and tilt MUST be disabled
- **Touch devices:** Custom cursor hidden, tap interactions instead
- **Keyboard navigation:** All interactive elements remain keyboard-accessible
- **Screen readers:** Effects are purely visual — no ARIA impact

### 6.3 Device Handling

| Device | Behavior |
|--------|----------|
| Desktop (pointer: fine) | Full effects |
| Tablet (pointer: coarse) | No cursor effects, keep hover alternatives |
| Mobile (pointer: coarse, max-width: 768px) | No cursor/tilt effects, simpler animations |
| Slow connection | Effects load after main content (dynamic import) |

---

## 7. Implementation Phases

### Phase 1 — Quick Wins (Now)
- [x] Profile picture hover effect (scale + glow + ring speedup)
- [ ] Card spotlight/glow following cursor
- [ ] Magnetic buttons on Hero CTAs

### Phase 2 — Core Effects
- [ ] Custom cursor (dot + ring)
- [ ] Project card tilt effect
- [ ] Profile photo 3D tilt
- [ ] Section scroll indicator

### Phase 3 — Polish
- [ ] Enhanced scroll reveal staggering
- [ ] Page transition animations
- [ ] Parallax depth layers

### Phase 4 — Extras (Optional)
- [ ] Text scramble effect
- [ ] Character-by-character name reveal
- [ ] Click Easter egg on profile photo
- [ ] Seasonal cursor trail particles

---

## 8. File Structure (Planned)

```
src/
├── components/ui/
│   └── CustomCursor.tsx          # Global custom cursor
│   └── Magnetic.tsx              # Magnetic wrapper component
├── hooks/
│   ├── useMagnetic.ts            # Magnetic pull hook
│   ├── useTilt.ts                # 3D tilt hook
│   ├── useMousePosition.ts       # Global mouse position tracker
│   └── useSpotlight.ts           # Card spotlight glow hook
```

---

## 9. References & Inspiration

- **brittanychiang.com** — Spotlight card glow, clean hover states
- **leerob.io** — Minimal, performance-first interactions
- **bryllim.com** — Design reference (resume-portfolio hybrid)
- **linear.app** — Magnetic buttons, custom cursor
- **stripe.com** — Card tilt, gradient animations
- **rauno.me** — Text scramble, micro-interactions

---

## 10. Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2025-XX | Profile hover: scale + glow + ring speedup | Immediate visual feedback without complexity |
| 2025-XX | Magnetic buttons before custom cursor | Higher impact-to-effort ratio |
| 2025-XX | Card spotlight over card tilt | More universally appealing, works on all cards |
| 2025-XX | No cursor effects on mobile | Touch devices don't have cursors |
