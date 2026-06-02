# Namias CMS Studio Restructure — Master Plan

> **Working branch:** `feature/sanity-showcase-studio`
> **Date:** 2026-06-02
> **Code name:** `atlas` → `atlas-2` (this iteration)
> **Constraint:** Zero content deletion, zero schema removal. Only structure, navigation, presentation, and tooling improve.

---

## 1. Goals

| # | Goal | Why |
|---|------|-----|
| G1 | Make the **structure** follow "what you see on the site" instead of "what kind of document" | Editors open the studio to update a specific page; current nesting forces mental mapping. |
| G2 | Make the **Presentation tool** the primary editing surface, not a separate one | Visual editing on the live site is the showcase feature. |
| G3 | Make **Vision tool** opinionated with saved GROQ queries relevant to this site | The raw Vision tool is fine for engineers, hostile for editors. |
| G4 | Add a **Welcome / Onboarding** that teaches content ownership | New editors must understand the "page-first" model. |
| G5 | Add a **Studio Skills** panel linking to doc files | "Skills" are the repeatable recipes we want the AI / new editors to follow. |
| G6 | Add a **/studio/skills** landing tool | Browse recipes in the studio without leaving it. |
| G7 | Commit every slice as its own commit | Revertable, reviewable, attributable. |

---

## 2. Information Architecture

### 2.1 Current structure (5 groups, 3 levels deep)

```
Content
├── Homepage
│   ├── Hero & shell
│   │   ├── Hero Section
│   │   ├── Resume
│   │   └── Site Settings
│   ├── Main column
│   │   ├── About Section
│   │   ├── Tech Stack
│   │   └── Projects
│   └── Sidebar column
│       ├── Experience
│       ├── Certifications
│       └── Gallery
├── Support Data
│   ├── Profile
│   ├── Memberships
│   └── Recommendations
├── Blog
│   ├── Posts
│   ├── Authors
│   └── Categories
├── Reference Data
│   ├── Certification Categories
│   ├── Certification Issuers
│   └── Gallery Categories
└── Interview Demo
    ├── 1. Preview Foundation
    ├── 2. Homepage Live Preview
    └── 3. Blog Live Preview
```

**Problem:** 3 levels deep + "Interview Demo" is a copy of normal navigation. Editors get lost.

### 2.2 Target structure (2 levels, page-first)

```
Content
├── Pages
│   ├── Homepage               (singletons + collections that render on `/`)
│   │   ├── Hero Section
│   │   ├── About Section
│   │   ├── Tech Stack
│   │   ├── Projects
│   │   ├── Experience
│   │   ├── Certifications
│   │   ├── Gallery
│   │   ├── Site Settings      (footer, hero copy, empty states)
│   │   └── Resume
│   ├── Blog                   (everything that renders on `/blog` or `/blog/[slug]`)
│   │   ├── Posts
│   │   ├── Authors
│   │   ├── Categories
│   │   └── Blog Settings      (from siteSettings.blog)
│   └── Profile                (everything that renders on `/about` or profile pages)
│       ├── Profile
│       ├── Memberships
│       └── Recommendations
├── Settings                   (cross-page site config)
│   ├── SEO Settings
│   ├── Media Settings
│   └── Site Settings (full)
├── Reference Data             (taxonomy only — re-usable values)
│   ├── Certification Categories
│   ├── Certification Issuers
│   └── Gallery Categories
└── Quick Start                (one-click jump to most-edited docs)
    ├── Edit Hero
    ├── Add a Project
    ├── Publish a Blog Post
    └── Open Presentation Tool
```

**Rules:**
1. **Max 2 levels** under any group. The deepest list has 2 levels.
2. **Pages are primary**; everything is grouped by where it shows up on the site.
3. **Settings is its own group** so global config is never confused with page content.
4. **Reference Data** is grouped last; it is rarely edited.
5. **Quick Start** is a top-level entry-point for new editors (deep links to most-touched docs + Presentation tool).

---

## 3. Presentation Tool

### 3.1 Current state
- `presentationTool` enabled in `sanity.config.ts`.
- Locations registered inline (12 type entries) + duplicated in `preview/previewLocations.ts` (which is then merged with `Object.fromEntries`).
- No landing page (just goes to the structure tool).
- No "view on site" button in document editor.

### 3.2 Target
- **Single source of truth** for locations: `preview/previewLocations.ts`. Delete the inline duplicates.
- **Custom Presentation tool landing page** with:
  - Site URL display + "open in new tab"
  - 4 most-edited docs as quick-launch cards
  - Link to the docs/skills folder
- **Document-level "View on site" action** in the document toolbar (uses `presentationTool` resolution).
- **"Edit in Studio" overlay** verified on homepage + blog routes (already configured, but not tested).

