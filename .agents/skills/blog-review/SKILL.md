---
name: blog-review
description: Reviews all blog posts, shows sync status, and validates content. Use when the user wants to see what posts exist, their publish status, or what's changed.
---

# Review Blog Posts

Use this skill when the user wants to review their blog content — see what posts exist, their status, and what needs attention.

## When to use this skill

- "show me all my blog posts", "what posts do I have"
- "review my blog", "check my blog content"
- "what's the status of my posts", "what needs to be published"
- "compare local vs Sanity", "what's different"
- "validate my blog files"

## Workflow

### 1. List all local posts

```bash
ls content/blog/*.md
```

For each file, show:

| Field     | Value            |
| --------- | ---------------- |
| Title     | from frontmatter |
| Slug      | from filename    |
| Published | true/false       |
| Date      | publishedAt      |
| Tags      | from frontmatter |
| Excerpt   | first 80 chars   |

### 2. Show sync status

Run the diff script:

```bash
npm run blog:diff
```

This shows:

- `IN-SYNC` — local matches Sanity
- `MODIFIED` — local or Sanity has changed
- `NEW LOCAL` — exists locally but not in Sanity
- `NEW REMOTE` — exists in Sanity but not locally

### 3. Validate frontmatter

For each post, check:

- Required fields present: title, slug, excerpt, publishedAt, author, tags
- Excerpt length: 10-300 characters
- Slug format: lowercase, hyphens only
- publishedAt is valid ISO datetime
- tags is a non-empty array

### 4. Show summary

```
Blog Content Summary
====================
Total posts:     12
Published:        8
Drafts:           4
In sync:          6
Modified:         3
New local:        2
New remote:       1

Validation errors: 0
```

### 5. Highlight issues

Flag any problems:

- Posts with missing required fields
- Posts with very short excerpts (< 50 chars)
- Posts with no tags
- Posts that are drafts but look ready to publish
- Posts that exist in one place but not the other

## Output format

Present results in a clean table format. Use markdown tables for readability.

```
| # | Title | Status | Published | Tags | Sync |
|---|-------|--------|-----------|------|------|
| 1 | Hello World | draft | No | webdev, intro | IN-SYNC |
| 2 | Cloudflare Deploy | published | Yes | nextjs, cf | MODIFIED |
```
