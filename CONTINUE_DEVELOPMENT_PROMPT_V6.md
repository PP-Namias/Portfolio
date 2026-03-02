# AI Agent Prompt — Portfolio V6 Mega Upgrade

> **Copy-paste this ENTIRE prompt into a new Copilot Chat session (Claude Opus 4.6) to implement the improvements.**
> **Model:** Claude Opus 4.6 via VS Code Copilot
> **Created:** 2026-03-03

---

## TASK

Implement a comprehensive visual and functional upgrade to my Next.js 14 portfolio website at `C:\Users\Kenneth\Desktop\PP Namias\Portfolio`. This is a phased implementation — complete each phase fully before moving to the next.

**CRITICAL:** Read `/.github/copilot-instructions.md` FIRST for full architecture context, data flow, design tokens, and component patterns. Follow ALL rules in that file.

---

## PHASE 1: Navigation Bar (HIGHEST PRIORITY)

### 1A — Create `src/components/layout/Navbar.tsx`

Create a sticky navigation bar that goes at the TOP of every page. This is the single biggest missing piece.

**Requirements:**
- `'use client'` component with Framer Motion animations
- **Sticky** at the top: `fixed top-0 left-0 right-0 z-40`
- **Glass morphism effect:** `bg-white/80 dark:bg-black/80 backdrop-blur-md` with a bottom border
- **Desktop layout (lg+):**
  - Left: "JN" text logo or just the name "Keneth Namias" — click navigates to `/`
  - Center/Right: Navigation links — About, Projects, Experience, Blog
  - Far right: ThemeToggle component
- **Mobile layout (< lg):**
  - Left: Name
  - Right: Hamburger menu button (Menu/X icon toggle)
  - Dropdown: full-width menu with nav links + ThemeToggle
- **Scroll behavior:** On home page, nav links scroll to sections using `id` attributes (smooth scroll via Lenis). On other pages (/blog, /experience), clicking "About" or "Projects" navigates to `/#about`, `/#projects`, etc.
- **Active section highlighting:** Use `IntersectionObserver` to detect which section is in view and highlight the corresponding nav link with `text-accent-pink` + an underline indicator
- **Hide on scroll down, show on scroll up** (optional nice-to-have, only if simple)
- Use Lucide icons: `Menu`, `X` from `lucide-react`
- Import `ThemeToggle` from `@/components/ui/ThemeToggle`
- Use design tokens from `tailwind.config.ts` — all theme colors as documented

### 1B — Add section IDs to `src/app/page.tsx`

Add `id` attributes to sections so the navbar can link to them:
```tsx
<Card id="about" className="...">  // wrapping AboutSection
<Card id="tech-stack" className="...">
<Card id="projects" className="...">
// ... etc for all sections
```

### 1C — Update `src/app/layout.tsx`

- Import and render `<Navbar />` BEFORE `{children}` inside `<Providers>`
- Add `pt-16` (64px) to `<body>` or the main content wrapper to offset the fixed navbar height
- Navbar appears on EVERY page (home, blog, experience)

### 1D — Remove ThemeToggle from HeroSection

