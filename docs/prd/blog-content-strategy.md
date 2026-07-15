# Blog Content Strategy & Plan

> **Goal:** Transform the portfolio blog into a storytelling engine that showcases skills, journey, and technical depth for interview success.
>
> **Owner:** Jhon Keneth Ryan B. Namias (PP Namias)
>
> **Last Updated:** 2026-07-16

---

## 1. Current State Inventory

### Sanity CMS — Existing Blog Posts (3 total)

All three posts were published on **June 5, 2026** — the same day — which looks artificial.

| # | Title | Slug | Published | Tags | Featured |
|---|-------|------|-----------|------|----------|
| 1 | Hi - Welcome to my blog-portfolio! | `hi-welcome-to-my-blog-portfolio` | 2026-06-05 06:53 UTC | intro, career, ai, fullstack, personal | ✅ |
| 2 | GitGoing - Computer Science GitHub Webinar! | `gitgoing-computer-science-github-webinar` | 2026-06-05 07:41 UTC | git, github, webinar, speaking, collaboration, version-control, ucc | ✅ |
| 3 | My Experience as a Developer in 2026 | `my-experience-as-a-developer-in-2026` | 2026-06-05 13:41 UTC | experience, reflection, ai, cs50, balance, learning, developer-journey | ❌ |

### Fallback Data (when Sanity is unavailable)

| Slug | Title | Date |
|------|-------|------|
| `hello-world` | Hello World | 2026-01-10 |
| `deep-dive` | Deep Dive | 2026-02-20 |

### Current Blog Content Pipeline

```
Sanity CMS → GROQ Query → portableTextToMarkdown() → react-markdown
                                                    ↑
                                            STRIPS all image blocks
                                            Only extracts text from block children
```

Key files:
- Schema: `studio/schemaTypes/blockContent.ts` — inline images have `alt` + `caption` fields
- Pipeline: `portfolio-v1/src/lib/cms-content.server.ts:197` and `portfolio-v1/src/lib/sections/blog.server.ts:11`
- Render: `portfolio-v1/src/app/blog/[slug]/BlogPostContent.tsx`
- List: `portfolio-v1/src/app/blog/BlogListClient.tsx` + `portfolio-v1/src/components/sections/BlogSection.tsx`

---

## 2. Gaps & Pain Points

| Issue | Impact | Priority |
|-------|--------|----------|
| All 3 posts published same day — no narrative arc | Looks fake to hiring managers | 🔴 |
| No inline images in blog body | Can't show screenshots, diagrams, event photos | 🔴 |
| No image collages/galleries | Can't show multi-photo layouts (events, UI grids) | 🔴 |
| Only 3 posts — thin content | Limited interview storytelling material | 🔴 |
| `readTime` null on all posts | Missing metadata on blog list | 🟡 |
| BlogSection shows count badge but all same date | Stale-looking home section | 🟡 |

---

## 3. Feature Requirements

### 3.1 Quick Inline Image System (with Credits)

**Goal:** Easy image insertion inside blog body, with visible credits/captions.

**Sanity Side — Add fields to inline image block:**

File: `studio/schemaTypes/blockContent.ts` (line 56-71)

Add to the inline image array member:
| Field | Type | Purpose |
|-------|------|---------|
| `alt` | string | Alt text (exists) |
| `caption` | string | Display caption below image (exists) |
| `credit` | string | Who took/created the image |
| `source` | string | URL to original source |
| `license` | string | e.g. "CC BY 4.0", "Screenshot by author" |

**Pipeline Side — Preserve images in portableTextToMarkdown():**

File: `portfolio-v1/src/lib/cms-content.server.ts:197` and `portfolio-v1/src/lib/sections/blog.server.ts:11`

