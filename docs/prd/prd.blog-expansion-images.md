# Blog Expansion & Inline Image System — PRD

> **Goal:** Transform the blog into a visual storytelling engine with inline images, image collages, YouTube embeds, and a foundation for 50+ posts.
>
> **Owner:** PP Namias
>
> **Status:** Draft for review
>
> **Created:** 2026-07-16

---

## 1. Current State (14 posts in Sanity, 2025-03 to 2026-12)

| Slug | Title | Date | Featured |
|------|-------|------|----------|
| `hello-world-the-day-i-wrote-my-first-line-of-code` | Hello World... | 2025-03-15 | ❌ |
| `building-student-attendance-management-system-from-scratch` | Building Student Attendance... | 2025-09-10 | ❌ |
| `from-for-loops-to-full-stack-engineer` | From For Loops... | 2025-11-05 | ❌ |
| `how-i-built-an-ai-chatbot-for-a-real-client` | How I Built an AI Chatbot... | 2026-01-15 | ❌ |
| `gitgoing-computer-science-github-webinar` | GitGoing... | 2026-02-28 | ✅ |
| `what-i-learned-automating-enterprise-workflows-with-n8n` | What I Learned... n8n | 2026-03-20 | ❌ |
| `building-a-portfolio-with-278-tests-and-100-score` | Building a Portfolio... | 2026-05-10 | ❌ |
| `hi-welcome-to-my-blog-portfolio` | Hi - Welcome... | 2026-05-20 | ✅ |
| `my-experience-as-a-developer-in-2026` | My Experience... | 2026-06-05 | ❌ |
| `impostor-syndrome-at-50-plus-repos` | Impostor Syndrome... | 2026-07-01 | ❌ |
| `how-i-use-ai-as-a-force-multiplier` | How I Use AI... | 2026-08-15 | ❌ |
| `architecture-behind-this-portfolios-ai-chat` | Architecture Behind... AI Chat | 2026-09-28 | ❌ |
| `what-hiring-managers-look-for-in-a-junior-dev` | What Hiring Managers... | 2026-11-10 | ❌ |
| `2026-year-in-review` | 2026 Year in Review | 2026-12-28 | ❌ |

**Gaps today:**
1. No inline images in any post — text-only renders
2. No image galleries/collages supported
3. `portableTextToMarkdown()` strips image blocks silently
4. No YouTube embed support in the markdown pipeline
5. Only 14 posts — thin for interview storytelling

---

## 2. Feature Requirements

### 2.1 Quick Inline Image System (with Credits)

**Sanity Side** — `studio/schemaTypes/blockContent.ts`:
- Already has `alt`, `caption`, `credit`, `source`, `license` on inline images ✅
- Already has `imageGallery` array member ✅

**Pipeline Side** — `cms-content.server.ts` + `blog.server.ts`:
- `portableTextToMarkdown()` must handle `_type === 'image'` → emit `![alt|caption|credit|source|license](url)`
- Handle `_type === 'imageGallery'` → emit `[gallery:2col]...[/gallery]`

**Render Side** — `BlogPostContent.tsx`:
- Custom `img` component parses pipe-separated metadata from alt text
- Renders `<figure>` with `<Image>`, `<figcaption>` with caption/credit/source/license
- CollageGallery component renders multi-image grids
- YouTube embed: `[youtube:VIDEO_ID "Title"]` syntax → `<YoutubeEmbed>`

### 2.2 Image Collages

When 2+ images are placed sequentially in Sanity body or via `imageGallery`:
- Auto-render as responsive CSS grid (2-col or 3-col)
- Each image keeps its caption/credit
- Rounded corners, border, hover effect

### 2.3 YouTube Embed

Custom markdown syntax in blog content:
```
[youtube:VIDEO_ID "Optional caption text"]
```
→ Renders as a 16:9 responsive iframe embed with optional caption.

### 2.4 Blog Expansion Pipeline

Goal: Make it easy to add 50+ posts over time.

| Layer | What | How |
|-------|------|-----|
| Content creation | Local MD files → Sanity | `push-blog-to-sanity.mjs` script |
| Visual content | Inline images via Sanity UI | Studio schema already ready |
| Fallback | Local MD + cms-content.shared.ts | Auto-fallback when Sanity unavailable |
| Future | GROQ-based pagination, categories | Next phase |

---

## 3. Technical Implementation Plan

### Step 1: Fix Sanity Studio React Error
- Root cause: pnpm virtual store creates duplicate React resolutions
- Fix: Ensure `react` and `react-dom` resolve from single location
- Or: Use `--shamefully-hoist` in pnpm or add `react`/`react-dom` to `pnpm.overrides`

### Step 2: Update Schema (if needed)
`studio/schemaTypes/blockContent.ts` — verify inline image fields are complete:
- [x] `alt` (string)
- [x] `caption` (string)  
- [x] `credit` (string)
- [x] `source` (url)
- [x] `license` (string)
- [x] `imageGallery` array member

### Step 3: Update Pipeline — portableTextToMarkdown()
Two files:
- `portfolio-v1/src/lib/cms-content.server.ts`
- `portfolio-v1/src/lib/sections/blog.server.ts`

Changes:
- Detect `_type === 'image'` → emit `![alt|caption|credit|source|license](url)`
- Detect `_type === 'imageGallery'` → emit `[gallery:2col]` + images + `[/gallery]`

### Step 4: Update Render — BlogPostContent.tsx
- Add `img` custom component with metadata parsing
- Add `YoutubeEmbed` component
- Add `CollageGallery` component
- Update preprocessContent() to handle `[youtube:]` and `[gallery:]` syntax

### Step 5: Update Blog Posts
- Add YouTube embed to Attendance System post (top of content)
- Add image references to posts that need them
- Set featured flags appropriately

### Step 6: Push to Sanity
- Run `push-blog-to-sanity.mjs` to update all posts with new body content
- Verify blog posts render with images

---

## 4. Success Metrics

| Metric | Before | Target |
|--------|--------|--------|
| Posts with images | 0 | 14+ |
| Image galleries working | ❌ | ✅ |
| YouTube embeds working | ❌ | ✅ |
| Studio runs locally | ❌ (React error) | ✅ |
| Image pipeline preserved in PT→MD | ❌ (stripped) | ✅ |

---

## 5. Future Phases (Post-Image-System)

| Phase | What | When |
|-------|------|------|
| Phase B1 | Add cover/OG images to all posts | Next |
| Phase B2 | Category/tag filtering on blog list | Next |
| Phase B3 | Related posts at bottom of each post | Future |
| Phase B4 | Reading progress bar | Future |
| Phase B5 | Social share buttons on posts | Future |
| Phase B6 | Blog RSS feed | Future |
| Phase B7 | 50+ post pipeline with content calendar | Future |

---

*Draft — review and approve before execution.*
