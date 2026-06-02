---
title: Update the About Section
trigger: "edit about", "about copy", "education section"
audience: editors
time: 2 min
---

# Update the About Section

## What this does
Edits the `aboutSection` singleton. Renders on `/` and at `/#about`.

## Steps

1. **Content → Pages → Homepage → About Section**.
2. Fields:
   - **About content** — Portable Text block content. The primary "About" paragraph.
   - **About paragraphs (legacy)** — hidden by default. Use the new "About content" field instead.
   - **Education** — single object:
     - Degree
     - School
     - Location
     - Period
     - Highlights (array of strings)
3. **Open the Presentation tool** to verify the rendered output.
4. **Publish** to push live.

## Common mistakes
- ❌ Adding an image to the legacy `aboutParagraphs` field — the new field doesn't support inline images.

## Related skills
- `update-the-hero.md`
- `use-the-presentation-tool.md`
