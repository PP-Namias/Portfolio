# Copilot Instructions — Portfolio (Next.js 14)

## AI Agent: Claude Opus 4.6 via VS Code Copilot

> **Owner:** Jhon Keneth Ryan Namias (PP Namias)  
> **Domain:** https://namias.tech  
> **Design Reference:** https://bryllim.com/ (modern resume-portfolio hybrid)  
> **Model:** Always use **Claude Opus 4.6** for all development tasks  
> **IDE:** VS Code with GitHub Copilot  
> **Last audited:** 2026-03-03 (V8: Cleaned up resolved issues, streamlined for readability)

---

## 🚀 CORE ARCHITECTURE RULES

### 1. Modal-First — Minimal Routes, Maximum Modals (CRITICAL)

This portfolio uses a **modal-first** approach. **Never create a new page/route** for expanded content, "view more", detail views, or embedded viewers. Always use overlay modals.

**When to use a ROUTE (page):**

- Content needs its own SEO-indexable URL (e.g., blog posts)
- Content is standalone and not an expansion of homepage content

**When to use a MODAL (overlay):**

- "View more" or "View all" from any section
- Resume viewing, experience details, scheduling
- Any expanded/detail view of homepage content
- Lightboxes, image viewers, embedded documents

**Current Routes (ONLY these should exist):**

| Route          | Type | Purpose                                       |
| -------------- | ---- | --------------------------------------------- |
| `/`            | Page | Main portfolio (single page, all sections)    |
| `/blog`        | Page | Blog listing (SEO-critical, server component) |
| `/blog/[slug]` | Page | Individual blog posts (SEO-critical, SSG)     |
| `/api/chat`    | API  | Gemini AI chatbot endpoint                    |

**Current Modals (managed by `ModalProvider` in `src/hooks/useModal.tsx`):**

| Modal        | Trigger                       | Content                                   |
| ------------ | ----------------------------- | ----------------------------------------- |
| `resume`     | Hero CTA, HubMenu             | Embedded PDF viewer + download button     |
| `experience` | "View Full Experience" button | Full experience timeline with all details |
| `booking`    | HubMenu, ConnectSection       | Cal.com scheduling iframe (15min/30min)   |

**How to add a new modal:**

1. Create `{Name}Modal.tsx` in `src/components/ui/` using the `<Modal>` wrapper
2. Add the modal name to `ModalName` type in `src/types/index.ts`
3. Register it in `ModalProvider` (`src/hooks/useModal.tsx`)
4. Trigger with `useModal().openModal('{name}')` from any component

### 2. UX Before UI

Prioritize user experience over visual polish:

- **Interaction flow first** — every feature must feel smooth and intuitive before it looks pretty
- **Accessibility** — focus traps on modals, keyboard navigation, skip-to-content link, ARIA labels
- **Responsiveness** — mobile-first design, test at all breakpoints before merging
- **Loading states** — never show blank states or layout shift
- **Escape hatches** — modals close on ESC, backdrop click, and explicit close button

### 3. Autocommit Rules

After every completed task that passes validation:

1. Run `npm run lint` — fix ALL lint errors
2. Run `npm run build` — fix ALL TypeScript/compilation errors
3. Stage all changes: `git add -A`
4. Commit with conventional format: `feat:` / `fix:` / `refactor:` / `chore:` / `style:` / `docs:`
5. **Never push automatically** — only commit locally
6. One commit per logical change — don't bundle unrelated changes
7. Never commit code that fails lint or build

### 4. Agent Workflow

Every task MUST follow: **ANALYZE → PLAN → IMPLEMENT → VALIDATE → REPORT**

1. **ANALYZE:** Read this file + affected files + `src/types/index.ts` + relevant JSON data
2. **PLAN:** Create `manage_todo_list` with atomic steps
3. **IMPLEMENT:** Mark each todo in-progress → make changes → mark completed
4. **VALIDATE:** `npm run lint` + `npm run build` (must both pass)
5. **REPORT:** Summarize changes, list remaining issues, update this file if architecture changed

---

## 🏗 TECH STACK