```typescript
// Add image handling before the text-only logic:
const imgBlock = block as { _type?: string; asset?: { url?: string }; alt?: string; caption?: string; credit?: string; source?: string; license?: string };
if (imgBlock._type === 'image') {
  const url = buildMediaGatewayUrl(imgBlock.asset?.url || '', { width: 800, sign: true });
  const alt = imgBlock.alt || '';
  const caption = imgBlock.caption || '';
  const credit = imgBlock.credit || '';
  const source = imgBlock.source || '';
  const license = imgBlock.license || '';
  // Pipe-separated metadata after alt text
  lines.push(`![${alt}|${caption}|${credit}|${source}|${license}](${url})`);
  lines.push('');
  continue;
}
```

**Render Side — Custom img component in react-markdown:**

File: `portfolio-v1/src/app/blog/[slug]/BlogPostContent.tsx`

```tsx
img: ({ src, alt }: { src?: string; alt?: string }) => {
  // Parse: "alt|caption|credit|source|license"
  const parts = (alt || '').split('|');
  const [altText, caption, credit, source, license] = parts;
  return (
    <figure className="my-6 space-y-2">
      <Image
        src={src || ''}
        alt={altText || ''}
        width={800}
        height={450}
        className="rounded-lg w-full object-cover border border-border-light dark:border-border-dark"
        unoptimized
      />
      {(caption || credit) && (
        <figcaption className="text-xs text-text-muted-light dark:text-text-muted-dark leading-relaxed px-1">
          {caption && <span>{caption}</span>}
          {credit && <span> — <em>{credit}</em></span>}
          {source && <span> (<a href={source} target="_blank" rel="noopener noreferrer" className="underline hover:text-accent-pink">source</a>)</span>}
          {license && <span className="block text-[10px] opacity-70">{license}</span>}
        </figcaption>
      )}
    </figure>
  );
},
```

**Result:** Editor adds image in Sanity → fills alt, caption, credit → renders beautifully on blog.

### 3.2 Image Collages (Simple Approach)

**Approach: Adjacent-image gallery**

When 2+ images are placed sequentially in Sanity's body with no text or heading between them, they auto-render as a responsive grid.

**Pipeline change:** In `portableTextToMarkdown()`, track image adjacency:

```typescript
// After processing all blocks, collapse adjacent image markers:
// ![img1|...](url1)
// ![img2|...](url2)
// → [gallery:2]![img1|...](url1)![img2|...](url2)[/gallery]
```

**Render side:** Add `CollageGallery` component:

```tsx
// Detects [gallery:N]...[/gallery] pattern in content
// Renders N-column CSS grid with gap
```

**Alternative (even simpler):** Add an `imageGallery` array member to blockContent:

```typescript
defineArrayMember({
  name: 'imageGallery',
  type: 'object',
  title: 'Image Gallery',
  fields: [
    { name: 'images', type: 'array', of: [{ type: 'image', options: { hotspot: true }, fields: [/* alt, caption, credit */] }] },
    { name: 'layout', type: 'string', options: { list: [{ title: '2 Columns', value: '2' }, { title: '3 Columns', value: '3' }] } }
  ]
})
```

### 3.3 Staggered Publishing Timeline

**Backdate existing posts + schedule new ones:**

| Date | Post | Type |
|------|------|------|
| 2025-03-15 | The Day I Wrote My First Line of Code | Origin story |
| 2025-06-20 | Why CS50 Changed How I Think About Problems | Learning journey |
| 2025-09-10 | Building My First Real App: CaseMaster | Project deep-dive |
| 2025-11-05 | From Java Student to Full-Stack Engineer | Skill progression |
| 2026-01-15 | What I Learned Building an AI Chatbot for a Client | Client work |
| 2026-02-28 | **GitGoing:** The Day I Spoke to 1,000+ Students | Milestone |
| 2026-04-10 | How I Automated an Enterprise Workflow with n8n | Technical deep-dive |
| 2026-05-20 | My GPA Isn't the Full Story — Here's What Matters | Reflection |
| 2026-06-05 | **My Experience as a Developer in 2026** | Existing |
| 2026-07-01 | Building the Portfolio You're Reading This On | Technical case study |

### 3.4 Content Themes for Interview Storytelling

