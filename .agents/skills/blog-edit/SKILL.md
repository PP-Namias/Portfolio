---
name: blog-edit
description: Edits an existing blog post's content or metadata in local MD files. Use when the user wants to modify, update, or improve a blog post.
---

# Edit a Blog Post

Use this skill when the user wants to edit an existing blog post stored as a local Markdown file in `content/blog/`.

## When to use this skill

- "edit my blog post about...", "update the post on..."
- "change the title/excerpt/tags of...", "fix the content in..."
- "improve the writing in...", "rewrite the intro of..."
- "add a section to...", "remove the paragraph about..."
- "make the post about... more detailed"

## Workflow

1. **Find the post** — search `content/blog/` by slug or title keyword:

   ```bash
   grep -rl "{keyword}" content/blog/
   ```

   Or list all posts and ask the user to pick.

2. **Read the current file** — parse frontmatter and body:

   ```bash
   cat content/blog/{slug}.md
   ```

3. **Apply the edit** — modify the requested part:
   - **Body changes**: edit the Markdown content directly
   - **Frontmatter changes**: update the YAML fields (title, excerpt, tags, published, etc.)
   - **Structure changes**: add/remove/reorder sections

4. **Validate** — ensure:
   - Frontmatter is still valid YAML
   - Required fields are present (title, slug, excerpt, publishedAt, author, tags)
   - Excerpt is 10-300 characters
   - Slug hasn't changed (unless explicitly requested)

5. **Write the updated file** — save changes.

6. **Confirm** — show what changed (diff summary).

## Edit targets

### Body content

- Add, remove, or modify paragraphs
- Add sections with `##` headings
- Fix typos and grammar
- Improve clarity and flow

### Frontmatter metadata

- `title` — change the post title
- `excerpt` — update the summary
- `tags` — add or remove tags
- `featured` — toggle featured status
- `published` — toggle publish status
- `publishedAt` — change the publication date
- `coverImage` — set or update the cover image path

## Important rules

- **Never change the slug** unless the user explicitly asks and understands the URL implications
- **Always show the diff** after editing so the user can review
- **Preserve existing frontmatter** — only change what was requested
- **Keep the Markdown body clean** — no unnecessary formatting changes

## Example

```
User: "Update the excerpt of my Cloudflare deployment post to mention Workers"
Agent:
  1. Reads content/blog/deploying-nextjs-to-cloudflare.md
  2. Updates excerpt field to include "Cloudflare Workers"
  3. Shows the before/after diff
  4. Confirms the file was updated
```
