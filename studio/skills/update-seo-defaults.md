---
title: Update SEO Defaults
trigger: "edit seo", "meta description", "og image"
audience: editors
time: 2 min
---

# Update SEO Defaults

## What this does
Edits the `seoSettings` singleton. Provides the default SEO copy and
Open Graph / Twitter card assets used across the site.

## Steps

1. **Content → Settings → SEO Settings**.
2. Fields:
   - **Site title** — required.
   - **Site description** — required, text area.
   - **Canonical URL** — https URL.
   - **Open Graph image** — image with hotspot.
   - **Twitter image** — image with hotspot.
   - **Noindex** — toggle to hide the site from search engines.
   - **Nofollow** — toggle to disable link-following.
3. **Publish** — used by Next.js metadata API on `/` and `/blog/*`.

## Common mistakes
- ❌ Setting `noindex = true` in production (it will de-list the site).
