# One-Page Portfolio Architecture

## Goal
Refactor the Namias portfolio from a multi-route site (with `/blog` and `/blog/[slug]`) into a true one-page portfolio where all content lives on `/` and supplementary surfaces (blog list, blog post, resume, contact, booking, project detail) open in modals.

## Public surface

| URL | Content | Notes |
|-----|---------|-------|
| `/` | All sections (Hero, About, TechStack, Projects, Experience, Connect, Certifications, Gallery, Footer) | One canonical page |
| `/?modal=<name>` | Same as `/` with a modal open on mount | e.g. `/?modal=blog`, `/?modal=contact` |
| `/?modal=blog-post&slug=<slug>` | Same as `/` with a specific post open | e.g. `/?modal=blog-post&slug=hello-world` |
| `/studio` | Sanity CMS studio (login + content editing) | Unchanged |
| `/api/*` | API routes (chat, webhooks, etc.) | Unchanged |

## Modals

| Modal name | Component | Triggered by | Payload |
|------------|-----------|--------------|---------|
| `resume` | `ResumeModal` | HubMenu, NavBar | none |
| `experience` | `ExperienceModal` | HubMenu | none |
| `booking` | `BookingModal` | HeroSection, NavBar | none |
| `contact` | `ContactModal` | NavBar, Connect section | none |
| `project` | `ProjectDetailModal` | Projects grid cards | `Project` |
| `blog` | `BlogListModal` | HubMenu, Hero, NavBar | none |
| `blog-post` | `BlogPostModal` | BlogList cards, redirect from `/blog/:slug` | `string` (slug) |

## Modal management

- `src/hooks/useModal.tsx` is the single source of truth
- `ModalName` type union: `'resume' | 'experience' | 'booking' | 'contact' | 'project' | 'blog' | 'blog-post' | null`
- `openModal(name, payload?)` opens a modal; `payload` is `Project | string | null`
- For blog-post, `payload` is a `string` (the slug); the modal reads CMS content to find the post

## Deep-link auto-open

`src/app/ModalAutoOpen.tsx` is a client component mounted in `Providers`. On every URL change, it reads `useSearchParams()` and dispatches `openModal()` if `?modal=<name>` is present and valid.

This means external links (search engines, social shares) that redirect to `/?modal=blog-post&slug=foo` will land on `/` with the right modal pre-opened — no extra route needed.

## 301 redirects

`next.config.js` `redirects()`:

```
/blog                -> /?modal=blog                    (permanent)
/blog/:slug          -> /?modal=blog-post&slug=:slug    (permanent)
```

Old URLs from search engines, social shares, and external blogs resolve to `/` with the right modal pre-opened. No link rot.

## Deleted routes

The following were removed in the refactor:

- `src/app/blog/page.tsx`
- `src/app/blog/[slug]/page.tsx`
- `src/app/blog/BlogListClient.tsx`
- `src/app/blog/[slug]/BlogPostContent.tsx`
- `src/app/blog/layout.tsx`
- `src/app/blog/` directory

And the corresponding tests:

- `src/__tests__/app/blog-hidden-branches.test.ts`
- `src/__tests__/app/blog-uncovered.test.tsx`

## Caching

The `cms:blog` cache tag is preserved in `src/lib/cache.ts` so the in-memory CMS cache still invalidates when Sanity blog content changes. Only the `revalidatePath('/blog')` calls were dropped (no longer needed — there's no `/blog` page).

## SEO

- Sitemap (`src/app/sitemap.ts`) emits only `/` and `/studio`. No `/blog` or per-post entries.
- The `cms:blog` cache tag still invalidates on Sanity webhooks (`/api/sanity/webhook` and `/api/sanity/live`); only the page-level `revalidatePath` calls were removed.

## Files added

- `src/components/ui/BlogListModal.tsx` — modal for blog list
- `src/components/ui/BlogPostModal.tsx` — modal for single post (markdown body, prev/next nav, back-to-list)
- `src/app/ModalAutoOpen.tsx` — auto-opens modal from `?modal=` query
- `src/__tests__/components/BlogListModal.test.tsx`
- `src/__tests__/components/BlogPostModal.test.tsx`
- `src/__tests__/app/ModalAutoOpen.test.tsx`
- `src/__tests__/app/next-config-redirects.test.ts`

## Files modified

- `src/hooks/useModal.tsx` — added `activeBlogSlug`, payload typing
- `src/types/index.ts` — extended `ModalName` to include `'blog' | 'blog-post'`
- `src/components/ui/HubMenu.tsx` — "Read Blog" uses `onClick` (was `href="/blog"`)
- `src/components/sections/HeroSection.tsx` — "Blog" button uses modal (was anchor)
- `src/app/providers.tsx` — mounts `ModalAutoOpen`
- `src/app/sitemap.ts` — removed blog entries
- `src/app/not-found.tsx` — Blog suggestion uses `/?modal=blog`
- `src/app/api/sanity/webhook/route.ts` — dropped `/blog` from `REVALIDATE_PATHS`
- `src/app/api/sanity/live/route.ts` — dropped `/blog` from `REVALIDATE_PATHS`
- `next.config.js` — added `redirects()`

## Files deleted

- `src/app/blog/` (entire directory)
- `src/__tests__/app/blog-hidden-branches.test.ts`
- `src/__tests__/app/blog-uncovered.test.tsx`

## Verification

- `npx tsc --noEmit` — 0 errors
- `npm run lint` — 0 errors (3 pre-existing warnings)
- `npm run test -- --run` — 269 / 269 pass across 31 test files
- `npm run doctor:check` — 0 diagnostics, exit 0
