---
name: sync
description: Synchronizes Sanity CMS schemas with the portfolio's Next.js data fetching. Use when modifying content models or updating frontend data queries.
---

# Sync Skill

This skill keeps the data layer (Sanity) and the presentation layer aligned for the portfolio.

## When to use this skill

- Use this when adding or modifying Sanity schemas in `sanity/` or `studio/`.
- Use this when updating data fetching logic or typed content modules in `src/data`.
- Use this to verify that content-driven sections still receive the expected fields.

## How to use it

### 1. Schema updates

- When modifying a schema, check all downstream references in the frontend.
- Update TypeScript types if the data structure changes.

### 2. Data validation

- Ensure that every new Sanity field has a corresponding UI use or is intentionally unused.
- Use the standalone studio to verify that sample content matches the frontend requirements.

## Troubleshooting

- If a query returns `null`, verify the field name in the Sanity schema.
- Ensure that the Sanity dataset (for example, `production`) matches the configured environment variables.
