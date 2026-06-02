---
title: Add an Initial-Value Template
trigger: "template", "initial value", "new document"
audience: devs
time: 5 min
---

# Add an Initial-Value Template

## What it does
Templates pre-fill a new document. The studio shows them as
quick-create options in the list view header.

## Steps

1. **Open** `studio/templates/index.ts`.

2. **Add a new template** to the `templateRegistry`:
   ```ts
   import type {Template} from 'sanity'

   export const templateRegistry: Template[] = [
     /* ...existing... */
     {
       id: 'recommendation-internal',
       title: 'Recommendation (internal)',
       description: 'A reference from a colleague.',
       schemaType: 'recommendation',
       value: {kind: 'internal', visibility: 'private'},
     },
   ]
   ```

3. **Verify** the template appears in the document list's
   **Create new** dropdown.

## Template value fields
Anything you set in `value` becomes the document's `initialValue`.
Use it to:
- Set defaults (`status: 'draft'`, `featured: false`).
- Seed derived fields (`publishedAt: () => new Date().toISOString()`).
- Wire relationships (`author: () => authorClient.current()`).

## Conditional fields
Combine with `hidden` / `readOnly` in the schema to hide fields
that are filled in by the template.
