# Copilot Instructions — Portfolio (Next.js 14)
## AI Agent: Claude Opus 4.6 via VS Code Copilot

> **Owner:** Jhon Keneth Ryan Namias (PP Namias)  
> **Domain:** https://namias.tech  
> **Design Reference:** https://bryllim.com/ (modern resume-portfolio hybrid)  
> **Model:** Always use **Claude Opus 4.6** for all development tasks  
> **IDE:** VS Code with GitHub Copilot  
> **Last audited:** 2026-03-03 (V7: Modal-first architecture, minimal routes, resume/experience modals, removed /resume and /experience pages, ModalProvider context, autocommit rules)

---

## 🏗 TECH STACK

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Framework | Next.js 14 (App Router) | 14.2.21 | SSR, SSG, routing |
| Language | TypeScript (strict) | ^5.7.3 | Type safety |
| Runtime | React | ^18.3.1 | UI rendering |
| Styling | Tailwind CSS v3 | ^3.4.17 | Utility-first styling with custom design tokens |
| Animations | Framer Motion | ^11.15.0 | Scroll-triggered, page transitions, hover effects |
| Icons | Lucide React | ^0.468.0 | Consistent, tree-shakeable icon library |
| Theming | next-themes | ^0.4.4 | Dark/light mode with `class` strategy |
| Smooth Scroll | Lenis | ^1.3.18-dev.0 | Smooth scroll via ReactLenis (lerp: 0.1, duration: 1.2) |
| Accent Colors | AccentColorProvider | — | 8-color scheme picker with CSS vars + localStorage |
| Hosting | AWS Amplify | — | Serverless deployment with CI/CD |
| Markdown | react-markdown + remark-gfm + rehype-highlight | ^9.x | Blog content rendering with GFM + syntax highlighting |
| AI Chatbot | @google/generative-ai (Gemini 2.0 Flash) | ^0.x | AI portfolio assistant via /api/chat route |
| Static Assets | Local `portfolio-resources/` | — | Images, documents, JSON data |

---

## 🏗 AGENT WORKFLOW — Autonomous Development Protocol

Every task MUST follow this pipeline:

### Phase 1: ANALYZE
1. Read this instructions file fully
2. Identify which files are affected (use `grep_search` / `semantic_search`)
3. Read all affected files to understand current state
4. Check `src/types/index.ts` for data shapes
5. Check related JSON data files in `portfolio-resources/data/`
6. Review the **KNOWN ISSUES** section below for context on existing problems

### Phase 2: PLAN
1. Create a detailed todo list using `manage_todo_list`
2. Break work into atomic, independently verifiable steps
3. Identify dependencies between steps
4. Cross-reference work against the **IMPROVEMENT ROADMAP** to avoid duplicating future work

### Phase 3: IMPLEMENT
1. Mark each todo as `in-progress` before starting
2. Make changes file-by-file
3. Follow all architecture patterns below strictly
4. Mark each todo as `completed` immediately after finishing

### Phase 4: VALIDATE
1. Run `npm run lint` — fix ALL lint errors
2. Run `npm run build` — fix ALL TypeScript/compilation errors

### Phase 5: REPORT
1. Summarize what was changed
2. List any remaining TODOs or known issues
3. Update this instructions file if the change affects architecture, data shapes, or project structure

---

## 🚀 MODAL-FIRST ARCHITECTURE (CRITICAL)

### Core Principle: Minimal Routes, Maximum Modals
This portfolio uses a **modal-first** approach. Content that expands on what's shown on the homepage (e.g., "View All", "View Resume", "View Full Experience") MUST open in an **overlay modal**, NOT navigate to a separate page.

### Route Minimization Rules
1. **Only create a new route when the content is SEO-critical or standalone** (e.g., blog posts need their own URLs for indexing).
2. **"View more" actions MUST use modals** — never create a page just to show expanded content from the homepage.
3. **Resume viewing is a modal** — the PDF is embedded in a fullscreen `<Modal>` with a download button, NOT a separate page.
4. **Experience details are a modal** — "View Full Experience" opens an `<ExperienceModal>`, NOT a `/experience` page.
5. **Any future "detail view" or "expanded view" MUST be a modal** unless it requires its own SEO-indexable URL.

### Current Routes (ONLY these should exist)
| Route | Type | Purpose |
|-------|------|---------|
| `/` | Page | Main portfolio (all sections, single page) |
| `/blog` | Page | Blog listing (SEO-critical, server component) |
| `/blog/[slug]` | Page | Individual blog posts (SEO-critical, SSG) |
| `/api/chat` | API | Gemini AI chatbot endpoint |

**Deleted routes (now modals):**
- ~~`/resume`~~ → `ResumeModal` (opened via Hero button, HubMenu)
- ~~`/experience`~~ → `ExperienceModal` (opened via "View Full Experience" button)

### ModalProvider Pattern
All modals are managed by `ModalProvider` in `src/hooks/useModal.tsx`:
```tsx
// Usage in any component:
const { openModal } = useModal();
openModal('resume');     // Opens resume PDF viewer modal
openModal('experience'); // Opens full experience modal
```

Provider hierarchy: `ThemeProvider > AccentColorProvider > ModalProvider > ReactLenis > children`

The `ModalProvider` renders all modal components at the top level and controls which one is active. This allows any component (HeroSection, HubMenu, ExperienceTimeline, etc.) to trigger modals without prop drilling.

### When to Add a New Modal
If the user asks to add a "view more" or "detail view" for any content:
1. Create a `{Name}Modal.tsx` in `src/components/ui/`
2. Register it in `ModalProvider` (`src/hooks/useModal.tsx`) — add the modal name to the `ModalName` type union and render the component
3. Use `useModal().openModal('{name}')` from any triggering component
4. Use the reusable `<Modal>` component (`src/components/ui/Modal.tsx`) as the wrapper

