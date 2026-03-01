# Copilot Instructions - Portfolio v3  
## AI Agent: Claude Opus 4.6 via VS Code Copilot

> **Owner:** Jhon Keneth Namias (PP Namias)  
> **Domain:** https://namias.tech  
> **Design Reference:** https://bryllim.com/ (modern resume-portfolio hybrid)  
> **Model:** Always use **Claude Opus 4.6** for all development tasks  
> **IDE:** VS Code with GitHub Copilot  

---

## 🏗 AGENT WORKFLOW — Autonomous Development Protocol

Every task MUST follow this pipeline. The agent should execute these phases **autonomously** without waiting for user confirmation between steps (unless destructive).

### Phase 1: ANALYZE
1. Read this instructions file fully
2. Identify which files are affected (use `grep_search` / `semantic_search`)
3. Read all affected files to understand current state
4. Check `src/services/core/types.ts` for data shapes
5. Check related JSON data files in `src/assets/portfolio-resources/data/`

### Phase 2: PLAN
1. Create a detailed todo list using `manage_todo_list`
2. Break work into atomic, independently verifiable steps
3. Identify dependencies between steps (what must come first)
4. Flag any destructive or irreversible actions for user confirmation

### Phase 3: IMPLEMENT
1. Mark each todo as `in-progress` before starting
2. Make changes file-by-file, using `multi_replace_string_in_file` for batch edits
3. Follow all architecture patterns below strictly
4. Mark each todo as `completed` immediately after finishing

### Phase 4: VALIDATE
1. Run `npm run lint` — fix ALL lint errors before proceeding
2. Run `npm run build` — fix ALL TypeScript/compilation errors
3. If tests exist for the changed area, run `npm run test:run`
4. Visually verify by checking the component renders correctly (read the output)

### Phase 5: REPORT
1. Summarize what was changed (files, lines, new components)
2. List any remaining TODOs or known issues
3. Generate the **Next Prompt** (see Prompt Chain section at bottom)

---

## 🎯 DESIGN VISION — Single-Page Scrollable Resume Portfolio

> **REDESIGN IN PROGRESS**: Converting from split-panel + tabbed layout to a **single-page scrollable layout** where ALL data is visible at once, inspired by https://bryllim.com/.

### Layout Architecture: Single-Page Scrollable

**Previous layout (DEPRECATED):** Split-panel with left sidebar (5/12) + right TabPanel (7/12) with 6 tabs. User could only see ONE section at a time.

**New layout (TARGET):** Two-column layout where the left column is a **sticky profile card** and the right column is a **vertically scrollable stream of ALL sections**. Every section is visible on one page — no tabs.

```
┌──────────────────────────────────────────────────────────────┐
│  ┌───────────────┐  ┌──────────────────────────────────────┐ │
│  │               │  │  Experience Timeline                │ │
│  │  Profile Card │  ├──────────────────────────────────────┤ │
│  │  (sticky)     │  │  Tech Stack (marquee)               │ │
│  │  (4/12 width) │  ├──────────────────────────────────────┤ │
│  │               │  │  Recent Projects (4)  [View All →]  │ │
│  │  - Avatar     │  ├──────────────────────────────────────┤ │
│  │  - Name +     │  │  Recent Certs (4)    [View All →]   │ │
│  │    Verified   │  ├──────────────────────────────────────┤ │
│  │  - Title      │  │  GitHub Activity (stats + calendar) │ │
│  │  - Avail.     │  ├──────────────────────────────────────┤ │
│  │    Badge      │  │  Recommendations                    │ │
│  │  - PH Time    │  ├──────────────────────────────────────┤ │
│  │  - Bio        │  │  Memberships                        │ │
│  │  - Socials    │  ├──────────────────────────────────────┤ │
│  │  - Discord    │  │  Gallery (8)         [View All →]   │ │
│  │  - Last.fm    │  ├──────────────────────────────────────┤ │
│  │  - Resume btn │  │  Contact / CTA                      │ │
│  │  - Calendly   │  └──────────────────────────────────────┘ │
│  │               │                                           │
│  │  Footer       │                                           │
│  └───────────────┘                                           │
└──────────────────────────────────────────────────────────────┘
```

