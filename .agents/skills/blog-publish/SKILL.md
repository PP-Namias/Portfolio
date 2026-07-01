---
name: blog-publish
description: Publishes a blog post by marking it as published and syncing to Sanity. Use when the user wants to make a post live on the site.
---

# Publish a Blog Post

Use this skill when the user wants to make a specific blog post live on the site.

## When to use this skill

- "publish this post", "make this live"
- "push this to production", "release this article"
- "flip the published flag", "take this draft live"

## Workflow

1. **Find the post** — by slug or title:

   ```bash
   grep -rl "{keyword}" content/blog/
   ```

2. **Show the post content** — display the full post for final review:
   - Frontmatter summary (title, tags, date)
   - Full body content

3. **Confirm publication** — ask the user:
   - "Ready to publish '{title}'?"
   - "This will make it visible at /blog/{slug}"

4. **Update frontmatter** — set:

   ```yaml
   published: true
   publishedAt: '{current ISO datetime}'
   ```

5. **Sync to Sanity** — push just this one post:

   ```bash
   node scripts/blog-sync.mjs --push --force
   ```

6. **Verify** — check the post appears on the live site:

   ```bash
   curl -s https://namias.tech/blog/{slug} | head -20
   ```

7. **Confirm** — tell the user:
   - Post is live at `https://namias.tech/blog/{slug}`
   - Published at the current datetime
   - Visible on the blog listing page

## Before publishing checklist

- [ ] Content is final and proofread
- [ ] Excerpt is compelling (10-300 chars)
- [ ] Tags are relevant (at least 1)
- [ ] publishedAt date is correct
- [ ] No placeholder text remaining
- [ ] Links are valid
- [ ] Code blocks have proper syntax highlighting

## Batch publishing

To publish multiple posts at once:

1. List the posts to publish
2. Update all frontmatter to `published: true`
3. Run `npm run blog:push --force`
4. Report all published posts

## Unpublishing

To unpublish a post:

1. Set `published: false` in frontmatter
2. Sync to Sanity
3. The post will no longer appear on /blog but the Sanity document remains