### Modal Component (`src/components/ui/Modal.tsx`)
Reusable modal with:
- Backdrop click to close
- Escape key to close
- Focus trap (Tab key cycling)
- Body scroll lock
- Framer Motion enter/exit animations
- `fullScreen` prop for large content (resume, experience)
- Optional `title` prop (shows header bar with close button)

---

## 📋 AUTOCOMMIT RULES

### When the Agent Should Commit
After every completed task that passes validation (`npm run lint` + `npm run build`), the agent should prepare a commit. The commit flow:

1. **Stage all changes:** `git add -A`
2. **Commit with a descriptive message** using conventional commit format:
   - `feat:` for new features (e.g., `feat: add resume modal viewer`)
   - `fix:` for bug fixes (e.g., `fix: correct accent color ring style`)
   - `refactor:` for restructuring (e.g., `refactor: convert /resume route to modal`)
   - `chore:` for maintenance (e.g., `chore: update copilot-instructions.md`)
   - `style:` for visual-only changes (e.g., `style: adjust modal backdrop blur`)
   - `docs:` for documentation (e.g., `docs: add modal-first architecture rules`)
3. **Do NOT push automatically** — only commit locally. The user will push when ready.
4. **One commit per logical change** — don't bundle unrelated changes. If a task involves multiple logical changes (e.g., "create modal + delete old route + update references"), commit them together as one coherent change.
5. **Always validate before committing** — never commit code that fails lint or build.
6. **Commit message body (optional):** For larger changes, add a brief body explaining what was changed and why.

### Commit Message Examples
```
feat: add resume modal with embedded PDF viewer

- Created Modal.tsx reusable component with focus trap and scroll lock
- Created ResumeModal.tsx with embedded PDF and download button
- Updated HeroSection and HubMenu to open modal instead of navigating
- Removed /resume route (now modal-based)
```

```
refactor: convert experience page to modal

- Created ExperienceModal.tsx with full experience timeline
- Updated ExperienceTimeline "View Full Experience" to open modal
- Removed /experience route and ExperiencePageClient.tsx
- Removed unused timeline.tsx component
```

---

## 📂 PROJECT STRUCTURE