### Section Order (top to bottom on right column)
| # | Section | Preview Mode | View All Route | Components | Skeleton |
|---|---------|-------------|----------------|------------|----------|
| 1 | Experience Timeline | All items | — | `experiences.tsx` | `ExperiencesSkeleton` |
| 2 | Tech Stack | Marquee | — | `technologies.tsx` | `TechStackSkeleton` |
| 3 | Recent Projects | First 4 cards | `/projects` | `projects.tsx` | `ProjectsSkeleton` |
| 4 | Recent Certifications | First 4 cards | `/certifications` | `certifications.tsx` | `CertificationsSkeleton` |
| 5 | GitHub Activity | Stats + Calendar combined | — | `github-stats.tsx` + `github-activity-calendar.tsx` | `GithubStatsSkeleton` + `GithubCalendarSkeleton` |
| 6 | Recommendations | All (usually few) | — | `recommendations.tsx` | `RecommendationsSkeleton` |
| 7 | Memberships | All badges | — | `memberships.tsx` | `MembershipsSkeleton` |
| 8 | Gallery | First 8 images | `/gallery` | `gallery.tsx` | `GallerySkeleton` |
| 9 | Contact / CTA | Full form + links | — | `contact.tsx` | — |

### "View All" Pattern
Sections with many items show a **preview** (limited count) + a **"View All" button/link**:
- The "View All" button navigates to a **dedicated sub-route** (e.g., `/projects`, `/certifications`, `/gallery`)
- Sub-routes render the full list with its own layout and back button
- Sub-routes are file-based: `src/routes/projects.tsx`, `src/routes/certifications.tsx`, `src/routes/gallery.tsx`
- Each sub-route reuses the existing section component but passes a `showAll` prop or renders without limit

### Left Column: Slim Sticky Profile Card (4/12 width)
The left column is a **slim, focused profile card** (`lg:w-4/12 2xl:w-3/12`) containing ONLY:
- Profile image + name + verified badge + title
- Availability badge (from GitHub API commit activity)
- Philippine time widget
- Bio / summary text
- Social icon links row
- Discord presence (compact)
- Last.fm now playing (compact)
- Resume button + Calendly button
- Theme toggle
- Footer (hidden on mobile, shown below profile card on desktop)

**NOT in left column** (moved to right column as proper sections):
- ~~Technologies marquee~~ → Right column section #2
- ~~GitHub stats + calendar~~ → Right column section #5
- ~~Memberships~~ → Right column section #7
- ~~RecentExperienceTile~~ → Removed (redundant with Experiences section)
- ~~DiscordPresenceTile / GithubRecentCommitTile~~ → Removed (Discord already in ProfileCard)

On mobile (`< lg:`), the profile card is **not sticky** and appears at the top, followed by all sections stacked vertically.

Right column uses `lg:w-8/12 2xl:w-9/12` width.

### Key Implementation Changes
1. **~~Remove `src/sections/tab-panel.tsx`~~** — DONE (deleted)
2. **~~Modify `src/routes/index.tsx`~~** — DONE (all sections stacked vertically in right column)
3. **~~Add sub-routes~~** — DONE (`src/routes/projects.tsx`, `src/routes/certifications.tsx`, `src/routes/gallery.tsx`)
4. **~~Add preview mode~~** — DONE (each section accepts a `limit` prop to show first N items)
5. **~~Add section headers~~** — DONE (each section gets a `<SectionHeader title="..." viewAllHref="..." />` component)
6. **~~Left column becomes sticky~~** — DONE (`lg:sticky lg:top-4 lg:self-start` on desktop)
7. **~~Add AnimatedSection~~** — DONE (`<AnimatedSection id="..." />` wraps each right-column section with Framer Motion whileInView)
8. **~~Slim left column~~** — DONE (only ProfileCard + Footer; Technologies, GithubStats, Calendar, Memberships moved to right column)
9. **~~Content-shaped skeletons~~** — DONE (12 skeleton components in `skeleton-loaders.tsx`, replacing generic LoadingTile)

