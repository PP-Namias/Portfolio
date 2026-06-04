# One-Page Portfolio Skill

Use when the user wants to understand, modify, or extend the one-page portfolio refactor: all content (blog, contact, booking, resume, project detail) on `/` via modals; 301-redirect old URLs to `/?modal=<name>`.

## Architecture

Canonical doc: `docs/refactor/one-page/architecture.md`

- All public content lives on `/` — there is no `/blog` or `/blog/[slug]` route anymore.
- Supplementary surfaces (resume, experience, booking, contact, project detail, blog list, blog post) open as modals on top of `/`.
- External links to old `/blog` URLs are 301-redirected to `/?modal=blog` or `/?modal=blog-post&slug=<slug>`.
- A client component (`src/app/ModalAutoOpen.tsx`) reads `?modal=` from the URL on mount and dispatches to the modal system.

## Modal system

- Single source of truth: `src/hooks/useModal.tsx`
- Type union: `'resume' | 'experience' | 'booking' | 'contact' | 'project' | 'blog' | 'blog-post' | null`
- API: `openModal(name, payload?)` where `payload` is `Project | string | null` (string = slug for `blog-post`)

## Adding a new modal

1. Add the name to the `ModalName` type in `src/types/index.ts`
2. Create `src/components/ui/<Name>Modal.tsx` accepting `{ open: boolean; onClose: () => void; payload?: ... }`
3. Mount it inside `ModalProvider` in `src/hooks/useModal.tsx`
4. If the modal can be deep-linked, add the name to `VALID_MODALS` in `src/app/ModalAutoOpen.tsx`

## Adding a 301 redirect

Add an entry to `next.config.js` `redirects()`:

```js
{
  source: '/old/path/:slug',
  destination: '/?modal=<name>&slug=:slug',
  permanent: true,
}
```

## Caching

`src/lib/cache.ts` invalidates the `cms:blog` cache tag on Sanity webhooks — keep this even though there's no `/blog` page, since the in-memory CMS cache refreshes content consumed by `BlogListModal` and `BlogPostModal`.

## Tests

- `src/__tests__/components/BlogListModal.test.tsx` — list view, click-to-detail, closed state
- `src/__tests__/components/BlogPostModal.test.tsx` — valid post, not found, prev/next nav, back-to-list
- `src/__tests__/app/ModalAutoOpen.test.tsx` — `?modal=` dispatch behavior
- `src/__tests__/app/next-config-redirects.test.ts` — redirect mappings

When adding a new modal, add a `<Name>Modal.test.tsx` file with at least 3 tests: closed state, open state, payload handling.

## Verification

- `npx tsc --noEmit` — must be 0 errors
- `npm run lint` — must be 0 errors
- `npm run test -- --run` — must be all green
- `npm run doctor:check` — must be 0 diagnostics, exit 0