```
├── .github/
│   └── copilot-instructions.md      # THIS FILE — agent context & rules
├── portfolio-resources/              # Real content data & assets (SOURCE OF TRUTH)
│   ├── assets/
│   │   ├── documents/
│   │   │   ├── resume.pdf            # Downloadable resume
│   │   │   ├── resume.docx           # Editable resume
│   │   │   ├── resume.tex            # LaTeX source
│   │   │   └── configs/              # Resume builder configs
│   │   └── images/
│   │       ├── certifications/       # 28 certificate images (.png, .jpg)
│   │       ├── gallery/              # 22 gallery photos (.jpg, .jpeg, .JPG, .png)
│   │       └── projects/             # 15 project screenshots (.png, .jpg)
│   └── data/                         # Static JSON data
│       ├── blog.json                 # 6 blog posts (migrated from hardcoded TS)
│       ├── certifications.json       # 28 certifications (21 HackerRank + 7 others)
│       ├── experiences.json          # 7 work experiences
│       ├── gallery.json              # 22 gallery images
│       ├── memberships.json          # 2 memberships (PSIA, AAAP)
│       ├── profile.json              # Profile: Jhon Keneth Ryan Namias
│       ├── projects.json             # 7 projects
│       ├── recommendations.json      # 2 recommendations (PLACEHOLDER — needs real data)
│       ├── socials.json              # 8 social links (real URLs)
│       └── technologies.json         # 45 technologies across 6 categories
├── public/                           # Next.js public static files
│   ├── favicon.svg                    # SVG favicon (32x32, pink "JN" branding)
│   ├── apple-touch-icon.svg          # Apple touch icon (180x180)
│   ├── og-image.svg                  # OpenGraph image (1200x630, branded)
│   ├── robots.txt                    # SEO robots.txt (Allow all, sitemap link)
│   ├── site.webmanifest              # PWA manifest (JN branding, pink theme)
│   ├── resume.pdf                    # Downloadable resume (copied from portfolio-resources)
│   └── images/                       # Served images (copied from portfolio-resources)
│       ├── blog/                     # 6 SVG blog cover images (gradient backgrounds)
│       ├── experience/              # 8 branded SVG covers for experience entries
│       ├── gallery/                  # 22 gallery photos
│       ├── projects/                 # 15 project screenshots
│       ├── certifications/           # 28 certificate images
│       └── profile/                  # Profile photos (PP Namias.png, etc.)
├── src/
│   ├── app/
│   │   ├── globals.css               # Global styles + CSS custom properties + accent color vars
│   │   ├── layout.tsx                # Root layout + metadata + Inter font + favicon SVG icons + JSON-LD (NO Navbar)
│   │   ├── page.tsx                  # Home page (main portfolio, server component, all sections)
│   │   ├── providers.tsx             # ThemeProvider > AccentColorProvider > ModalProvider > ReactLenis
│   │   ├── sitemap.ts                # Dynamic sitemap.xml generation (Next.js built-in)
│   │   ├── not-found.tsx             # Branded 404 page (pink gradient "404")
│   │   ├── error.tsx                 # Branded error boundary ('use client', reset button)
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts          # POST /api/chat — Gemini AI chatbot (rate-limited, sanitized)
│   │   └── blog/
│   │       ├── layout.tsx            # Blog layout with SEO metadata
│   │       ├── page.tsx              # Blog listing (server component — renders BlogListClient)
│   │       ├── BlogListClient.tsx    # Client component for animated blog grid (Framer Motion)
│   │       └── [slug]/
│   │           ├── page.tsx          # Blog post SSG page + generateStaticParams + generateMetadata + Article JSON-LD
│   │           └── BlogPostContent.tsx  # Client-side blog renderer (react-markdown + remark-gfm + ReadingProgress)
│   ├── components/
│   │   ├── layout/
│   │   │   └── Footer.tsx            # Minimal copyright line (no multi-column layout)
│   │   ├── sections/                 # 11 section components (all 'use client')
│   │   │   ├── HeroSection.tsx       # Animated photo ring, role text rotation, availability badge, social icons, CTA buttons, ColorSchemePicker + ThemeToggle
│   │   │   ├── AboutSection.tsx      # Summary, education, animated stat counters (years, projects, technologies)
│   │   │   ├── TechStackSection.tsx  # Tech stack grouped by category with proficiency
│   │   │   ├── ProjectsSection.tsx   # Project cards grid with tag filtering (all 7, with toggle)
│   │   │   ├── CertificationsSection.tsx  # Scrollable cert list with images + lightbox
│   │   │   ├── ExperienceTimeline.tsx     # Timeline with expandable details + "View Full Experience" modal trigger
│   │   │   ├── RecommendationsCarousel.tsx # Auto-advancing testimonials
│   │   │   ├── MembershipsSection.tsx     # Org membership links
│   │   │   ├── SpeakingSection.tsx        # Speaking availability with Mic icon, topic pills from profile data
│   │   │   ├── ConnectSection.tsx         # Social links (Connect card) + latest blog post card
│   │   │   └── GallerySection.tsx         # Paginated image slider (5/slide) with title hover overlay + lightbox
│   │   └── ui/                       # Reusable UI primitives
│   │       ├── Button.tsx            # Primary/ghost/outline with href support + onClick
│   │       ├── Card.tsx              # Bordered card wrapper with hover option + optional id prop
│   │       ├── Modal.tsx             # Reusable modal (backdrop, ESC close, focus trap, scroll lock, Framer Motion)
│   │       ├── ResumeModal.tsx       # Resume PDF viewer modal (embedded <object> + download button)
│   │       ├── ExperienceModal.tsx   # Full experience details modal (all roles, highlights, achievements, images)
│   │       ├── ProjectCard.tsx       # Project card with screenshot + links
│   │       ├── ReadingProgress.tsx   # Blog reading progress bar (fixed top, accent gradient, framer-motion useScroll)
│   │       ├── FloatingHub.tsx       # Main floating hub container (FAB + 3-state machine + panel wrapper)
│   │       ├── HubMenu.tsx           # Hub menu panel with 6 quick action items (resume opens modal)
│   │       ├── HubMenuItem.tsx       # Reusable action row component (icon + label + subtitle)
│   │       ├── ChatPanel.tsx         # Chat-only panel (refactored from ChatWidget, receives messages as props)
│   │       ├── ChatMessage.tsx       # Chat message bubble component (user/assistant styling)
│   │       ├── ThemeToggle.tsx       # Dark/light mode toggle button
│   │       ├── ColorSchemePicker.tsx # 8-color accent scheme picker (circle buttons with ring indicator)
│   │       ├── TimelineItem.tsx      # Expandable experience timeline entry
│   │       └── VerifiedBadge.tsx     # Accent checkmark next to name
│   ├── data/                         # TS modules importing JSON → typed exports
│   │   ├── blogPosts.ts             # Sources from blog.json (same pattern as other data modules)
│   │   ├── certifications.ts
│   │   ├── experience.ts
│   │   ├── gallery.ts
│   │   ├── memberships.ts
│   │   ├── profile.ts
│   │   ├── projects.ts
│   │   ├── recommendations.ts
│   │   ├── socials.ts
│   │   └── techStack.ts             # Also exports techCategories (grouped)
│   ├── hooks/
│   │   ├── useAccentColor.tsx        # AccentColorProvider + useAccentColor hook (8 color schemes, localStorage, CSS vars)
│   │   ├── useCarousel.ts           # Auto-advance & hover-pause carousel
│   │   ├── useModal.tsx             # ModalProvider + useModal hook (manages resume/experience modals globally)
│   │   └── useTheme.ts              # Wrapper around next-themes
│   ├── lib/
│   │   └── utils.ts                 # cn() — simple class concatenation
│   └── types/
│       └── index.ts                  # All TypeScript interfaces (includes HubState, ModalName)
├── tailwind.config.ts                # Custom colors (CSS var-based accent), fonts, darkMode: 'class'
├── next.config.js                    # Standalone output only
├── amplify.yml                       # AWS Amplify CI/CD config
└── package.json
```

---

## 👤 OWNER PROFILE — Real Content Reference

This section documents the **actual content** from `portfolio-resources/data/` so the agent always has context about who the portfolio belongs to and what data is available. **Never use placeholder data — always reference this.**

### Identity
- **Name:** Jhon Keneth Ryan Namias
- **Alias:** PP Namias (GitHub: PP-Namias)
- **Title:** Full Stack Engineer & AI Automation Specialist
- **Email:** pp.namias@gmail.com (consistent across profile.json and socials.json)
- **Location:** National Capital Region, Philippines
- **GitHub:** https://github.com/PP-Namias
- **LinkedIn:** https://www.linkedin.com/in/pp-namias/
- **Calendly:** https://calendly.com/pp-namias/15-minute-meeting
- **Current Roles:** Project Manager @ MASH, Head of Technical Committee @ UCC

### Education
- **BS Computer Science** — University of Caloocan City (2021–present)
- GPA: 3.8 | Honors: Dean's List, Academic Excellence Award
- Courses: DSA, Software Engineering, DBMS, Web Development, Mobile Development, AI

