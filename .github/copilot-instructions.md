# Copilot Instructions - Portfolio v3

## Stack
React 19 + TanStack Router (file-based) + TanStack Query + HeroUI + Tailwind v4. Static portfolio data lives in `src/assets/portfolio-resources/data/*.json`.

## Core Architecture: Service Layer Pattern

**All data fetching follows Interface → Service → Hook → Component:**

```typescript
// 1. Interface (src/services/core/interface.ts)
export interface ICoreService { getProjects(): Promise<Project[]>; }

// 2. Service (src/services/core/service.ts) - MUST bind methods in constructor
export class CoreService implements ICoreService {
  constructor() { this.getProjects = this.getProjects.bind(this); }
  async getProjects(): ReturnType<ICoreService["getProjects"]> {
    return projects as Project[];
  }
}

// 3. Hook (src/hooks/use-core.ts)
const queryProjects = () => useQuery({ queryFn: coreService.getProjects, queryKey: ["projects"] });

// 4. Component usage
const { data, isLoading, error } = useCore().queryProjects();
```

## Image Optimization (vite-imagetools)

Sections displaying images use `import.meta.glob` to auto-optimize. **All image globs MUST include all supported formats:**

```typescript
// Pattern used in projects.tsx, gallery.tsx, certifications.tsx
// IMPORTANT: Include ALL image formats: png, jpg, jpeg, JPG, jfif, gif, webp
const optimizedImages: Record<string, string> = import.meta.glob(
  "../assets/portfolio-resources/assets/images/projects/*.{png,jpg,jpeg,JPG,jfif,gif,webp}",
  { eager: true, import: "default", query: "?format=webp&meta" }
);
const imageKey = Object.keys(optimizedImages).find(key => key.includes(item.image));
```

**Supported image formats:** `.png`, `.jpg`, `.jpeg`, `.JPG`, `.jfif`, `.gif`, `.webp`

**Note:** PDF files cannot be optimized with vite-imagetools. For PDF certificates, import them directly or use a fallback.

## Component Architecture

| Directory | Purpose | Example |
|-----------|---------|---------|
| `src/sections/` | Page-level layouts | `projects.tsx`, `gallery.tsx` |
| `src/components/features/` | Domain components | `projects/project-card.tsx` |
| `src/components/ui/` | Reusable primitives | `LoadingTile`, `ErrorTile` |
| `src/components/common/` | Shared business logic | `floating-action-button.tsx` |

**Compound Component Pattern** (see `project-card.tsx`):
```tsx
<ProjectCard>
  <ProjectCard.Body>
    <ProjectCard.Image imageUrl={img} />
    <ProjectCard.Title title={t} year={y} />
  </ProjectCard.Body>
</ProjectCard>
```

## Loading/Error States

Always wrap async content:
```tsx
if (isLoading) return <LoadingTile className="h-[280px]" />;
if (error) return <ErrorTile className="h-[280px]" />;
```

## Commands

```bash
npm run dev      # Vite dev (localhost:5173)
npm run build    # tsc + vite build
npm run lint     # ESLint
npx prettier --write .  # Format (Tailwind plugin auto-sorts classes)
```

## Pre-Commit Checklist

**ALWAYS run these commands before committing:**

```bash
# 1. Run linting to catch code quality issues
npm run lint

# 2. Build the project to ensure no TypeScript/compilation errors
npm run build

# 3. (Optional) Format code
npx prettier --write .
```

**Do NOT commit if:**
- `npm run lint` reports errors
- `npm run build` fails
- There are TypeScript type errors

## Adding New Features

**New JSON data type:**
1. Add JSON to `src/assets/portfolio-resources/data/`
2. Add type to `src/services/core/types.ts`
3. Add to `ICoreService` interface → implement in `CoreService` (bind!) → add to `useCore()` hook

**New external API:** Create `src/services/newapi/` with `interface.ts`, `service.ts`, `types.ts` + hook in `src/hooks/`

