---
name: blog-create
description: Creates a new blog post as a local Markdown file with YAML frontmatter in content/blog/. Use when the user wants to write, draft, or create a new blog post.
---

# Create a Blog Post

Use this skill when the user wants to create a new blog post as a local Markdown file. The post will live in `content/blog/{slug}.md` and can be synced to Sanity CMS later.

## When to use this skill

- "write a blog post", "create a new post", "draft a blog article"
- "add a post to the blog", "new blog entry"
- "I want to write about...", "help me draft a post"

## Workflow

1. **Ask for the title** — derive a slug from it (lowercase, hyphens, no special chars).
2. **Ask for topic/tags** — at least one tag is required.
3. **Generate the MD file** at `content/blog/{slug}.md` with this frontmatter template:

```yaml
---
title: '{title}'
slug: '{slug}'
excerpt: '{10-300 char summary}'
featured: false
publishedAt: '{ISO datetime, default: now}'
published: false
author: 'PP Namias'
categories: []
tags: [{ tag1 }, { tag2 }]
---
```

4. **Write the body** — start with a solid intro paragraph. Use GFM markdown:
   - `##` for main sections (not `#` — that's reserved for the title)
   - `-` for bullet lists
   - ` ```lang ` for code blocks
   - `**bold**` and `*italic*` for emphasis
   - `[text](url)` for links

5. **Confirm** — show the user the file path and frontmatter summary.

## Required frontmatter fields

| Field         | Type         | Default                     |
| ------------- | ------------ | --------------------------- |
| `title`       | string       | (ask)                       |
| `slug`        | string       | derived from title          |
| `excerpt`     | string       | (ask or generate from body) |
| `publishedAt` | ISO datetime | `new Date().toISOString()`  |
| `published`   | boolean      | `false`                     |
| `author`      | string       | `"PP Namias"`               |
| `tags`        | string[]     | (ask)                       |

## Optional frontmatter fields

| Field             | Type     | Default         |
| ----------------- | -------- | --------------- |
| `metaTitle`       | string   | same as title   |
| `metaDescription` | string   | same as excerpt |
| `featured`        | boolean  | `false`         |
| `readTime`        | string   | auto-estimate   |
| `coverImage`      | string   | undefined       |
| `categories`      | string[] | `[]`            |

## Post is created as draft

The post is created with `published: false`. It will NOT appear on the live site until:

1. The user reviews it with `blog-review`
2. The user syncs it with `blog-sync --push`
3. The user publishes it with `blog-publish`

## Example

```
User: "Write a blog post about deploying Next.js to Cloudflare"
Agent: Creates content/blog/deploying-nextjs-to-cloudflare.md with:
  title: "Deploying Next.js to Cloudflare"
  slug: "deploying-nextjs-to-cloudflare"
  tags: ["nextjs", "cloudflare", "deployment"]
  published: false
  Body: Full blog post content
```
