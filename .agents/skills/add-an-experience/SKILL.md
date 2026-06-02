---
name: add-an-experience
description: Creates a new experience document in the Sanity studio. Use when the user wants to add a job, role, internship, or work history entry to the Experience collection.
---

# Add an Experience

Use this skill when the user wants to add a new `experience` document.
It appears in the homepage's Experience section (and `/#experience`).

## When to use this skill

- Use this when the user says "add a job", "new experience",
  "add a role", "I just started a new position", or "add work history".

## Workflow

1. Direct the user to **Content → Pages → Homepage → Experience** →
   **Create new**.
2. Fill the form with the following fields:
   - **Order** — display order (lower = first).
   - **Role** — required (e.g. "Senior Frontend Engineer").
   - **Company** — required.
   - **Location** — optional (e.g. "Remote" or "Caloocan City,
     Philippines").
   - **Start date** — sortable value. Use `YYYY-MM-DD` for past roles
     or `Present` for current.
   - **End date** — `YYYY-MM-DD` or `Present`.
   - **Computed duration** — auto-fills. Read-only.
   - **Employment type** — `Full-time` / `Part-time` / `Freelance` /
     `Contractual` / `Internship`.
   - **Work model** — `On-site` / `Remote` / `Hybrid`.
   - **Summary** — 40-280 chars.
   - **Featured story** — optional longer narrative.
   - **Highlights** — array of short bullet points.
   - **Achievements** — array of impact statements.
   - **Tags** — array of strings.
   - **Status** — `draft` / `published` / `archived` / `featured` /
     `pinned`.
   - **Images** — optional. Array of images with alt + caption.

## The "Present" trick

Setting `endDate = Present` (case-insensitive) makes the duration
compute to today's date. Used for current roles.

## Common mistakes

- Putting a freeform date like "Last year" — use `YYYY-MM-DD`.
- Setting `startDate` without `endDate` — duration will be blank.

## Related

- `use-the-presentation-tool`
- `use-status-badges`
