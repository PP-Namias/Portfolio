---
title: Update the Hero
trigger: "change the hero", "update hero text", "new name in hero"
audience: editors
time: 2 min
---

# Update the Hero

## What this does
Edits the `heroSection` singleton — the top-of-page hero on `/`.

## Steps

1. **Content → Pages → Homepage → Hero Section**.
2. The form opens with these fields:
   - **Full name** — required.
   - **Primary title** — required.
   - **Hero role rotator** — array of strings. Each role rotates in the hero.
   - **Location** — string.
   - **Availability** — radio. `Available` or `Unavailable`.
   - **Primary contact email** — required. Validated email.
   - **Legacy resume URL** — optional fallback. Active resume doc is preferred.
   - **Profile image** — image with hotspot + alt.
   - **Social links** — array. See `add-a-social-link.md`.
3. **Open the Presentation tool** to see your edits live on `https://namias.tech`.
4. **Publish** — the marketing site revalidates on next request.

## Common mistakes
- ❌ Adding a role with leading/trailing spaces (the rotator is space-sensitive).
- ❌ Setting `contactEmail` to a non-email value (validator will block).

## Related skills
- `update-the-about-section.md`
- `use-the-presentation-tool.md`
- `add-a-social-link.md`
