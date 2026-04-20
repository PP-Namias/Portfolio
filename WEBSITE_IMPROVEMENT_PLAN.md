# Website Improvement Plan

Last updated: 2026-04-20
Project: PP Namias Portfolio (`namias.tech`)

## Objective

Create a practical, execution-ready plan to improve UX quality, credibility, conversion rate, and maintainability without breaking the existing architecture.

## Product Constraints (Must Keep)

1. Modal-first architecture for expanded content (except SEO-critical routes).
2. Projects behavior remains:
   - Hover/focus: smooth image zoom only
   - Click: direct navigation (`detailURL > liveURL > repositoryURL`)
3. Content source of truth remains in `portfolio-resources/data/*.json`.
4. Existing routes stay minimal:
   - `/`
   - `/contact`
   - `/blog`
   - `/blog/[slug]`
   - `/api/chat`
5. All changes must pass quality gates:
   - `npm run lint`
   - `npm run build`
   - relevant tests

## Current Snapshot

### Strengths

- Strong visual identity and dark/light theming.
- Good section coverage (hero, experience, projects, certifications, gallery, connect).
- Existing modal system and AI chat integration.
- Stable build/lint pipeline.

### Gaps to Improve

1. Some portfolio content is still placeholder-level (recommendations, blog depth).
2. Connect flow can be improved further through a smoother dedicated `/contact` page flow.
3. Analytics is not yet privacy-focused and structured for conversion tracking.
4. Motion and spacing can be further tuned for readability on dense screens.
5. Need consistent icon strategy across all social/action surfaces.

## Prioritized Roadmap

## Phase 1 — UX Polish and Interaction Quality (High Priority, 3-5 days)

### Phase 1 scope

- Refine top-fold readability and spacing rhythm.
- Normalize iconography and action affordances across Hero, Connect, Hub, and modals.
- Improve keyboard/focus visibility and small-screen interaction comfort.

### Phase 1 key tasks

- Tune typography scale/line-height in dense cards (`About`, `Experience`, `Connect`).
- Standardize icon sizing and visual weight for social/action rows.
- Ensure hover/focus parity for all interactive controls.
- Improve motion timing consistency (`duration`, `ease`, reduced-motion behavior).

### Phase 1 acceptance criteria

- No clipped text/controls on common mobile breakpoints.
- Focus states visible and consistent on all actionable elements.
- Icon set appears visually cohesive across all sections.

## Phase 2 — Content Credibility Upgrade (High Priority, 3-7 days)

### Phase 2 scope

- Replace placeholder content with real proof-driven content.

### Phase 2 key tasks

- Replace `recommendations.json` placeholder quotes with real testimonials.
- Expand `blog.json` posts into authentic technical writeups.
- Enrich project cards with concise outcomes (impact, stack clarity, role clarity).
- Validate all social/external links and metadata consistency.

### Phase 2 acceptance criteria

- Recommendations have real names/roles/companies (or approved anonymized format).
- At least 3 high-quality blog posts with real project lessons.
- Every featured project has clear role + value statement.

## Phase 3 — Conversion Improvements (High Priority, 4-6 days)

### Phase 3 scope

- Make contacting and booking easier with fewer drop-offs.

### Phase 3 key tasks

- Enhance dedicated `/contact` page flow with:
  - name, email, message
  - optional service/topic selector
  - clear success/error states
- Add CTA hierarchy tuning (primary: booking, secondary: email/contact form).
- Add fallback links where relevant (Cal.com open link + email backup).

### Phase 3 acceptance criteria

- Contact page form is accessible (keyboard, labels, clear focus states).
- Submission states are explicit (loading/success/error).
- Contact/booking actions are reachable within 1-2 interactions from hero/connect.

## Phase 4 — Performance and Accessibility Hardening (Medium Priority, 3-5 days)

### Phase 4 scope

- Improve perceived speed and maintain smooth interactions under load.

### Phase 4 key tasks

- Audit section-level animation costs; reduce unnecessary re-renders.
- Optimize large image surfaces (gallery/project/certification loading strategy).
- Add/verify reduced-motion handling in all high-motion UI areas.
- Improve semantic labeling/ARIA for interactive sections and modals.

### Phase 4 acceptance criteria

- Smooth interactions on mid-range mobile devices.
- No major layout shift during section entry and modal open.
- Keyboard-only navigation remains fully usable.

## Phase 5 — SEO and Content Discoverability (Medium Priority, 3-6 days)

### Phase 5 scope

- Improve organic discoverability and blog quality without route bloat.

### Phase 5 key tasks

- Strengthen blog post metadata (title, excerpt, tags, OG image discipline).
- Add structured internal linking between blog and project/experience topics.
- Validate sitemap and robots coverage after content expansion.

### Phase 5 acceptance criteria

- Blog pages have complete metadata and share previews.
- Internal links improve navigation to portfolio proof points.

## Phase 6 — Privacy-Respecting Analytics (Medium Priority, 1-3 days)

### Phase 6 scope

- Introduce actionable measurement without intrusive tracking.

### Phase 6 key tasks

- Integrate Plausible or Umami.
- Track key events: `hero_book_call_click`, `connect_schedule_click`, `contact_form_submit`, `resume_view_click`, `project_card_outbound_click`.
- Add simple monthly dashboard review process.

### Phase 6 acceptance criteria

- Analytics script loads in privacy-respecting mode.
- Core conversion events are visible and validated in production.

## Suggested Backlog (Implementation Units)

| ID | Item | Priority | Effort | Primary Files |
| --- | --- | --- | --- | --- |
| IMP-001 | Top-fold spacing and readability pass | P0 | S | `src/components/sections/HeroSection.tsx`, `src/app/globals.css` |
| IMP-002 | Cross-section icon consistency pass | P0 | S | `HeroSection`, `ConnectSection`, `HubMenu` |
| IMP-003 | Replace recommendations placeholders | P0 | M | `portfolio-resources/data/recommendations.json` |
| IMP-004 | Write 3 real blog posts | P0 | M/L | `portfolio-resources/data/blog.json` |
| IMP-005 | Enhance dedicated contact page flow | P0 | M | `src/app/contact/page.tsx`, `src/components/sections/HeroSection.tsx`, `src/components/sections/ConnectSection.tsx` |
| IMP-006 | Modal and section a11y audit | P1 | M | `src/components/ui/Modal.tsx`, section components |
| IMP-007 | Motion/perf tuning pass | P1 | M | `src/components/sections/*`, `src/components/ui/*` |
| IMP-008 | Add privacy analytics | P1 | S/M | `src/app/layout.tsx`, analytics config |
| IMP-009 | SEO metadata hardening for blog | P1 | M | `src/app/blog/**` |

## Success Metrics

1. +20% increase in booking CTA click-through rate.
2. +15% increase in contact initiation events.
3. Lower bounce on hero section (tracked by analytics tool).
4. 100% pass rate on lint/build gates per release.
5. No accessibility regressions in keyboard/modal flows.

## Execution Rhythm

- Work in weekly sprints (P0 first, then P1).
- One logical commit per item.
- Validate every completed item with lint/build and targeted tests.
- Update `prd.json`/`progress.txt` when roadmap items are transformed into active stories.

## Immediate Next 3 Actions

1. Start `IMP-001` (hero readability and spacing polish).
2. Start `IMP-003` (real recommendations collection/import).
3. Start `IMP-005` (dedicated contact page flow design + implementation).
