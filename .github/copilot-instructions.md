# Copilot Instructions — Portfolio (Next.js 14)
## AI Agent: Claude Opus 4.6 via VS Code Copilot

> **Owner:** Jhon Keneth Namias (PP Namias)  
> **Domain:** https://namias.tech  
> **Design Reference:** https://bryllim.com/ (modern resume-portfolio hybrid)  
> **Model:** Always use **Claude Opus 4.6** for all development tasks  
> **IDE:** VS Code with GitHub Copilot  
> **Last audited:** 2026-03-02 (images, UI/UX, SEO, data quality, gallery lightbox, ConnectSection cleanup)

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
| Hosting | AWS Amplify | — | Serverless deployment with CI/CD |
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
│       ├── certifications.json       # 28 certifications (21 HackerRank + 7 others)
│       ├── experiences.json          # 7 work experiences
│       ├── gallery.json              # 22 gallery images
│       ├── memberships.json          # 2 memberships (PSIA, AAAP)
│       ├── profile.json              # Profile: Jhon Keneth Namias
│       ├── projects.json             # 7 projects
│       ├── recommendations.json      # 2 recommendations (PLACEHOLDER — needs real data)
│       ├── socials.json              # 8 social links (real URLs)
│       └── technologies.json         # 45 technologies across 6 categories
├── public/                           # Next.js public static files
│   ├── site.webmanifest
│   ├── resume.pdf                    # Downloadable resume (copied from portfolio-resources)
│   └── images/                       # Served images (copied from portfolio-resources)
│       ├── gallery/                  # 22 gallery photos
│       ├── projects/                 # 15 project screenshots
│       ├── certifications/           # 28 certificate images
│       └── profile/                  # Profile photos (me.jpg, etc.)
├── src/
│   ├── app/
│   │   ├── globals.css               # Global styles + CSS custom properties
│   │   ├── layout.tsx                # Root layout + metadata + Inter font
│   │   ├── page.tsx                  # Home page (main portfolio, 'use client')
│   │   ├── providers.tsx             # ThemeProvider (dark default, class strategy)
│   │   └── blog/
│   │       ├── layout.tsx            # Blog layout with SEO metadata
│   │       ├── page.tsx              # Blog listing ('use client')
│   │       └── [slug]/
│   │           ├── page.tsx          # Blog post SSG page + generateStaticParams + generateMetadata
│   │           └── BlogPostContent.tsx  # Client-side blog renderer
│   ├── components/
│   │   ├── layout/
│   │   │   └── Footer.tsx            # Simple copyright footer
│   │   ├── sections/                 # 11 section components (all 'use client')
│   │   │   ├── HeroSection.tsx       # Name, real photo, CTA buttons + resume download (download attr)
│   │   │   ├── AboutSection.tsx      # Summary, education (dates, GPA, courses), highlights stats
│   │   │   ├── TechStackSection.tsx  # Tech stack grouped by category with proficiency
│   │   │   ├── ProjectsSection.tsx   # Project cards grid (all 7, with toggle)
│   │   │   ├── CertificationsSection.tsx  # Scrollable cert list with images + lightbox
│   │   │   ├── ExperienceTimeline.tsx     # Timeline with expandable details
│   │   │   ├── RecommendationsCarousel.tsx # Auto-advancing testimonials
│   │   │   ├── MembershipsSection.tsx     # Org membership links
│   │   │   ├── SpeakingSection.tsx        # Static speaking availability
│   │   │   ├── ConnectSection.tsx         # Social links (Connect card) + latest blog post card
│   │   │   └── GallerySection.tsx         # Paginated image slider (5/slide) with title hover overlay + lightbox
│   │   └── ui/                       # 6 reusable UI primitives
│   │       ├── Button.tsx            # Primary/ghost/outline with href support
│   │       ├── Card.tsx              # Bordered card wrapper with hover option
│   │       ├── ProjectCard.tsx       # Project card with screenshot + links
│   │       ├── ThemeToggle.tsx       # Dark/light mode toggle button
│   │       ├── TimelineItem.tsx      # Expandable experience timeline entry
│   │       └── VerifiedBadge.tsx     # Pink checkmark next to name
│   ├── data/                         # TS modules importing JSON → typed exports
│   │   ├── blogPosts.ts             # ⚠️ HARDCODED blog data (not from JSON)
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
│   │   ├── useCarousel.ts           # Auto-advance & hover-pause carousel
│   │   └── useTheme.ts              # Wrapper around next-themes
│   ├── lib/
│   │   └── utils.ts                 # cn() — simple class concatenation
│   └── types/
│       └── index.ts                  # All TypeScript interfaces
├── tailwind.config.ts                # Custom colors, fonts, darkMode: 'class'
├── next.config.js                    # Standalone output, S3 remote patterns
├── amplify.yml                       # AWS Amplify CI/CD config
└── package.json
```

---

## 👤 OWNER PROFILE — Real Content Reference

This section documents the **actual content** from `portfolio-resources/data/` so the agent always has context about who the portfolio belongs to and what data is available. **Never use placeholder data — always reference this.**

### Identity
- **Name:** Jhon Keneth Namias
- **Alias:** PP Namias (GitHub: PP-Namias)
- **Title:** Full Stack Developer
- **Email:** pp.namias@gmail.com (consistent across profile.json and socials.json)
- **Location:** Caloocan City, Philippines
- **GitHub:** https://github.com/PP-Namias
- **LinkedIn:** https://www.linkedin.com/in/pp-namias/
- **Calendly:** https://calendly.com/pp-namias/15-minute-meeting

### Education
- **BS Computer Science** — University of Caloocan City (2021–present)
- GPA: 3.8 | Honors: Dean's List, Academic Excellence Award
- Courses: DSA, Software Engineering, DBMS, Web Development, Mobile Development, AI

### Experience Summary (7 roles)
| # | Company | Role | Type | Period |
|---|---------|------|------|--------|
| 1 | PhoneCraft Cellphone Repair | Head Technician | Full-time | 2020–Present |
| 2 | Ucc-Ingo | Website Administrator | Full-time | 2025–Present |
| 3 | Aeternitas Chapels & Columbarium | Software Engineer Intern | Internship | 2025–2025 |
| 4 | Wilshire Financial Network | AI Consultant Trainee | Internship | 2025–2025 |
| 5 | JIMIRENE Clinic Management System | Full Stack Developer | Full-time | 2025–2025 |
| 6 | J'5 Pharmacy | Full Stack Web Developer | Full-time | 2025–2025 |
| 7 | Legal Workflow Manager (CaseMaster) | System Analyst | Full-time | 2024–2024 |

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
- **Accent color**: Pink `#db2777` (`accent-pink` in Tailwind config)
- **Typography**: Inter via `next/font/google` loaded as `--font-inter` CSS variable
- **Max width**: 860px container (`max-w-container`)
- **Spacing**: Consistent `gap-4` between cards, `p-5` card padding

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