| Theme | Posts | Skills Shown |
|-------|-------|-------------|
| **Origin & Motivation** | First code, CS50, why CS | Passion, self-learning |
| **Technical Milestones** | CaseMaster, AI Chatbot, Portfolio | Full-stack, AI, architecture |
| **Leadership** | GitGoing talk, team projects | Communication, leadership |
| **AI & Automation** | Chatbot, n8n, Whisper AI | Modern tech adoption |
| **Career & Growth** | Skills progression, interview, impostor | Self-awareness, growth |

---

## 4. Technical Changes Required

### 4.1 Schema — Inline Image Fields

**File:** `studio/schemaTypes/blockContent.ts` (line 56-71)

Add `credit`, `source`, `license` fields to the image array member:

```typescript
defineArrayMember({
  type: 'image',
  options: { hotspot: true },
  fields: [
    { name: 'alt', type: 'string', title: 'Alternative Text' },
    { name: 'caption', type: 'string', title: 'Caption' },
    { name: 'credit', type: 'string', title: 'Credit / Photographer' },
    { name: 'source', type: 'url', title: 'Source URL' },
    { name: 'license', type: 'string', title: 'License' },
  ],
}),
```

### 4.2 Schema — Image Gallery (Collage)

**File:** `studio/schemaTypes/blockContent.ts`

Add after the image array member:

```typescript
defineArrayMember({
  name: 'imageGallery',
  type: 'object',
  title: 'Image Gallery',
  fields: [
    {
      name: 'images',
      type: 'array',
      of: [{
        type: 'image',
        options: { hotspot: true },
        fields: [
          { name: 'alt', type: 'string', title: 'Alt Text' },
          { name: 'caption', type: 'string', title: 'Caption' },
          { name: 'credit', type: 'string', title: 'Credit' },
        ],
      }],
    },
    {
      name: 'layout',
      type: 'string',
      title: 'Layout',
      options: {
        list: [
          { title: '2 Columns', value: '2col' },
          { title: '3 Columns', value: '3col' },
        ],
      },
    },
  ],
  preview: {
    select: { images: 'images' },
    prepare({ images }: { images?: Array<unknown> }) {
      return { title: `Image Gallery (${images?.length ?? 0} images)` };
    },
  },
}),
```

### 4.3 Pipeline — portableTextToMarkdown()

**Files:**
- `portfolio-v1/src/lib/cms-content.server.ts:197-233`
- `portfolio-v1/src/lib/sections/blog.server.ts:11-47`

Replace both with version that handles:
- `_type === 'image'` → emit `![alt|caption|credit|source|license](url)` (pipe-separated metadata)
- `_type === 'imageGallery'` → emit `[gallery:layout]` + images + `[/gallery]`

### 4.4 Render — BlogPostContent.tsx

**File:** `portfolio-v1/src/app/blog/[slug]/BlogPostContent.tsx`

- Add `img` component handler with metadata parsing
- Add `CollageGallery` component for gallery rendering
- Add custom `p` handler that detects gallery content
- Responsive images with `object-cover`, rounded corners, border

### 4.5 Sanity Data Updates

- Backdate "Hi - Welcome" to 2026-05-20 (make it 2 weeks before the other posts)
- Backdate "GitGoing" to 2026-02-28
- Set `readTime` on all 3 existing posts
- Add inline images to "GitGoing" post (event photos)
- Add inline images to "My Experience" post (screenshots, diagrams)

---

## 5. Recommended Blog Posts

### Phase 1: Foundation (4 new posts)

| # | Title | Est. Words | Suggested Date | Tags |
|---|-------|-----------|----|------|
| 1 | The Day I Wrote My First Line of Code | 800-1200 | 2025-03-15 | c++, learning, origin |
| 2 | Why CS50 Changed How I Think About Problems | 1000-1500 | 2025-06-20 | cs50, learning, algorithms |
| 3 | Building CaseMaster: A Case Management System from Scratch | 1200-1800 | 2025-09-10 | project, java, desktop |
| 4 | From For Loops to Full-Stack: My 2023 Transformation | 1000-1500 | 2025-11-05 | growth, fullstack, journey |

### Phase 2: Depth (4 new posts)

