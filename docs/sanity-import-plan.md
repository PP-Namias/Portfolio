# Sanity GitHub Import Plan

> Comprehensive plan for importing PP-Namias GitHub repository data into Sanity CMS.

**Generated:** 2026-06-12  
**Source repos:** 57 total (13 featured, 17 standard, 27 archived)  
**Target:** Sanity CMS project documents  
**Status:** Plan phase

---

## Table of Contents

1. [Project Curation Strategy](#1-project-curation-strategy)
2. [Sanity Schema Mapping](#2-sanity-schema-mapping)
3. [Import Script Architecture](#3-import-script-architecture)
4. [Data Enrichment Plan](#4-data-enrichment-plan)
5. [Showcase Detail Pages](#5-showcase-detail-pages)
6. [Validation & QA](#6-validation--qa)
7. [Risks & Mitigations](#7-risks--mitigations)
8. [Effort Estimates](#8-effort-estimates)

---

## 1. Project Curation Strategy

### Goal
Select ~35-40 projects from the 57 available to balance portfolio breadth with maintainability.

### Selection Rules

| Rule | Action | Rationale |
|------|--------|-----------|
| **All 13 `featured` from github-projects.json** | Keep | Already curated as showcase-worthy |
| **Standard projects with `showcaseDetail: true`** | Keep | Java-Rice has detail page |
| **Standard projects with unique tech stacks** | Keep | Login-with-Google (Firebase), GizDuino (IoT) |
| **Web Art series (6 CSS art projects)** | Keep 4, archive 2 | Show progression; archive `CSS3-Egg-Asteroid` and `Optimus-Prime-Animation` |
| **Academic exercises (DSA, Simple-Program-Menu, Passed-or-Failed, C-Program)** | Keep 2 | Keep `Final-Program-DSA` and `Simple-Program-Menu`; archive rest |
| **Game projects (Floppy-Bird, Cube-Drift, AdventureTyper, Tekken-8)** | Keep 2 | Keep `Floppy-Bird` and `Cube-Drift`; archive rest |
| **Duplicate/redundant projects** | Archive | `Attendance-Management-System` duplicates `Student-Attendance-Management-System` |
| **Very basic projects (< 50 LOC equivalent)** | Archive | `Passed-or-Failed`, `QR-Code` |

### Final Curated List (~38 projects)

#### Featured Tier (13 projects)
| # | GitHub Repo | Title | Tier | Showcase |
|---|-------------|-------|------|----------|
| 1 | Klaro | Klaro | featured | yes |
| 2 | Portfolio | Namias Portfolio | featured | no |
| 3 | CaseMaster | CaseMaster | featured | yes |
| 4 | Whisper_AI_Real_Time | Whisper AI Real-Time | featured | yes |
| 5 | Whisper-AI-Generate-Subtitles-Transcriptions | Whisper AI Subtitles | featured | yes |
| 6 | Student-Attendance-Management-System | Student Attendance System | featured | yes |
| 7 | Pre-enrollment-Management-System | Pre-Enrollment System | featured | yes |
| 8 | Billing-Management-System | Billing Management System | featured | yes |
| 9 | Car-Dealership-Management-Program | Car Dealership Manager | featured | yes |
| 10 | Java-Rice | Java Rice | featured | yes |
| 11 | Sage-AI | Sage AI | featured | yes |
| 12 | Biometric-Attendance-System-Using-IOT | Biometric IoT Attendance | featured | yes |
| 13 | EVOLVE-OR-PERISH | EVOLVE OR PERISH | featured | yes |

#### Standard Tier (~14 projects)
| # | GitHub Repo | Title | Tier | Showcase |
|---|-------------|-------|------|----------|
| 14 | Gigachad-Accounting-System | Gigachad Accounting | standard | no |
| 15 | Aura-AI-Discord-Bot | Aura AI Discord Bot | standard | no |
| 16 | ATM-System | ATM System | standard | no |
| 17 | UCC-Student-Portal | UCC Student Portal | standard | no |
| 18 | UCC-Access-Module | UCC Access Module | standard | no |
| 19 | Point-of-Sale-System | Point of Sale System | standard | no |
| 20 | Banking-System | Banking System | standard | no |
| 21 | Final-Program-DSA | DSA in Action | standard | no |
| 22 | HCI-Final-Project | HCI Final Project | standard | no |
| 23 | GizDuino-Program | GizDuino Program | standard | no |
| 24 | Tourism-Case-Study | Philippines Tourism | standard | no |
| 25 | PHP-Login | PHP Login System | standard | no |
| 26 | Login-with-Google | Google Login | standard | no |
| 27 | CSD-Bot | CSD Freshman Bot | standard | no |

#### Archived Tier (~11 projects)
| # | GitHub Repo | Title | Tier |
|---|-------------|-------|------|
| 28 | Galaxy-Animation | Galaxy Animation | archived |
| 29 | CSS3-Robot-Web-Art | CSS3 Robot Art | archived |
| 30 | CSS3-Robot-Animation | CSS3 Robot Animation | archived |
| 31 | Short-Clip-Animation | Short Clip Animation | archived |
| 32 | Floppy-Bird | Floppy Bird | archived |
| 33 | Cube-Drift | Cube Drift | archived |
| 34 | Calendar-2023 | Calendar 2023 | archived |
| 35 | PP-Namias.github.io | GitHub Pages Bio | archived |
| 36 | Website-Project | Grade 11 Website | archived |
| 37 | UCC-Programing-Competition-2023 | UCC Programming Competition | archived |
| 38 | My-first-project-in-programming | First Programming Project | archived |

### Projects to EXCLUDE (19 repos)
- `Full-Name-Rotation` — trivial midterm, no technical merit
- `Simple-Program-Menu` — too basic even for archived
- `Passed-or-Failed` — trivial grade checker
- `QR-Code` — minimal utility
- `Java-Program` — code collection, not a project
- `react-js-testing-hub` — experimentation repo
- `Computer-Science-Lecture-Notes` — notes, not code
- `CSS3-Egg-Asteroid` — weak CSS art
- `Optimus-Prime-Animation` — weak CSS art
- `AdventureTyper` — basic game, redundant with Floppy-Bird
- `Tekken-8-LeaderBoard` — personal fun project
- `Reviewer-Surprise` — trivial Chrome extension
- `Git-Going` — event materials
- `Companion-App-AI` — incomplete/prototype
- `Attendance-Management-System` — duplicate of Student-Attendance
- `Gigachad-Accounting-System` (keep as standard, not featured — current script has it as featured but it's in the standard tier in github-projects.json)

---

## 2. Sanity Schema Mapping

### Source → Target Field Mapping

The Sanity `project` schema (`studio/schemaTypes/project.ts`) has these fields. Here is how each maps to GitHub data and the curated overrides:

| Sanity Field | Type | Source | Transform |
|---|---|---|---|
| `order` | number | Manual | Set per tier: featured=1-13, standard=14-27, archived=28-38 |
| `title` | string | `curated.title` or `repo.name` | Direct mapping |
| `slug` | slug | `curated.slug` or generate from `repo.name` | Lowercase, replace non-alphanumeric with `-`, strip leading/trailing `-` |
| `summary` | text (60-320 chars) | `repo.description` or `curated.shortDescription` | Pad to 60 chars min if needed |
| `challenge` | text | Manual enrichment | See Data Enrichment Plan |
| `solution` | text | Manual enrichment | See Data Enrichment Plan |
| `result` | text | Manual enrichment | See Data Enrichment Plan |
| `year` | number | `repo.created_at` year | `new Date(repo.created_at).getFullYear()` |
| `category` | string | `curated.category` | Direct mapping |
| `featured` | boolean | `curated.tier === 'featured'` | Boolean from tier |
| `role` | string | `curated.role` | Direct mapping |
| `technologies` | string[] | GitHub `repo.language` + `repo.topics` + `curated.technologies` | Deduplicate, cap at 8 |
| `achievements` | string[] | `curated.highlights` | Direct mapping |
| `image` | image | Manual upload | See Data Enrichment Plan |
| `gallery` | image[] | Manual upload | See Showcase Detail Pages |
| `liveUrl` | url | `curated.liveURL` or `repo.homepage` | HTTPS only, validate |
| `repositoryUrl` | url | `repo.html_url` | Always set |
| `featuredRank` | number | Based on tier + order | featured=1-13, standard=14, archived=28 |
| `status` | string | Always `'completed'` | All GitHub repos are completed |
| `tier` | string | `curated.tier` | `'featured'` / `'standard'` / `'archived'` |
| `showcaseDetail` | boolean | `curated.showcaseDetail` | Only 8-10 projects get detail pages |
| `shortDescription` | string (max 120) | `curated.shortDescription` | Truncate to 120 chars |
| `highlights` | string[] | `curated.highlights` | Direct mapping |
| `githubRepo` | string | `repo.name` | GitHub repository name |
| `publishAt` | datetime | Omitted on import | Set manually later if needed |

### Document ID Convention
```
github-{repo-name}
```
Example: `github-Klaro`, `github-Portfolio`, `github-CaseMaster`

This matches the existing pattern in `import-github-projects.mjs:742`.

### Sanity Mutation Type
```javascript
// createIfNotExists — idempotent upsert
{
  createIfNotExists: {
    _type: 'project',
    _id: `github-${repo.name}`,
    // ... all fields
  }
}
```

---

## 3. Import Script Architecture

### Overview
Replace the current monolithic `scripts/import-github-projects.mjs` with a modular architecture:

```
scripts/
  import-github-projects.mjs     ← Main orchestrator (rewrite)
  lib/
    github-api.mjs               ← GitHub API client
    sanity-client.mjs            ← Sanity API client
    project-curator.mjs          ← Curated project list + overrides
    data-transform.mjs           ← GitHub → Sanity field mapping
    enrichment.mjs               ← Challenge/solution/result templates
    validation.mjs               ← Pre-import validation
    reporter.mjs                 ← Import summary + diff reporting
```

### Main Orchestrator Flow

```javascript
// scripts/import-github-projects.mjs (rewritten)
async function main() {
  1. Parse CLI args (--dry-run, --token, --github-token, --filter=tier, --verbose)
  2. Load curated project list from project-curator.mjs
  3. For each curated project:
     a. Fetch repo data from GitHub API
     b. Fetch repo languages from GitHub API
     c. Transform to Sanity document via data-transform.mjs
     d. Apply enrichment overrides from enrichment.mjs
     e. Validate document via validation.mjs
     f. If --dry-run: log preview
     g. Else: upsert to Sanity via sanity-client.mjs
  4. Generate import report via reporter.mjs
  5. Exit with appropriate code (0 = success, 1 = errors)
}
```

### GitHub API Client (`lib/github-api.mjs`)

```javascript
const GITHUB_API = 'https://api.github.com';

export async function fetchRepo(owner, repoName, token) {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'namias-portfolio-importer',
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  
  const response = await fetch(`${GITHUB_API}/repos/${owner}/${repoName}`, { headers });
  if (!response.ok) throw new Error(`GitHub ${response.status}: ${repoName}`);
  return response.json();
}

export async function fetchRepoLanguages(owner, repoName, token) {
  // Returns { "JavaScript": 12345, "TypeScript": 6789 } (bytes per language)
  // Use to supplement technologies[] when topics are empty
}

export async function fetchRepoReadme(owner, repoName, token) {
  // Returns raw markdown — useful for challenge/solution enrichment
}
```

### Sanity Client (`lib/sanity-client.mjs`)

```javascript
const SANITY_API_VERSION = '2024-01-01';

export async function upsertProject(doc, token, projectId, dataset) {
  const url = `https://${projectId}.api.sanity.io/${SANITY_API_VERSION}/${dataset}/data/mutate/${doc.githubRepo}`;
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      mutations: [{ createIfNotExists: doc }],
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Sanity ${response.status}: ${error}`);
  }
  return response.json();
}

export async function fetchExistingProjects(token, projectId, dataset) {
  // GROQ query to get all existing project IDs
  // Used for diff reporting: which were created, updated, or orphaned
  const query = '*[_type == "project"]{ _id, title, githubRepo, tier }';
  const url = `https://${projectId}.api.sanity.io/${SANITY_API_VERSION}/data/query/${dataset}?query=${encodeURIComponent(query)}`;
  // ...
}
```

### Data Transform (`lib/data-transform.mjs`)

```javascript
export function buildSanityDocument(repo, curated, languages) {
  const repoLanguages = languages ? Object.keys(languages) : [];
  const topics = repo.topics || [];
  const allTags = [...new Set([...repoLanguages, ...topics, ...(curated.technologies || [])])];
  
  return {
    _type: 'project',
    _id: `github-${repo.name}`,
    
    // Identity
    title: curated.title || repo.name,
    slug: { current: curated.slug || slugify(repo.name) },
    githubRepo: repo.name,
    
    // Content
    summary: padSummary(curated.shortDescription || repo.description || ''),
    shortDescription: (curated.shortDescription || '').slice(0, 120),
    challenge: curated.challenge || null,
    solution: curated.solution || null,
    result: curated.result || null,
    
    // Classification
    year: new Date(repo.created_at).getFullYear(),
    category: curated.category || inferCategory(repo),
    role: curated.role || 'Developer',
    tier: curated.tier || 'standard',
    featured: curated.tier === 'featured',
    status: 'completed',
    
    // Display
    technologies: allTags.slice(0, 8),
    highlights: curated.highlights || [],
    achievements: curated.highlights || [],
    shortDescription: (curated.shortDescription || '').slice(0, 120),
    
    // Links
    liveUrl: curated.liveURL || repo.homepage || null,
    repositoryUrl: repo.html_url,
    
    // Ordering
    order: curated.order || 99,
    featuredRank: curated.featuredRank || null,
    
    // Feature flags
    showcaseDetail: curated.showcaseDetail || false,
    
    // Images (set manually post-import)
    image: null,
    gallery: [],
  };
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function padSummary(text) {
  if (text.length >= 60) return text;
  // Pad short descriptions to meet Sanity validation min:60
  return text + ' '.repeat(60 - text.length);
}

function inferCategory(repo) {
  const topics = (repo.topics || []).map(t => t.toLowerCase());
  if (topics.includes('machine-learning') || topics.includes('ai')) return 'AI/ML';
  if (topics.includes('iot') || topics.includes('arduino')) return 'IoT';
  if (repo.name.includes('bot')) return 'Bot';
  if (repo.language === 'C++' || repo.language === 'C') return 'Academic';
  return 'Web Application';
}
```

### CLI Interface

```bash
# Full import (live)
node scripts/import-github-projects.mjs \
  --token=<sanity-token> \
  --github-token=<gh-token>

# Dry run
node scripts/import-github-projects.mjs --dry-run

# Import only featured tier
node scripts/import-github-projects.mjs --filter=featured

# Verbose mode with per-project diffs
node scripts/import-github-projects.mjs --verbose

# Re-import a single project
node scripts/import-github-projects.mjs --repo=Klaro
```

---

## 4. Data Enrichment Plan

### What Needs Enrichment

The GitHub API provides: name, description, language, topics, dates, URL. It does NOT provide:

| Field | Source | Effort |
|-------|--------|--------|
| `summary` (60-320 chars) | Enhance GitHub description | Low — template + manual review |
| `challenge` | Write per project | Medium — 1-2 sentences per project |
| `solution` | Write per project | Medium — 1-2 sentences per project |
| `result` | Write per project | Medium — 1-2 sentences per project |
| `image` (cover) | Generate or upload | High — need screenshots/thumbnails |
| `gallery` | Upload screenshots | High — manual curation |
| `highlights` | Enhance from README | Low — template available from github-projects.json |

### Challenge/Solution/Result Templates

For projects without manual content, use these templates:

```javascript
// enrichment.mjs
const enrichmentTemplates = {
  'Klaro': {
    challenge: 'Filipino patients struggle to understand medical documents and find affordable healthcare providers, especially in regional dialects like Bisaya and Ilocano.',
    solution: 'Built a full-stack monorepo with Expo (mobile) and Next.js (web) apps, integrating AI-powered document analysis, a multilingual chatbot, and a provider network with geolocation-based discovery.',
    result: 'Delivered a production-ready health companion supporting 3 Filipino dialects with integrated consultation booking and PhilHealth-aware provider filtering.',
  },
  'Portfolio': {
    challenge: 'Needed a performant, secure, and content-managed portfolio that could showcase projects with rich detail pages while maintaining a 100/100 react-doctor score.',
    solution: 'Built with Next.js 14, Sanity CMS, and Gemini AI chat. Implemented multi-layer caching (Redis + ISR), HMAC-secured media gateway, and 278 tests across 19 CI/CD workflows.',
    result: 'Production portfolio at namias.tech with automated security scanning (PentestAgent), AI chat assistant, and zero critical accessibility issues.',
  },
  // ... 36 more entries needed
};

// Fallback template for projects without manual content
function generateEnrichment(repo, curated) {
  return {
    challenge: `Developing a ${curated.category || 'software project'} required solving ${inferredProblem(repo)}.`,
    solution: `Built using ${curated.technologies?.join(', ') || repo.language || 'multiple technologies'} with a focus on ${curated.role?.toLowerCase() || 'full-stack development'}.`,
    result: `Successfully delivered a functional ${curated.category?.toLowerCase() || 'application'} demonstrating ${curated.role?.toLowerCase() || 'software development'} skills.`,
  };
}
```

### Cover Image Strategy

| Approach | Effort | Quality |
|----------|--------|---------|
| **A. GitHub OpenGraph images** | Low | Medium — generic |
| **B. Manual screenshots** | High | High — polished |
| **C. Generated placeholders** | Low | Low — temporary |
| **D. Fallback to no image** | None | None — empty |

**Recommended: Option A + B hybrid**
1. Import script auto-sets `image: null` initially
2. Run a separate script to generate OG image URLs from GitHub repo URLs
3. Later, manually upload curated screenshots for featured projects

```javascript
// Post-import: set cover images from GitHub
// GitHub repos have auto-generated OpenGraph images at:
// https://opengraph.githubassets.com/{hash}/{owner}/{repo}
// But these are not stable URLs. Better approach:
// Use placeholder images from /public/images/projects/ or leave null.
```

### Summary Enhancement Strategy

Current `summary` validation: `min: 60, max: 320` characters.

```javascript
function enhanceSummary(curated, repo) {
  const base = curated.shortDescription || repo.description || '';
  if (base.length >= 60) return base.slice(0, 320);
  
  // Pad with context
  const techContext = curated.technologies?.length 
    ? ` Built with ${curated.technologies.slice(0, 3).join(', ')}.` 
    : '';
  const roleContext = curated.role 
    ? ` Role: ${curated.role}.` 
    : '';
  
  return (base + techContext + roleContext).slice(0, 320);
}
```

---

## 5. Showcase Detail Pages

### Which Projects Get Detail Pages

From the current data, these projects have `showcaseDetail: true`:

| # | Project | Tier | Has challenge/solution/result? | Priority |
|---|---------|------|-------------------------------|----------|
| 1 | Klaro | featured | Needs writing | P0 |
| 2 | CaseMaster | featured | Needs writing | P0 |
| 3 | Whisper AI Real-Time | featured | Needs writing | P0 |
| 4 | Whisper AI Subtitles | featured | Needs writing | P0 |
| 5 | Student Attendance System | featured | Needs writing | P0 |
| 6 | Pre-Enrollment System | featured | Needs writing | P0 |
| 7 | Billing Management System | featured | Needs writing | P0 |
| 8 | Car Dealership Manager | featured | Needs writing | P0 |
| 9 | Java Rice | standard | Needs writing | P1 |
| 10 | Biometric IoT Attendance | featured | Needs writing | P0 |
| 11 | Sage AI | featured | Needs writing | P0 |
| 12 | EVOLVE OR PERISH | featured | Needs writing | P0 |

**Total: 12 showcase detail pages**

### Detail Page Content Requirements

Each showcase project needs these fields populated:

```typescript
interface ShowcaseContent {
  // Required for detail page rendering
  challenge: string;    // 1-3 sentences: What problem was being solved?
  solution: string;     // 1-3 sentences: How was it solved?
  result: string;       // 1-3 sentences: What was the outcome?
  highlights: string[]; // 4-6 bullet points: Key achievements
  
  // Optional but recommended
  image: SanityImage;   // Cover image (required for hero)
  gallery: SanityImage[]; // 3-6 screenshots of the app
  liveUrl: string;      // Link to live demo if available
  
  // Optional advanced content
  impactMetrics: Array<{label: string; value: string}>;
  // Example: [{ label: "Languages Supported", value: "3 dialects" }]
}
```

### Content Writing Guide

For each showcase project, write content following this template:

```markdown
## Challenge (2-3 sentences)
What was the problem? Who was the user? What made it difficult?

## Solution (2-3 sentences)
What approach was taken? What technologies were chosen and why? What was the architecture?

## Result (2-3 sentences)
What was delivered? What impact did it have? Any metrics?

## Highlights (4-6 bullets)
- Specific technical achievement
- User-facing feature
- Integration or API work
- Testing/quality metric
- Unique or interesting aspect
```

### Example: Klaro Detail Content

```javascript
{
  challenge: "Filipino patients frequently struggle to understand medical documents and find affordable healthcare providers, especially when information is only available in English or Tagalog. Regional dialect speakers in Visayas and Northern Luzon face even greater barriers to accessing health information.",
  
  solution: "Built a full-stack monorepo using Turborepo with Expo (React Native) for mobile and Next.js for web. Integrated AI-powered medical document analysis that translates clinical language into patient-friendly explanations, a multilingual chatbot supporting Filipino, Bisaya, and Ilocano, and a geolocation-based provider network with PhilHealth insurance filtering.",
  
  result: "Delivered a production-ready health companion app supporting 3 Filipino dialects with integrated free consultation booking, provider discovery, and AI-assisted document understanding. The system handles real-time chat, document uploads, and location-based care facility recommendations.",
  
  highlights: [
    "Full-stack monorepo with mobile (Expo) and web (Next.js) apps sharing tRPC contracts",
    "AI-powered medical document analysis with patient-friendly language translation",
    "Multilingual chatbot supporting Filipino, Bisaya, and Ilocano dialects",
    "Integrated provider network with geolocation-based care facility discovery",
    "PhilHealth insurance filtering for affordable care recommendations",
    "Better Auth with Drizzle ORM for type-safe database operations"
  ]
}
```

### Gallery Image Requirements

For each showcase project, plan 3-6 gallery images:

| Image | Content | Source |
|-------|---------|--------|
| Hero | App screenshot or concept art | Manual screenshot |
| Feature 1 | Key feature in action | Manual screenshot |
| Feature 2 | Secondary feature | Manual screenshot |
| Architecture | System diagram (optional) | Manual creation |
| Mobile | Mobile view (if applicable) | Manual screenshot |

**Image specs:**
- Format: PNG or WebP
- Resolution: 1200x800 min for gallery, 1920x1080 for hero
- File size: < 500KB per image (optimize before upload)
- Alt text: Required for accessibility

---

## 6. Validation & QA

### Pre-Import Validation

```javascript
// validation.mjs
export function validateDocument(doc, repo) {
  const errors = [];
  const warnings = [];
  
  // Required fields
  if (!doc.title) errors.push('Missing title');
  if (!doc.slug?.current) errors.push('Missing slug');
  if (!doc.summary) errors.push('Missing summary');
  if (doc.summary && doc.summary.length < 60) warnings.push(`Summary too short (${doc.summary.length}/60 min)`);
  if (doc.summary && doc.summary.length > 320) errors.push(`Summary too long (${doc.summary.length}/320 max)`);
  if (!doc.repositoryUrl) warnings.push('Missing repositoryUrl');
  
  // Slug validation
  if (doc.slug?.current && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(doc.slug.current)) {
    errors.push(`Invalid slug: ${doc.slug.current}`);
  }
  
  // URL validation
  if (doc.liveUrl && !doc.liveUrl.startsWith('https://')) {
    errors.push(`liveUrl must be HTTPS: ${doc.liveUrl}`);
  }
  
  // Tier validation
  if (!['featured', 'standard', 'archived'].includes(doc.tier)) {
    errors.push(`Invalid tier: ${doc.tier}`);
  }
  
  // shortDescription length
  if (doc.shortDescription && doc.shortDescription.length > 120) {
    warnings.push(`shortDescription over 120 chars (${doc.shortDescription.length})`);
  }
  
  return { valid: errors.length === 0, errors, warnings };
}
```

### Post-Import Verification

After import, run these checks:

```bash
# 1. Count documents
# GROQ query
*[_type == "project"] | order(tier asc, order asc) {
  _id,
  title,
  tier,
  showcaseDetail,
  slug,
  technologies,
  status
}

# 2. Verify no duplicate slugs
*[_type == "project"]{
  "slug": slug.current,
  count: count(*[_type == "project" && slug.current == ^.slug.current])
} | order(count desc) [count > 1]

# 3. Verify all showcase projects have content
*[_type == "project" && showcaseDetail == true] {
  title,
  hasChallenge: defined(challenge),
  hasSolution: defined(solution),
  hasResult: defined(result),
  hasImage: defined(image),
  highlightCount: count(highlights)
}

# 4. Verify no orphaned documents
*[_type == "project" && !defined(githubRepo)] {
  title,
  _id
}
```

### Automated QA Script

```javascript
// scripts/qa-projects.mjs
async function runQA() {
  const projects = await fetchAllProjects();
  
  console.log(`Total projects: ${projects.length}`);
  console.log(`Featured: ${projects.filter(p => p.tier === 'featured').length}`);
  console.log(`Standard: ${projects.filter(p => p.tier === 'standard').length}`);
  console.log(`Archived: ${projects.filter(p => p.tier === 'archived').length}`);
  
  // Check summary lengths
  const shortSummaries = projects.filter(p => p.summary && p.summary.length < 60);
  if (shortSummaries.length > 0) {
    console.warn(`⚠️ ${shortSummaries.length} projects have summaries under 60 chars`);
  }
  
  // Check showcase completeness
  const showcaseProjects = projects.filter(p => p.showcaseDetail);
  const incompleteShowcase = showcaseProjects.filter(p => !p.challenge || !p.solution || !p.result);
  if (incompleteShowcase.length > 0) {
    console.warn(`⚠️ ${incompleteShowcase.length} showcase projects missing challenge/solution/result`);
  }
  
  // Check for duplicate slugs
  const slugs = projects.map(p => p.slug?.current).filter(Boolean);
  const duplicates = slugs.filter((s, i) => slugs.indexOf(s) !== i);
  if (duplicates.length > 0) {
    console.error(`❌ Duplicate slugs: ${[...new Set(duplicates)].join(', ')}`);
  }
  
  // Check featured rank ordering
  const featured = projects.filter(p => p.tier === 'featured').sort((a, b) => (a.featuredRank || 0) - (b.featuredRank || 0));
  const missingRank = featured.filter(p => !p.featuredRank);
  if (missingRank.length > 0) {
    console.warn(`⚠️ ${missingRank.length} featured projects missing featuredRank`);
  }
}
```

### Visual QA Checklist

After import, verify in Sanity Studio:

- [ ] All projects appear in the Project list
- [ ] Featured projects have `featured: true` and `tier: 'featured'`
- [ ] Showcase projects have `showcaseDetail: true`
- [ ] Slugs are unique and URL-safe
- [ ] Summaries are 60-320 characters
- [ ] Technologies arrays are populated
- [ ] Highlights arrays have 4-6 items
- [ ] Repository URLs are valid HTTPS
- [ ] Live URLs (where applicable) are valid HTTPS
- [ ] No `_rev` conflicts (import was idempotent)

### Frontend QA Checklist

After import, verify on the portfolio:

- [ ] Home page shows 4 recent projects (with `IS_PROJECTS_REVAMP_ENABLED = true`)
- [ ] /projects page shows all projects in grid
- [ ] Tab filtering works (All / Live / Showcase)
- [ ] Showcase projects link to `/projects/[slug]`
- [ ] Detail pages render challenge/solution/result sections
- [ ] Gallery images load (or show graceful fallback)
- [ ] JSON-LD structured data is valid
- [ ] No hydration errors in console
- [ ] Mobile responsive at 320px, 768px, 1024px, 1440px

---

## 7. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| **GitHub API rate limiting** | Import fails mid-way | Medium | Use `--github-token` for 5000 req/hr; implement retry with exponential backoff |
| **Sanity API rate limiting** | Mutations rejected | Low | Batch mutations; add 100ms delay between writes |
| **Duplicate slug errors** | Import fails | Medium | Pre-validate slugs; use `_id` for upsert (idempotent) |
| **Summary validation failure** | Document rejected | Medium | Pad short summaries; validate before upload |
| **Missing images** | Empty hero on detail pages | High | Use GitHub OpenGraph as temp; plan manual upload |
| **Enrichment content quality** | Generic/boring detail pages | Medium | Write content manually for top 10 projects; use templates for rest |
| **Schema mismatch** | Fields rejected | Low | Schema is stable; test with dry-run first |
| **Concurrent imports** | Data corruption | Low | Use `_id`-based upserts; only run one import at a time |
| **Feature flag not enabled** | Revamp not visible | Certain | Set `IS_PROJECTS_REVAMP_ENABLED = true` after import verified |

---

## 8. Effort Estimates

### Phase 1: Script Rewrite (2-3 hours)
- [ ] Refactor `import-github-projects.mjs` into modular architecture
- [ ] Create `lib/github-api.mjs`
- [ ] Create `lib/sanity-client.mjs`
- [ ] Create `lib/data-transform.mjs`
- [ ] Create `lib/validation.mjs`
- [ ] Create `lib/reporter.mjs`
- [ ] Test with `--dry-run`

### Phase 2: Curation & Enrichment (3-4 hours)
- [ ] Finalize curated project list in `lib/project-curator.mjs`
- [ ] Write challenge/solution/result for 12 showcase projects
- [ ] Write enhanced summaries for all 38 projects
- [ ] Validate all content meets Sanity constraints

### Phase 3: Import Execution (1-2 hours)
- [ ] Run dry-run and review output
- [ ] Execute live import
- [ ] Run QA script
- [ ] Verify in Sanity Studio

### Phase 4: Detail Pages (4-6 hours)
- [ ] Upload cover images for 12 showcase projects
- [ ] Upload gallery images (3-6 per showcase project)
- [ ] Write alt text for all images
- [ ] Test detail page rendering

### Phase 5: Frontend Verification (2-3 hours)
- [ ] Enable `IS_PROJECTS_REVAMP_ENABLED`
- [ ] Test home page RecentCard section
- [ ] Test /projects listing page
- [ ] Test /projects/[slug] detail pages
- [ ] Run full test suite
- [ ] Run Lighthouse audit

### Total Estimated Effort: **12-18 hours**

---

## Appendix A: Sanity GROQ Queries

### Fetch all projects for import verification
```groq
*[_type == "project"] | order(order asc) {
  _id,
  title,
  slug,
  tier,
  featured,
  showcaseDetail,
  technologies,
  githubRepo,
  status
}
```

### Fetch showcase projects with full content
```groq
*[_type == "project" && showcaseDetail == true] | order(featuredRank asc) {
  title,
  slug,
  summary,
  challenge,
  solution,
  result,
  highlights,
  technologies,
  image,
  gallery,
  liveUrl,
  repositoryUrl
}
```

### Count by tier
```groq
{
  "featured": count(*[_type == "project" && tier == "featured"]),
  "standard": count(*[_type == "project" && tier == "standard"]),
  "archived": count(*[_type == "project" && tier == "archived"]),
  "total": count(*[_type == "project"])
}
```

---

## Appendix B: GitHub API Reference

| Endpoint | Rate Limit | Purpose |
|----------|------------|---------|
| `GET /repos/{owner}/{repo}` | 5000/hr (auth) | Repo metadata |
| `GET /repos/{owner}/{repo}/languages` | 5000/hr (auth) | Language breakdown |
| `GET /repos/{owner}/{repo}/topics` | 5000/hr (auth) | Repository topics |
| `GET /repos/{owner}/{repo}/readme` | 5000/hr (auth) | README content |

**Authentication:** `Authorization: Bearer {token}` header  
**Unauthenticated limit:** 60 requests/hour (insufficient for 57 repos)

---

## Appendix C: File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `scripts/import-github-projects.mjs` | **Rewrite** | Modular orchestrator |
| `scripts/lib/github-api.mjs` | **Create** | GitHub API client |
| `scripts/lib/sanity-client.mjs` | **Create** | Sanity API client |
| `scripts/lib/project-curator.mjs` | **Create** | Curated project list |
| `scripts/lib/data-transform.mjs` | **Create** | GitHub → Sanity mapping |
| `scripts/lib/enrichment.mjs` | **Create** | Challenge/solution/result content |
| `scripts/lib/validation.mjs` | **Create** | Pre-import validation |
| `scripts/lib/reporter.mjs` | **Create** | Import summary reporting |
| `scripts/qa-projects.mjs` | **Create** | Post-import QA checks |
| `src/lib/features.ts` | **Edit** | Enable `IS_PROJECTS_REVAMP_ENABLED` |
| `src/lib/cms-content.shared.ts` | **Update** | Sync fallback data with import |

---

*This plan is designed to be implemented by any developer (or AI agent) with full context of the Namias Portfolio codebase.*