**Exception:** `blogPosts.ts` is currently hardcoded with sample blog posts and does NOT follow this pattern. Blog data should eventually be migrated to `portfolio-resources/data/blog.json`.

### Data Flow
```
portfolio-resources/data/*.json  →  src/data/*.ts (typed)  →  Section Components
```

### Image Asset Flow
```
portfolio-resources/assets/images/  →  public/images/ (copied)  →  Next.js <Image> components
```
Images from `portfolio-resources/` are copied to `public/images/` with subdirectories: `gallery/`, `projects/`, `certifications/`, `profile/`. All components reference `/images/{subfolder}/{filename}` paths. When adding new images, copy them to both locations.

### Types (src/types/index.ts)
All TypeScript interfaces for JSON data live here. `BlogPost` type is also in `src/types/index.ts`.

| Type | Key Fields | JSON Source | Used Fields in UI | Unused Fields |
|------|------------|-------------|-------------------|---------------|
| `Profile` | name, title, email, phone, location, github, linkedin, summary, highlights, education | profile.json | name, title, email, location, github, summary, highlights.yearsExperience, highlights.projectsCompleted, education.degree, education.institution, education.location, education.honors, education.gpa, education.relevantCourses, education.startedAt | **phone, linkedin, highlights.primaryTechnologies, education.endedAt** |
| `Experience` | company, position, summary, country, modality, type, startedAt, endedAt, technologies, highlights, achievements, relatedProjects | experiences.json | company, position, type, startedAt, endedAt, summary, technologies, highlights, achievements (expandable) | **country, modality, relatedProjects** |
| `Project` | title, image, description, repositoryURL, liveURL, processURL, tags, year | projects.json | title, image, description, repositoryURL, liveURL, tags (first 3), year | **processURL** |
| `Certification` | title, image, issuer, issuedAt, tags | certifications.json | title, image, issuer, issuedAt (with lightbox) | **tags** |
| `Technology` | name, logo, category, proficiency | technologies.json | name, category, proficiency (hover reveal) | **logo** |
| `GalleryItem` | title, mediaType, media, tags, createdAt | gallery.json | title, media (title shown on hover overlay) | **mediaType, tags, createdAt** |
| `Membership` | name, url, joinedAt | memberships.json | name, url, joinedAt | — |
| `SocialLink` | name, icon, label, link, featured? | socials.json | name, icon, label, link, featured (accent style for featured links) | — |
| `Recommendation` | quote, name, title, company | recommendations.json | All used | — |

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

