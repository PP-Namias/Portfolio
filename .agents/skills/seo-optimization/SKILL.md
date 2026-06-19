---
name: seo-optimization
description: Improve search engine visibility with proper meta tags, structured data, sitemaps, and semantic HTML.
---

# SEO Optimization Skill

Optimizes the portfolio for search engines by ensuring proper metadata, structured data (JSON-LD), semantic HTML, sitemaps, and social sharing previews.

## When to use this skill

- Adding or modifying pages
- Improving search engine rankings
- Setting up social media previews (Open Graph, Twitter Cards)
- Adding structured data for rich results
- Generating or updating sitemaps

## Workflow

1. **Title and meta description** — Every page needs a unique, descriptive `<title>` and `<meta name="description">`. Under 60 chars for title, 155-160 chars for description.

2. **Open Graph / Twitter Cards** — Set `og:title`, `og:description`, `og:image`, `og:url`, `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`.

3. **Structured data (JSON-LD)** — Add `<JsonLd>` component with appropriate schema (Person, WebSite, BlogPosting, Project, etc.). Follow existing patterns in the codebase.

4. **Semantic HTML** — Proper heading hierarchy (`<h1>`–`<h6>`). Use `<article>`, `<section>`, `<nav>`, `<main>`, `<aside>`, `<footer>` appropriately.

5. **Sitemap** — Ensure `public/sitemap.xml` or `app/sitemap.ts` is up to date with all canonical URLs. Include `lastmod`, `changefreq`, `priority`.

6. **robots.txt** — Verify `public/robots.txt` allows crawling of important pages, disallows admin/studio paths.

7. **Canonical URLs** — Every page has a `<link rel="canonical">` to prevent duplicate content issues.

8. **Performance** — SEO and performance are linked. Ensure LCP < 2.5s, good Core Web Vitals per `performance-optimization` skill.

## Common patterns in this codebase

- `<JsonLd>` component used for structured data
- Metadata exported from `layout.tsx` or page files using Next.js `metadata` export
- Open Graph images served from public directory or Sanity CMS
- Blog posts use `BlogPosting` schema

## Delivery Checks

- [ ] Unique title and meta description per page
- [ ] Open Graph and Twitter Card tags present
- [ ] JSON-LD structured data added where relevant
- [ ] Semantic heading hierarchy
- [ ] Sitemap includes all public pages
- [ ] robots.txt properly configured
- [ ] Canonical URLs set
- [ ] Lighthouse SEO score ≥ 90
