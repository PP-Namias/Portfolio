# Sanity Functions

Server-side functions that run on the Sanity platform in response to document mutations or on a schedule. These power the "intelligence" beat of the showcase: scheduled publishing, broken-reference detection, and image auto-tagging.

## Functions

| Folder | Trigger | Purpose |
|---|---|---|
| `scheduled-publish/` | scheduled (every 5 min) | Promotes posts and projects whose `publishAt` is in the past. |
| `broken-refs/` | scheduled (every 6h) | Scans for references to missing documents and patches a `brokenRefsCount` onto the parent. |
| `auto-tag-images/` | `sanity.imageAsset.create` | Calls an image-tagging API and patches `asset.metadata.labels`. |

## Deploy

```bash
cd functions
npm install
npm run deploy:all
```

## Required env

- `SANITY_STUDIO_PROJECT_ID` (default `nl0qw78w`)
- `SANITY_STUDIO_DATASET` (default `production`)
- `SANITY_API_WRITE_TOKEN` - function needs write access

## Local smoke test

Each function exports a default that can be invoked with a fake event payload:

```ts
import scheduledPublish from './scheduled-publish'
await scheduledPublish({})
```