- Remove the ThemeToggle from `HeroSection.tsx` (it's now in the Navbar)
- Remove the `absolute top-0 right-0` wrapper div around it

### 1E — Update blog and experience pages

- Add a "Back to portfolio" nav link or ensure the Navbar's "Portfolio" logo link works on these pages
- The Navbar should show on `/blog`, `/blog/[slug]`, and `/experience` pages too

---

## PHASE 2: Hero Section Redesign

### 2A — Profile Photo with Decorative Ring

Replace the current simple square photo with a circular photo that has a decorative animated ring:
```tsx
<div className="relative">
  {/* Animated gradient ring */}
  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-pink via-pink-400 to-purple-500 animate-spin-slow" style={{ padding: '3px' }}>
    <div className="h-full w-full rounded-full bg-white dark:bg-background-dark" />
  </div>
  {/* Photo */}
  <Image src="/images/profile/PP%20Namias.png" ... className="rounded-full object-cover relative z-10" />
</div>
```
Add to `tailwind.config.ts`:
```
animation: { 'spin-slow': 'spin 8s linear infinite' }
```

### 2B — Animated Role Text

Add a typewriter or text rotation effect below the name. Cycle through:
- "Full Stack Engineer"
- "AI Automation Specialist"
- "Project Manager @ MASH"

Use Framer Motion's `AnimatePresence` with `mode="wait"` and auto-cycle every 3 seconds. Keep it subtle — just text swapping with a fade.

### 2C — Availability Status Badge

Add a green dot + "Open to opportunities" pill badge near the name or below the title:
```tsx
<span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
  Open to opportunities
</span>
```

### 2D — Social Icons Row

Add a compact row of social icons below the CTA buttons. Pull from `socialLinks` data:
```tsx
<div className="flex items-center gap-2 mt-3">
  {socialLinks.filter(s => ['github', 'linkedin', 'x', 'instagram'].includes(s.name)).map(link => (
    <a href={link.link} className="h-8 w-8 rounded-full border border-border-light dark:border-border-dark flex items-center justify-center hover:border-accent-pink hover:text-accent-pink transition-colors">
      <Icon className="h-4 w-4" />
    </a>
  ))}
</div>
```

---

## PHASE 3: Footer Upgrade

### 3A — Replace Simple Footer with Multi-Column Footer

Replace the current single-line footer in `src/components/layout/Footer.tsx` with:

```
┌──────────────────────────────────────────────────────────┐
│  Quick Links        │  Connect         │  Get in Touch    │
│  • About            │  GitHub ·        │  pp.namias@      │
│  • Projects         │  LinkedIn ·      │  gmail.com       │
│  • Blog             │  X · Instagram   │  Caloocan City,  │
│  • Experience       │                  │  Philippines     │
├──────────────────────────────────────────────────────────┤
│  © 2026 Jhon Keneth Namias · Made with Next.js           │
│  ↑ Back to Top                                           │
└──────────────────────────────────────────────────────────┘
```

- 3-column grid on desktop, stacks on mobile
- "Back to Top" button that scrolls to top (use `window.scrollTo({ top: 0 })` or Lenis)
- Pull social links from `@/data/socials`
- Pull profile info from `@/data/profile`

---

## PHASE 4: Custom Error Pages

### 4A — Create `src/app/not-found.tsx`

A branded 404 page:
- Large "404" number with pink gradient
- "Page not found" message
- "Go back home" button using the `Button` component
- Maybe a fun illustration or animation

### 4B — Create `src/app/error.tsx`

A branded error boundary:
- `'use client'` (required for error boundaries)
- "Something went wrong" message
- "Try again" button that calls `reset()`
- Match the site's design language

---

## PHASE 5: UX Enhancements

### 5A — Blog Reading Progress Bar

Create `src/components/ui/ReadingProgress.tsx`:
- Fixed at the very top of the page (above Navbar, `z-50`)
- Pink gradient bar that fills based on scroll progress
- Only appears on blog post pages (`/blog/[slug]`)
- Use `framer-motion`'s `useScroll` + `useTransform`

### 5B — Back to Top Button

Add to `Footer.tsx` or create a standalone component:
- Appears after scrolling down 500px
- Smooth scroll to top on click
- Small pill or circle button with up-arrow icon
- Pink accent styling

### 5C — Projects Section Filter

Add technology filter pills above the project grid (similar to CertificationsSection):
- Extract unique tags from all projects
- "All" + tag buttons
- Filter projects by tag
- Reset "show all" toggle state when filter changes

### 5D — About Section Stats Enhancement

Make the "4+ Years" and "25+ Projects" stats more visually prominent:
- Larger numbers
- Add icons (Briefcase for years, Code for projects, Layers for technologies)
- Consider a 3-stat row: Years, Projects, Technologies (count from technologies.json)
- Animated counter on scroll (numbers count up from 0)

---

## PHASE 6: Technical Improvements

### 6A — SEO Files

Create `public/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://namias.tech/sitemap.xml
```

Create `src/app/sitemap.ts` (Next.js built-in):
```typescript
import { blogPosts } from '@/data/blogPosts';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const blogs = blogPosts.map(post => ({
    url: `https://namias.tech/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    { url: 'https://namias.tech', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://namias.tech/blog', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://namias.tech/experience', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    ...blogs,
  ];
}
```

### 6B — Structured Data for Blog Posts

In `src/app/blog/[slug]/page.tsx`, add Article JSON-LD:
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": post.title,
  "datePublished": post.date,
  "author": { "@type": "Person", "name": "Jhon Keneth Ryan Namias" },
  "publisher": { "@type": "Person", "name": "Jhon Keneth Ryan Namias" }
}
```

