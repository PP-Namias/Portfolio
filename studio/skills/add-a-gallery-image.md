---
title: Add a Gallery Image
trigger: "upload gallery image", "add photo"
audience: editors
time: 2 min
---

# Add a Gallery Image

## Steps

1. **Content → Pages → Homepage → Gallery** → **Create new**.
2. Fields:
   - **Title** — required.
   - **Media type** — `image` / `video` / `embed`.
   - **Category** — reference to a `galleryCategory`.
   - **Captured at** — date.
   - **Alt text** — required for accessibility.
   - **Tags** — array of strings.
   - **Media path** — string (for video/embed).
   - **Image** — required, image with hotspot + alt.
3. **Order** in the form is display order (lower = first).
4. **Publish** — appears on `/#gallery`.

## Common mistakes
- ❌ Leaving alt text empty (the **Content Health** inspector will flag it).
