# Sanity Web CMS Migration & Automation Plan

## Goals

- Migrate portfolio content from `portfolio-resources/data/*.json` to Sanity while preserving reliability via JSON fallback.
- Maintain separate deployment for Sanity Studio (cms.namias.tech) and the main portfolio (namias.tech).
- Keep UX parity during migration: no layout regressions, no routing changes, no modal policy violations.
- Enable content operations without redeploying the main app.

## Guiding Principles

- Source of truth remains JSON until each content slice is migrated, validated, and parity-tested.
- Sanity is additive first, then becomes the primary source once stability is confirmed.
- Use idempotent automation for migration and repeatable content sync.
- Preserve performance through caching, ISR, and safe fallback paths.

## Phases

### Phase 1: Setup & Initialization

- Install Sanity tooling, confirm Next.js 15 + React 19 alignment.
- Add standalone `studio/` folder for separate CMS deployment.
- Validate base schema wiring from `sanity/schema.ts`.
- Define environment variables shared between app + Studio.

### Phase 2: Schema Architecture

- Map each JSON file to a document schema with clear field parity:
  - `profile.json` → profile document + education array
  - `experiences.json` → experience documents with ordered highlights/achievements
  - `projects.json` → project documents with links, media, metrics, gallery
  - `certifications.json` → certification documents
  - `technologies.json` → technology documents (category grouping)
  - `recommendations.json` → recommendation documents
  - `memberships.json` → membership documents
  - `gallery.json` → gallery item documents
  - `socials.json` → social link documents
  - `blog.json` → blog post documents (slug + content)
- Define normalization rules for image assets and file naming.
- Establish ordering fields for featured or sorted content.

### Phase 3: Automated Migration Script

- Build an idempotent sync script that upserts documents by stable IDs.
- Normalize and upload image assets once; reuse references on re-run.
- Provide a dry-run mode for validation before writing.
- Add verification output showing changed/created/unchanged counts.

#### Asset normalization rules

- Source assets live in `portfolio-resources/assets/images` and are mirrored in `public/images`.
- Use folder mapping aligned with the JSON data: `projects`, `certifications`, `gallery`, `experience`, `blog`, `profile`.
- Decode URL-encoded filenames (for example `%20`) before resolving files on disk.
- Store assets with a folder-prefixed key to avoid duplicate uploads across runs.

### Phase 4: Advanced Fetching & Failover Architecture

- Use `safeFetchSanity` for resilient data reads with timeouts and fallback to JSON.
- Maintain cache tagging and revalidation strategy for ISR.
- Add monitoring log lines for failover events and recovery.

### Phase 5: Component Refactoring

- Convert data modules and server components to consume async Sanity fetches.
- Keep client components data-agnostic and pass resolved props.
- Ensure all routes maintain expected metadata and SEO output.

### Phase 6: Deployment & Environments

- Separate Studio deployment (cms.namias.tech) from main app deployment.
- Use environment-specific datasets (production, staging) where needed.
- Lock down Studio access with Sanity project auth and CORS rules.
- Document deployment inputs and rollout steps.

### Phase 7: Performance & Edge Caching

- Confirm ISR cache windows per route and prevent unnecessary re-renders.
- Validate build output size and avoid heavy client bundles.

### Phase 8: QA, Validation, and Parity

- Snapshot tests for content parity (JSON vs Sanity).
- Visual regression pass across critical sections.
- Verify fallback behavior with simulated Sanity outages.

### Phase 9: Launch & Monitoring

- Switch primary content source to Sanity once parity is confirmed.
- Monitor logs, fallbacks, and content freshness.
- Define rollback plan back to JSON-only mode if needed.
