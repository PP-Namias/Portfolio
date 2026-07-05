# Blog Content Directory

This directory contains all blog posts as local Markdown files with YAML frontmatter.

## Structure

```
content/blog/
  my-post-slug.md
  another-post.md
```

## File Format

Each file follows this structure:

```markdown
---
title: My Post Title
slug: my-post-slug
excerpt: A brief summary of the post (10-300 chars).
metaTitle: SEO title (optional, max 70 chars)
metaDescription: SEO description (optional, max 160 chars)
featured: false
readTime: 5 min read
publishedAt: 2026-07-02T00:00:00Z
publishAt: 2026-07-02T00:00:00Z
published: false
author: PP Namias
categories:
  - Technology
tags:
  - webdev
  - portfolio
coverImage: /path/to/image.jpg
sourceId: external-source-id
---

Your blog post content goes here. This is Markdown with GFM support.

- Tables
- Task lists
- Fenced code blocks
- And more
```

## Required Frontmatter Fields

| Field         | Type         | Description                        |
| ------------- | ------------ | ---------------------------------- |
| `title`       | string       | Post title                         |
| `slug`        | string       | URL slug (lowercase, hyphens only) |
| `excerpt`     | string       | Post summary (10-300 chars)        |
| `publishedAt` | ISO datetime | Publication date                   |
| `published`   | boolean      | Whether the post is published      |
| `author`      | string       | Author name                        |
| `tags`        | string[]     | At least one tag                   |

## Workflow

1. Create a new post: use the `blog-create` skill or write manually
2. Edit content: modify the Markdown body or frontmatter
3. Review: use `blog-review` to check status
4. Sync: use `blog-sync` to push to Sanity CMS
5. Publish: use `blog-publish` to mark as published and go live

## Commands

```bash
npm run blog:diff     # Compare local vs Sanity
npm run blog:pull     # Pull from Sanity to local
npm run blog:push     # Push local to Sanity (dry-run)
npm run blog:sync     # Interactive sync
npm run blog:import   # One-time import from Sanity
```
