# Branch `dev` — Complete Changelog

**Total Commits:** 196  
**Files Changed:** 369  
**Lines Added:** ~46,000  
**Lines Removed:** ~8,000  

---

## Overview

This branch is a massive overhaul of the PP Namias portfolio — touching every layer of the stack from accessibility and SEO to AI agent infrastructure and security monitoring.

---

## 1. Accessibility (a11y)

### What Changed
- Added `aria-expanded` to 5 toggle buttons (certifications, memberships, experience, speaking, gallery)
- Added `role="img"` to `VerifiedBadge`
- Added `aria-hidden` to 6+ decorative icons (sparkles, glow, dots, bars)
- Increased touch targets from 28-32px → 44px on 4 modal close buttons, ScrollToTop, hero social links
- Replaced `focus:` with `focus-visible:` across 8 files
- Added `prefers-reduced-motion` support in `AboutSection`, `ConnectSection`, `ExperienceTimeline`
- Fixed heading hierarchy on project detail page (`h2` → `h3`)
- Fixed footer copyright contrast ratio
- Certification cards use `<button>` instead of `<div onClick>`
- Added `aria-label` to contact modal clear draft button

### Why
- WCAG 2.1 AA compliance
- Keyboard-only navigation support
- Touch device usability (mobile)
- Screen reader compatibility

---

## 2. Performance

### What Changed
- Replaced `transition-all` with specific CSS transitions in 8 files (`ContactModal`, `ExperienceTimeline`, `FloatingHub`, `HubMenu`, `ChatPanel`, `ResumeModal`, `MagicCursor`, `GallerySection`)
- Added `React.memo` to `ChatMessage` and `TimelineItem`
- Deduplicated `SITE_URL` in `seo-image.ts`
- Added `color-scheme: dark` to `globals.css`
- Added `touch-action: manipulation` to interactive elements

### Why
- `transition-all` causes unnecessary repaints on every frame
- `React.memo` prevents re-renders of static components
- `color-scheme` eliminates FOUC for dark mode
- `touch-action` disables 300ms tap delay on mobile

---

## 3. SEO

### What Changed
- Added canonical URLs to blog and project layouts
- Added Twitter/X Card meta tags to blog and project pages
- Fixed duplicate H1 on project detail page
- Added `start_url` to web manifest
- Added `robots.txt` rules for `/studio`, `/api/`, `/_next/`
- Created `seo-image.ts` utility with Sanity image URL builder
- Created `seoImage` field in Sanity schemas (Profile, Post, Project)
- Enhanced `Person`, `Article`, and `CreativeWork` JSON-LD with `ImageObject`
- Replaced all hardcoded Sanity project IDs with `site-config` constants
- Created `site-config.ts` with `SITE_URL` and `SANITY_PROJECT_ID`
- Added `twitter:image` meta tags to project pages
- Added Google Rich Results testing documentation

### Why
- Search engines need canonical URLs to avoid duplicate content penalties
- Twitter Cards enable rich previews when links are shared
- Structured data (JSON-LD) enables rich snippets in Google results
- Centralized config prevents hardcoded values from diverging

---

## 4. Security

### What Changed
- Added `X-Frame-Options: DENY` header (prevents clickjacking)
- Added `sandbox` attribute to iframe in `ResumeModal`
- Added `fonts.gstatic.com` preconnect
- Validated `OPENAI_BASE_URL` protocol to prevent SSRF
- Required admin API key for cache flush endpoint
- Media gateway signature verification fails closed when secret missing
- Webhook auth fails closed when secret is missing
- Activated rate limiter middleware
- Restricted CORS headers and removed info leakage
- Added `Disallow` rules for `/studio`, `/api/` in robots.txt

### Why
- Clickjacking, SSRF, and information disclosure are common attack vectors
- Fail-closed security ensures systems deny access by default
- Rate limiting prevents abuse

---

## 5. UI/UX Improvements

