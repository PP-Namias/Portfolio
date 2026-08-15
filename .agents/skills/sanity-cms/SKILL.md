---
name: sanity-cms
description: Master reference for Sanity CMS integration in this portfolio. Load this skill whenever working with Sanity schemas, queries, data, webhooks, media, draft mode, or any CMS operation. Covers all 20 document types, GROQ patterns, client configuration, caching, revalidation, and studio structure.
---

# Sanity CMS — Master Reference

This is the canonical reference for the Sanity CMS integration. Load this skill for ANY Sanity-related task: adding/editing content, modifying schemas, writing queries, debugging data issues, or understanding the data flow.

## Quick Facts

| Property             | Value                               |
| -------------------- | ----------------------------------- |
| **Project ID**       | `nl0qw78w`                          |
| **Dataset**          | `production`                        |
| **API Version**      | `2026-02-19`                        |
| **Studio URL**       | `https://namias-cms.sanity.studio/` |
| **Site URL**         | `https://namias.tech`               |
| **Schema Location**  | `studio/schemaTypes/`               |
| **Types Location**   | `src/types/index.ts`                |
| **Queries Location** | `src/lib/cms-content.server.ts`     |
| **Client Location**  | `src/sanity/lib/client.ts`          |
| **Webhook Endpoint** | `POST /api/sanity/webhook`          |

## Environment Variables

| Variable                        | Purpose               | Required    |
| ------------------------------- | --------------------- | ----------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Public project ID     | Yes         |
| `NEXT_PUBLIC_SANITY_DATASET`    | Public dataset        | Yes         |
| `SANITY_API_READ_TOKEN`         | Authenticated reads   | Yes         |
| `SANITY_API_WRITE_TOKEN`        | Mutations/scripts     | For scripts |
| `SANITY_REVALIDATE_SECRET`      | Webhook auth          | Yes         |
| `SANITY_MEDIA_GATEWAY_SECRET`   | HMAC for media URLs   | Yes         |
| `SANITY_STUDIO_URL`             | Studio URL for env.ts | Optional    |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | Public studio URL     | Optional    |

## Document Types (20 total)

### Singletons (7)

| Type            | File               | Description                             |
| --------------- | ------------------ | --------------------------------------- |
| `profile`       | `profile.ts`       | Hero info, bio, education, social links |
| `aboutSection`  | `aboutSection.ts`  | About content (portable text)           |
| `siteSettings`  | `siteSettings.ts`  | All site-wide settings (600+ lines)     |
| `seoSettings`   | `seoSettings.ts`   | Default SEO meta                        |
| `mediaSettings` | `mediaSettings.ts` | Image defaults, quality presets         |
| `techStack`     | `techStack.ts`     | Technology list with logos/categories   |
| `resume`        | `resume.ts`        | Resume PDF file reference               |

### Collections (8)

| Type             | File                | Key Fields                                                  |
| ---------------- | ------------------- | ----------------------------------------------------------- |
| `experience`     | `experience.ts`     | role, company, startDate, endDate, highlights, images       |
| `project`        | `project.ts`        | title, slug, summary, technologies, gallery, showcaseDetail |
| `certification`  | `certification.ts`  | title, issuer (ref), issuedAt, expiresAt, credentialUrl     |
| `galleryImage`   | `galleryImage.ts`   | title, image, category (ref), mediaType, tags               |
| `recommendation` | `recommendation.ts` | quote, name, title, company, avatar                         |
| `membership`     | `membership.ts`     | name, url, joinedAt                                         |
| `post`           | `post.ts`           | title, slug, body (portable text), published, publishAt     |
| `author`         | `author.ts`         | name, slug, image, bio (portable text)                      |

### Reference Types (4)

| Type                    | File                       | Referenced By          |
| ----------------------- | -------------------------- | ---------------------- |
| `category`              | `category.ts`              | post.categories[]      |
| `certificationCategory` | `certificationCategory.ts` | certification.category |
| `certificationIssuer`   | `certificationIssuer.ts`   | certification.issuer   |
| `galleryCategory`       | `galleryCategory.ts`       | galleryImage.category  |

### Array Types (1)

