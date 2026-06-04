# Route Inventory — /blog and /contact references

> Audit of every place in the codebase that references the soon-to-be-removed /blog and /contact routes.

## Files referencing /blog

| File | Line | Reference | Action |
|------|------|-----------|--------|
| `src/components/ui/HubMenu.tsx` | 263 | `href="/blog"` on the "Read Blog" item | Rewrite to `openModal('blog')` |
| `src/components/sections/HeroSection.tsx` | 242 | `href="/blog"` on a CTA link | Rewrite to `openModal('blog')` |
| `src/__tests__/components/ui-uncovered.test.tsx` | 162-163 | Asserts Button renders `href="/blog"` | Rewrite to assert modal trigger |
| `src/__tests__/components/HubMenu.blogVisible.test.tsx` | 149 | Asserts blog link has `href="/blog"` | Rewrite to assert modal trigger |
| `src/__tests__/app/app-layout-page.test.tsx` | 164 | Asserts Blog link in layout has `href="/blog"` | Rewrite or remove |
| `src/app/sitemap.ts` | 17, 25-26 | Generates `/blog` and `/blog/:slug` entries | Remove from sitemap |
| `src/app/api/sanity/webhook/route.ts` | 6, 17, 74-75 | `REVALIDATE_PATHS` includes `/blog`, `/blog/[slug]`; `cms:blog` cache tag | Keep `cms:blog` tag, drop revalidation paths |
| `src/app/api/sanity/live/route.ts` | 6 | `REVALIDATE_PATHS` includes `/blog`, `/blog/[slug]` | Drop the revalidation paths |

## Files to be deleted

| File | Reason |
|------|--------|
| `src/app/blog/page.tsx` | Public list page is being merged into the modal |
| `src/app/blog/[slug]/page.tsx` | Public detail page is being merged into the modal |
| `src/app/blog/BlogListClient.tsx` | Only used by the deleted list page; not reused |
| `src/app/blog/[slug]/BlogPostContent.tsx` | Only used by the deleted detail page; not reused |
| `src/app/blog/layout.tsx` | Only used by the deleted list page |
| `src/app/blog/` (directory) | Empty after deletions |

## Files referencing /contact

No file currently has `href="/contact"`. The contact form is exposed via the `BookingModal` and `ContactModal` modals. No action required.

## Public route surface after refactor

```
/                  # Home — full portfolio, all sections inline
/studio            # Sanity CMS (kept)
/api/*             # Backend routes (kept)
/blog              # 301 -> /?modal=blog
/blog/:slug        # 301 -> /?modal=blog&slug=:slug
```

## Cache tags

- `cms:blog` tag stays. The webhook still invalidates this tag so the in-memory CMS cache refreshes when posts change.
- `cms:resume` tag stays.

## Test files needing updates

1. `src/__tests__/components/ui-uncovered.test.tsx`
2. `src/__tests__/components/HubMenu.blogVisible.test.tsx`
3. `src/__tests__/app/app-layout-page.test.tsx`

New test files to add:

1. `src/__tests__/components/BlogListModal.test.tsx`
2. `src/__tests__/components/BlogPostModal.test.tsx`