### Experience Summary (10 roles)
| # | Company | Role | Type | Period |
|---|---------|------|------|--------|
| 1 | MASH - Mushroom Automation | Project Manager | Full-time | Sep 2025–Present |
| 2 | PhoneCraft Cellphone Repair | Head Technician | Full-time | 2020–Present |
| 3 | Ucc-Ingo | Website Administrator | Full-time | 2025–Present |
| 4 | Aeternitas Chapels & Columbarium | Software Engineer | Internship | Jun–Sep 2025 |
| 5 | Wilshire Financial Network | Automation Engineer Trainee | Internship | Jun–Sep 2025 |
| 6 | JIMIRENE Clinic Management System | Full Stack Developer | Full-time | 2025–2025 |
| 7 | J'5 Pharmacy | Full Stack Web Developer | Full-time | 2025–2025 |
| 8 | Legal Workflow Manager (CaseMaster) | System Analyst | Full-time | 2024–2024 |
| 9 | University of Caloocan City | Head of Technical Committee | Volunteer | 2025–Present |
| 10 | University of Caloocan City | Program Committee Member | Volunteer | 2024–2025 |

### Projects (7 projects)
| # | Title | Year | Live | Repo | Stack |
|---|-------|------|------|------|-------|
| 1 | Story Adaptive Game Engine | 2025 | Vercel | — | JS/TS, GPT, Stable Diffusion |
| 2 | Java Rice - Food Ordering | 2024 | — | GitHub | Java, Swing, QR, Payments |
| 3 | Student Attendance System | 2023 | — | GitHub | C#, WPF, PostgreSQL, Barcode |
| 4 | Galaxy Animation - Solar System | 2023 | GH Pages | GitHub | HTML, CSS, JS |
| 5 | CSS3 Robot Animation | 2023 | GH Pages | GitHub | CSS3, Pure CSS |
| 6 | Car Dealership Management | 2022 | — | GitHub | C++, Console, File I/O |
| 7 | Pre-enrollment Management | 2022 | — | GitHub | VB.NET, Desktop, RBAC |

### Technology Stack (45 technologies, 6 categories)
- **Languages (10):** TypeScript 90%, JavaScript 92%, Python 80%, Java 75%, C# 70%, PHP 72%, HTML5 95%, CSS3 90%, Bash 68%, R 60%
- **Frontend (8):** React 92%, Next.js 88%, TailwindCSS 95%, HeroUI 85%, ShadcnUI 80%, Bootstrap 85%, Flutter 70%, JavaFX 65%
- **Backend (6):** Node.js 85%, FastAPI 82%, Flask 80%, Laravel 72%, CodeIgniter 70%, Swagger 78%
- **Databases (5):** PostgreSQL 82%, MySQL 85%, Supabase 80%, PocketBase 75%, InfluxDB 65%
- **Tools (10):** Docker 78%, Git 90%, GitHub 92%, VS Code 95%, Neovim 70%, Jenkins 65%, Grafana 68%, n8n 75%, Jupyter 80%, Photoshop 70%
- **Data Science (6):** NumPy 75%, Pandas 78%, Scikit-learn 70%, Plotly 72%, Seaborn 68%, Streamlit 75%