| Type           | File              | Used By                                          |
| -------------- | ----------------- | ------------------------------------------------ |
| `blockContent` | `blockContent.ts` | post.body, author.bio, aboutSection.aboutContent |

## Schema Patterns

### Slug Pattern

```typescript
defineField({
  name: 'slug',
  type: 'slug',
  options: { source: 'title', maxLength: 96 },
  validation: uniqueSlug, // Custom async validator
})
```

Format: `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`

### Image Pattern (Standard)

```typescript
defineField({
  name: 'image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    { name: 'alt', type: 'string', validation: requireAltText },
    { name: 'caption', type: 'string' },
    { name: 'credit', type: 'string' },
    { name: 'source', type: 'string' },
    { name: 'license', type: 'string' },
  ],
})
```

### Reference Pattern

```typescript
defineField({
  name: 'issuer',
  type: 'reference',
  to: [{ type: 'certificationIssuer' }],
  options: { disableNew: false }, // Allows inline creation
})
```

### Order/Sort Pattern

Collections use numeric `order` field for manual sorting:

```typescript
defineField({ name: 'order', type: 'number' })
```

### Status Enum Pattern

```typescript
defineField({
  name: 'status',
  type: 'string',
  options: {
    list: [
      { title: 'Completed', value: 'completed' },
      { title: 'In progress', value: 'in-progress' },
      // ...
    ],
  },
})
```

### Scheduled Publishing

Both `project` and `post` have `publishAt: datetime` for future publishing. A Sanity Function (`scheduled-publish`) runs every 5 minutes to promote past-due documents.

### Computed Fields

- `experience.computedDuration` — Custom `ExperienceDurationField` component
- `post.computedReadingTime` — Custom `ReadingTimeField` component

## GROQ Queries

### Master Data Fetch (`src/lib/cms-content.server.ts`)

All data flows through `getCmsContent()` which calls `querySanity<T>()` for each document type. Each query uses cache tags for targeted invalidation.

**Profile:**

```groq
*[_type == "profile"][0]{
  fullName, title, email, phone, location, github, linkedin, summary,
  "avatarUrl": avatar.asset->url,
  "profileImageUrl": profileImage.asset->url,
  resumeUrl, availabilityLabel, heroRoles,
  socialLinks[]{platform, icon, url, placements},
  highlights, education
}
```

**Experience:**

```groq
*[_type == "experience"] | order(order asc, startDate desc){
  role, company, location, startDate, endDate, employmentType, workModel,
  summary, featuredStory, highlights, tags, achievements, images
}
```

**Projects (list):**

```groq
*[_type == "project"] | order(order asc, featuredRank asc, title asc){
  title, "slug": slug.current, summary, challenge, solution, result,
  year, category, featured, role, technologies, achievements,
  featuredRank, status, liveUrl, repositoryUrl,
  "imageUrl": image.asset->url, "imageAlt": image.alt,
  tier, showcaseDetail, shortDescription, highlights, githubRepo,
  "galleryItems": gallery[]{
    "url": asset->url, alt, caption, credit, source, license
  }
}
```

**Project (single by slug):**

```groq
*[_type == "project" && slug.current == "${safeSlug}"][0]{...}
```

**Certifications:**

```groq
*[_type == "certification"] | order(order asc, issuedAt desc){
  title, issuedAt, tags,
  "issuer": issuer->title,
  "imageUrl": image.asset->url, "alt": image.alt
}
```

**Blog Posts:**

```groq
*[_type == "post" && published == true && defined(slug.current)]
  | order(publishedAt desc){
  title, "slug": slug.current, excerpt, readTime, body, tags,
  publishedAt, featured, metaTitle, metaDescription,
  "mainImageUrl": mainImage.asset->url,
  "author": author->name,
  "categories": categories[]->title
}
```

**Gallery:**

```groq
*[_type == "galleryImage"] | order(order asc, capturedAt desc){
  title, mediaType, tags, capturedAt,
  "category": category->title,
  "mediaUrl": image.asset->url, alt
}
```

**Site Settings:**

```groq
*[_type == "siteSettings"][0]{
  footer{...}, blog{...},
  siteName, siteTagline, ownerName, contactEmail,
  "ogImageUrl": ogImage.asset->url,
  "twitterImageUrl": twitterImage.asset->url
}
```