### Section Status (mapped to current codebase)
| Section | Current Implementation | Status |
|---------|----------------------|--------|
| Profile Card (sticky) | `src/components/features/profile/profile-card.tsx` (merged header + main) | ✅ Unified + Sticky on desktop |
| Experience Timeline | `src/sections/experiences.tsx` | ✅ Right column + content-shaped skeleton |
| Tech Stack (marquee) | `src/sections/technologies.tsx` | ✅ Right column + content-shaped skeleton |
| Projects (cards + links) | `src/sections/projects.tsx` | ✅ Has `limit` prop + `/projects` sub-route + skeleton |
| Certifications | `src/sections/certifications.tsx` | ✅ Has `limit` prop + `/certifications` sub-route + skeleton |
| GitHub Activity | `src/sections/github-stats.tsx` + `github-activity-calendar.tsx` | ✅ Combined in right column |
| Recommendations | `src/sections/recommendations.tsx` | ✅ Right column + content-shaped skeleton |
| Memberships | `src/sections/memberships.tsx` | ✅ Right column (simplified, no wrapper) |
| Gallery | `src/sections/gallery.tsx` | ✅ Has `limit` prop + `/gallery` sub-route + skeleton |
| Contact / CTA | `src/sections/contact.tsx` | ✅ Exists |
| Discord Presence | `src/components/features/discord/` | ✅ Compact in ProfileCard |
| Last.fm Music | `src/components/features/last-fm/` | ✅ Compact in ProfileCard |
| Resume PDF View/Download | `src/routes/resume-preview.tsx` | ✅ Exists |
| AnimatedSection | `src/components/common/animated-section.tsx` | ✅ Scroll animations |
| SectionHeader | `src/components/common/section-header.tsx` | ✅ Title + View All |
| ProfileCard | `src/components/features/profile/profile-card.tsx` | ✅ Unified profile + socials + Last.fm |
| Skeleton Loaders | `src/components/ui/skeleton-loaders.tsx` | ✅ 12 content-shaped skeletons |

### Design Principles
- **Single-page scrollable**: All content visible on one page — no tabs, no hidden sections
- **Sticky profile card**: Left column stays visible while scrolling content on desktop
- **"View All" sub-routes**: Sections with many items preview N items + link to dedicated page
- **Dark/Light theme**: CSS variables in `globals.css` (`--custom-background`, `--custom-secondary`)
- **Smooth animations**: Framer Motion for scroll-triggered reveals (viewport enter)
- **Mobile-first**: Stacks vertically on mobile, two-column with sticky sidebar on `lg:` breakpoint
- **Bento grid tiles**: Cards/tiles with consistent padding, rounded corners (`rounded-xl`)
- **Micro-interactions**: Hover states, press feedback, smooth section transitions
- **Section anchors**: Each section has an `id` for anchor navigation from profile card links

---

## 📂 PROJECT STRUCTURE

```
src/
├── assets/portfolio-resources/
│   ├── assets/documents/          # Resume PDF
│   ├── assets/images/             # All image assets
│   │   ├── certifications/
│   │   ├── gallery/
│   │   └── projects/
│   └── data/                      # Static JSON data
│       ├── certifications.json
│       ├── experiences.json
│       ├── gallery.json
│       ├── profile.json
│       ├── projects.json
│       ├── socials.json
│       └── technologies.json
├── components/
│   ├── common/                    # Shared business components
│   ├── features/                  # Domain-specific components
│   │   ├── certifications/
│   │   ├── discord/
│   │   ├── experiences/
│   │   ├── gallery/
│   │   ├── github/
│   │   ├── last-fm/
│   │   ├── profile/
│   │   ├── projects/
│   │   ├── resume/
│   │   ├── socials/
│   │   └── technologies/
│   ├── partials/                  # Header, Footer
│   └── ui/                        # Reusable primitives (LoadingTile, ErrorTile, etc.)
├── constants/form-schemas/        # Zod/form schemas
├── context/                       # React contexts (ThemeProvider)
├── hooks/                         # Custom hooks (useCore, useGithub, useLastfm, etc.)
├── routes/                        # TanStack Router file-based routes
│   ├── __root.tsx
│   ├── index.tsx                  # Main portfolio page
│   ├── certifications.tsx         # View All certifications sub-route
│   ├── gallery.tsx                # View All gallery sub-route
│   ├── projects.tsx               # View All projects sub-route
│   └── resume-preview.tsx         # Full resume view
├── sections/                      # Page-level section layouts
├── services/                      # Service layer (Interface → Service → Hook)
│   ├── contact/
│   ├── core/                      # Main data service
│   ├── github/
│   ├── lastfm/
│   └── likes/
├── types/
└── utilities/
```

