---
title: Add a Sanity Function
trigger: "sanity function", "blueprint", "scheduled function"
audience: devs
time: 10 min
---

# Add a Sanity Function

## Steps

1. **Pick the trigger**: `document` / `scheduled` / `imageAsset` (only
   the first two are exposed in `@sanity/functions` v1.3; for assets,
   use a `document` event on `sanity.imageAsset`).

2. **Add the function file** under `functions/<name>/index.ts`:
   ```ts
   import {createClient} from '@sanity/client'
   import {documentEventHandler} from '@sanity/functions'

   export const handler = documentEventHandler(async ({context, event}) => {
     const client = createClient({
       ...context.clientOptions,
       apiVersion: '2026-02-19',
       useCdn: false,
     })
     await client
       .patch(event.data._id)
       .set({/* ... */})
       .commit()
   })
   ```

3. **Register the function** in `functions/sanity.blueprint.ts`:
   ```ts
   import {defineFunction} from '@sanity/functions'
   export const myFunction = defineFunction({
     name: 'my-function',
     trigger: {type: 'document', documentTypes: ['post']},
     handler: './functions/my-function/index.ts',
   })
   ```

4. **Install deps**:
   ```bash
   cd functions
   npm install
   ```

5. **Set the env var**:
   ```bash
   npx sanity@latest blueprints env add my-function SANITY_API_WRITE_TOKEN <token>
   ```

6. **Deploy**:
   ```bash
   npm run deploy
   ```

7. **Test locally**:
   ```bash
   npx sanity@latest functions test my-function
   ```

## What we already have
- `functions/scheduled-publish/` — flips `published = true` at `publishAt`.
- `functions/broken-refs/` — counts broken refs every 6 hours.
- `functions/auto-tag-images/` — runs on `sanity.imageAsset` mutation
  (stub; replace `tagImage` with your CV model).