**Static Params:**

```groq
// Blog slugs
*[_type == "post" && published == true && defined(slug.current)]{"slug": slug.current}
// Project slugs (showcase)
*[_type == "project" && showcaseDetail == true && defined(slug.current)]{"slug": slug.current}
```

## Data Flow Architecture

```
Sanity CMS (cdn.sanity.io)
    │
    ├─► Public Client (CDN, published perspective)
    │     └─► querySanity() with L1 (in-memory Map) + L2 (Redis) cache
    │           └─► getCmsContent() → Promise.all() for all doc types
    │                 └─► Server Components render with data
    │
    ├─► Preview Client (no CDN, previewDrafts perspective)
    │     └─► Used when draftMode() is enabled
    │     └─► Stega enabled for click-to-edit
    │
    ├─► Read Client (authenticated, no CDN)
    │     └─► Used for draft-mode enable endpoint
    │
    └─► Media Gateway (/api/media/sanity/{encoded})
          └─► HMAC-signed URLs, proxied from Sanity CDN
          └─► Smart caching headers based on URL expiry
```

### Cache Strategy

| Layer              | TTL    | Stale-while-revalidate | Scope             |
| ------------------ | ------ | ---------------------- | ----------------- |
| L1 (in-memory Map) | 5 min  | 60s                    | Per-request dedup |
| L2 (Redis/Upstash) | 5 min  | 60s                    | Cross-request     |
| CDN (Sanity)       | Varies | —                      | Edge              |

### Cache Invalidation (Webhook)

When content changes in Sanity studio:

1. Studio triggers `POST /api/sanity/webhook` with secret header
2. Webhook validates secret via timing-safe comparison
3. Maps document type to cache tags (e.g., `project` → `['cms:project', 'cms:project-list']`)
4. Calls `invalidateByTag()` to clear L1 + L2
5. Calls `revalidatePath()` for affected routes: `/`, `/blog`, `/blog/[slug]`, `/projects/[slug]`, `/sitemap.xml`

## Media Gateway

All Sanity images are served through `/api/media/sanity/{base64url-encoded-target}`:

- **URL format:** `/api/media/sanity/{encoded}?w=1200&q=85&exp={expiresAt}&sig={hmac}`
- **HMAC signing:** Uses `SANITY_MEDIA_GATEWAY_SECRET`
- **Expiry:** 7 days default
- **Proxy:** Validates target is Sanity CDN, verifies HMAC, proxies response
- **Cache headers:** Signed URLs use remaining expiry, files get `immutable`, images get `86400s`

### Building Media URLs

```typescript
import { buildMediaGatewayUrl } from '@/lib/media-gateway'

// For server components (with HMAC):
const url = buildMediaGatewayUrl(sanityCdnUrl, { width: 1200, quality: 85 })

// For client components (no HMAC):
import { resolveContentImageSrc } from '@/lib/media'
const url = resolveContentImageSrc(sanityCdnUrl, { width: 1200 })
```

## Draft Mode / Visual Editing

1. **Enable:** Studio calls `/api/draft-mode/enable?secret=...`
2. **Client selection:** `pickClient()` checks `draftMode()`:
   - Draft ON → Preview client (previewDrafts, stega enabled)
   - Draft OFF → Public client (published, CDN)
3. **Stega:** Embeds `data-sanity` attributes for click-to-edit
4. **Data attributes:** Use `sanityField()` from `@/utils/sanity-data-attribute`

## Studio Structure

```
Content
  Homepage
    Hero & Profile (singleton)
    About Section (singleton)
    Tech Stack (singleton)
  Collections
    Projects (filtered: All / Featured / Showcase)
    Experience (filtered: All / Current / Past)
    Certifications
    Gallery
    Resume
  Blog
    Posts (filtered: All / Published / Drafts)
    Authors
    Categories
  Community
    Memberships
    Recommendations
Settings
  Site Settings (singleton)
  SEO Settings (singleton)
  Media Settings (singleton)
Reference Data
  Certification Categories
  Certification Issuers
  Gallery Categories
```

## Validation Rules (`studio/validation/rules.ts`)