---

## 🏛 CORE ARCHITECTURE: Service Layer Pattern

**MANDATORY: All data fetching follows Interface → Service → Hook → Component**

```typescript
// 1. INTERFACE — src/services/core/interface.ts
export interface ICoreService {
  getProjects(): Promise<Project[]>;
}

// 2. SERVICE — src/services/core/service.ts
// ⚠️ MUST bind ALL methods in constructor or TanStack Query will lose `this`
export class CoreService implements ICoreService {
  constructor() {
    this.getProjects = this.getProjects.bind(this);
  }
  async getProjects(): ReturnType<ICoreService["getProjects"]> {
    return projects as Project[];
  }
}

// 3. HOOK — src/hooks/use-core.ts
const queryProjects = () => useQuery({
  queryFn: coreService.getProjects,
  queryKey: ["projects"],
});

// 4. COMPONENT — any section or feature component
const { data, isLoading, error } = useCore().queryProjects();
```

### Adding a New Data Type (e.g., Recommendations)
1. Add JSON → `src/assets/portfolio-resources/data/recommendations.json`
2. Add TypeScript type → `src/services/core/types.ts`
3. Add to interface → `src/services/core/interface.ts`
4. Implement in service → `src/services/core/service.ts` (bind in constructor!)
5. Add query → `src/hooks/use-core.ts`
6. Create section → `src/sections/recommendations.tsx`
7. Create feature component → `src/components/features/recommendations/`
8. Add section to `src/routes/index.tsx` in the right column scroll area
9. If section has many items: add `limit` prop + create a `/sectionname` sub-route for "View All"

### Adding a New External API Service
1. Create directory: `src/services/newapi/`
2. Create files: `interface.ts`, `service.ts`, `types.ts`, `index.ts`
3. Create hook: `src/hooks/use-newapi.ts`
4. Bind all methods in service constructor

---

## 🖼 IMAGE OPTIMIZATION (vite-imagetools)

**CRITICAL: All image glob patterns MUST include ALL supported formats:**

```typescript
const optimizedImages: Record<string, string> = import.meta.glob(
  "../assets/portfolio-resources/assets/images/projects/*.{png,jpg,jpeg,JPG,jfif,gif,webp}",
  { eager: true, import: "default", query: "?format=webp&meta" }
);
const imageKey = Object.keys(optimizedImages).find(key => key.includes(item.image));
```

**Supported formats:** `.png`, `.jpg`, `.jpeg`, `.JPG`, `.jfif`, `.gif`, `.webp`  
**PDF files:** Cannot use vite-imagetools — import directly or use fallback.

---

## 🧩 COMPONENT PATTERNS

### Compound Component Pattern
```tsx
<ProjectCard>
  <ProjectCard.Body>
    <ProjectCard.Image imageUrl={img} />
    <ProjectCard.Title title={t} year={y} />
  </ProjectCard.Body>
</ProjectCard>
```

### Loading/Error States — ALWAYS wrap async content

**Prefer content-shaped skeletons** over generic `LoadingTile` for better UX:
```tsx
import { ProjectsSkeleton } from "@/components/ui/skeleton-loaders";

if (isLoading) return <ProjectsSkeleton count={limit ?? 4} />;
if (error) return <ErrorTile className="h-70" />;
```

