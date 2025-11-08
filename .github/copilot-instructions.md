# Copilot Instructions - Portfolio v3

## Stack & Architecture
React 19 SPA with **TanStack Router** (file-based), **TanStack Query** (data), **HeroUI** (UI), **Tailwind v4** (styling). Portfolio content is static JSON in `src/assets/portfolio-resources/data/`.

## Critical Patterns

### 1. Service Layer (3-Tier Pattern)
Data fetching uses **Interface → Service → Hook** pattern:

```typescript
// 1. Interface defines contract (src/services/core/interface.ts)
export interface ICoreService {
  getProjects(): Promise<Project[]>;
}

// 2. Service implements (src/services/core/service.ts)
export class CoreService implements ICoreService {
  constructor() {
    this.getProjects = this.getProjects.bind(this); // MUST bind
  }
  async getProjects(): ReturnType<ICoreService["getProjects"]> {
    return projects as Project[]; // JSON import
  }
}

// 3. Hook wraps with TanStack Query (src/hooks/use-core.ts)
export const useCore = () => {
  const coreService = new CoreService();
  const queryProjects = () => useQuery({
    queryFn: coreService.getProjects,
    queryKey: ["projects"],
  });
  return { queryProjects };
};

// 4. Usage in components
const { data } = useCore().queryProjects();
```

**Adding new data**: Follow all 3 steps + bind constructor.

### 2. Static Content as API
JSON files in `src/assets/portfolio-resources/data/` are imported by services as if calling an API:
- `projects.json`, `experiences.json`, `certifications.json`, `technologies.json`, `socials.json`, `gallery.json`
- Change content: Edit JSON directly
- Media references: Filename strings resolved by Vite globs

### 3. Image Optimization Pattern
Every section that displays images uses `import.meta.glob` with `vite-imagetools`:

```typescript
// Standard pattern (see gallery.tsx, projects.tsx, main.tsx)
const optimizedImages: Record<string, string> = import.meta.glob(
  "../assets/portfolio-resources/assets/images/projects/*.png",
  { eager: true, import: "default", query: "?format=webp&meta" }
);

// Match JSON filename to optimized path
const imageKey = Object.keys(optimizedImages).find(key => 
  key.includes(item.media)
);
const imageUrl = imageKey ? optimizedImages[imageKey] : item.media;
```

### 4. Component Organization
- `src/sections/`: Page layouts (Main, TabPanel, Gallery, Projects, Experiences)
- `src/components/features/`: Domain logic by feature (`github/`, `projects/`, `gallery/`)
- `src/components/ui/`: Reusable UI (`LoadingTile`, `ErrorTile`, `MetricCard`)
- `src/components/partials/`: Layout (`Header`, `Footer`)
- `src/components/common/`: Shared business logic

### 5. Loading/Error States
Always wrap async content with tiles:

```tsx
if (isLoading) return <LoadingTile className="h-[280px]" />;
if (error) return <ErrorTile className="h-[280px]" />;
```

### 6. Routing (TanStack Router)
- File-based: `src/routes/*.tsx` → auto-generates `routeTree.gen.ts`
- Root route (`__root.tsx`): Wraps with devtools
- Main route (`index.tsx`): 2-column responsive layout
- QueryClient passed via router context

### 7. Theming
- Context: `src/context/theme-context.tsx` (light/dark/system)
- CSS variables: `src/globals.css` defines `--custom-background`, `--custom-secondary`
- Toggle: `useThemeContext().toggleTheme()`
- Classes: `bg-custom-background`, `bg-custom-secondary`

### 8. Floating Action Button
- Component: `src/components/common/floating-action-button.tsx`
- Speed dial menu with quick actions (Schedule, Download, Contact)
- Uses Framer Motion for animations
- Self-contained, no props needed

### 9. Search & Filter Pattern
- Example: `ProjectSearchFilter` component
- Real-time filtering with useState
- Multiple filter types (search, dropdown, tags)
- Callback pattern: `onFilterChange(filtered: T[])`

## Development Commands
```bash
npm run dev      # Vite dev server (localhost:5173)
npm run build    # tsc + vite build
npm run lint     # ESLint (typescript-eslint + react-hooks)
npm run preview  # Preview production build
```

## Formatting Conventions

### Prettier Configuration
Project uses Prettier with **Tailwind CSS plugin** (`.prettierrc`):
- **Tailwind Class Sorting**: Automatically sorts Tailwind classes in recommended order
- **Run manually**: `npx prettier --write .` (no npm script defined)
- **IDE Integration**: Configure editor to format on save

### Code Style Patterns
From existing codebase:
- **Imports**: Group by external → internal, single line for simple imports
- **Type Imports**: Use `import type { ... }` for type-only imports
- **String Quotes**: Double quotes (Prettier default)
- **Component Props**: Destructure in function signature when few props
- **Tailwind Classes**: Long className strings on separate line, multi-line for complex HeroUI `classNames` objects
- **Arrow Functions**: Implicit returns for simple JSX, explicit for logic

Example:
```tsx
// Good: Tailwind plugin auto-sorts classes
<div className="flex h-[85vh] flex-col space-y-2 overflow-y-scroll lg:h-full">
  
// Good: Multi-line for complex classNames objects
<Tabs
  classNames={{
    tabList: "w-max m-[3px] p-0 dark:bg-background",
    base: "w-full bg-custom-secondary dark:bg-background",
  }}
>
```

## External Integrations
- **GitHub API**: `GithubService` → `api.github.com` + `github-contributions-api.jogruber.de` (no auth)
- **Last.fm**: `LastFmService` → recent tracks
- **Contact Form**: `ContactService` → FormSubmit.co (`hello@jadecabrera.com`)
- **PDF Resume**: `@react-pdf-viewer/core` + `pdfjs-dist@3.4.120`

## Key File Paths
- Entry: `src/main.tsx` → `src/App.tsx` (providers: Theme, HeroUI, QueryClient, Router)
- Config: `vite.config.ts` (alias `@` → `/src`, plugins: router, imagetools, tailwind)
- Types: `src/services/*/types.ts`, `src/types/*.ts`
- Data: `src/assets/portfolio-resources/data/*.json`

## Adding Features

**New JSON Data Type**:
1. Add `src/assets/portfolio-resources/data/newtype.json`
2. Define type in `src/services/core/types.ts`
3. Add method to `ICoreService` interface
4. Implement in `CoreService` (import + bind)
5. Add `queryNewType()` to `useCore()` hook

**New External API**:
1. Create `src/services/newapi/` (interface.ts, service.ts, types.ts)
2. Create `src/hooks/use-newapi.ts`
3. Use axios for HTTP calls

**New Tab**:
1. Create section in `src/sections/newsection.tsx`
2. Add `<Tab>` to `TabPanel` component

## Common Issues
- **Routes not working**: Restart dev server, check `routeTree.gen.ts` regenerated
- **Images not loading**: Verify JSON filename matches file in `assets/images/`, glob pattern includes extension
- **TypeScript errors**: Service methods must bind in constructor, return types match interface
- **Build fails**: Run `npm run lint` first, check `@/` alias resolves