### What Changed
- Redesigned 404 page to match ZonFire99 CodePen (glitch effect, OCR-A font)
- Added global `loading.tsx` for route transitions
- Added back navigation, heading, and theme toggle to projects page
- Simplified hero section — single-line info row, compact CTAs
- Slimmed footer to single tight block
- Removed contact modal, replaced with direct `mailto:` links
- Replaced Instagram with Twitter/X across all social link components
- Added Facebook icon to Connect section
- Cleaned up profile picture hover effect
- Added `MagicCursor` to production layout with `prefers-reduced-motion` support
- Added `IS_MAGIC_CURSOR_VISIBLE` feature flag
- Flattened contact form to single-column direct form (removed wizard steps)
- Added Discord to chat hub (replaced Messenger)
- Added `IS_PROJECTS_REVAMP_ENABLED` feature flag
- Created `ProjectsSectionRevamped` with dual tabs (Live Projects / Showcase)
- Created `/projects/[slug]` detail page with ISR and JSON-LD
- Created `/projects` listing page with layout and sitemap entries
- Polished home page `RecentCard` and `/projects` `ListingCard` designs

### Why
- Modern, clean aesthetic
- Better mobile UX (compact layouts, direct actions)
- Feature flags enable gradual rollout
- ISR caching for project detail pages

---

## 6. Sanity CMS

### What Changed
- Created backup scripts (`backup.sh`, `backup.ps1`, `restore.sh`, `restore.ps1`, `verify.sh`, `verify.ps1`)
- Created 18+ Sanity plan documents (EPIC-0 through EPIC-H)
- Added `ContentHealthPanel` to welcome page
- Added `DataConsistency` inspector panel
- Added `JsonInspector` inspector panel
- Added smart defaults to create actions
- Added duplicate title detection
- Added field-level validation rules
- Added filtered views and icons to desk structure
- Added onboarding with progress tracking
- Added automation panel
- Removed `heroSection` schema (merged into `profile`)
- Added `heroRoles`, `socialLinks`, `profileImage`, `availabilityLabel` to profile schema
- Added `seoImage` field to Profile, Post, and Project schemas
- Added `Experience` badge type "Study" (blue)
- Created migration runner framework with 3 migrations
- Added GROQ backup script
- Added health report script and CI workflow
- Added `npm run dev` to run Next.js and Sanity studio together
- Removed `skillsToolPlugin` and studio skills
- Updated Presentation navigator

### Why
- Consolidate heroSection into profile (single source of truth)
- Smart studio features reduce manual work
- Backup/restore scripts protect against data loss
- Validation rules enforce data quality at the schema level

---

## 7. AI Agents & MCP Infrastructure

### What Changed
- Cleaned `opencode.json` from 1000+ lines to 15 working MCP servers + 12 LSP servers
- Created 5 specialized subagents: frontend, backend, content, security, devops
- Created 5 workflow templates: bug-fix, feature-development, code-review, portfolio-development, mimo-prompt-guide
- Created enterprise workflow guide
- Added 50+ skills across all categories
- Added Chrome DevTools MCP, Magic UI MCP, GitHub MCP, Filesystem MCP, Sequential Thinking MCP, Memory MCP, Brave Search MCP, Fetch MCP, Puppeteer MCP, SQLite MCP, Sanity CMS MCP, Sentry MCP, Vercel MCP, Docker MCP
- Added TypeScript LSP, ESLint LSP, Prettier LSP, Tailwind CSS LSP, HTML LSP, CSS LSP, JSON LSP, Markdown LSP, GraphQL LSP, YAML LSP, Dockerfile LSP, Prisma LSP
- Created MiMo v2.5 optimized workflows: mimo-workflow, opencode-optimization, fullstack-workflow, typescript-advanced

### Why
- Domain-specific agents reduce context switching
- Workflow templates enforce consistency
- MCP/LSP servers provide IDE intelligence
- MiMo workflows optimize for the free model's strengths

---

## 8. Testing