Available skeleton components (in `src/components/ui/skeleton-loaders.tsx`):
- `ExperiencesSkeleton`, `ProjectsSkeleton`, `CertificationsSkeleton`
- `GallerySkeleton`, `RecommendationsSkeleton`, `TechStackSkeleton`
- `GithubStatsSkeleton`, `GithubCalendarSkeleton`, `MembershipsSkeleton`
- `ProfileCardSkeleton`

**Fallback** for sections without a custom skeleton:
```tsx
if (isLoading) return <LoadingTile className="h-70" />;
if (error) return <ErrorTile className="h-70" />;
```

### Animation Pattern (Framer Motion)
```tsx
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, delay: index * 0.05 }}
>
  {/* content */}
</motion.div>
```

---

## 🔧 COMMANDS

```bash
npm run dev          # Vite dev server (localhost:5173)
npm run build        # TypeScript check + Vite build (MUST pass before commit)
npm run lint         # ESLint (MUST pass before commit)
npm run test:run     # Run all tests once
npm run test         # Watch mode tests
npx prettier --write .  # Format (Tailwind plugin auto-sorts classes)
```

---

## ✅ PRE-COMMIT CHECKLIST

**ALWAYS run in this order before ANY commit:**

```bash
npm run lint         # 1. Fix all lint errors
npm run build        # 2. Fix all TypeScript/build errors
npx prettier --write .  # 3. Format code
```

**BLOCK COMMIT if:**
- `npm run lint` has errors
- `npm run build` fails
- TypeScript type errors exist

---

## 🌐 EXTERNAL APIs

| Service | Base URL | Hook | Auth |
|---------|----------|------|------|
| GitHub API | `api.github.com` | `useGithub()` | None |
| GitHub Contributions | `github-contributions-api.jogruber.de` | `useGithub()` | None |
| Last.fm | `ws.audioscrobbler.com` | `useLastfm()` | `VITE_LAST_FM_API_KEY` |
| Contact (FormSubmit) | `formsubmit.co` | `useContact()` | None |

---

## 📏 KEY CONVENTIONS

- **Type imports:** `import type { ... }` for type-only imports
- **Path alias:** `@/` → `src/` (configured in `vite.config.ts`)
- **Theming:** CSS variables `--custom-background`, `--custom-secondary` in `globals.css`
- **Routing:** File-based in `src/routes/`, auto-generates `routeTree.gen.ts`
- **UI Library:** HeroUI components (`@heroui/react`) — use these over custom implementations
- **Icons:** `lucide-react` for all icons
- **Animations:** `framer-motion` for all transitions and scroll reveals
- **Date handling:** `dayjs` for date formatting and manipulation

---

## ⚠️ GOTCHAS

1. **Service method binding:** MUST bind in constructor or TanStack Query loses `this` context
2. **Image filenames:** JSON `image`/`media` fields must exactly match filenames in `assets/images/`
3. **Image glob formats:** MUST include `*.{png,jpg,jpeg,JPG,jfif,gif,webp}` — missing formats = broken images
4. **Route regeneration:** Restart dev server if routes don't update (`routeTree.gen.ts`)
5. **Build before commit:** Always `npm run build` before committing
6. **HeroUI imports:** Import from `@heroui/react` (not individual packages) unless tree-shaking specific components
7. **Tailwind v4:** Uses CSS-based config, NOT `tailwind.config.js` for theme values. CSS vars in `globals.css`
8. **Tailwind v4 shorthand:** Use `h-44` not `h-[11rem]`, `z-5` not `z-[5]`, `bg-linear-to-r` not `bg-gradient-to-r`, `mx-0.75` not `mx-[3px]`
9. **Dead code:** `RecentExperienceTile`, `DiscordPresenceTile`, `GithubRecentCommitTile`, `EmploymentStatus` are unused — can be deleted

---

## 📸 CONTENT MANAGEMENT