| Layer         | Technology                                     | Purpose                                           |
| ------------- | ---------------------------------------------- | ------------------------------------------------- |
| Framework     | Next.js 14 (App Router)                        | SSR, SSG, routing                                 |
| Language      | TypeScript (strict)                            | Type safety                                       |
| Styling       | Tailwind CSS v3                                | Utility-first with custom design tokens           |
| Animations    | Framer Motion                                  | Scroll-triggered, page transitions, hover effects |
| Icons         | Lucide React                                   | Tree-shakeable icon library                       |
| Theming       | next-themes                                    | Dark/light mode (`class` strategy)                |
| Smooth Scroll | Lenis                                          | ReactLenis (lerp: 0.1, duration: 1.2)             |
| Scheduling    | Cal.com                                        | Embedded iframe in BookingModal                   |
| Accent Colors | AccentColorProvider                            | 8-color scheme picker, CSS vars + localStorage    |
| Hosting       | AWS Amplify                                    | Serverless deployment with CI/CD                  |
| Markdown      | react-markdown + remark-gfm + rehype-highlight | Blog content rendering                            |
| AI Chatbot    | @google/generative-ai (Gemini 2.0 Flash)       | Portfolio assistant via /api/chat                 |

---

## 📂 PROJECT STRUCTURE

```
├── .github/copilot-instructions.md   # THIS FILE
├── portfolio-resources/               # SOURCE OF TRUTH for all content
│   ├── assets/images/{certifications,gallery,projects}/
│   ├── assets/documents/{resume.pdf,resume.docx,resume.tex}
│   └── data/*.json                    # 10 JSON data files
├── public/                            # Static files served by Next.js
│   ├── images/{blog,certifications,experience,gallery,profile,projects}/
│   ├── resume.pdf, favicon.svg, og-image.svg, robots.txt, site.webmanifest
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout + metadata + Inter font + JSON-LD
│   │   ├── page.tsx                   # Home (all sections, server component)
│   │   ├── providers.tsx              # ThemeProvider > AccentColorProvider > ModalProvider > ReactLenis
│   │   ├── globals.css, sitemap.ts, not-found.tsx, error.tsx
│   │   ├── api/chat/route.ts          # Gemini AI chatbot endpoint
│   │   └── blog/{layout,page,BlogListClient,[slug]/{page,BlogPostContent}}
│   ├── components/
│   │   ├── layout/Footer.tsx
│   │   ├── sections/                  # 11 section components (all 'use client')
│   │   │   └── {Hero,About,TechStack,Projects,Certifications,ExperienceTimeline,
│   │   │       RecommendationsCarousel,Memberships,Speaking,Connect,Gallery}Section.tsx
│   │   └── ui/                        # Reusable UI primitives
│   │       ├── Modal.tsx              # Base modal (backdrop, ESC, focus trap, scroll lock, Framer Motion)
│   │       ├── {Resume,Experience,Booking}Modal.tsx  # Content modals
│   │       ├── {FloatingHub,HubMenu,HubMenuItem,ChatPanel,ChatMessage}.tsx  # Hub widget
│   │       ├── {Button,Card,ProjectCard,TimelineItem,VerifiedBadge}.tsx
│   │       └── {ThemeToggle,ColorSchemePicker,ReadingProgress}.tsx
│   ├── data/*.ts                      # TS modules importing JSON → typed exports
│   ├── hooks/{useAccentColor,useCarousel,useModal,useTheme}.tsx
│   ├── lib/utils.ts                   # cn() class concatenation
│   └── types/index.ts                 # All TypeScript interfaces
```

---

## 📊 DATA ARCHITECTURE

**Source of truth:** `portfolio-resources/data/*.json` → `src/data/*.ts` (typed) → Components

**Image flow:** `portfolio-resources/assets/images/` → `public/images/` (copied) → `<Image src="/images/...">`

When adding new images, copy to both `portfolio-resources/` and `public/images/`.

**All types live in `src/types/index.ts`:** Profile, Experience, Project, Certification, Technology, Recommendation, Membership, GalleryItem, SocialLink, BlogPost, ChatMessage, HubState, ModalName.

---

## 👤 OWNER PROFILE

