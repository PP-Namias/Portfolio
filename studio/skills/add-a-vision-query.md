---
title: Add a Vision Query
trigger: "vision tool", "groq", "query"
audience: devs
time: 5 min
---

# Add a Vision Query

## Steps

1. **Open** `studio/vision/queries.ts` (created during the
   restructure).

2. **Add the query** to the registry:
   ```ts
   export const visionQueries = {
     siteHealth: {
       title: 'Site health',
       description: 'Count of every document type + last edited.',
       query: /* groq */ `
         *[_type in [
           "project", "post", "certification", "experience",
           "membership", "recommendation", "galleryImage"
         ]] | order(_updatedAt desc) {
           _type,
           _id,
           title,
           "updatedAt": _updatedAt,
           "slug": slug.current,
         }
       `,
     },
   }
   ```

3. **Wire it into the Vision tool** via a custom landing component
   (see `studio/vision/VisionLanding.tsx`).

## Tips
- Use the GROQ cheat sheet (Vision → Help) for projection syntax.
- The marketing site reads `published == true` only; the studio
  reads everything.
- Test with `studio/env.ts` `getStudioEnvSnapshot().dataset` to
  confirm the dataset name.