---

## 🚨 KNOWN ISSUES — Current State Audit

These are confirmed issues in the codebase as of 2026-03-02. Reference these when planning work.

### P0 — Critical (Broken Functionality)

1. ~~**Gallery images 404** — `GallerySection.tsx` references `/portfolio-resources/assets/images/gallery/{filename}` but `portfolio-resources/` is NOT in `public/`. Fixed 2026-03-02: images copied to `public/images/`, GallerySection updated to use `/images/gallery/` with Next.js `<Image>`.~~

2. ~~**Project images all placeholder** — Every project in `projects.json` has `"image": "placeholder.png"`. Fixed 2026-03-02: all 7 projects mapped to real screenshots, ProjectCard now displays images.~~

3. ~~**Build-breaking import paths** — All 9 `src/data/*.ts` modules used `../../../portfolio-resources/` (3 levels up) instead of `../../portfolio-resources/` (2 levels up, correct path from `src/data/` to project root). Fixed 2026-03-02.~~

### P1 — High (Data Quality / Architecture Violations)

3. **Recommendations are fake** — `recommendations.json` contains 2 placeholder testimonials from "Sample Recommender" and "Another Recommender" at fictional companies. Must be replaced with real quotes.

4. **Blog data violates architecture** — `src/data/blogPosts.ts` hardcodes 6 blog posts instead of sourcing from `portfolio-resources/data/blog.json`. All cover images use external `picsum.photos` placeholder URLs.

5. ~~**`BlogPost` type not in `src/types/index.ts`** — Fixed 2026-03-02: moved to `src/types/index.ts`, `blogPosts.ts` now imports from `@/types`.~~

6. ~~**Profile photo is initials placeholder** — `HeroSection.tsx` renders initials in a gradient box instead of using actual photos. Fixed 2026-03-02: now uses `me.jpg` via Next.js `<Image>`.~~

7. ~~**Two different email addresses** — Fixed 2026-03-02: both profile.json and socials.json now use `pp.namias@gmail.com`. LinkedIn URL also fixed to `pp-namias`.~~

### P2 — Medium (Unused Data / Missing Features)

8. ~~**Massive unused data** — Many JSON fields were never rendered. Fixed 2026-03-02: Experience now shows summary/technologies/highlights (expandable), certifications show images with lightbox, projects show screenshots, tech stack shows proficiency on hover, memberships show joinedAt.~~
   Remaining unused: Experience country/modality/relatedProjects, Certification tags, Technology logos, Gallery tags/dates/mediaType, Profile phone/linkedin.

9. ~~**Only 4 of 7 projects displayed** — Fixed 2026-03-02: ProjectsSection now shows all 7 with "View all projects" toggle.~~

10. ~~**`Badge` component is unused** — Removed 2026-03-02.~~

11. ~~**`SocialLink.featured` field unused** — Fixed 2026-03-02: featured social links now display with accent pink background + white text in ConnectSection.~~

12. ~~**HeroSection uses `profile.github`** which points to `https://github.com/jhonmamias` — Fixed 2026-03-02: profile.json updated to `https://github.com/PP-Namias`.~~

### P3 — Low (Code Quality / Polish)

13. ~~**Raw `<img>` tags everywhere** — Fixed 2026-03-02: GallerySection, ConnectSection, BlogPostContent, blog pages now use Next.js `<Image>`.~~

14. **Blog listing is `'use client'`** — Prevents SSR/SSG, bad for SEO. Should be a server component.

15. ~~**Blog posts lack `generateMetadata`** — Fixed 2026-03-02: added `generateMetadata` to `blog/[slug]/page.tsx` + blog layout with metadata.~~

