---
title: Use the Presentation Tool
trigger: "presentation tool", "live preview", "visual editing", "click to edit"
audience: editors, devs
time: 5 min
---

# Use the Presentation Tool

## What it does
The Presentation tool is a side-by-side editor + live preview. Edit on
the left, see the live `https://namias.tech` on the right, click any
text on the live site to jump to that field in the studio.

## Steps

1. **Open the tool** — click **Presentation** in the top nav.
2. **Pick a document** from the left panel. The right panel loads
   `https://namias.tech/[resolved-path]` and shows the studio in the
   left.
3. **Edit a field** in the studio. The right panel re-renders within
   ~500ms.
4. **Click-to-edit** — click any element on the live site. The studio
   highlights the corresponding field in the left panel.
5. **Switch perspectives** — use the **Perspective** action (top-right
   of the document) to toggle between Published / Drafts / PreviewDrafts.

## Why it's better than the regular editor
- You see the rendered output, not the raw form.
- You can confirm visual changes immediately.
- You can verify copy on a phone-sized iframe (drag the divider).

## Common mistakes
- ❌ Trying to edit `blockContent` inline in the iframe — the click-to-edit
   jumps to the field, but you'll still need the form editor.
- ❌ Refreshing the iframe manually — the **Reload** button in the tool
   header does the right thing (preserves the document selection).
