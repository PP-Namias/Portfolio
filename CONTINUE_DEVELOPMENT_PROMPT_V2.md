# Continue Development — Portfolio (Next.js 14)
## Session Handoff Prompt

> **Copy-paste this entire file into a new Copilot chat to continue development.**  
> **Model:** Claude Opus 4.6 via VS Code Copilot  
> **Last session:** Completed FloatingHub cleanup, accessibility, and pulse animation

---

## ✅ COMPLETED THIS SESSION

1. **Deleted dead `ChatWidget.tsx`** — No source files imported it. Removed from UI components.
2. **Updated `.github/copilot-instructions.md`** — Added FloatingHub architecture docs (3-state machine, escape cascade, click-outside, pulse animation), updated component listing (7→11 UI primitives), marked resolved issues #30 and completed roadmap items.
3. **FloatingHub accessibility** — Added focus trap (Tab/Shift+Tab cycling), click-outside-to-close (desktop only, `sm:` breakpoint), `tabIndex={-1}` on panel for programmatic focus.
4. **FAB pulse ring animation** — Pink ring animation on the FAB for first-time visitors. Uses `sessionStorage` to track interaction — pulse stops permanently after first click. CSS `@keyframes pulse-ring` added to `globals.css`.
5. **Placeholder recommendations indicator** — Added "Sample testimonials — real recommendations coming soon" subtitle to `RecommendationsCarousel`.
6. **All tests passing** — 44 tests across 4 test files. FloatingHub tests updated with `forwardRef` mocks (hoisted-safe pattern using `require('react')` inside `vi.mock` factory).

**Commit:** `0cc0f3b` — `chore: FloatingHub cleanup — delete ChatWidget, add accessibility, pulse animation, placeholder indicator`

---

## 🔧 REMAINING TASKS — Pick up from here

### Priority 1: Test File Rename
- `src/__tests__/components/ChatWidget.test.tsx` still tests `ChatPanel` (not ChatWidget, which is deleted). Rename to `ChatPanel.test.tsx` for clarity. Update any test runner configs if needed.

### Priority 2: Real Recommendations
- `portfolio-resources/data/recommendations.json` has 2 placeholder entries ("Sample Recommender" at "Tech Company"). These need real testimonials from actual colleagues/managers. Ask the owner for real data, or design a "coming soon" state that hides the carousel entirely when no real data exists.

### Priority 3: Remaining Unused Data Fields
These JSON fields exist but are never rendered in the UI:
- **Experience:** `country`, `modality`, `relatedProjects`
- **Certification:** `tags`
- **Technology:** `logo` (icon URLs)
- **Gallery:** `mediaType`, `tags`, `createdAt`
- **Profile:** `phone`, `linkedin`

Consider which of these add value to the portfolio and implement UI for them.

### Priority 4: Performance & Polish
- **Image optimization:** Audit all `<Image>` components for proper `width`/`height`/`sizes` attributes. Some may be using `fill` without proper container sizing.
- **Bundle analysis:** First Load JS is 160kB for home page. Investigate code splitting opportunities.
- **Lighthouse audit:** Run a full Lighthouse audit and address any accessibility, performance, or SEO issues.
- **Mobile testing:** Verify all sections look correct on small screens (320px–768px). The two-column layout and gallery slider are most at risk.

### Priority 5: New Features
- **Blog content:** The 6 blog posts have placeholder markdown content. Write real, substantive blog articles.
- **Contact form:** Consider adding a proper contact form instead of just mailto links.
- **Analytics:** Add privacy-respecting analytics (e.g., Plausible, Umami) to track portfolio visits.
- **Print stylesheet:** Add `@media print` styles for a clean printable view.
- **Skip navigation:** Add a "Skip to main content" link for screen readers.

---

## 📋 CURRENT STATE REFERENCE

### Files Modified This Session
| File | Change |
|------|--------|
| `src/components/ui/FloatingHub.tsx` | Added focus trap, click-outside-to-close, pulse ring, sessionStorage |
| `src/components/ui/ChatWidget.tsx` | **DELETED** |
| `src/components/sections/RecommendationsCarousel.tsx` | Added placeholder indicator subtitle |
| `src/app/globals.css` | Added `@keyframes pulse-ring` |
| `src/__tests__/components/FloatingHub.test.tsx` | Updated mock with forwardRef, added 3 new tests (19 total) |
| `.github/copilot-instructions.md` | FloatingHub docs, resolved issues, roadmap updates |

### Test Status
- **44 tests passing** across 4 files
- `chat.test.ts` — 12 tests (API route)
- `ChatMessage.test.tsx` — 4 tests (message bubble)
- `ChatWidget.test.tsx` — 9 tests (ChatPanel, misnamed)
- `FloatingHub.test.tsx` — 19 tests (hub widget)

### Build Status
- `npm run lint` — ✅ No errors
- `npm run build` — ✅ Clean, 13 static pages
- `npx vitest run` — ✅ 44/44 passing

---

## 🚀 HOW TO CONTINUE

1. Read `.github/copilot-instructions.md` fully for architecture context
2. Pick tasks from the REMAINING TASKS section above
3. Follow the agent workflow: ANALYZE → PLAN → IMPLEMENT → VALIDATE → REPORT
4. Run `npm run lint`, `npm run build`, `npx vitest run` after all changes
5. Commit with descriptive message
6. Create a new continuation prompt for the next session