## External APIs (no auth required)
- GitHub: `api.github.com` + `github-contributions-api.jogruber.de` via `GithubService`
- Last.fm: `LastFmService` for recent tracks
- Contact: FormSubmit.co via `ContactService`

## Key Conventions
- **Type imports**: `import type { ... }` for types only
- **Path alias**: `@/` → `src/` (configured in vite.config.ts)
- **Theming**: CSS vars `--custom-background`, `--custom-secondary` in globals.css
- **Routing**: File-based in `src/routes/`, auto-generates `routeTree.gen.ts`

## Gotchas
- Service methods MUST be bound in constructor or TanStack Query fails
- Image filenames in JSON must match actual files in `assets/images/`
- **Image glob patterns MUST include ALL formats:** `*.{png,jpg,jpeg,JPG,jfif,gif,webp}` - missing formats will cause images not to display
- Restart dev server if routes don't update (`routeTree.gen.ts` regeneration)
- Always run `npm run build` before committing to catch TypeScript errors

## Adding Gallery & Certifications Content

### Gallery Setup Guide

1. **Add images to the gallery folder:**
   ```
   src/assets/portfolio-resources/assets/images/gallery/
   ```
   Supported formats: `.png`, `.jpg`, `.jpeg`, `.JPG`, `.jfif`, `.gif`, `.webp`

2. **Add entries to `gallery.json`:**
   ```json
   // src/assets/portfolio-resources/data/gallery.json
   [
     {
       "title": "Image Title",
       "mediaType": "image",
       "media": "filename.jpg",
       "tags": ["tag1", "tag2"],
       "createdAt": "2025-01-15"
     }
   ]
   ```

3. **GalleryItem type fields:**
   | Field | Type | Required | Description |
   |-------|------|----------|-------------|
   | `title` | string | ✅ | Display title |
   | `mediaType` | `"image"` \| `"video"` \| `"gif"` | ✅ | Media type |
   | `media` | string | ✅ | Filename (must match file in gallery folder) |
   | `tags` | string[] | ✅ | Tags for filtering |
   | `createdAt` | string | ❌ | ISO date (YYYY-MM-DD) |
   | `description` | string | ❌ | Optional description |
   | `thumbnail` | string | ❌ | Thumbnail filename for videos |

### Certifications Setup Guide

1. **Add certificate images to:**
   ```
   src/assets/portfolio-resources/assets/images/certifications/
   ```
   Supported formats: `.png`, `.jpg`, `.jpeg`, `.JPG`, `.jfif`, `.gif`, `.webp`
   
   **Note:** PDF certificates should be converted to images (jpg/png) for display.

2. **Add entries to `certifications.json`:**
   ```json
   // src/assets/portfolio-resources/data/certifications.json
   [
     {
       "title": "Certificate Title",
       "image": "certificate-filename.jpg",
       "issuer": "Issuing Organization",
       "issuedAt": "2025-01-15",
       "tags": ["skill1", "skill2"]
     }
   ]
   ```

3. **Certification type fields:**
   | Field | Type | Required | Description |
   |-------|------|----------|-------------|
   | `title` | string | ✅ | Certificate title |
   | `image` | string | ✅ | Filename (must match file in certifications folder) |
   | `issuer` | string | ✅ | Issuing organization |
   | `issuedAt` | string | ✅ | ISO date (YYYY-MM-DD) |
   | `tags` | string[] | ✅ | Related skills/topics |

### Troubleshooting Images Not Displaying

1. **Check filename match:** The `image`/`media` field in JSON must exactly match the filename
2. **Check file extension:** Ensure the extension is in the glob pattern
3. **Restart dev server:** After adding new images, restart `npm run dev`
4. **Check console:** Look for 404 errors or vite-imagetools warnings
5. **Verify path:** Images must be in the correct subfolder (gallery/, certifications/, projects/)
