---
title: Add a Preview Location
trigger: "preview location", "presentation", "live url"
audience: devs
time: 5 min
---

# Add a Preview Location

## What it does
A preview location maps a Sanity document to a URL on the marketing
site. The Presentation tool uses this for click-to-edit and the
preview iframe.

## Steps

1. **Open** `studio/preview/previewLocations.ts`.

2. **Add a location** for the new type:
   ```ts
   import {defineLocations} from 'sanity/presentation'

   export const previewLocations = {
     /* ...existing... */
     testimonial: defineLocations({
       locations: [
         {title: 'Homepage testimonials', href: '/#testimonials'},
       ],
     }),
   }
   ```

3. **Register** in `sanity.config.ts`:
   ```ts
   presentationTool({
     preview: {
       locations: previewLocations,
     },
   })
   ```

4. **Use a dynamic URL** (e.g. blog post by slug):
   ```ts
   blogPost: defineLocations({
     select: {title: 'title', slug: 'slug.current'},
     resolve: (doc) => ({
       locations: [
         {title: doc?.title ?? 'Untitled', href: `/blog/${doc?.slug ?? ''}`},
       ],
     }),
   }),
   ```

5. **Deploy** the studio. Open the Presentation tool and verify
   the location appears in the dropdown.
