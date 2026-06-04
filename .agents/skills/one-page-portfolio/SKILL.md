# One-Page Portfolio Skill

Use when the user wants to understand, modify, or extend the one-page portfolio refactor: all content (blog, contact, booking, resume, project detail) on `/` via modals; 301-redirect old URLs to `/?modal=<name>`; the home page is a compact 2-column resume-style layout.

## Architecture

Canonical doc: `docs/refactor/one-page/architecture.md`

- All public content lives on `/` — there is no `/blog` or `/blog/[slug]` route anymore.
- Supplementary surfaces (resume, experience, booking, contact, project detail, blog list, blog post) open as modals on top of `/`.
- External links to old `/blog` URLs are 301-redirected to `/?modal=blog` or `/?modal=blog-post&slug=<slug>`.
- A client component (`src/app/ModalAutoOpen.tsx`) reads `?modal=` from the URL on mount and dispatches to the modal system.
- The home page is a compact 2-column resume-style page: Hero on top, 38% left (skills/education/certs) and 62% right (about/experience/projects), minimal footer with last-updated timestamp.

## Modal system

- Single source of truth: `src/hooks/useModal.tsx`
- Type union: `'resume' | 'experience' | 'booking' | 'contact' | 'project' | 'blog' | 'blog-post' | null`
- API: `openModal(name, payload?)` where `payload` is `Project | string | null` (string = slug for `blog-post`)

## Resume-style home page layout

- Header card (full width): `HeroSection` (name, role, location, socials, CTAs)
- 2-column body (38% / 62%, no sticky logic, no resize observer):
  - **Left**: `TechStackSection` (renamed heading to "Skills"), `EducationSection` (extracted from AboutSection), `CertificationsSection`
  - **Right**: `AboutSection` (Education removed), `ExperienceTimeline`, `ProjectsSection`
- Section `<h2>` style: `text-[11px] font-bold uppercase tracking-[0.14em] text-accent-pink` with `border-b` divider
- Each `<section>` has `data-section="..."` and matching `id` on the h2 (e.g. `about-heading`) for `aria-labelledby`
- `<hr>` between sections (no stacked Card wrappers)
- Footer: socials + copyright + last-updated timestamp (no CTA — it's in the Hero)

## Critical: Suspense boundary

`ModalAutoOpen` uses `useSearchParams()` and **must be wrapped in `<Suspense fallback={null}>`** inside `Providers`. Without it:
- The static prerender of `/_not-found` fails with `useSearchParams() should be wrapped in a suspense boundary`
- This breaks CodeQL Analysis, Vercel, and Workers Builds CI checks

If you add a new component to `Providers` that uses `useSearchParams()`, wrap it in `<Suspense>` too.

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
- `src/__tests__/app/resume-layout.test.tsx` — pins the 2-column layout invariants (7 tests)

When adding a new modal, add a `<Name>Modal.test.tsx` file with at least 3 tests: closed state, open state, payload handling.

## Verification

- `npx tsc --noEmit` — must be 0 errors
- `npm run lint` — must be 0 errors
- `npm run test -- --run` — must be all green (target: 277+)
- `npm run doctor:check` — must be 0 diagnostics, score 100
- `npm run build` — `/_not-found` must prerender successfully (proves the Suspense boundary is correct)
