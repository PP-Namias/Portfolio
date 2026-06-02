---
title: Update Site Settings
trigger: "site settings", "global copy", "footer text"
audience: editors
time: 3 min
---

# Update Site Settings

## What this does
Edits the `siteSettings` singleton. Controls global copy: section titles,
hero action labels, footer, blog, announcement banner, empty states.

## Steps

1. **Content → Pages → Homepage → Site Settings**.
2. The form has nested objects for each section. **Open the Presentation tool** before editing to see the impact live.
3. Field map:
   - **About / Experience / Projects / Certifications / Gallery / Contact section** — each has `title` and `subtitle`.
   - **Hero actions** — `resumeLabel`, `scheduleLabel`, `emailLabel`.
   - **Contact actions** — `scheduleLabel`, `emailLabel`.
   - **Footer** — `leadText`, `linkLabel`, `copyright`, `backToPortfolioLabel`, `contactPrompt`.
   - **Blog** — `title`, `description`, `backLabel`.
   - **Announcement banner** — `enabled`, `message`, `linkLabel`, `linkUrl`.
   - **Empty states** — `projects`, `blog`, `testimonials`.

## Common mistakes
- ❌ Leaving the announcement banner `enabled = true` after a campaign ends.

## Related skills
- `update-the-hero.md`
- `update-seo-defaults.md`
