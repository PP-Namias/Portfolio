---
name: update-the-hero
description: Edits the heroSection singleton in the Sanity studio. Use when the user wants to change the homepage hero copy, name, title, role rotator, or contact email.
---

# Update the Hero

Use this skill when the user wants to edit the `heroSection` singleton
— the top-of-page hero on `/`.

## When to use this skill

- Use this when the user says "change the hero", "update hero text",
  "new name in hero", "change my title", or "swap the role rotator".

## Workflow

1. Direct the user to **Content → Pages → Homepage → Hero Section**.
2. The form opens with these fields:
   - **Full name** — required.
   - **Primary title** — required.
   - **Hero role rotator** — array of strings. Each role rotates in
     the hero.
   - **Location** — string.
   - **Availability** — radio. `Available` or `Unavailable`.
   - **Primary contact email** — required. Validated email.
   - **Legacy resume URL** — optional fallback. Active resume doc is
     preferred.
   - **Profile image** — image with hotspot + alt.
   - **Social links** — array. See `add-a-social-link`.
3. **Open the Presentation tool** to see edits live on
   `https://namias.tech`.
4. **Publish** — the marketing site revalidates on next request.

## Common mistakes

- Adding a role with leading/trailing spaces (the rotator is
  space-sensitive).
- Setting `contactEmail` to a non-email value (validator will block).

## Related

- `update-the-about-section`
- `use-the-presentation-tool`
- `add-a-social-link`
