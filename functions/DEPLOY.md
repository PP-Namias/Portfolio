# Sanity Functions

Server-side functions for the Namias CMS showcase. They run on the Sanity platform in response to document mutations, image asset events, or on a cron schedule.

## Functions

| Folder | Trigger | Purpose |
|---|---|---|
| `scheduled-publish/` | scheduled (every 5 min, `*/5 * * * *`) | Promotes `post` and `project` documents whose `publishAt` is in the past. |
| `broken-refs/` | scheduled (every 6h, `0 */6 * * *`) | Scans every document for references to missing documents and patches a `brokenRefsCount` onto the parent. |
| `auto-tag-images/` | `image-asset.create` | Calls an image-tagging service and patches the asset's `metadata.labels`. |

## One-command deploy

From the `functions/` directory:

```bash
cd functions
npm install
npm run deploy
```

That command:
1. Resolves the latest Sanity CLI (`sanity@latest`).
2. Reads the manifest at `sanity.blueprint.ts`.
3. Bundles and uploads each function with its trigger and env.
4. Waits for the deployment to complete.

## Manual deploy (advanced)

```bash
cd functions
npx sanity@latest blueprints plan   # preview resources
npx sanity@latest blueprints deploy # upload + activate
npx sanity@latest blueprints logs   # tail logs
npx sanity@latest blueprints info   # show stack id + region
```

## Local test (no deploy)

```bash
cd functions
npm run test:scheduled-publish
npm run test:broken-refs
npm run test:auto-tag-images
```

Each test uses a synthetic payload and runs the handler in-process. The `test:scheduled-publish` and `test:broken-refs` runs will hit the live dataset; use them sparingly.

## Required env

The blueprint manifest declares two required env keys per function:

- `SANITY_STUDIO_PROJECT_ID` - baked in as `nl0qw78w`.
- `SANITY_STUDIO_DATASET` - baked in as `production`.
- `SANITY_API_WRITE_TOKEN` - a write token, set once via `npx sanity@latest blueprints env add <name> SANITY_API_WRITE_TOKEN <token>`. After the first set, the platform stores it encrypted.

## After deploy

1. Open the Sanity manage UI at `https://www.sanity.io/manage/project/nl0qw78w/functions`.
2. Confirm three functions are listed: `scheduled-publish`, `broken-refs`, `auto-tag-images`.
3. Click into each and check the **Invocations** tab.
4. To force a `scheduled-publish` run, edit any `post` or `project` and set `publishAt` to 1 minute in the past, then wait for the next 5-minute tick.
5. To force `broken-refs`, delete a referenced document, then wait for the next 6-hour tick (or click **Invoke now** in the manage UI).
6. To force `auto-tag-images`, upload any image via the studio or the manage UI; the function fires on `imageAsset.create`.