### What Changed
- 43 test files, 404 tests — all passing
- Added tests for: canary system, cache routes, CSP violation, fallback responder, intent classifier, security headers, CMS content, redis cache, project detail page, project grid, projects section revamped
- Updated tests for: booking modal, chat panel, floating hub, hub menu, contact modal, media route, sanity webhook, blog layout, project detail page
- Fixed test isolation with `SWRConfig` provider
- Increased test timeout to prevent flaky failures

### Why
- Comprehensive test coverage prevents regressions
- Test isolation ensures deterministic results
- Canary tests validate the security monitoring system

---

## 9. Canary Token Security System

### What Changed
- Created 10 decoy tokens: `/.env-canary`, `/.ssh-canary/id_rsa`, `/.aws-canary/credentials`, `/backups-canary/database.sql`, `/api/canary/admin`, `/api/canary/config`, `/wp-admin-canary`, `/phpmyadmin-canary`, `/robots-canary.txt`, `/sitemap-canary.xml`
- Created email notification service with HTML templates (sends to `jkrbn99@gmail.com`)
- Created trigger logging service with stats aggregation
- Created admin dashboard at `/admin/canary` (dark theme, refresh, test alert buttons)
- Created API endpoints: `/api/canary/test`, `/api/canary/stats`
- Created canary middleware for request interception
- Created 23 unit tests — all passing
- Created PRD for Thinkst Canary token integration

### Why
- Early detection of automated scanners and human reconnaissance
- Email alerts provide immediate notification of unauthorized access attempts
- Admin dashboard enables monitoring and analytics

---

## 10. CI/CD & DevOps

### What Changed
- Added Sanity schema check workflow
- Added Checkov security scanning
- Rewrote auto-approve to poll all checks
- Added env vars for build
- Added `security.json` removal (was public)
- Added `site.webmanifest`

### Why
- Automated security scanning catches vulnerabilities before deployment
- Auto-approve ensures all checks pass before merging

---

## 11. Data Migration

### What Changed
- Created GitHub import script for project metadata
- Added complete GitHub repository data for 57 projects
- Created QA script for post-import validation
- Created data transform, enrichment, curator, reporter, validation, and Sanity client modules
- Deduplicated projects by `githubRepo`/`slug`/`title`
- Case-insensitive project dedup
- Updated fallback data with all 48 curated projects

### Why
- Automated import ensures consistency
- Deduplication prevents React key collisions
- QA script validates import integrity

---

## 12. Documentation

### What Changed
- Added PRD for Sanity Studio v2 upgrade
- Added PRD for Search Result Thumbnail
- Added PRD for Projects Revamp
- Added PRD for Sanity Migration Smart
- Added PRD for Canary Tokens
- Added PRD for Facebook Embedded Chat
- Added enterprise workflow guide
- Added about section visual preview
- Added Google Rich Results testing docs
- Added SEO image requirements
- Updated AGENTS.md with 50+ skills and subagent routing
- Updated `.agents/README.md`

### Why
- PRDs provide clear requirements and commit plans
- Workflow guides ensure consistent processes
- Updated agent docs reflect new capabilities

---

## Summary by Category

| Category | Commits | Impact |
|----------|---------|--------|
| Accessibility | 25+ | WCAG 2.1 AA compliance |
| Performance | 10+ | Faster load times, smoother animations |
| SEO | 15+ | Better search visibility, rich snippets |
| Security | 12+ | Defense in depth, fail-closed defaults |
| UI/UX | 30+ | Modern design, better mobile UX |
| Sanity CMS | 40+ | Smart studio, schema consolidation |
| AI Agents | 10+ | Domain-specific subagents, workflow templates |
| Testing | 15+ | 404 tests passing, comprehensive coverage |
| Canary Tokens | 21 | Early threat detection, email alerts |
| CI/CD | 5+ | Automated security scanning |
| Data Migration | 10+ | Automated import, deduplication |
| Documentation | 20+ | PRDs, workflow guides, agent docs |
