---
title: Update Tech Stack
trigger: "add a tech", "new technology", "skill list"
audience: editors
time: 2 min
---

# Update Tech Stack

## What this does
Edits the `techStack` singleton. Renders on `/` in the tech stack section.

## Steps

1. **Content → Pages → Homepage → Tech Stack**.
2. The form has a single array of objects:
   - **Name** — required (e.g. "Next.js").
   - **Logo** — required. Use a short string identifier (resolved by the marketing site from a static map; supported: "nextjs", "react", "typescript", "tailwind", "sanity", "cloudflare", "postgres", "node", "python", "openai", "vercel", "github").
   - **Category** — required. One of: "Frontend", "Backend", "Database", "DevOps", "AI/ML", "Tools".
   - **Proficiency** — required. Number 0-100.
3. **Order** in the form is the order displayed on the site.
4. **Publish** to push.

## Common mistakes
- ❌ Using an unsupported logo string — the marketing site falls back to a generic icon.

## Related skills
- `update-the-hero.md`
