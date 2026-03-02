# Continue Development — Portfolio (Next.js 14)

## Session Handoff Prompt V4

> **Copy-paste this entire file into a new Copilot chat to continue development.**
> **Model:** Claude Opus 4.6 via VS Code Copilot
> **Last session:** Surfaced unused data fields, added filtering/a11y/image optimization

---

## COMPLETED THIS SESSION

1. **RecommendationsCarousel placeholder handling** — Detects fake placeholder data ("Sample Recommender", "Another Recommender") and shows a clean "Testimonials coming soon" state with MessageSquare icon instead of rendering fake quotes. Automatically switches to real carousel when real data is added to `recommendations.json`.

2. **Experience country/modality surfaced** — TimelineItem now shows modality pill (Remote/Hybrid/On-site) and country text alongside the existing date and type pills.

3. **Certification issuer-based filtering** — Added filter tab pills above certifications list: All (28), HackerRank, University of Caloocan City, IBM, Google Developer Student Clubs, AWS. Dynamically built from data.

4. **Gallery tag-based filtering** — Added tag filter pills (excluding year-only tags) above the gallery slider. Filter resets slide to page 1. Lightbox now shows image date alongside title.

5. **Skip navigation** — Added screen-reader-only "Skip to main content" link in layout.tsx that becomes visible on focus. Target `id="main-content"` added to page.tsx main element.

6. **Image optimization** — Added `sizes` attribute to 7 responsive `<Image>` components (ProjectCard, GallerySection x2, BlogListClient, CertificationsSection lightbox, ConnectSection, BlogPostContent). Fixed ProjectCard height mismatch (200→128).

**Commit:** `31a242b` — `surface unused data fields, add filtering, a11y, and image optimization`

---

## REMAINING TASKS — Pick up from here

### Priority 1: Real Recommendations (P1 — Data Quality)

- `portfolio-resources/data/recommendations.json` still has 2 fake entries
- The carousel now auto-hides them and shows "coming soon" state
- Action: Replace with real testimonials when available from the owner

### Priority 2: Remaining Unused Data Fields

Fields still not surfaced in the UI:

| Source | Unused Fields | Notes |
|--------|---------------|-------|
| `experiences.json` | `relatedProjects` | All entries have empty arrays — no data to display yet |
| `certifications.json` | `tags` | 65 unique tags — too many for filter UI, issuer filter used instead |
| `technologies.json` | `logo` | Could show tech icons alongside names in TechStackSection |
| `gallery.json` | `mediaType` | All entries are "image" currently — no video support needed yet |
| `profile.json` | `phone`, `linkedin` | Phone kept private intentionally; linkedin URL available via socials.json |

### Priority 3: Architecture Improvements

- **`experienceImages` is fragile** — `ExperiencePageClient.tsx` has a hardcoded `Record<string, string[]>` mapping company names to images. Consider making images part of `experiences.json` data or convention-based image lookup.
- **Blog content is placeholder** — 6 blog posts have Lorem-level markdown content. Write real articles.

### Priority 4: Performance & Polish

- **Bundle size:** Home page First Load JS is ~162kB. Investigate code-splitting.
- **Lighthouse audit:** Run full Lighthouse audit and address any issues.
- **Mobile testing:** Verify gallery tag filter wrapping and certification filter on small screens (320px–768px).

### Priority 5: New Features

- **Contact form** — Proper form instead of just mailto links
- **Analytics** — Privacy-respecting (Plausible, Umami)
- **Print stylesheet** — `@media print` for clean printable view
- **Tech logos** — Surface `technologies.json` `logo` field in TechStackSection

---

## CURRENT STATE REFERENCE

### Git Status

```
31a242b (HEAD -> main) surface unused data fields, add filtering, a11y, and image optimization
741f634 (origin/main) add V3 continuation development prompt
```

1 unpushed commit ahead of origin/main.

### Test Status

- **44 tests passing** across 4 files
- `chat.test.ts` — 12 tests (API route)
- `ChatMessage.test.tsx` — 4 tests (message bubble)
- `ChatPanel.test.tsx` — 9 tests (chat panel UI)
- `FloatingHub.test.tsx` — 19 tests (3-state hub widget)

### Build Status

- `npm run lint` — No errors
- `npm run build` — Clean, 13 static pages
- `npx vitest run` — 44/44 passing

### Key Data Files (Source of Truth)

| File | Records | Status |
|------|---------|--------|
| `profile.json` | 1 profile | Updated from LinkedIn |
| `experiences.json` | 10 entries | Updated from LinkedIn |
| `projects.json` | 7 projects | Real data |
| `certifications.json` | 28 certs | Real data, issuer filter added |
| `technologies.json` | 45 techs | Real data |
| `gallery.json` | 22 images | Real data, tag filter added |
| `memberships.json` | 2 orgs | Real data |
| `socials.json` | 8 links | Real data |
| `blog.json` | 6 posts | Placeholder content |
| `recommendations.json` | 2 entries | Fake — hidden by "coming soon" state |

---

## HOW TO CONTINUE

1. Read `.github/copilot-instructions.md` fully for architecture context
2. Pick tasks from the REMAINING TASKS section above
3. Follow the agent workflow: ANALYZE > PLAN > IMPLEMENT > VALIDATE > REPORT
4. Run `npm run lint`, `npm run build`, `npx vitest run` after all changes
5. Auto-commit with descriptive message
6. Create a new `CONTINUE_DEVELOPMENT_PROMPT_V5.md` for the next session