---

## DESIGN RULES (MANDATORY)

1. **Colors:** Use ONLY the Tailwind custom tokens defined in `tailwind.config.ts`:
   - `text-text-primary-light dark:text-text-primary-dark` for primary text
   - `text-text-secondary-light dark:text-text-secondary-dark` for secondary
   - `text-text-muted-light dark:text-text-muted-dark` for muted
   - `bg-white dark:bg-card-bg-dark` for card backgrounds
   - `border-border-light dark:border-border-dark` for borders
   - `accent-pink` / `accent-pink-hover` for accents

2. **Animations:** Use Framer Motion. Standard pattern:
   ```tsx
   <motion.div
     initial={{ opacity: 0, y: 20 }}
     whileInView={{ opacity: 1, y: 0 }}
     viewport={{ once: true, margin: '-50px' }}
     transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
   />
   ```

3. **Components:** Wrap contents in `<Card>` from `@/components/ui/Card`. Use `<Button>` for actions.

4. **Data:** Import from `@/data/*` modules. NEVER hardcode content. All data from `portfolio-resources/data/*.json`.

5. **Types:** All interfaces in `src/types/index.ts`.

6. **Theme:** BOTH dark and light mode must work. Default is dark.

7. **Responsive:** Mobile-first. Use `sm:`, `md:`, `lg:` breakpoints.

8. **Lenis:** Smooth scroll is active via `ReactLenis` in providers.tsx. For internal nav, use `document.getElementById('section').scrollIntoView()` or Lenis's `scrollTo` method.

9. **Max width:** `max-w-container` (860px) for main content.

---

## VALIDATION (MANDATORY AFTER EACH PHASE)

After completing each phase:
```bash
npm run lint     # Must have 0 ESLint errors
npm run build    # Must compile successfully with 0 TS errors
npx vitest run   # All existing tests must pass
```

Fix ALL errors before proceeding to the next phase.

---

## WORKFLOW

1. Read `/.github/copilot-instructions.md` fully before starting
2. Use `manage_todo_list` to track each phase/task
3. Read ALL affected files BEFORE editing them
4. Mark tasks in-progress → completed as you go
5. Run validation after each phase
6. When ALL phases are done:
   - Summarize what changed
   - Update `/.github/copilot-instructions.md` with new components, new files, and resolved items
   - Update the KNOWN ISSUES section

---

## FILE REFERENCE

Key files to read first:
- `/.github/copilot-instructions.md` — Full project context
- `src/app/page.tsx` — Home page layout
- `src/app/layout.tsx` — Root layout  
- `src/app/providers.tsx` — Lenis + ThemeProvider
- `src/app/globals.css` — Global styles
- `src/components/sections/HeroSection.tsx` — Hero section
- `src/components/layout/Footer.tsx` — Current footer
- `tailwind.config.ts` — Design tokens
- `src/types/index.ts` — All TypeScript interfaces
- `src/data/profile.ts` — Profile data module
- `src/data/socials.ts` — Social links module

---

## EXPECTED OUTCOME

After implementation:
- Professional navigation bar on every page with section linking
- Visually striking hero with animated photo ring, role rotation, status badge
- Full-featured footer with links, socials, and back-to-top
- Branded 404 and error pages
- Blog reading progress indicator
- Projects with tag filtering
- Enhanced About stats with animated counters
- SEO sitemap and robots.txt
- Article structured data on blog posts
- All tests passing, 0 lint errors, clean build