### 3.3 Resolver improvements
- `presentationTool` resolver: also include `blogPostLocation` with `/blog` and `/blog/[slug]` (already there, just need to dedupe).
- Add a `routeSecret` config so the Presentation tool can read the `SANITY_STUDIO_REVALIDATE_SECRET`.

---

## 4. Vision Tool

### 4.1 Current state
- `visionTool()` enabled with no customization.

### 4.2 Target
- **`studio/vision/queries.ts`** — exported object of named GROQ queries.
- **`studio/vision/panels.tsx`** — custom Vision tool panel that shows the saved queries as clickable buttons. Clicking inserts the query into the editor.
- **Sections:** "Site health", "Content audit", "Schema reference", "Live preview", "Bulk operations".
- **Vision landing component** that picks the dataset automatically.

---

## 5. Welcome / Onboarding

### 5.1 Current state
- `Welcome.tsx` — gradient hero with 3 quick-create cards. No navigation aid.
- `Onboarding.tsx` — 4-step local tour. No content education.

### 5.2 Target
- **New `WelcomeScreen.tsx`**:
  - Hero "The portfolio is a content surface. This is the cockpit."
  - **Top row: 3 quick-create cards** (existing).
  - **Middle row: 4 quick-edit cards** (Hero, Project, Blog Post, Profile) — opens existing doc.
  - **Bottom row: Studio Skills** (3 cards linking to most important skills in `.opencode/skills`).
  - **Footer: 3 onboarding links** ("I need to update text", "I need to add a project", "I need to publish a blog post").
- **New `Onboarding.tsx`** (rewritten):
  - 4 steps, each one teaches a concept:
    1. **Pages are first** — show the structure tool
    2. **Edit while you see it** — open Presentation tool on Hero
    3. **Status badges tell you what's stale** — open a Blog Post
    4. **Vision tool is your SQL console** — open Vision, show a saved query
  - Skip if `localStorage['namias-onboarding-tour'] === 'done'`.

---

## 6. Studio Skills

### 6.1 What "skills" mean here
A skill is a markdown file in `.opencode/skills/` (or `studio/skills/`) that:
- Explains a single repeatable task ("How to add a project", "How to publish a blog post")
- Has frontmatter describing triggers
- Has step-by-step instructions with screenshots
- Optionally links to the underlying code (schema file, template file)

### 6.2 Skills to author
- `add-a-project.md`
- `add-a-blog-post.md`
- `add-a-certification.md`
- `add-an-experience.md`
- `update-the-hero.md`
- `update-the-about-section.md`
- `update-tech-stack.md`
- `update-site-settings.md`
- `add-a-membership.md`
- `add-a-recommendation.md`
- `add-a-gallery-image.md`
- `add-a-resume.md`
- `update-seo-defaults.md`
- `use-the-presentation-tool.md`
- `use-vision-tool-saved-queries.md`
- `use-ai-assist.md`
- `use-templates.md`
- `use-status-badges.md`
- `use-content-health-inspector.md`
- `fix-stale-content.md`
- `fix-expiring-certification.md`
- `publish-and-revalidate.md`
- `rollback-a-document.md`
- `duplicate-a-document.md`
- `schedule-a-blog-post.md`
- `configure-cors-and-tokens.md`
- `deploy-the-studio.md`
- `deploy-the-marketing-site.md`
- `add-a-sanity-function.md`
- `add-an-ai-action.md`
- `add-a-custom-badge.md`
- `add-a-custom-action.md`
- `add-a-new-schema-type.md`
- `add-a-validation-rule.md`
- `add-a-list-preview.md`
- `add-a-custom-input.md`
- `add-an-onboarding-step.md`
- `restructure-the-studio.md`
- `add-a-studio-tool.md`
- `add-a-studio-route.md`
- `debug-studio-locally.md`
- `read-the-structure-registry.md`
- `add-a-vision-query.md`
- `add-a-saved-vision-query.md`
- `add-an-ai-assist-instruction.md`