### Adding Gallery Items
1. Place image in `src/assets/portfolio-resources/assets/images/gallery/`
2. Add entry to `src/assets/portfolio-resources/data/gallery.json`:
```json
{
  "title": "Image Title",
  "mediaType": "image",
  "media": "filename.jpg",
  "tags": ["tag1", "tag2"],
  "createdAt": "2025-01-15"
}
```

### Adding Certifications
1. Place image in `src/assets/portfolio-resources/assets/images/certifications/`
2. Add entry to `src/assets/portfolio-resources/data/certifications.json`:
```json
{
  "title": "Certificate Title",
  "image": "certificate-filename.jpg",
  "issuer": "Issuing Organization",
  "issuedAt": "2025-01-15",
  "tags": ["skill1", "skill2"]
}
```

### Adding Projects
1. Place screenshot in `src/assets/portfolio-resources/assets/images/projects/`
2. Add entry to `src/assets/portfolio-resources/data/projects.json`

### Adding Experiences
Add entry to `src/assets/portfolio-resources/data/experiences.json`

### Troubleshooting Missing Images
1. Verify filename in JSON matches actual file exactly (case-sensitive)
2. Verify file extension is in the glob pattern
3. Restart dev server after adding new images
4. Check browser console for 404s or vite-imagetools warnings
5. Confirm image is in the correct subfolder

---

## 🔗 PROMPT CHAIN SYSTEM — Automated Development Workflow

This system enables **fully autonomous, iterative AI development**. After completing any task, the agent generates a **Next Prompt** that can be copy-pasted to continue the workflow.

### Prompt Chain Template

After completing each task, generate a prompt block in this format:

```
---
📋 NEXT PROMPT (copy-paste this for the next session):
---

Context: [Brief description of what was just completed]
Current State: [What exists now — new files, changed files, current build status]
Remaining Work: [What's left from the original plan]

Task: [Specific next action to take]

Requirements:
1. [Specific requirement 1]
2. [Specific requirement 2]
3. [Specific requirement 3]

Acceptance Criteria:
- [ ] npm run lint passes
- [ ] npm run build passes
- [ ] [Feature-specific check]
- [ ] Responsive on mobile and desktop
- [ ] Dark/light theme works

Design Reference: https://bryllim.com/ — match the [specific section] visual style

After completing this task, generate the next prompt in the chain.
```

### Master Prompt — Full Feature Implementation

Use this prompt template when starting a **new feature from scratch**:

```
I need to add [FEATURE_NAME] to my portfolio (namias.tech).

Design reference: https://bryllim.com/ — look at the [SECTION] section.

Follow the copilot-instructions.md workflow:
1. ANALYZE: Read all affected files first
2. PLAN: Create a detailed todo list
3. IMPLEMENT: Follow the Service Layer Pattern (types → interface → service → hook → section → component)
4. VALIDATE: Run lint + build, fix all errors
5. REPORT: Summarize changes and generate the next prompt

Architecture requirements:
- Add data type to src/services/core/types.ts
- Add JSON data to src/assets/portfolio-resources/data/
- Extend ICoreService interface
- Implement in CoreService (bind methods!)
- Add query to useCore hook
- Create section in src/sections/
- Create feature components in src/components/features/
- Add section to the right column in src/routes/index.tsx
- If section has many items: add limit prop + create View All sub-route
- Use HeroUI components + Tailwind v4
- Add Framer Motion animations
- Handle loading/error states with LoadingTile/ErrorTile
- Support dark/light theme
- Mobile-first responsive design

After completing, generate the next prompt.
```

### Quick Fix Prompt

```
There's a bug: [DESCRIBE THE BUG]

Follow copilot-instructions.md:
1. Read the affected files
2. Identify root cause
3. Fix it
4. Run npm run lint && npm run build
5. Confirm the fix

After fixing, generate the next prompt if there are related improvements.
```

### Iteration Improvement Prompt

```
Review the current state of [SECTION/COMPONENT] against the design reference (https://bryllim.com/).

1. Read the current implementation
2. Compare with the reference design
3. List specific visual/functional gaps
4. Create a prioritized improvement plan
5. Implement the top 3 improvements
6. Validate with lint + build

Focus on:
- Visual polish (spacing, typography, colors)
- Animations and micro-interactions
- Responsive behavior
- Accessibility

After completing, generate the next prompt for further refinements.
```

