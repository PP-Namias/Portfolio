---
title: Publish and Revalidate
trigger: "publish and revalidate", "webhook", "revalidate"
audience: editors, devs
time: 2 min
---

# Publish and Revalidate

## What it does
The **Publish & Revalidate** action replaces the default **Publish**
button. After the doc is published to Sanity, it POSTs to
`https://namias.tech/api/sanity/webhook` which calls Next.js's
`revalidatePath` for the affected routes.

## When to use it
- After editing **any singleton** (hero, about, site settings) — the
  homepage is affected.
- After editing a **project** — the `/` and `/projects/*` routes
  are affected.
- After editing a **post** — `/blog` and `/blog/[slug]` are
  affected.

## When NOT to use it
- Reference data (categories, issuers) — no marketing-side render
  to revalidate.
- Drafts — the marketing site reads `published` perspective only.

## How to verify
After clicking **Publish & Revalidate**, the toast will say
"Published + Webhook triggered". Check the response code (200 = OK).
