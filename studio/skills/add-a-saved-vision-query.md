---
title: Add a Saved Vision Query
trigger: "saved query", "vision tool", "preset"
audience: devs
time: 3 min
---

# Add a Saved Vision Query

A saved Vision query is a named preset accessible from the Vision
tool landing. Use them for queries you run often (audit, cleanup,
content health).

## Steps

1. **Open** `studio/vision/queries.ts`.
2. **Add a new entry** to `visionQueries`:
   ```ts
   staleContent: {
     title: 'Stale content',
     description: 'Documents not updated in 30+ days.',
     query: /* groq */ `
       *[_type in ["post", "project", "certification"]
         && _updatedAt < now() - 60*60*24*30] {
         _id, _type, title, _updatedAt
       }
     `,
   },
   ```
3. The Vision landing component auto-discovers all entries and
   renders them as cards. No further wiring needed.

## To remove a saved query
Delete the entry from `visionQueries`. No data impact.