---

## 📊 DEVELOPMENT ROADMAP

### Phase 1: Core Polish (Completed)
- [x] Profile / Hero section
- [x] Experience timeline
- [x] Tech stack (categorized)
- [x] Projects grid
- [x] Certifications
- [x] Gallery (masonry)
- [x] Contact form
- [x] GitHub stats + activity calendar
- [x] Discord presence
- [x] Last.fm integration
- [x] Resume PDF viewer
- [x] SEO / structured data
- [x] Dark/light theme
- [x] Recommendations / Testimonials section
- [x] Memberships / Affiliations section

### Phase 2: Single-Page Redesign (Completed)
- [x] Remove TabPanel — replace with vertically scrolled sections
- [x] Create `SectionHeader` component (title + optional "View All" link)
- [x] Update `src/routes/index.tsx` — render all sections in right column
- [x] Add `limit` prop to Projects, Certifications, Gallery sections
- [x] Make left column a sticky profile card on desktop
- [x] Create sub-routes: `/projects`, `/certifications`, `/gallery`
- [x] Scroll-triggered Framer Motion animations on all sections
- [x] Section anchor IDs for navigation
- [x] Mobile-first stacked layout
- [x] Create `AnimatedSection` component for reusable scroll animations

### Phase 3: Enhanced Profile Card (Completed)
- [x] Consolidate `header.tsx` + `main.tsx` into a single sticky profile card
- [x] Verified badge / achievement highlights
- [x] Speaking / Availability badge
- [x] Compact Discord presence + Last.fm now playing in profile card
- [x] Deleted unused `header.tsx` and `main.tsx`
- [x] Social icon links row in profile card

### Phase 4: Layout Refinement & Skeleton Loading (Completed)
- [x] Slim left column to ProfileCard + Footer only (4/12 width)
- [x] Move Technologies, GithubStats, GithubActivityCalendar, Memberships to right column
- [x] Remove redundant tiles (RecentExperienceTile, DiscordPresenceTile, GithubRecentCommitTile)
- [x] Combine GitHub stats + calendar into single "GitHub Activity" section
- [x] 12 content-shaped skeleton loading components (`skeleton-loaders.tsx`)
- [x] Replace generic `LoadingTile` with content-shaped skeletons in all sections
- [x] Fix Tailwind v4 shorthand warnings (z-5, bg-linear-to-r, etc.)
- [x] 480 unit tests passing (19 test files)

### Phase 5: Polish & Performance (Current)
- [ ] Lighthouse score >95 across all metrics
- [ ] Image lazy loading + blur placeholders
- [ ] Bundle size optimization (code splitting large chunks)
- [ ] PWA manifest + service worker
- [ ] Dead code cleanup (unused tiles/components)
- [ ] Analytics integration
- [ ] Blog integration (optional)
- [ ] AI chatbot widget (optional)

---

## 🤖 AGENT BEHAVIOR RULES

1. **Always read before writing.** Never modify a file without reading it first.
2. **Follow the Service Layer Pattern.** No exceptions — types → interface → service (bind!) → hook → component.
3. **Batch edits efficiently.** Use `multi_replace_string_in_file` for multiple changes in the same operation.
4. **Validate every change.** Run `npm run lint` and `npm run build` after implementation.
5. **Never skip error handling.** All async components need content-shaped skeletons (from `skeleton-loaders.tsx`) / `ErrorTile` states.
6. **Match the design reference.** When implementing UI, refer to https://bryllim.com/ for visual guidance.
7. **Generate the Next Prompt.** Every completed task MUST end with a copy-pasteable prompt for continuation.
8. **Stay minimal.** Don't add features, abstractions, or refactors beyond what was requested.
9. **Track progress.** Use `manage_todo_list` for any multi-step work.
10. **Respect the theme.** All UI must work in both dark and light mode using CSS variables.