| Rule                   | Purpose                        |
| ---------------------- | ------------------------------ |
| `uniqueSlug`           | Regex + async uniqueness check |
| `uniqueTitle`          | Async title uniqueness check   |
| `requireAltText`       | Alt text 4+ characters         |
| `summaryLength`        | 40-280 chars                   |
| `seoTitleLength`       | 30-60 chars                    |
| `seoDescriptionLength` | 120-160 chars                  |
| `httpsOnly`            | URL must be https              |
| `dateOrder`            | Issue date before expiry       |
| `endDateAfterStart`    | Cross-field date validation    |
| `requiredForPublish`   | Conditional required fields    |
| `maxArrayItems({max})` | Array length cap               |
| `seoImageDimensions`   | Min 1200x630 pixels            |

## Adding a New Document Type

1. Create schema file: `studio/schemaTypes/myType.ts`
2. Add to registry: `studio/schemaTypes/_registry.ts` (DOCUMENT_META)
3. Export in index: `studio/schemaTypes/index.ts`
4. Add to desk structure: `studio/structure/deskStructure.ts`
5. Add preview location: `studio/preview/previewLocations.ts`
6. Add template: `studio/templates/index.ts`
7. Add GROQ query: `src/lib/cms-content.server.ts`
8. Add cache tag mapping: webhook `SANITY_TYPE_TO_TAGS`
9. Add TypeScript type: `src/types/index.ts`
10. Add to `CmsContent` interface: `src/lib/cms-content.shared.ts`
11. Add fallback data: `src/lib/cms-content.shared.ts`
12. Add to backup script: `studio/scripts/backup-sanity.mjs`

## Common Tasks

### Add a field to an existing schema

1. Edit schema file in `studio/schemaTypes/`
2. Update TypeScript type in `src/types/index.ts`
3. Update GROQ query in `src/lib/cms-content.server.ts`
4. Update `CmsContent` interface if needed
5. Update fallback data if needed
6. Test with `npm run dev` (studio)

### Add a new singleton

1. Create schema with `type: 'singleton'`
2. Add to registry, index, desk structure
3. Add query to `cms-content.server.ts`
4. Add type to `src/types/index.ts`
5. Add to webhook cache tags

### Debug a data issue

1. Check Sanity studio: is the document published?
2. Check cache: call `clearCmsQueryCache()` or wait 5 min
3. Check webhook: is revalidation firing? (check `/api/sanity/webhook` logs)
4. Check query: test GROQ in Vision tool in studio
5. Check types: do TypeScript types match the schema?

### Add a new collection

1. Create schema with `type: 'document'`
2. Add `order` field for manual sorting
3. Add orderings array
4. Add status/featured fields if needed
5. Follow the "Add a new document type" checklist above

## Backup & Restore

| Command                      | Purpose                        |
| ---------------------------- | ------------------------------ |
| `npm run sanity:seed`        | Seed demo data                 |
| `studio/scripts/backup.ps1`  | Export NDJSON backup (Windows) |
| `studio/scripts/restore.ps1` | Import NDJSON backup (Windows) |
| `studio/scripts/verify.ps1`  | Verify backup integrity        |

## Sanity Functions (Blueprints)

| Function            | Trigger            | Purpose                                         |
| ------------------- | ------------------ | ----------------------------------------------- |
| `scheduled-publish` | Cron `*/5 * * * *` | Promotes documents where `publishAt` has passed |
| `broken-refs`       | Cron `0 */6 * * *` | Scans for broken document references            |
| `auto-tag-images`   | Image asset create | Auto-tags uploaded images                       |

## Troubleshooting

| Symptom             | Likely Cause               | Fix                                        |
| ------------------- | -------------------------- | ------------------------------------------ |
| Data not updating   | Cache not invalidated      | Check webhook secret, trigger revalidation |
| Stale content       | CDN caching                | Add `?t={timestamp}` or clear cache        |
| Draft not showing   | Draft mode not enabled     | Check `/api/draft-mode/enable` endpoint    |
| Image 404           | HMAC mismatch              | Check `SANITY_MEDIA_GATEWAY_SECRET`        |
| Query returns empty | Wrong dataset or type name | Verify in Vision tool                      |
| Build fails         | Missing env vars           | Check `.env.local` has all required vars   |
