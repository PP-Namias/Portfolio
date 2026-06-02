---
title: Add a Project
trigger: "add a new project", "create project", "portfolio project"
audience: editors
time: 3 min
---

# Add a Project

## What this does
Creates a new entry in the `project` collection. It will appear on the
homepage's Projects section, in the `/projects` grid, and (if featured) on
the homepage hero.

## Steps

1. **Open the studio** and click **Content → Pages → Homepage → Projects**.
2. Click **Create new** (top-right of the list).
3. Pick a template:
   - **New project (featured)** — status `completed`, featured = true, current year.
   - **New project (draft)** — status `draft`, featured = false, current year.
4. Fill the form:
   - **Title** — required. Used in the slug, list preview, and OG title.
   - **Slug** — auto-generated from title. Lowercase, hyphens only.
   - **Summary** — 60-320 chars. Used in the project card and SEO description.
   - **Year** — current year by default.
   - **Status** — `completed` (default), `in-progress`, `prototype`, `draft`, `archived`.
   - **Featured** — toggle to show on the homepage.
   - **Featured rank** — lower = appears first. Leave at 0 for unranked.
   - **Role** — your role on the project (e.g. "Sole engineer").
   - **Technologies** — array of strings. Use canonical names ("Next.js", not "nextjs").
   - **Achievements** — array of short bullet points.
   - **Cover image** — required. Use a high-res image (1600x900 min, hotspot enabled).
   - **Live URL** — optional. Required https. Hidden if status is `concept`/`draft`.
   - **Repository URL** — optional. Required https.
5. **Verify the preview** — open the **Presentation** tool (top nav), select this project, and confirm the card looks right.
6. **Publish** — click **Publish** in the top-right. The **Publish & Revalidate** modal will fire the marketing site's webhook.

## Common mistakes
- ❌ Forgetting to set `featured = true` for projects you want on the homepage.
- ❌ Using a year older than the project's completion year.
- ❌ Putting long paragraphs in the `summary` field (use `challenge`/`solution`/`result` instead).

## Related skills
- `update-the-hero.md`
- `use-the-presentation-tool.md`
- `publish-and-revalidate.md`
- `duplicate-a-document.md`
