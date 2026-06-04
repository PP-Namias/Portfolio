# Modal Trigger Contract

> Every public-facing modal in the one-page portfolio. Use this as the canonical reference for opening, closing, and URL-driven auto-open.

## Modal Catalog

| `ModalName` | Component | Opens with | Notes |
|-------------|-----------|------------|-------|
| `resume` | `ResumeModal` | `openModal('resume')` | Resume download — uses `/api/resume` for the signed URL |
| `experience` | `ExperienceModal` | `openModal('experience', exp)` | Per-experience detail (used by timeline click) |
| `booking` | `BookingModal` | `openModal('booking')` | Cal.com inline booking |
| `contact` | `ContactModal` | `openModal('contact')` | Direct email/contact |
| `project` | `ProjectDetailModal` | `openModal('project', project)` | Per-project detail |
| `blog` | `BlogListModal` | `openModal('blog')` | **NEW** — list of all posts |
| `blog-post` | `BlogPostModal` | `openModal('blog-post', slug)` | **NEW** — single post detail |

## Hook signature

```ts
const { openModal, closeModal, activeProject } = useModal();
// openModal(name: OpenableModalName, project?: Project | null) => void
// closeModal() => void
// activeProject: Project | null   (only relevant for the 'project' modal)
```

`OpenableModalName` is `ModalName` minus `null`.

## URL convention — auto-open

`/?modal=<name>` auto-opens the named modal on the home page. Optional `&slug=<slug>` carries the post slug for `blog-post`.

| URL | Behaviour |
|-----|-----------|
| `/?modal=blog` | Auto-opens `BlogListModal` |
| `/?modal=blog&slug=hello-world` | Auto-opens `BlogPostModal` for `hello-world` |
| `/?modal=booking` | Auto-opens `BookingModal` |
| `/?modal=contact` | Auto-opens `ContactModal` |
| `/?modal=project&slug=foo` | Auto-opens `ProjectDetailModal` for `foo` (optional) |

The auto-open logic runs in a small client component (`src/app/ModalAutoOpen.tsx`) that reads `useSearchParams()` on mount and dispatches to `useModal()`. The query string is preserved in `router.replace` so the modal state and URL stay in sync.

## 301 redirects

`next.config.js` `redirects()` maps:

```
/blog              -> /?modal=blog                    (permanent)
/blog/:slug        -> /?modal=blog-post&slug=:slug    (permanent)
```

These preserve any inbound links from search engines, social shares, or external blogs.

## Cache invalidation

The Sanity webhook continues to invalidate the `cms:blog` cache tag when a post is created, updated, or deleted. This causes the next read of `useCmsContent()` to refetch from Sanity. Since the blog modal reads from the same provider, the new content appears automatically.

`/blog` is no longer a page route, so the webhook no longer calls `revalidatePath('/blog', 'page')`.