### Certifications (28 total)
- **21 HackerRank certificates** (Software Engineer, Frontend React, Angular, REST API, SQL Advanced/Intermediate/Basic, React, R, Python, Problem Solving, Node.js, JavaScript, Java, CSS, C#)
- **2nd Place Programming Competition** — University of Caloocan City (2025)
- **CS Council Member** — University of Caloocan City (2025)
- **Cybersecurity Fundamentals** — IBM (2025)
- **3 Google Developer Student Club workshops** (Firebase Deployment, React Native Google Maps, Google Auth)
- **How to Navigate the Database Universe** — AWS (2024)

### Memberships (2)
- Philippine Software Industry Association (PSIA) — since 2024
- Analytics & AI Association of the Philippines (AAAP) — since 2024

### Recommendations (2 — PLACEHOLDER DATA)
⚠️ **Both recommendations in `recommendations.json` are generic placeholders** ("Sample Recommender" at "Tech Company", "Another Recommender" at "Digital Agency"). These need to be replaced with **real testimonials** from actual colleagues/managers.

### Social Links (8)
- Calendly (featured), GitHub, Email (pp.namias@gmail.com), LinkedIn, Facebook, Discord, X/Twitter, Instagram

### Gallery (22 images)
- 9 Birthday 2024 photos, 1 Dream PC setup, 1 Friend group 2025, 6 HackForGov 2025 hackathon photos, 2 personal portraits, 1 MASH Team, 1 professional headshot (white BG), 1 OJT pic

### Available Image Assets
- **Certifications:** 28 images (all present, matching JSON)
- **Gallery:** 22 images (all present, matching JSON)
- **Projects:** 15 screenshots available — **now mapped to correct filenames in projects.json and displayed in ProjectCard**
- **Profile photos:** `me.jpg`, `Jhon Keneth Namias (2).jpg`, `Namias Profile White BG.png` — **me.jpg used in HeroSection**
- **Resume:** PDF, DOCX, and LaTeX source available (PDF served at `/resume.pdf`)
- **Blog covers:** 6 SVG images in `public/images/blog/` (ai-langchain.svg, aws-amplify.svg, ts-patterns.svg, codespaces.svg, gen-ai.svg, aws-s3.svg)

---

## 🎯 DESIGN VISION — Two-Column Card-Based Portfolio

### Layout Architecture (page.tsx)
```
┌──────────────────────────────────────────────────────────┐
│  Hero Section (full width) — Name, photo, CTA buttons    │
├──────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐  ┌──────────────────────────┐  │
│  │  Main (62%)         │  │  Sidebar (38%, sticky)   │  │
│  │  - About            │  │  - Experience Timeline   │  │
│  │  - Tech Stack       │  │  - Memberships           │  │
│  │  - Projects         │  │  - Speaking              │  │
│  └─────────────────────┘  └──────────────────────────┘  │
├──────────────────────────────────────────────────────────┤
│  Certifications (50%) │ Recommendations Carousel (50%)   │
├──────────────────────────────────────────────────────────┤
│  Connect + Social Links  │  Latest Blog Post             │
├──────────────────────────────────────────────────────────┤
│  Gallery (paginated slider, full width)                   │
├──────────────────────────────────────────────────────────┤
│  Footer                                                   │
└──────────────────────────────────────────────────────────┘
```

### Design Principles
- **Card-based**: All sections in bordered `<Card>` components
- **Dark/Light theme**: CSS custom properties in `globals.css`, `next-themes` with `class` strategy, default: dark
- **Smooth animations**: Framer Motion `whileInView` scroll reveals staggered per section
- **Mobile-first**: Stacks vertically on mobile, two-column layout on `lg:` breakpoint
- **Accent color**: User-selectable via `ColorSchemePicker` (8 presets), stored in `localStorage`, applied via CSS vars `--accent`, `--accent-hover`, `--accent-hover-dark`
- **Typography**: Inter via `next/font/google` loaded as `--font-inter` CSS variable
- **Max width**: 860px container (`max-w-container`)
- **Spacing**: Consistent `gap-4` between cards, `p-5` card padding
- **No Navbar**: Intentionally removed — avoids generic AI-generated website feel
- **Minimal footer**: Single-line copyright, no multi-column sections

### Tailwind Custom Colors (tailwind.config.ts)
```
background-light: #ffffff     background-dark: #000000
surface-light: #ffffff        surface-dark: #0a0a0a
card-bg-light: #ffffff        card-bg-dark: #111111
text-primary-light: #111827   text-primary-dark: #ffffff
text-secondary-light: #4b5563 text-secondary-dark: #d1d5db
text-muted-light: #6b7280     text-muted-dark: #9ca3af
border-light: #e5e7eb         border-dark: #1f1f1f
accent-pink: #db2777          accent-pink-hover: #be185d
                               accent-pink-hover-dark: #f472b6
```

---

## 📊 DATA ARCHITECTURE

### Source of Truth
All real content lives in `portfolio-resources/data/*.json`.  
The `src/data/*.ts` modules import this JSON and re-export with TypeScript types.

All 10 data modules now follow this pattern consistently, including `blogPosts.ts` which sources from `blog.json`.

### Data Flow
```
portfolio-resources/data/*.json  →  src/data/*.ts (typed)  →  Section Components
```

### Image Asset Flow
```
portfolio-resources/assets/images/  →  public/images/ (copied)  →  Next.js <Image> components
```
Images from `portfolio-resources/` are copied to `public/images/` with subdirectories: `blog/`, `gallery/`, `projects/`, `certifications/`, `profile/`. All components reference `/images/{subfolder}/{filename}` paths. When adding new images, copy them to both locations.

### Types (src/types/index.ts)
All TypeScript interfaces for JSON data live here. `BlogPost` type is also in `src/types/index.ts`.

| Type | Key Fields | JSON Source | Used Fields in UI | Unused Fields |
|------|------------|-------------|-------------------|---------------|
| `Profile` | name, title, email, phone, location, github, linkedin, summary, highlights, education | profile.json | name, title, email, location, github, summary, highlights.yearsExperience, highlights.projectsCompleted, highlights.primaryTechnologies (SpeakingSection topic pills), education.degree, education.institution, education.location, education.honors, education.gpa, education.relevantCourses, education.startedAt | **phone, linkedin, education.endedAt** |
| `Experience` | company, position, summary, country, modality, type, startedAt, endedAt, technologies, highlights, achievements, relatedProjects, images | experiences.json | company, position, type, startedAt, endedAt, summary, technologies, highlights, achievements (expandable), country, modality, images | **relatedProjects** |
| `Project` | title, image, description, repositoryURL, liveURL, processURL, tags, year | projects.json | title, image, description, repositoryURL, liveURL, tags (first 3), year | **processURL** |
| `Certification` | title, image, issuer, issuedAt, tags | certifications.json | title, image, issuer, issuedAt (with lightbox) | **tags** |
| `Technology` | name, logo, category, proficiency | technologies.json | name, category, proficiency (hover reveal) | **logo** |
| `GalleryItem` | title, mediaType, media, tags, createdAt | gallery.json | title, media (title shown on hover overlay) | **mediaType, tags, createdAt** |
| `Membership` | name, url, joinedAt | memberships.json | name, url, joinedAt | — |
| `SocialLink` | name, icon, label, link, featured? | socials.json | name, icon, label, link, featured (accent style for featured links) | — |
| `Recommendation` | quote, name, title, company | recommendations.json | All used | — |
| `BlogPost` | id, slug, title, excerpt, content, date, readTime, tags, coverImage | blog.json | All used (listing grid + full post page) | — |
| `ChatMessage` | id, role, content, timestamp | — (client state) | FloatingHub/ChatPanel/ChatMessage components | — |

---

## 🔧 COMMANDS

```bash
npm run dev          # Next.js dev server (localhost:3000)
npm run build        # Production build (MUST pass before commit)
npm run lint         # ESLint with next/core-web-vitals
npm run start        # Start production server
```

---

## 🧩 COMPONENT PATTERNS

### Animation Pattern (standard for all sections)
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.4 }}
/>
```

### Staggered Children Pattern
```tsx
<motion.div
  initial={{ opacity: 0, y: 10 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: index * 0.1, duration: 0.3 }}
/>
```

### Theme Classes (MANDATORY for all visible elements)
```tsx
className="text-text-primary-light dark:text-text-primary-dark"
className="text-text-secondary-light dark:text-text-secondary-dark"
className="text-text-muted-light dark:text-text-muted-dark"
className="bg-surface-light dark:bg-surface-dark"
className="bg-white dark:bg-card-bg-dark"
className="border-border-light dark:border-border-dark"
```

### Accent Tag/Pill Pattern (used in About honors, ProjectCard tags, Certifications, Blog tags)
```tsx
<span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent-pink/10 text-accent-pink">
  {label}
