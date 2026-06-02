---
title: Use Status Badges
trigger: "status badge", "live", "draft", "scheduled", "stale", "expiring"
audience: editors
time: 2 min
---

# Use Status Badges

## What it does
Every document shows a status badge near the title. The badge tells
you if the doc is `Draft`, `Live`, `Scheduled`, `Featured`, `Stale`,
or `Expiring soon`.

## Badge meanings

| Badge | Color | Meaning |
|-------|-------|---------|
| `Draft` | gray | Document has not been published yet. |
| `Live` | green | Document is published and visible on the site. |
| `Scheduled ...` | blue | Will publish automatically at `publishAt`. |
| `Featured` | pink | Document is featured on the homepage. |
| `Stale` | yellow | Document has not been updated in 30+ days. |
| `Expiring soon` | red | Certification expires within 90 days. |

## How to fix Stale content
Open the doc, make any edit, click **Publish**. The Stale badge
disappears.

## How to fix Expiring soon
Open the cert, update `expiresAt` or toggle `neverExpires`. Publish.

## Related skills
- `fix-stale-content.md`
- `fix-expiring-certification.md`