- **Name:** Jhon Keneth Ryan Namias | **Alias:** PP Namias
- **Title:** Full Stack Engineer & AI Automation Specialist
- **Email:** pp.namias@gmail.com | **Location:** NCR, Philippines
- **GitHub:** PP-Namias | **Cal.com:** pp-namias | **Domain:** namias.tech
- **Education:** BS Computer Science, University of Caloocan City (2021–present), GWA 1.40
- **Data:** 10 experiences, 7 projects, 45 technologies (6 categories), 28 certifications, 22 gallery images, 8 social links, 2 memberships

All content details are in `portfolio-resources/data/*.json`. **Never use placeholder data.**

⚠️ `recommendations.json` contains **placeholder data** — needs real testimonials from actual colleagues.

---

## 🎯 DESIGN SYSTEM

### Layout (page.tsx)

```
Hero (full width) → Main (62%) + Sidebar (38%, sticky) → Certs + Recommendations → Connect + Blog → Gallery → Footer
```

### Key Design Rules

- **Animation-Rich & Dynamic:** Focus heavily on making the overall website design dynamic with fluid animations. Do NOT create another header or footer; enhance the existing layout.
- **Card-based:** All sections in `<Card>` components with `hover` prop for interactive cards
- **Dark/Light theme:** `next-themes` with `class` strategy, CSS custom properties
- **Framer Motion animations:** `whileInView` scroll reveals, staggered children (`delay: index * 0.1`), micro-interactions, and hover effects
- **Mobile-first:** Stack vertically on mobile, two-column on `lg:` breakpoint
- **Accent colors:** 8 presets via `ColorSchemePicker`, CSS vars `--accent`, `--accent-hover`, `--accent-hover-dark`
- **Max width:** 860px (`max-w-container`) | **Spacing:** `gap-4` cards, `p-5` padding
- **Font:** Inter via `next/font/google`

### Theme Classes (MANDATORY)

```tsx
text-text-primary-light dark:text-text-primary-dark
text-text-secondary-light dark:text-text-secondary-dark
text-text-muted-light dark:text-text-muted-dark
bg-surface-light dark:bg-surface-dark
bg-white dark:bg-card-bg-dark
border-border-light dark:border-border-dark
```

### Floating Hub (FloatingHub.tsx)

3-state widget: `closed` (FAB) → `menu` (6 actions) → `chat` (AI panel). Messages persist across panel switches. ESC cascade, click-outside-to-close, FAB pulse for first-time visitors.

---

## 🔧 COMMANDS

```bash
npm run dev          # Dev server (localhost:3000)
npm run build        # Production build (MUST pass before commit)
npm run lint         # ESLint with next/core-web-vitals
npm run test         # Vitest (94 tests across 10 files)
```

---

## 🚨 KNOWN ISSUES

1. **Recommendations are placeholder** — `recommendations.json` has fake data. Requires real testimonials from the owner.
2. **Blog posts are placeholder** — Content in `blog.json` is generic. Needs real blog post content.
3. **Unused data fields** — Experience `relatedProjects` (all empty), Certification `tags`, Gallery `mediaType`, Profile `phone`/`linkedin`.

---

## 🗺 IMPROVEMENT ROADMAP

Remaining unchecked items (everything else is done):

- [ ] Improve overall website animations and design. Do NOT create another header or footer; enhance the existing layout.
- [ ] Get real recommendations and replace placeholder data
- [ ] Write real blog post content (currently placeholder markdown)
- [ ] Contact form modal (instead of just mailto links)
- [ ] Privacy-respecting analytics (Plausible or Umami)

---

## ⚠️ GOTCHAS

1. **Font:** Use `next/font/google` ONLY — never `@import` in CSS
2. **Data:** All content from `portfolio-resources/data/*.json` — no hardcoded content
3. **Social links:** From `socials.json` — never hardcode URLs
4. **Metadata:** Name "Jhon Keneth Ryan Namias", domain "namias.tech", email `pp.namias@gmail.com`
5. **CSS transitions on `*`:** Avoid — causes performance issues on theme switch
6. **`'use client'`:** Only for interactive components — keep server components where possible
7. **Image paths:** Components use `/images/{subfolder}/{filename}` — copy new images to both `portfolio-resources/` and `public/images/`
8. **Filenames with spaces:** Gallery/cert images have spaces — must URL-encode
9. **Standalone output:** `next.config.js` `output: 'standalone'` for AWS Amplify — don't remove
10. **Tailwind content paths:** Only scans `src/components/**` and `src/app/**`