</span>
```

### Card Wrapper
All sections must be wrapped in `<Card>` from `src/components/ui/Card.tsx`:
```tsx
<Card>           // Standard card
<Card hover>     // Card with hover lift effect + pink border accent
```

### Social Icon Mapping (ConnectSection.tsx)
The `iconMap` maps `socials.json` icon strings to Lucide components:
```
calendar → Calendar, github → Github, mail → Mail,
linkedin → Linkedin, facebook → Facebook,
message-square → MessageSquare, twitter → Twitter, instagram → Instagram
```
Unmapped icons fall back to `ExternalLink`.

### Floating Hub Pattern (FloatingHub.tsx)
The floating hub is a 3-state widget replacing the old single-purpose chat FAB:
```
HubState: 'closed' → 'menu' → 'chat'
```
- **closed**: Pink FAB (Sparkles icon) in bottom-right corner
- **menu**: Panel with 6 quick actions (Ask AI, Download Resume, Schedule Meeting, Send Email, Connect socials, Read Blog)
- **chat**: Full AI chat panel with back-to-menu button

Key architecture:
- Messages lifted to `FloatingHub` for persistence across panel switches
- Escape key cascade: chat → menu → closed
- Click-outside-to-close on desktop (sm: breakpoint and up)
- FAB pulse animation for first-time visitors (sessionStorage-backed)
- Panel: `AnimatePresence mode="wait"` with `key={hubState}` for smooth transitions
- Data sourced from `@/data/socials` and `@/data/profile` — no hardcoded URLs

---

## 🚨 KNOWN ISSUES — Current State Audit

These are confirmed issues in the codebase as of 2026-03-02. Reference these when planning work.

### P0 — Critical (Broken Functionality)

1. ~~**Gallery images 404** — `GallerySection.tsx` references `/portfolio-resources/assets/images/gallery/{filename}` but `portfolio-resources/` is NOT in `public/`. Fixed 2026-03-02: images copied to `public/images/`, GallerySection updated to use `/images/gallery/` with Next.js `<Image>`.~~

2. ~~**Project images all placeholder** — Every project in `projects.json` has `"image": "placeholder.png"`. Fixed 2026-03-02: all 7 projects mapped to real screenshots, ProjectCard now displays images.~~

3. ~~**Build-breaking import paths** — All 9 `src/data/*.ts` modules used `../../../portfolio-resources/` (3 levels up) instead of `../../portfolio-resources/` (2 levels up, correct path from `src/data/` to project root). Fixed 2026-03-02.~~

### P1 — High (Data Quality / Architecture Violations)

3. **Recommendations are fake** — `recommendations.json` contains 2 placeholder testimonials from "Sample Recommender" and "Another Recommender" at fictional companies. Must be replaced with real quotes.

4. ~~**Blog data violates architecture** — `src/data/blogPosts.ts` hardcodes 6 blog posts instead of sourcing from `portfolio-resources/data/blog.json`. All cover images use external `picsum.photos` placeholder URLs. Fixed 2026-03-02: created `portfolio-resources/data/blog.json`, rewrote `blogPosts.ts` as JSON import, replaced picsum.photos with local SVG covers in `public/images/blog/`.~~

5. ~~**`BlogPost` type not in `src/types/index.ts`** — Fixed 2026-03-02: moved to `src/types/index.ts`, `blogPosts.ts` now imports from `@/types`.~~

6. ~~**Profile photo is initials placeholder** — `HeroSection.tsx` renders initials in a gradient box instead of using actual photos. Fixed 2026-03-02: now uses `me.jpg` via Next.js `<Image>`.~~

7. ~~**Two different email addresses** — Fixed 2026-03-02: both profile.json and socials.json now use `pp.namias@gmail.com`. LinkedIn URL also fixed to `pp-namias`.~~

### P2 — Medium (Unused Data / Missing Features)

8. ~~**Massive unused data** — Many JSON fields were never rendered. Fixed 2026-03-02: Experience now shows summary/technologies/highlights (expandable), certifications show images with lightbox, projects show screenshots, tech stack shows proficiency on hover, memberships show joinedAt. Further fixed 2026-03-02: Experience country/modality surfaced as pills in TimelineItem, certifications filterable by issuer, gallery filterable by tags with dates in lightbox. Technology logos surfaced via Simple Icons CDN in TechStackSection.~~
   Remaining unused: Experience relatedProjects (all empty), Certification tags (65 unique — issuer filter used instead), Gallery mediaType (all "image"), Profile phone/linkedin.

9. ~~**Only 4 of 7 projects displayed** — Fixed 2026-03-02: ProjectsSection now shows all 7 with "View all projects" toggle.~~

10. ~~**`Badge` component is unused** — Removed 2026-03-02.~~

11. ~~**`SocialLink.featured` field unused** — Fixed 2026-03-02: featured social links now display with accent pink background + white text in ConnectSection.~~

12. ~~**HeroSection uses `profile.github`** which points to `https://github.com/jhonmamias` — Fixed 2026-03-02: profile.json updated to `https://github.com/PP-Namias`.~~

### P3 — Low (Code Quality / Polish)

13. ~~**Raw `<img>` tags everywhere** — Fixed 2026-03-02: GallerySection, ConnectSection, BlogPostContent, blog pages now use Next.js `<Image>`.~~

14. ~~**Blog listing is `'use client'`** — Prevents SSR/SSG, bad for SEO. Fixed 2026-03-02: split into server component `page.tsx` + client `BlogListClient.tsx`. First Load JS dropped from 7.51 kB to 1.61 kB.~~

15. ~~**Blog posts lack `generateMetadata`** — Fixed 2026-03-02: added `generateMetadata` to `blog/[slug]/page.tsx` + blog layout with metadata.~~

16. ~~**Custom markdown renderer is naive** — `BlogPostContent.tsx` parses markdown manually. Fixed 2026-03-02: installed `react-markdown` + `remark-gfm` + `rehype-highlight`, rewrote `BlogPostContent.tsx` with proper component mapping for headings, lists, code blocks, links, blockquotes.~~

17. ~~**`ConnectSection` calls `.find()` twice** for calendly — Fixed 2026-03-02: cached as `calendlyLink` variable. Further streamlined: removed redundant "Get in Touch" and "Quick Links" sections that duplicated Social Links and Hero CTAs.~~

18. ~~**`RecommendationsCarousel` direction bug** — Fixed 2026-03-02: `prevIndex` ref now synced via `useEffect` on `currentIndex`. Import consistency also fixed (unified `React.useEffect` → named `useEffect` import).~~

19. ~~**Footer copyright year hardcoded** — Fixed 2026-03-02: now uses `new Date().getFullYear()`.~~

20. ~~**`Button` ghost/outline variants are identical** — Fixed 2026-03-02: ghost is now borderless with subtle bg, outline has border with accent hover.~~

21. ~~**`next.config.js` has S3 remote patterns** but no S3 bucket is currently in use. Fixed 2026-03-02: removed entire `images.remotePatterns` config. Config now just sets `output: 'standalone'`.~~

22. ~~**Resume button opens new tab instead of downloading** — Fixed 2026-03-02: HeroSection resume uses `<a download>` attribute instead of Button with `target="_blank"`.~~

23. ~~**Gallery images not clickable** — Fixed 2026-03-02: GallerySection now has click-to-enlarge lightbox (AnimatePresence modal, X close, backdrop click close) matching CertificationsSection pattern.~~

24. ~~**Gallery section missing image count** — Fixed 2026-03-02: header now shows `Gallery (22)` count like Projects and Certifications.~~

25. ~~**ConnectSection had redundant sections** — Fixed 2026-03-02: removed "Get in Touch" and "Quick Links" sections. Now shows single "Connect" card with all 8 social links + "Latest Post" card.~~

26. ~~**SpeakingSection was too generic** — Fixed 2026-03-02: added Mic icon, real topic pills from `profile.highlights.primaryTechnologies`, improved description, mailto subject prefill.~~

27. ~~**Dead favicon.ico reference in layout.tsx** — Fixed 2026-03-02: removed `icons: { icon: '/favicon.ico' }` from metadata since the file doesn't exist.~~

28. ~~**LICENSE had wrong copyright name** — Fixed 2026-03-02: changed from "Karen Pearl V. Pabilando" to "Jhon Keneth Namias".~~

29. ~~**No favicon** — Fixed 2026-03-02: created `public/favicon.svg` (32x32, pink rounded rect with "JN") and `public/apple-touch-icon.svg` (180x180). Added to `layout.tsx` metadata. Updated `site.webmanifest` with name, colors, and icon entries.~~

30. ~~**Single-purpose chat FAB** — ChatWidget was only for AI chat. Fixed 2026-03-02: Replaced with multi-purpose FloatingHub (6 actions: AI chat, resume, Calendly, email, social connect, blog). Old ChatWidget.tsx deleted.~~

---

## 🗺 IMPROVEMENT ROADMAP

Prioritized improvements organized by effort and impact. Reference this when the user asks for improvements.

### Quick Wins (< 30 min each)
- [x] Fix `projects.json` image fields — map to actual filenames from `portfolio-resources/assets/images/projects/`
- [x] Fix `profile.json` GitHub URL — change `jhonmamias` → `PP-Namias`
- [x] Resolve email inconsistency between profile.json and socials.json
- [x] Use profile photo in HeroSection instead of initials
- [x] Show all 7 projects (or add "View all" toggle)
- [x] Display `membership.joinedAt` in MembershipsSection
- [x] Make Footer copyright year dynamic
- [x] Remove unused `Badge.tsx` component
- [x] Cache calendly link lookup in ConnectSection
- [x] Fix RecommendationsCarousel prevIndex auto-advance sync
- [x] Enhance SpeakingSection with Mic icon and topic pills from profile data
- [x] Remove dead favicon.ico reference from layout.tsx metadata
- [x] Fix LICENSE copyright name (was wrong person)

### Medium Effort (1–3 hours)
- [x] Solve image serving: copy `portfolio-resources/assets/images/` to `public/images/`
- [x] Display certification images in CertificationsSection (with lightbox)
- [x] Display technology proficiency in TechStackSection (hover reveal)
- [x] Display project screenshots in ProjectCard
- [x] Show experience details (summary, technologies, highlights) in expanded timeline
- [x] Replace `<img>` with Next.js `<Image>` throughout
- [x] Move `BlogPost` type to `src/types/index.ts`
- [x] Create `portfolio-resources/data/blog.json` and source blog data from it

### Larger Features (3+ hours)
- [ ] Get real recommendations and replace placeholder data
- [x] Implement proper markdown rendering (react-markdown + remark-gfm + rehype-highlight)
- [x] Add SEO: `generateMetadata` for blog pages + blog layout metadata
- [x] Make blog listing a server component for SSG
- [x] Show gallery image title on hover overlay
- [x] Add resume download button in HeroSection using `public/resume.pdf`
- [x] Leverage `SocialLink.featured` for prominent accent display in ConnectSection
- [x] Display education dates, GPA, relevant courses in AboutSection
- [x] Show experience achievements in expandable timeline
- [x] Add favicon (SVG favicon + apple-touch-icon) to public/
- [x] Add OG images and structured data for full SEO
- [x] Gallery lightbox (click-to-enlarge with AnimatePresence modal)
- [x] Streamline ConnectSection (removed redundant "Get in Touch" and "Quick Links")
- [x] Resume download uses `download` attribute instead of new tab
- [x] Gallery shows image count in header
- [x] Replace single-purpose chat FAB with multi-purpose floating hub widget
- [x] Delete old `ChatWidget.tsx` (dead code)
- [x] FloatingHub accessibility: focus trap, click-outside-to-close, FAB pulse animation
- [x] RecommendationsCarousel: auto-detect placeholder data, show "coming soon" state
- [x] Surface experience country/modality in TimelineItem pills
- [x] Certification issuer-based filter tabs
- [x] Gallery tag-based filter with slide reset + dates in lightbox
- [x] Skip-to-main-content link for screen reader accessibility
- [x] Image optimization: `sizes` attribute on 7 responsive `<Image>` components
- [ ] Write real blog post content (currently placeholder markdown)
- [x] Surface technology logos in TechStackSection
- [x] Move experience images to data (experiences.json `images` field)
- [x] Print stylesheet (`@media print` in globals.css)
- [x] Sticky navigation bar with section anchoring, active highlights, mobile hamburger
- [x] Hero redesign: animated gradient ring on photo, role text rotation, availability badge, social icons row
- [x] Multi-column footer with Quick Links, Connect socials, Contact info, Back to Top
- [x] Branded 404 page and error boundary
- [x] Blog reading progress bar (framer-motion useScroll)
- [x] Project tag filtering (similar to certifications)
- [x] About section animated stat counters (years, projects, technologies) with icons
- [x] SEO sitemap.xml (Next.js built-in) + robots.txt
- [x] Article JSON-LD structured data on blog posts
- [x] Modal-first architecture: ResumeModal, ExperienceModal, ModalProvider
- [x] Removed /resume and /experience routes (now modals)
- [x] Reusable Modal component with focus trap, scroll lock, animations
- [ ] Contact form (instead of just mailto links)
- [ ] Privacy-respecting analytics (Plausible or Umami)

---

## ⚠️ GOTCHAS

1. **Font loading:** Use `next/font/google` ONLY — do NOT also `@import` from CSS (Inter is loaded in `layout.tsx` as `--font-inter`)
2. **Real data:** All content from `portfolio-resources/data/` — no placeholders, no hardcoded content
3. **Social links:** From `socials.json` — never hardcode URLs (8 links: calendly, github, email, linkedin, facebook, discord, x, instagram)
4. **Metadata:** Real name "Jhon Keneth Ryan Namias", real domain "namias.tech", real email `pp.namias@gmail.com`
5. **CSS transitions on `*`:** Avoid — causes performance issues on theme switch. Only transition specific properties on body
6. **`'use client'`:** Only for interactive components — blog listing is now a server component with `BlogListClient` for animations
7. **Image paths:** Images live in `portfolio-resources/assets/images/` and are copied to `public/images/`. Components reference `/images/{subfolder}/{filename}`. When adding new images, copy them to both locations.
8. **Filenames with spaces:** Gallery and cert images have spaces in filenames (e.g., `Birthday Picture 2024 (1).JPG`, `HackForGov 2025 (1).jpeg`) — must URL-encode when referencing
9. **Mixed file extensions:** Gallery uses `.JPG`, `.jpg`, `.jpeg`, `.png` — ensure case-sensitive handling
10. **Standalone output:** `next.config.js` sets `output: 'standalone'` for AWS Amplify — don't remove
11. **`react-markdown` installed:** Blog uses `react-markdown` + `remark-gfm` + `rehype-highlight` for proper markdown rendering
12. **`tailwind.config.ts` content paths:** Only scans `src/components/**` and `src/app/**` — if adding components elsewhere, update the config
13. **`rehype-highlight` wired up:** Blog uses `rehype-highlight` for syntax highlighting in code blocks — imported in BlogPostContent.tsx

---

## 🤖 AGENT BEHAVIOR RULES

1. **Always read before writing.** Never modify a file without reading it first. Check the KNOWN ISSUES section before starting work.
2. **Real data only.** All content from `portfolio-resources/data/` JSON. Never invent names, companies, quotes, or URLs.
3. **Validate every change.** Run `npm run lint` and `npm run build` after modifications.
4. **Match the design reference.** Refer to https://bryllim.com/ for layout, spacing, and interaction patterns.
5. **Stay minimal.** Don't add features beyond what was requested. Don't refactor unrelated code.
6. **Track progress.** Use `manage_todo_list` for multi-step work.
7. **Respect the theme.** All UI must work in both dark and light mode using the documented Tailwind color tokens.
8. **No dead code.** Remove unused imports, components, and files.
9. **Types in one place.** All TypeScript interfaces go in `src/types/index.ts`.
10. **Update this file.** When making structural changes (new components, new data files, new types, resolved issues), update this instructions file accordingly.
11. **Modal-first.** Never create a new page/route for "view more" or "detail view" content. Always use modals via `ModalProvider`. Only create routes for SEO-critical content (blog posts).
12. **Autocommit after validation.** After every task that passes `npm run lint` + `npm run build`, stage and commit with a conventional commit message. Never push automatically.
13. **UX before UI.** Prioritize user experience (interaction flow, accessibility, responsiveness, loading states) over visual polish. Every feature should feel smooth and intuitive before it looks pretty.

---

## 🤖 AI AGENT CONTINUATION PROMPT

Use this prompt to continue autonomous development in a new session. Copy-paste it into the chat to pick up where you left off:

```
Read the copilot-instructions.md file at .github/copilot-instructions.md fully. This is your complete context for the portfolio project.

Then:
1. Run `npm run build` to verify the current build state
2. Review the KNOWN ISSUES section for any unresolved P0/P1 issues
3. Review the IMPROVEMENT ROADMAP for unchecked items
4. Identify the highest-impact unchecked item and implement it
5. After implementation, run `npm run lint` and `npm run build` to validate
6. If validation passes, stage and commit with a conventional commit message (`git add -A` then `git commit -m "type: description"`)
7. Update copilot-instructions.md if the change affects architecture, data shapes, or project structure
8. Report what was done and suggest the next highest-impact task

Follow all rules in the instructions file — especially modal-first architecture, autocommit rules, and UX-first design principles.
```
