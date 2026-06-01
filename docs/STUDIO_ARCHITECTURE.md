# Studio Architecture

A short, single-page map of the Namias Studio. Read this before adding a field, a validation, an action, or a Sanity Function.

## Folder map

```
studio/
  sanity.config.ts          # Plugins, structure, document actions, schema
  sanity.cli.ts             # CLI config (project, dataset, deployment id)
  env.ts                    # Centralized env registry + getStudioEnvSnapshot()
  schemaTypes/              # One file per document type
    _registry.ts            # Type registry (kinds, referenceable, previewable)
    index.ts                # Re-exports registry helpers + the schemaTypes array
  actions/
    publishAndRefreshAction.tsx  # Wraps the default publish action with a webhook trigger
    publishAndRevalidateAction.tsx # One-click publish + revalidate with a modal
    publishAndRevalidateModalAction.tsx # Standalone modal action
    perspectiveSwitcher.tsx # Cookie-based perspective switcher
  components/
    Welcome.tsx             # Branded landing screen
    Onboarding.tsx          # 4-step guided tour
    inputs/
      ExperienceDurationField.tsx  # Computed "2y 4m" field
      ReadingTimeField.tsx         # Computed "X min read" field
    inspector/
      SeoPreview.tsx        # Live SERP + social card preview
      ContentHealth.tsx     # Word count, alt, refs, staleness
    previews/
      listItems.tsx         # Rich list previews for project, experience, post
    badges/
      statusBadges.tsx      # Draft, Live, Scheduled, Stale, Expiring, Featured
  ai/
    prompts.ts              # AI action prompts by document type
  preview/
    previewLocations.ts     # Presentation tool routes for every previewable type
  templates/
    index.ts                # Initial value templates (project draft/featured, etc.)
  theme/
    studioTheme.ts          # Tokens for the studio shell
  seed/
    tasks.ts                # Pre-seeded sample tasks
  utils/
    text.ts                 # formatDuration, estimateReadingTime, countPortableTextWords
  validation/
    rules.ts                # headlineLength, httpsOnly, dateOrder, uniqueSlug, requireAltText, summaryLength
```

```
functions/
  scheduled-publish/        # Promotes post/project whose publishAt is past
  broken-refs/              # Counts broken references per document
  auto-tag-images/          # Stubs an image-tagging pipeline
  package.json              # Deploy script
```

```
src/
  sanity/lib/
    client.ts               # Cached public, preview, read clients
    live.ts                 # next-sanity defineLive (Live Content API)
  components/cms/
    SanityField.tsx         # data-sanity attribute + studio edit deep-link
  app/api/sanity/
    webhook/route.ts        # Revalidation webhook
    live/route.ts           # Health check for the Live API
```

## How a new field flows through the system

1. Add the field in the relevant `schemaTypes/<type>.ts` file.
2. If it has a validation, import from `validation/rules.ts`.
3. If it has a computed partner, write a custom input in `components/inputs/`.
4. If it shows in the inspector, add it in `components/inspector/`.
5. If it appears in list previews, add it to `components/previews/listItems.tsx`.
6. If it needs a custom badge (e.g. scheduled, expiring), add it in `components/badges/statusBadges.tsx`.
7. If it needs an AI action, register it in `ai/prompts.ts`.
8. If it needs a server-side automation, write a Sanity Function in `functions/`.
9. If it should be visible to the marketing site in real time, wrap the consumer in `<SanityField>` so the Visual Editing overlay can find it.

## How to extend

- **Add a new document type** - create `schemaTypes/<type>.ts`, register in `schemaTypes/index.ts`, add metadata to `_registry.ts`, add a structure entry in `sanity.config.ts`.
- **Add a new validation** - add to `validation/rules.ts` and use as `validation: myRule` or `validation: myRule({...})` on a field.
- **Add a new AI action** - register in `ai/prompts.ts` and wire into the document form via the `ai-assist` plugin.
- **Add a new Sanity Function** - create a folder under `functions/`, follow the pattern of `scheduled-publish`, then run `npm run deploy:all` from `functions/`.

## Style rules

- TypeScript everywhere. No `.js` in `studio/` except for `eslint.config.mjs` and `scripts/`.
- One file per document type in `schemaTypes/`. Co-locate field types only when the type is private to that document.
- Computed fields are always `readOnly: true` with a `components: {input: ...}` custom input.
- Validations are pure functions in `validation/rules.ts`; no inline closures longer than 5 lines.
- Custom UI components are stateless and accept only the props Sanity provides.