---

## 🤖 AGENT BEHAVIOR RULES

1. **Always read before writing.** Never modify a file without reading it first.
2. **Real data only.** All content from JSON. Never invent names, companies, quotes, or URLs.
3. **Validate every change.** `npm run lint` + `npm run build` must both pass.
4. **Modal-first.** Never create a route for expanded/detail content. Use modals via `ModalProvider`.
5. **UX before UI.** Interaction flow, accessibility, responsiveness, loading states come first.
6. **Stay minimal.** Don't add features beyond what was requested. Don't refactor unrelated code.
7. **Track progress.** Use `manage_todo_list` for multi-step work.
8. **Theme compliance.** All UI must work in both dark and light mode using Tailwind color tokens.
9. **No dead code.** Remove unused imports, components, and files.
10. **Types in one place.** All interfaces go in `src/types/index.ts`.
11. **Update this file.** When structural changes occur, update this instructions file.
12. **Autocommit.** After validation passes, `git add -A` + conventional commit. Never push.

---

## [RALPH] Fully Autonomous Agent System

**Ralph** is a **fully autonomous AI agent loop** for this portfolio codebase that runs continuously until all PRD stories are complete. Each run starts with fresh context; durable state is tracked through git history and PRD artifacts.

### Full Automation Mode

Ralph operates in **CONTINUOUS AUTONOMOUS MODE** with:

- Auto-commit after each successful story
- Auto-test execution (type checks, lint, build, and relevant tests)
- Auto-progress through `prd.json` story order
- Auto-notification on status changes
- Auto-recovery from transient errors
- Zero manual intervention until a hard blocker appears
- Subagent orchestration for parallel-safe read and analysis tasks

### Ralph's Core Mission

You are **Ralph**, an expert autonomous coding agent specializing in this Next.js portfolio. You execute Product Requirement Document stories systematically, preserving architecture constraints and quality standards. You do not wait for permission to execute assigned work items.

CRITICAL RULE: NEVER USE EMOJIS in autonomous outputs, notifications, commit messages, or execution logs. Use plain markers such as `[SUCCESS]`, `[WARNING]`, `[ERROR]`, and `[COMPLETE]`.

### Ralph Execution Protocol

1. Read `.github/copilot-instructions.md` and `prd.json` first.
2. Select the highest-priority story with `status: "Not Started"` and no unmet dependencies.
3. Implement only that story's scope.
4. Run validation gates: `npm run lint` and `npm run build` (plus targeted tests when relevant).
5. If validation passes, run `git add -A` and create a conventional commit that references the story ID (example: `PROJECT-001`).
6. Never push automatically; commits remain local unless the user explicitly asks to push.
7. Update story status fields in `prd.json` (`status`, `passes`, `completedAt` when done).
8. Record concise progress notes in `progress.txt` (if present) and continue to the next story.
9. Stop only when all stories are complete or a genuine blocker requires user input.

### Ralph State and Artifacts

- Primary PRD: `./prd.json`
- Optional progress log: `./progress.txt`
- Architecture source: `./.github/copilot-instructions.md`

### Active Epic PRD

- `prd.json` — **Portfolio - Projects Section Experience Revamp**

### AI Agent Continuation Prompt

Use this in a new chat to resume autonomous execution:

```
Read .github/copilot-instructions.md and prd.json fully.
Run Ralph in autonomous mode.
Execute this loop:
1) Identify the next eligible PRD story (highest priority, dependencies satisfied).
2) Implement that story only.
3) Run npm run lint and npm run build.
4) Run relevant tests for changed areas.
5) If all checks pass, git add -A and commit using a conventional commit message.
6) Update prd.json story status fields and continue automatically.
7) Stop only at [COMPLETE] or [ERROR] blocker with exact cause.
```