16. **Custom markdown renderer is naive** — `BlogPostContent.tsx` parses markdown manually (handles ##, ###, code blocks, lists, bold) but misses inline formatting, links, images, inline code, and nested elements. Should use `react-markdown` or similar.

17. ~~**`ConnectSection` calls `.find()` twice** for calendly — Fixed 2026-03-02: cached as `calendlyLink` variable. Further streamlined: removed redundant "Get in Touch" and "Quick Links" sections that duplicated Social Links and Hero CTAs.~~

18. ~~**`RecommendationsCarousel` direction bug** — Fixed 2026-03-02: `prevIndex` ref now synced via `useEffect` on `currentIndex`. Import consistency also fixed (unified `React.useEffect` → named `useEffect` import).~~

19. ~~**Footer copyright year hardcoded** — Fixed 2026-03-02: now uses `new Date().getFullYear()`.~~

20. ~~**`Button` ghost/outline variants are identical** — Fixed 2026-03-02: ghost is now borderless with subtle bg, outline has border with accent hover.~~

21. **`next.config.js` has S3 remote patterns** but no S3 bucket is currently in use for the deployed site — images are local.

22. ~~**Resume button opens new tab instead of downloading** — Fixed 2026-03-02: HeroSection resume uses `<a download>` attribute instead of Button with `target="_blank"`.~~

23. ~~**Gallery images not clickable** — Fixed 2026-03-02: GallerySection now has click-to-enlarge lightbox (AnimatePresence modal, X close, backdrop click close) matching CertificationsSection pattern.~~

24. ~~**Gallery section missing image count** — Fixed 2026-03-02: header now shows `Gallery (22)` count like Projects and Certifications.~~

25. ~~**ConnectSection had redundant sections** — Fixed 2026-03-02: removed "Get in Touch" and "Quick Links" sections. Now shows single "Connect" card with all 8 social links + "Latest Post" card.~~

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

### Medium Effort (1–3 hours)
- [x] Solve image serving: copy `portfolio-resources/assets/images/` to `public/images/`
- [x] Display certification images in CertificationsSection (with lightbox)
- [x] Display technology proficiency in TechStackSection (hover reveal)
- [x] Display project screenshots in ProjectCard
- [x] Show experience details (summary, technologies, highlights) in expanded timeline
- [x] Replace `<img>` with Next.js `<Image>` throughout
- [x] Move `BlogPost` type to `src/types/index.ts`
- [ ] Create `portfolio-resources/data/blog.json` and source blog data from it

### Larger Features (3+ hours)
- [ ] Get real recommendations and replace placeholder data
- [ ] Implement proper markdown rendering (react-markdown + rehype plugins)
- [x] Add SEO: `generateMetadata` for blog pages + blog layout metadata
- [ ] Make blog listing a server component for SSG
- [x] Show gallery image title on hover overlay
- [x] Add resume download button in HeroSection using `public/resume.pdf`
- [x] Leverage `SocialLink.featured` for prominent accent display in ConnectSection
- [x] Display education dates, GPA, relevant courses in AboutSection
- [x] Show experience achievements in expandable timeline
- [ ] Add OG images and structured data for full SEO
- [x] Gallery lightbox (click-to-enlarge with AnimatePresence modal)
- [x] Streamline ConnectSection (removed redundant "Get in Touch" and "Quick Links")
- [x] Resume download uses `download` attribute instead of new tab
- [x] Gallery shows image count in header

---

## ⚠️ GOTCHAS

1. **Font loading:** Use `next/font/google` ONLY — do NOT also `@import` from CSS (Inter is loaded in `layout.tsx` as `--font-inter`)
2. **Real data:** All content from `portfolio-resources/data/` — no placeholders, no hardcoded content
3. **Social links:** From `socials.json` — never hardcode URLs (8 links: calendly, github, email, linkedin, facebook, discord, x, instagram)
4. **Metadata:** Real name "Jhon Keneth Namias", real domain "namias.tech", real email `pp.namias@gmail.com`
5. **CSS transitions on `*`:** Avoid — causes performance issues on theme switch. Only transition specific properties on body
6. **`'use client'`:** Only for interactive components — blog listing should be server component
7. **Image paths:** Images live in `portfolio-resources/assets/images/` and are copied to `public/images/`. Components reference `/images/{subfolder}/{filename}`. When adding new images, copy them to both locations.
8. **Filenames with spaces:** Gallery and cert images have spaces in filenames (e.g., `Birthday Picture 2024 (1).JPG`, `HackForGov 2025 (1).jpeg`) — must URL-encode when referencing
9. **Mixed file extensions:** Gallery uses `.JPG`, `.jpg`, `.jpeg`, `.png` — ensure case-sensitive handling
10. **Standalone output:** `next.config.js` sets `output: 'standalone'` for AWS Amplify — don't remove
11. **No `react-markdown`:** Blog content rendering is hand-rolled — adding a markdown library requires updating `package.json`
12. **`tailwind.config.ts` content paths:** Only scans `src/components/**` and `src/app/**` — if adding components elsewhere, update the config

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
