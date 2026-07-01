---
name: add-a-blog-post
description: Creates a new blog post document in the Sanity studio. Use when the user wants to write a blog post, publish an article, or schedule a future post.
---

# Add a Blog Post

Use this skill when the user wants to add a new `post` document. The
post will appear on `/blog` (if published) and at `/blog/[slug]` for
the public.

> **Recommended approach:** For local-first authoring with review before publishing,
> use the `blog-create` skill instead. This skill describes the Sanity Studio workflow
> as a fallback when Studio access is preferred.

## When to use this skill

- Use this when the user says "write a blog post", "publish a post",
  "new article", "draft a post", or "I have a blog idea".
- Use this when the user wants to schedule a post for the future.

## Workflow

1. Direct the user to **Content → Pages → Blog → Posts** in the studio.
2. Click **Create new**.
3. Fill the form with the following fields:
   - **Title** — required. Used in the slug.
   - **Slug** — auto-generated, lowercase + hyphens only.
   - **Excerpt** — 40-280 chars. Used in the blog card and meta
     description.
   - **Body** — rich text (Portable Text). Use the editor's headings,
     lists, and inline marks.
   - **Main image** — required for the blog card. Add alt text
     (4+ chars).
   - **Published at** — date the post went live. Defaults to now.
   - **Publish at** — optional scheduled publish time. Empty = publishes
     immediately.
   - **Published** — toggle to true when ready. The **Stale** badge
     will turn on if not edited in 30+ days.
   - **Featured** — toggles the post to the top of the blog list.
   - **Author** — reference to an Author document.
   - **Categories** — array of references to Category documents.
   - **Tags** — array of free-text strings.
4. **Reading time** is auto-computed from the body word count. The
   user will see it as a read-only field once they have any body
   content.
5. **Open the Presentation tool**, select this post, and confirm the
   blog post page renders.
6. **Publish** — click **Publish** in the top-right. Use **Publish &
   Revalidate** if the marketing site's `/blog` and `/blog/[slug]`
   should refresh.

## Scheduling a post

Set `publishAt` to a future datetime and `published = false`. The
`scheduled-publish` Sanity Function will flip the toggle at that time.

## Common mistakes

- Setting `published = true` while still drafting — the post will
  show on `/blog` immediately.
- Missing alt text on the main image (the SEO inspector will flag
  it).
- Using the same slug as an existing post — the slug validator will
  block it.

## Related

- `schedule-a-blog-post`
- `use-ai-assist` (for writing help)
- `use-status-badges`
- `publish-and-revalidate`
