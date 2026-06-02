---
title: Schedule a Blog Post
trigger: "schedule post", "future publish"
audience: editors
time: 1 min
---

# Schedule a Blog Post

## Steps

1. Open or create the post.
2. Fill the body. **Do not set `published = true` yet.**
3. Set `publishAt` to the future datetime.
4. Click **Publish** (the **Publish & Revalidate** modal is fine too).
5. The `scheduled-publish` Sanity Function fires at `publishAt` and
   flips `published = true`. The post appears on `/blog` automatically.

## Verify the schedule
- The document will show a blue **Scheduled ...** badge.
- After `publishAt`, the badge disappears and a green **Live** badge
  appears.

## Cancel the schedule
- Set `publishAt` to empty.
- Set `published = true` (publish now) OR leave `published = false`
  (keeps as draft).
