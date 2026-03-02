# Continue Development — Portfolio (Next.js 14)
## Session Handoff Prompt V3

> **Copy-paste this entire file into a new Copilot chat to continue development.**  
> **Model:** Claude Opus 4.6 via VS Code Copilot  
> **Last session:** Synced all portfolio data with real LinkedIn profile + dead code cleanup

---

## ✅ COMPLETED THIS SESSION

1. **Updated `profile.json` with LinkedIn data** — Full name "Jhon Keneth Ryan Namias", title "Full Stack Engineer & AI Automation Specialist", location "National Capital Region, Philippines", rich summary from LinkedIn About section, yearsExperience 3→4, added "AI Automation" and "Prompt Engineering" to primaryTechnologies.

2. **Rewrote `experiences.json` (7→10 entries):**
   - **ADDED** MASH - Mushroom Automation (Project Manager, Full-time, Sep 2025–Present, Hybrid)
   - **UPDATED** Aeternitas: title→"Software Engineer", dates→Jun-Sep 2025, modality→Hybrid, real LinkedIn highlights
   - **UPDATED** Wilshire: title→"Automation Engineer Trainee", country→"United States", dates→Jun-Sep 2025, real LinkedIn highlights (Eleven Labs, LLM, voice tech)
   - **ADDED** 2 UCC Volunteer entries (Head of Technical Committee 2025–Present, Program Committee Member 2024–2025)

3. **Created 3 new experience SVG covers** — `mash.svg` (green), `aeternitas.svg` (purple), `ucc-volunteer.svg` (magenta) in `public/images/experience/`

4. **Updated all SEO metadata** — layout.tsx (title, description, openGraph, twitter, jsonLd), experience/page.tsx, blog/layout.tsx, blog/[slug]/page.tsx

5. **Updated chatbot** — System prompt and model priming in route.ts updated with new name, title, and "10 roles including volunteer"

6. **Updated supporting files** — og-image.svg, site.webmanifest, LICENSE, test mocks (chat.test.ts, FloatingHub.test.tsx)

7. **Updated copilot-instructions.md** — Identity section, Experience Summary table (10 rows), SVG cover count (5→8)

8. **Renamed `ChatWidget.test.tsx` → `ChatPanel.test.tsx`** — File actually tests ChatPanel, not the deleted ChatWidget

**Commits:**
- `bdc1040` — `sync portfolio data with LinkedIn profile`
- `937a71c` — `rename ChatWidget.test.tsx to ChatPanel.test.tsx, add dev prompts`

---

## 🔧 REMAINING TASKS — Pick up from here

### Priority 1: Real Recommendations (P1 — Data Quality)
- `portfolio-resources/data/recommendations.json` has 2 placeholder entries ("Sample Recommender" at "Tech Company", "Another Recommender" at "Digital Agency"). These are FAKE.
- Options: (a) Get real testimonials from owner's colleagues/managers, or (b) hide the RecommendationsCarousel entirely when no real data exists, or (c) design a tasteful "coming soon" state.
- Currently shows a "Sample testimonials — real recommendations coming soon" subtitle indicator.

### Priority 2: Remaining Unused Data Fields
These JSON fields exist in the data but are never rendered in the UI:
| Source | Unused Fields | Potential UI |
|--------|---------------|-------------|
| `experiences.json` | `country`, `modality`, `relatedProjects` | Country flag/badge, remote/hybrid/onsite pill, project links |
| `certifications.json` | `tags` | Filter/search by tag |
| `technologies.json` | `logo` | Show tech logos alongside names |
| `gallery.json` | `mediaType`, `tags`, `createdAt` | Gallery filters, date grouping |
| `profile.json` | `phone`, `linkedin` | Contact info display |

### Priority 3: Performance & Polish
- **Image optimization:** Audit all `<Image>` components for proper `width`/`height`/`sizes` attributes
- **Bundle analysis:** First Load JS is ~160kB for home page — investigate code splitting
- **Lighthouse audit:** Run full audit, address accessibility/performance/SEO issues
- **Mobile testing:** Verify all sections on 320px–768px, especially two-column layout and gallery slider

### Priority 4: Architecture Improvements
- **`experienceImages` is fragile** — `ExperiencePageClient.tsx` has a hardcoded `Record<string, string[]>` mapping company names to images. When a new experience is added, this map must be manually updated. Consider making images part of the `experiences.json` data or building a convention-based image lookup.
- **Blog content is placeholder** — The 6 blog posts have Lorem-level markdown content. Write real, substantive articles.

### Priority 5: New Features
- **Contact form** — Proper contact form instead of just mailto links
- **Analytics** — Privacy-respecting analytics (Plausible, Umami)
- **Print stylesheet** — `@media print` styles for clean printable view
- **Skip navigation** — "Skip to main content" link for screen readers
- **Certifications filtering** — 28 certs are a lot; add tag-based filtering using the unused `tags` field

---

## 📋 CURRENT STATE REFERENCE

### Git Status
```
937a71c (HEAD -> main) rename ChatWidget.test.tsx to ChatPanel.test.tsx, add dev prompts
bdc1040 sync portfolio data with LinkedIn profile
0cc0f3b chore: FloatingHub cleanup — delete ChatWidget, add accessibility, pulse animation, placeholder indicator
bbcb779 Add FloatingHub, ChatPanel, HubMenu & tests
cf8857b (origin/main) Add Floating Hub prompt & test updates
```
**4 unpushed commits** ahead of origin/main.

### Test Status
- **44 tests passing** across 4 files
- `chat.test.ts` — 12 tests (API route)
- `ChatMessage.test.tsx` — 4 tests (message bubble)
- `ChatPanel.test.tsx` — 9 tests (chat panel UI)
- `FloatingHub.test.tsx` — 19 tests (3-state hub widget)

### Build Status
- `npm run lint` — ✅ No errors
- `npm run build` — ✅ Clean, 13 static pages
- `npx vitest run` — ✅ 44/44 passing

### Key Data Files (Source of Truth)
| File | Records | Status |
|------|---------|--------|
| `profile.json` | 1 profile | ✅ Updated from LinkedIn |
| `experiences.json` | 10 entries | ✅ Updated from LinkedIn |
| `projects.json` | 7 projects | ✅ Real data |
| `certifications.json` | 28 certs | ✅ Real data |
| `technologies.json` | 45 techs | ✅ Real data |
| `gallery.json` | 22 images | ✅ Real data |
| `memberships.json` | 2 orgs | ✅ Real data |
| `socials.json` | 8 links | ✅ Real data |
| `blog.json` | 6 posts | ⚠️ Placeholder content |
| `recommendations.json` | 2 entries | ❌ Fake placeholder data |

---

## 🚀 HOW TO CONTINUE

1. Read `.github/copilot-instructions.md` fully for architecture context
2. Pick tasks from the REMAINING TASKS section above
3. Follow the agent workflow: ANALYZE → PLAN → IMPLEMENT → VALIDATE → REPORT
4. Run `npm run lint`, `npm run build`, `npx vitest run` after all changes
5. Auto-commit with descriptive message
6. Create a new `CONTINUE_DEVELOPMENT_PROMPT_V4.md` for the next session
