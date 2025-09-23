# Site Simplification Plan: Transform to Blog-Only Website

This document outlines the complete step-by-step plan to convert your site into a simple blog with only Home, Blogs, About, and Contact pages.

---

## 1. Remove Unwanted Pages

- archive these files in `src/pages/`:
  - `skills.astro`
  - `skills-analytics.astro`
  - `gallery.astro`
  - `projects.astro`
  - `experience.astro`
  - `archive.astro`

## 2. Remove Related Content Folders

- archive these folders in `src/content/`:
  - `gallery/`
  - `projects/`
  - Any other folders related to skills or experience

## 3. Update Navigation/Menu Components

- Edit navigation components (e.g., `Navbar.astro`, `NavMenuPanel.astro`) to only show:
  - Home
  - Blogs (or Posts)
  - About
  - Contact

## 4. Clean Up Sidebar/Widgets

- Remove or update any sidebar, widget, or footer links to skills, experience, projects, or gallery.

## 5. Remove Unused Components

- archive components related to skills, experience, projects, or gallery (e.g., `SkillsAnalytics.astro`, `GalleryCard.astro`, etc.).

## 6. Update Routing Logic

- Ensure dynamic routing (e.g., `[...page].astro`) only supports the desired pages.

## 7. Clean Up Content Collections

- Remove or update any content collection logic for skills, experience, projects, or gallery in your Astro config or utility files.

## 8. Update Home Page

- Make sure the home page only features blog posts, and links to About and Contact.

## 9. Test the Site

- Build and run the site to verify only Home, Blogs, About, and Contact are visible.
- Check for broken links or references to removed sections.

## 10. Final Code Cleanup

- Remove any unused imports, assets, or configuration related to the deleted features.

---

**Next Steps:**
- Choose whether to start with navigation/menu cleanup or page deletion.
- Follow this checklist for a clean, focused blog website.
