# Component Architecture Overview — Cloud-Native Portfolio

This document describes the architecture of the portfolio without embedding source code. For the full implementation, see the [repository](https://github.com/pabilandokarenpv/cloud-native-portfolio).

---

## Layout Components (`src/components/layout/`)

| Component | Purpose |
|-----------|---------|
| `Header.tsx` | Top-level header — provides a slot for the theme toggle |
| `Footer.tsx` | Animated copyright footer with the profile name |
| `MainContent.tsx` | Left column wrapper that renders Hero → About → Tech Stack → Projects → Certifications |
| `Sidebar.tsx` | Right column wrapper that renders Experience → Recommendations → Memberships → Social Links → Speaking → Contact |

The home page (`page.tsx`) uses a two-column desktop layout with `MainContent` on the left (62% width) and `Sidebar` on the right (38% width). On mobile, these stack vertically.

---

## Section Components (`src/components/sections/`)

| Component | What it renders |
|-----------|----------------|
| `HeroSection.tsx` | Profile photo (with initials fallback), name with verified badge, location, roles, and CTA buttons (View Resume, Send Email, Read Blog) |
| `AboutSection.tsx` | Multi-paragraph bio pulled from the profile data file |
| `TechStackSection.tsx` | Categorized technology list (Languages, Backend, Cloud, DevOps) |
| `ProjectsSection.tsx` | 2-column grid of project cards with name, description, and URL |
| `CertificationsSection.tsx` | Stacked list of certification name + issuer |
| `ExperienceTimeline.tsx` | Vertical timeline with checkbox-style indicators — covers work, education, and milestones |
| `RecommendationsCarousel.tsx` | Auto-advancing testimonial carousel (6-second interval) with pause-on-hover and dot pagination |
| `MembershipsSection.tsx` | Professional organization links with external link icons |
| `SpeakingSection.tsx` | Speaking availability note with email CTA |
| `ConnectSection.tsx` | Two-card layout — social links + contact options on the left, latest blog post preview on the right |
| `GallerySection.tsx` | Paginated image gallery (5 images per slide) with animated slide transitions and navigation arrows |
| `ContactSection.tsx` | Direct email, schedule call, and blog links |
| `SocialLinksSection.tsx` | Platform links (LinkedIn, GitHub, Instagram) with icon mapping |

All section components use Framer Motion for scroll-triggered entrance animations (`whileInView`).

---

## Reusable UI Components (`src/components/ui/`)

| Component | Purpose |
|-----------|---------|
| `Badge.tsx` | Pill-shaped badge with `teal`, `sky`, and `default` variants |
| `Button.tsx` | Multi-variant button (`primary`, `ghost`, `outline`) with size options — supports `href` for link behavior and `internal` for Next.js `Link` routing |
| `Card.tsx` | Rounded, bordered card container powered by Framer Motion — optional `hover` prop adds lift and accent border effect |
| `ProjectCard.tsx` | Project-specific card displaying name, description, and URL inside a hoverable `Card` |
| `SocialLink.tsx` | Social platform link with an icon map (LinkedIn, GitHub, Instagram) and hover accent color |
| `TestimonialCard.tsx` | Animated testimonial block with quote, attribution, and directional slide transition |
| `ThemeToggle.tsx` | Sun/Moon icon toggle for light/dark mode — shows skeleton placeholder until mounted to prevent hydration mismatch |
| `TimelineItem.tsx` | Single timeline entry with a checkbox indicator, connecting line, role/org text, and year |
| `VerifiedBadge.tsx` | Inline verified checkmark icon (Lucide `BadgeCheck`) in the accent color |

---

## Data Files (`src/data/`)

All portfolio content lives in data files, completely separated from layout logic. To update your portfolio, edit these files — no component changes needed.

| File | Content |
|------|---------|
| `profile.ts` | Name, title, location, tagline, roles, email, bio paragraphs, profile photo URL, resume URL |
| `experience.ts` | Work history, education, and milestone entries with year and type |
| `projects.ts` | Project name, description, live URL, and optional S3 thumbnail reference |
| `certifications.ts` | Certification name and issuing organization |
| `techStack.ts` | Technology categories (Languages, Backend, Cloud, DevOps) and their items |
| `recommendations.ts` | Testimonial quotes with name, title, and company |
| `memberships.ts` | Professional organization name and URL |
| `gallery.ts` | Gallery image source URLs and alt text |
| `blogPosts.ts` | Blog post entries — slug, title, excerpt, full content (Markdown-like), date, read time, tags, cover image |

---

## Types, Hooks, and Utilities

### TypeScript Interfaces (`src/types/index.ts`)

Defines shared types used across data and components: `Profile`, `Experience`, `Project`, `Certification`, `TechCategory`, `Recommendation`, `Membership`, `GalleryImage`, `SocialLink`.

### Custom Hooks (`src/hooks/`)

| Hook | Purpose |
|------|---------|
| `useCarousel.ts` | Manages auto-advancing carousel state — tracks current index, provides `goTo` / `goNext` / `goPrev`, pauses on hover via `setIsHovered`, auto-cleans interval on unmount |
| `useTheme.ts` | Wraps `next-themes` — exposes `isDark`, `toggleTheme`, and a `mounted` flag to prevent hydration mismatch on SSR |

### Utility Functions (`src/lib/`)

| File | Purpose |
|------|---------|
| `utils.ts` | `cn()` — merges CSS class names, filtering out falsy values. `formatUrl()` — strips protocol prefix for display. |
| `s3-urls.ts` | Builds S3 asset URLs from the `NEXT_PUBLIC_S3_BUCKET_URL` env variable — helpers for profile photo, resume PDF, gallery images, project thumbnails, and OG image. Used in Part 2 when connecting to Amazon S3. |

---

## App Pages (`src/app/`)

| File | Role |
|------|------|
| `layout.tsx` | Root layout — sets metadata (title, OG tags, Twitter card), loads Inter font, wraps children in `Providers` |
| `page.tsx` | Home page — assembles all section components in the two-column card layout |
| `providers.tsx` | Configures `ThemeProvider` from `next-themes` (class strategy, dark default, system disabled) |
| `blog/page.tsx` | Blog listing page — grid of post cards with cover image, tags, excerpt, and date |
| `blog/[slug]/page.tsx` | Dynamic route — uses `generateStaticParams` for static generation of blog posts |
| `blog/[slug]/BlogPostContent.tsx` | Client component — renders blog post with basic Markdown parsing (headings, code blocks, lists), plus prev/next navigation |

---

## Key Design Decisions

- **Two-column layout** — Desktop: 62/38 split. Mobile: stacks vertically. Implemented with Flexbox and Tailwind responsive utilities.
- **Dark mode** — Class-based switching via `next-themes`. Default theme is dark. CSS variables in `globals.css` handle color tokens.
- **Client components** — Interactive elements (carousel, gallery, theme toggle) are marked `'use client'`. Static sections still benefit from React Server Components in the App Router.
- **Content separation** — Portfolio data lives in `src/data/` files, completely decoupled from component rendering logic. Update your info without touching JSX.
- **Animation** — Framer Motion handles entrance animations (`whileInView`) and carousel/gallery transitions (`AnimatePresence`).