(That's 42 skill files.)

### 6.3 Where they live
Two locations, both git-tracked:
- `studio/skills/<name>.md` — surfaced in the **Studio Skills** welcome cards and the `/studio/skills` tool.
- `.opencode/skills/<name>.md` — surfaced as the **opencode skill** for AI / new dev onboarding.

The first 6 skills are mirrored to both. The rest are studio-only.

---

## 7. /studio/skills — custom studio tool

A new custom tool (registered with `definePlugin`) that renders a read-only browser for the `studio/skills/` markdown files. Built with `marked` (already a Sanity dep).

- List view: cards with title, summary, last-modified.
- Detail view: rendered markdown with syntax highlighting.

This makes the studio self-documenting: an editor who has a question can open Skills and read the answer without leaving the studio.

---

## 8. Document-level improvements

### 8.1 Status badges
Already implemented. Just rename to match the new structure:
- `Live`, `Draft`, `Scheduled`, `Featured`, `Stale`, `Expiring soon`.

### 8.2 Actions
- **`viewOnSite` action** — appears in every document, opens the resolved Presentation location in a new tab.
- **`openInPresentation` action** — opens the Presentation tool focused on this document.

### 8.3 Templates
- Audit existing templates (only 4: project, experience, certification, post).
- Add templates for: `membership`, `recommendation`, `galleryImage`, `aboutSection`, `siteSettings` (one template per major edit).

### 8.4 Inspector
- Existing `SeoPreview` and `ContentHealth` panels.
- Add **`SmartCopySuggestions`** inspector: if title is short, suggest 1-2 variations.

---

## 9. Theming

No change. The Namias pink/indigo theme stays.

---

## 10. Commits

Plan to ship 20-25 commits, each one a coherent slice:

1. `docs: write master restructure plan to PLAN.md`
2. `docs(studio): add 42 studio skill files (stub)`
3. `docs(studio): add .opencode skill mirror for top 6 tasks`
4. `chore(studio): install marked for skill rendering`
5. `feat(studio): add skills custom tool (read-only markdown browser)`
6. `feat(studio): add skills welcome cards to welcome screen`
7. `feat(studio): add viewOnSite document action`
8. `feat(studio): add openInPresentation document action`
9. `feat(studio): refactor structure tool to page-first IA (2 levels)`
10. `feat(studio): add Quick Start top-level group`
11. `feat(studio): add templates for membership/recommendation/galleryImage`
12. `feat(studio): add saved queries to vision tool`
13. `feat(studio): add vision tool landing panel`
14. `refactor(studio): consolidate preview locations in previewLocations.ts`
15. `feat(studio): add Presentation tool landing component`
16. `refactor(studio): rewrite Onboarding tour (4 task-oriented steps)`
17. `refactor(studio): rewrite Welcome screen with skills links`
18. `feat(studio): add /studio/skills navigation entry`
19. `docs: update SHOWCASE_RUNBOOK.md to reference new structure`
20. `docs: update STUDIO_ARCHITECTURE.md with new structure map`
21. `docs: update EXTENDING_STUDIO.md with the new IA conventions`
22. `chore: typecheck + lint + deploy verification`

---

## 11. What I will NOT change

- **Schema files** — no field rename, no type change. All 21 schema files stay byte-identical.
- **Existing data in the dataset** — no migration, no deletion, no document copy. Only structure, presentation, and tooling.
- **`studio/env.ts`** — keep the public API. Just add to it if needed.
- **`studio/theme/studioTheme.ts`** — no color/motion change.
- **Marketing site** — no Next.js / Tailwind / component change. The Presentation tool iframe still points to `https://namias.tech` with the same CSP.
- **`.env.local`** — secrets stay where they are.

---

## 12. Risk register

| Risk | Mitigation |
|------|------------|
| Refactor breaks `presentationTool` resolution | Keep the existing `previewLocations` shape; only re-export from one place. |
| Vision tool custom panel incompatible with `@sanity/vision@4.22` | Read the `@sanity/vision` source for v4 to confirm `definePlugin`/`useEffect` hooks available. Fallback: use `studio/skills` instead. |
| `marked` is a new dep | `marked` is already in the studio's dep tree via `sanity` internals; we can use it directly without a version pin. |
| Large `PLAN.md` clutters repo | Put it in `studio/PLAN.md` so it lives next to the code it documents. |
| `Welcome.tsx` 300+ lines of inline styles becomes unreadable | Extract design tokens to `studio/theme/welcomeStyles.ts`. |
| Schema registry has a `_registry` virtual type that pollutes schema deployment | Document it; it's intentional for the side-effect of loading computed-field definitions. |

---

## 13. Acceptance criteria

- [ ] All 21 schema files still typecheck.
- [ ] `npm run lint` returns 0 errors (cosmetic warnings OK).
- [ ] `npm run build` produces `studio/dist` cleanly.
- [ ] `npm run deploy` succeeds.
- [ ] Studio opens at `https://namias-cms.sanity.studio/`.
- [ ] Welcome screen shows 3 quick-create cards + 4 quick-edit cards + 3 skills cards.
- [ ] Structure tool shows the new IA (2 levels max).
- [ ] Presentation tool opens, loads `https://namias.tech`, and click-to-edit works on the hero.
- [ ] Vision tool opens with at least 5 saved queries visible.
- [ ] `/studio/skills` (custom tool) shows the 42 markdown files as cards.
- [ ] No data deleted; document count in the dataset unchanged before/after.

---

## 14. Out of scope (future work)

- Custom dashboard widgets (Tasks, Activity, etc.) — separate epic.
- Comments / Tasks plugin — separate epic.
- Content Releases UI — separate epic.
- Multi-locale content — separate epic.
- Functions deploy (scheduled-publish, broken-refs, auto-tag-images) — already code-complete, needs a separate deploy commit by the user.
