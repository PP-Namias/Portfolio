# EPIC-0: Audit & Inventory

## Goal
Document every schema, field, plugin, component, and script in the Sanity Studio. Identify what to keep, what to merge, what to remove.

## Schema Inventory

### Singletons (8)

| Schema | Purpose | Overlaps With |
|---|---|---|
| `heroSection` | Homepage hero copy, roles, social links | `profile` (fullName, title, email, location, socialLinks) |
| `aboutSection` | About paragraphs, education | None |
| `profile` | Full profile with education array, highlights | `heroSection` (fullName, title) |
| `siteSettings` | Global site config, headings, footer, analytics | None |
| `seoSettings` | Default SEO meta | None |
| `mediaSettings` | Image defaults, fallbacks | None |
| `techStack` | Technology list | None |
| `resume` | Resume file | None |

### Collections (8)

| Schema | Purpose | Notes |
|---|---|---|
| `experience` | Work history | Has custom duration field, computed |
| `project` | Portfolio projects | Has showcaseDetail, githubRepo, tier |
| `certification` | Credentials | References certificationIssuer, certificationCategory |
| `galleryImage` | Gallery photos | References galleryCategory |
| `recommendation` | Testimonials | None |
| `membership` | Organization memberships | None |
| `post` | Blog posts | References author, category |
| `author` | Blog author | Reference type |
| `category` | Blog category | Reference type |

### Reference/Taxonomy (3)

| Schema | Purpose |
|---|---|
| `certificationCategory` | Certification categories |
| `certificationIssuer` | Certification issuers |
| `galleryCategory` | Gallery categories |

### Object Types (1)

| Schema | Purpose |
|---|---|
| `blockContent` | Portable Text for rich content |

## Duplicate Field Map

### heroSection vs profile (CRITICAL)

| Field | heroSection | profile | Merge Strategy |
|---|---|---|---|
| `fullName` | string, required | string, required | Keep in profile, migrate heroSection value |
| `title` | string, required | string, required | Keep in profile, migrate heroSection value |
| `email` | contactEmail (string) | email (string) | Keep profile.email, migrate heroSection.contactEmail |
| `location` | string | string | Keep in profile |
| `socialLinks` | array of objects | — (has github, linkedin urls) | Keep heroSection.socialLinks in profile |
| `heroRoles` | array of strings | — | Move to profile |
| `availabilityLabel` | string (radio) | string | Keep in profile |
| `resumeUrl` | string | url | Keep profile.resumeUrl |
| `profileImage` | image | avatar (image) | Keep profile.avatar, migrate heroSection.profileImage |
| `highlights` | — | object (years, projects, tech) | Keep in profile |
| `education` | — | array of objects | Keep in profile |
| `summary` | — | text | Keep in profile |

### Decision
**Merge heroSection INTO profile.** The profile singleton already has all the fields heroSection has, plus more. After migration, heroSection schema is removed. The desk structure routes "Hero Section" to the profile singleton.

## Data Volume Report (Actual — 2026-06-12)

| Document Type | Count | Status |
|---|---|---|
| heroSection | 1 | ✅ All fields populated |
| aboutSection | 1 | ✅ aboutContent + education populated |
| profile | 1 | ⚠️ phone, avatar, availabilityLabel, resumeUrl empty |
| siteSettings | 1 | ⚠️ logo, favicon empty |
| seoSettings | 0 | ❌ MISSING |
| mediaSettings | 0 | ❌ MISSING |
| techStack | 1 | ✅ All populated |
| resume | 2 | ⚠️ Should be 1 (singleton) |
| project | 40 | ⚠️ image 8%, liveUrl 38% |
| experience | 4 | ✅ All well populated |
| certification | 12 | ⚠️ No expiresAt/credentialUrl |
| galleryImage | 22 | ✅ All well populated |
| recommendation | 0 | ⚠️ EMPTY |
| membership | 2 | ✅ All populated |
| post | 9 | ✅ All well populated |
| author | 3 | ⚠️ image 33% |
| category | 21 | ⚠️ description 10% |
| certificationCategory | 10 | ✅ All populated |
| certificationIssuer | 2 | ✅ All populated |
| galleryCategory | 7 | ✅ All populated |

## Issues Found

1. **Duplicate slug "klaro"** — `github-Klaro` and `project-1-klaro` both have slug "klaro"
2. **resume has 2 docs** — should be 1 singleton, needs investigation
3. **seoSettings MISSING** — no SEO settings singleton
4. **mediaSettings MISSING** — no media settings singleton
5. **heroSection + profile overlap** — fullName, title, location are identical; availabilityLabel, resumeUrl only in hero; heroRoles, socialLinks, profileImage only in hero

## Cleanup Candidates

### Plugins to Remove
- `skillsToolPlugin` — 42 markdown files, not used in production, skills live in `.agents/skills/`

### Scripts to Review
- `scripts/sanity/seed.ts` — may be outdated
- `scripts/sanity/seed-demo.ts` — may be outdated
- `scripts/sanity/dry-run.ts` — keep (useful for testing)
- `scripts/sanity/manifest.ts` — keep

### Components to Keep
- All custom inputs (ReadingTimeField, ExperienceDurationField) — actively used
- All custom badges (draft, published, scheduled, stale, expiringSoon, featured) — actively used
- All custom inspectors (SeoPreview, ContentHealth) — actively used
- All custom actions (publishAndRefresh, perspectiveSwitcher, viewOnSite, openInPresentation) — actively used
- Welcome.tsx — update after removing skills plugin
- Onboarding.tsx — keep, update steps

## Execution Steps

1. Run GROQ queries to get actual data volumes
2. Document field-level usage (which fields are actually populated)
3. Identify any orphaned documents (referenced documents that no longer exist)
4. Write the migration scripts (EPIC-3) based on this audit
5. Verify no live site components depend on removed fields

## Commit Log
- `chore(sanity-plans): add EPIC-0 audit document`
