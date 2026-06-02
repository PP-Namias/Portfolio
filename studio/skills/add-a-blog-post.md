---
title: Add a Blog Post
trigger: "write a blog post", "publish post", "new article"
audience: editors
time: 5 min
---

# Add a Blog Post

## What this does
Creates a new `post` document. The post will appear on `/blog` (if
published) and at `/blog/[slug]` for the public.

## Steps

1. **Open the studio** and click **Content → Pages → Blog → Posts**.
2. Click **Create new**.
3. Fill the form:
   - **Title** — required. Used in the slug.
   - **Slug** — auto-generated, lowercase + hyphens only.
   - **Excerpt** — 40-280 chars. Used in the blog card and meta description.
   - **Body** — rich text (Portable Text). Use the editor's headings, lists, and inline marks.
   - **Main image** — required for the blog card. Add alt text (4+ chars).
   - **Published at** — date the post went live. Defaults to now.
   - **Publish at** — optional scheduled publish time. Empty = publishes immediately.
   - **Published** — toggle to true when ready. The **Stale** badge will turn on if not edited in 30+ days.
   - **Featured** — toggles the post to the top of the blog list.
   - **Author** — reference to an Author document.
   - **Categories** — array of references to Category documents.
   - **Tags** — array of free-text strings.
4. **Reading time** is auto-computed from the body word count. You'll see it as a read-only field once you have any body content.
5. **Open the Presentation tool**, select this post, and confirm the blog post page renders.
6. **Publish** — click **Publish** in the top-right. Use **Publish & Revalidate** if you want the marketing site's `/blog` and `/blog/[slug]` to refresh.

## Scheduling a post
Set `publishAt` to a future datetime and `published = false`. The
`scheduled-publish` Sanity Function will flip the toggle at that time.

## Common mistakes
- ❌ Setting `published = true` while still drafting — the post will show on `/blog` immediately.
- ❌ Missing alt text on the main image (the SEO inspector will flag it).
- ❌ Using the same slug as an existing post — the slug validator will block it.

## Related skills
- `schedule-a-blog-post.md`
- `use-ai-assist.md` (for writing help)
- `use-status-badges.md`
- `publish-and-revalidate.md`