| # | Title | Est. Words | Suggested Date | Tags |
|---|-------|-----------|----|------|
| 5 | How I Built an AI Chatbot for a Real Client | 1500-2000 | 2026-01-15 | ai, chatbot, llm, client-work |
| 6 | What I Learned Automating Enterprise Workflows with n8n | 1200-1800 | 2026-03-20 | n8n, automation, workflow |
| 7 | Building a Portfolio with 278 Tests and a 100/100 Score | 1500-2500 | 2026-05-10 | nextjs, testing, react |
| 8 | Impostor Syndrome at 50+ Repos: A 2026 Reflection | 800-1200 | 2026-07-01 | reflection, impostor, career |

### Phase 3: Ongoing

| # | Title | Est. Words | Suggested Date | Tags |
|---|-------|-----------|----|------|
| 9 | How I Use AI as a Force Multiplier (Without Losing My Edge) | 1200-1800 | 2026-08-15 | ai, productivity, balance |
| 10 | The Architecture Behind This Portfolio's AI Chat | 1500-2500 | 2026-09-28 | ai-chat, architecture, rag |
| 11 | What Hiring Managers Look for in a Junior Dev | 1000-1500 | 2026-11-10 | career, interview, advice |
| 12 | 2026 Year in Review: Ships, Misses, and Lessons | 1200-2000 | 2026-12-28 | reflection, year-in-review |

---

## 6. Image Strategy

### Image Types per Post

| Post | Images Needed | Type |
|------|--------------|------|
| First Line of Code | Screenshot of early code, IDE | Single |
| CS50 | CS50 certificate, David Malan photo | Single |
| CaseMaster | App screenshots (2-3), architecture diagram | Collage |
| For Loops to Full-Stack | Old project screenshots, evolution timeline | Collage |
| AI Chatbot | Chat UI, architecture diagram, metrics | Collage |
| n8n Workflows | Workflow editor screenshot, flow diagram | Single + collage |
| Portfolio Build | Lighthouse score, test results, components | Collage |
| GitGoing | Stage photos, banner, audience (3+ photos) | Collage |
| Impostor Syndrome | GitHub contribution graph, stats | Single |
| AI as Force Multiplier | Comparison screenshots | Single |
| AI Chat Architecture | System diagram, response comparison | Collage |
| Hiring Manager | (minimal images) | — |
| Year in Review | Contribution graph, highlights | Single/collage |

---

## 7. Timeline

| Phase | What | When |
|-------|------|------|
| **Phase 0** | Fix existing: backdate, readTime, inline images | Week 1 |
| **Phase 1** | Dev work: schema, pipeline, render components | Weeks 1-2 |
| **Phase 2** | Write + publish Phase 1 posts (4) | Weeks 3-6 |
| **Phase 3** | Write + publish Phase 2 posts (4) | Weeks 7-10 |
| **Phase 4** | Ongoing cadence — 1 post every 3-4 weeks | Week 11+ |

---

## 8. Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Total blog posts | 3 | 12+ |
| Posts with inline images | 0 | All new + backfilled |
| Posts with image collages | 0 | 4+ |
| Date spread | Same day | 12+ month range |
| readTime set | 0/3 | 100% |
| Cover images | 3/3 | 100% |

---

## 9. Checklist

- [ ] Add `credit`, `source`, `license` to inline image schema
- [ ] Add `imageGallery` collage schema type
- [ ] Update `portableTextToMarkdown()` in `cms-content.server.ts`
- [ ] Update `portableTextToMarkdown()` in `blog.server.ts`
- [ ] Add custom `img` component in `BlogPostContent.tsx`
- [ ] Add `CollageGallery` component
- [ ] Backdate existing Sanity posts
- [ ] Set `readTime` on existing posts
- [ ] Add inline images to existing posts
- [ ] Update fallback data in `cms-content.shared.ts`
- [ ] Write Phase 1 posts in Sanity studio
- [ ] Review and publish

---

*This plan will be converted to `prd.blog-content-strategy.json` for execution tracking.*
