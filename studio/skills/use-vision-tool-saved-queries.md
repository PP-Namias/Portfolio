---
title: Use Vision Tool Saved Queries
trigger: "vision tool", "groq query", "saved query"
audience: editors, devs
time: 3 min
---

# Use Vision Tool Saved Queries

## What it does
The Vision tool lets you run GROQ queries against the dataset. We
ship 5 opinionated saved queries:

- **Site health** — counts of every document type, last-edited dates.
- **Stale content** — documents not updated in 30+ days.
- **Broken references** — references to non-existent documents.
- **Expiring certifications** — within 90 days of expiry.
- **Featured coverage** — which projects/posts are marked featured.

## Steps

1. **Open the tool** — click **Vision** in the top nav.
2. **Left panel** shows the saved queries. Click one to insert it into
   the editor.
3. **Run** — Ctrl/Cmd + Enter.
4. **Inspect** the JSON result.

## Writing your own
Type a new query in the editor. The tool auto-completes `*[_type == "..."]`.

## Related skills
- `add-a-vision-query.md`
- `add-a-saved-vision-query.md`
