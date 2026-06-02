---
title: Add an Experience
trigger: "add job", "new experience", "work history"
audience: editors
time: 3 min
---

# Add an Experience

## What this does
Creates an `experience` document. It appears in the homepage's Experience
section (and `/#experience`).

## Steps

1. **Content → Pages → Homepage → Experience** → **Create new**.
2. Fill the form:
   - **Order** — display order (lower = first).
   - **Role** — required (e.g. "Senior Frontend Engineer").
   - **Company** — required.
   - **Location** — optional (e.g. "Remote" or "Caloocan City, Philippines").
   - **Start date** — sortable value. Use `YYYY-MM-DD` for past roles or `Present` for current.
   - **End date** — `YYYY-MM-DD` or `Present`.
   - **Computed duration** — auto-fills. Read-only.
   - **Employment type** — `Full-time` / `Part-time` / `Freelance` / `Contractual` / `Internship`.
   - **Work model** — `On-site` / `Remote` / `Hybrid`.
   - **Summary** — 40-280 chars.
   - **Featured story** — optional longer narrative.
   - **Highlights** — array of short bullet points.
   - **Achievements** — array of impact statements.
   - **Tags** — array of strings.
   - **Status** — `draft` / `published` / `archived` / `featured` / `pinned`.
   - **Images** — optional. Array of images with alt + caption.

## The "Present" trick
Setting `endDate = Present` (case-insensitive) makes the duration compute
to today's date. Used for current roles.

## Common mistakes
- ❌ Putting a freeform date like "Last year" — use `YYYY-MM-DD`.
- ❌ Setting `startDate` without `endDate` — duration will be blank.

## Related skills
- `use-the-presentation-tool.md`
- `use-status-badges.md`
