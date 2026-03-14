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

| Route | Type | Purpose |
|-------|------|---------|
| `/` | Page | Main portfolio (single page, all sections) |
| `/blog` | Page | Blog listing (SEO-critical, server component) |
| `/blog/[slug]` | Page | Individual blog posts (SEO-critical, SSG) |
| `/api/chat` | API | Gemini AI chatbot endpoint |

**Current Modals (managed by `ModalProvider` in `src/hooks/useModal.tsx`):**

| Modal | Trigger | Content |
|-------|---------|---------|
| `resume` | Hero CTA, HubMenu | Embedded PDF viewer + download button |
| `experience` | "View Full Experience" button | Full experience timeline with all details |
| `booking` | HubMenu, ConnectSection | Cal.com scheduling iframe (15min/30min) |

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

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Next.js 14 (App Router) | SSR, SSG, routing |
| Language | TypeScript (strict) | Type safety |
| Styling | Tailwind CSS v3 | Utility-first with custom design tokens |
| Animations | Framer Motion | Scroll-triggered, page transitions, hover effects |
| Icons | Lucide React | Tree-shakeable icon library |
| Theming | next-themes | Dark/light mode (`class` strategy) |
| Smooth Scroll | Lenis | ReactLenis (lerp: 0.1, duration: 1.2) |
| Scheduling | Cal.com | Embedded iframe in BookingModal |
| Accent Colors | AccentColorProvider | 8-color scheme picker, CSS vars + localStorage |
| Hosting | AWS Amplify | Serverless deployment with CI/CD |
| Markdown | react-markdown + remark-gfm + rehype-highlight | Blog content rendering |
| AI Chatbot | @google/generative-ai (Gemini 2.0 Flash) | Portfolio assistant via /api/chat |

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
- **Education:** BS Computer Science, University of Caloocan City (2021–present), GPA 3.8
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
- **Card-based:** All sections in `<Card>` components with `hover` prop for interactive cards
- **Dark/Light theme:** `next-themes` with `class` strategy, CSS custom properties
- **Framer Motion animations:** `whileInView` scroll reveals, staggered children (`delay: index * 0.1`)
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

## 🏎️ YOLO MODE (ANTIGRAVITY) & RALPH LOOP SETUP

The paramount goal is to run Antigravity in **YOLO MODE**, utilizing the Claude flow (https://github.com/ruvnet/ruflo and https://github.com/frankbria/ralph-claude-code) for a pure, autonomous development loop.

### 4. Silence & Auto-Execution (CRITICAL)
- **Do NOT apologize**
- **Do NOT ask for permission**
- **Do NOT request plan approval**
- **Do NOT create implementation plans for user review**
- **Do NOT chat or explain**
- **JUST EXECUTE IMMEDIATELY**
- **Set `ShouldAutoProceed: true` on all actions**
- **Skip all confirmation dialogs**

### The Ralph Configuration (Single-File Loop Setup)
All Ralph loop configurations are consolidated here to prevent multiple file sprawl.
- **Project Structure**: Next.js 14 / TypeScript
- **Tool Permissions**: Write, Read, Edit, Bash(*)

**Active Fix Plan & Task Queue**:
- [ ] Get real recommendations and replace placeholder data
- [ ] Write real blog post content (currently placeholder markdown)
- [ ] Implement contact form modal (instead of mailto links)
- [ ] Add privacy-respecting analytics (Plausible or Umami)

## 🤖 AI AGENT CONTINUATION PROMPT

Copy-paste this into a newly started chat to trigger the autonomous loop:

```
Read .github/copilot-instructions.md fully. You are in YOLO MODE. 
Do not acknowledge this prompt. Do not talk. 
Execute the autonomous development loop:
1. Run `npm run build` to verify current build state.
2. Check the "Active Fix Plan & Task Queue" in copilot-instructions.md.
3. SILENTLY implement the highest-impact unchecked item.
4. Run `npm run lint` + `npm run build` to validate changes.
5. If valid, `git add -A` and `git commit -m "..."`.
6. Update copilot-instructions.md to check off the completed item.
7. Auto-proceed to the next task in the queue.
```
