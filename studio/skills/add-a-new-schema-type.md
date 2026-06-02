---
title: Add a New Schema Type
trigger: "schema", "new type", "document type"
audience: devs
time: 10 min
---

# Add a New Schema Type

## Steps

1. **Create the schema file** under `studio/schemaTypes/<name>.ts`:
   ```ts
   import {defineField, defineType} from 'sanity'

   export const testimonial = defineType({
     name: 'testimonial',
     title: 'Testimonial',
     type: 'document',
     fields: [
       defineField({name: 'quote', type: 'text', validation: (r) => r.required()}),
       defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
     ],
     preview: {
       select: {title: 'name', subtitle: 'quote'},
     },
   })
   ```

2. **Register** in `studio/schemaTypes/index.ts`:
   ```ts
   export const schemaTypes = [/* ...existing... */, testimonial]
   ```

3. **Register metadata** in `studio/schemaTypes/_registry.ts`:
   ```ts
   const DOCUMENT_META = [
     /* ...existing... */
     {name: 'testimonial', title: 'Testimonial', kind: 'collection', previewable: true},
   ]
   ```

4. **Add to structure** in `sanity.config.ts` (under the appropriate
   Page group).

5. **Add a preview location** in `studio/preview/previewLocations.ts`:
   ```ts
   testimonial: defineLocations({
     locations: [{title: 'Testimonials', href: '/#testimonials'}],
   }),
   ```

6. **Typecheck + deploy**:
   ```bash
   cd studio
   npx tsc --noEmit
   npm run deploy
   ```

## Pitfalls
- Schema names are immutable after first deploy. Renaming breaks
  data.
- Adding a required field to an existing type requires a migration
  or `initialValue: () => null`.
