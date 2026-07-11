# Portfolio Development Workflow

Specific workflow for PP Namias portfolio development.

## Project Overview

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **CMS**: Sanity
- **Testing**: Vitest + React Testing Library
- **Deployment**: Vercel

## Development Workflow

### 1. Setup
```bash
npm install
cp .env.example .env.local
# Fill in environment variables
npm run dev
```

### 2. Daily Development
```bash
# Start dev server
npm run dev

# Run tests
npm run test -- --run

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

### 3. Before Committing
```bash
# Run all checks
npm run test -- --run && npx tsc --noEmit && npm run lint

# Build
npm run build
```

## Common Tasks

### Add New Section
1. Create component in `src/components/sections/`
2. Add to `src/components/sections/index.ts`
3. Add to page in `src/app/page.tsx`
4. Add tests in `src/__tests__/components/sections/`
5. Update feature flags in `src/lib/features.ts` if needed

### Add New API Route
1. Create route in `src/app/api/[endpoint]/route.ts`
2. Add tests in `src/__tests__/api/`
3. Update proxy.ts if rate limiting needed
4. Add to API documentation

### Add New Page
1. Create directory in `src/app/`
2. Create `page.tsx`
3. Create `layout.tsx` if needed
4. Add to navigation
5. Add SEO metadata

### Update Sanity Schema
1. Update schema in `studio/sanity.types.ts`
2. Update GROQ queries in `src/lib/queries.ts`
3. Update types in `src/types/`
4. Update data fetchers in `src/lib/cms-content.server.ts`
5. Test queries in Sanity Studio

## File Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── blog/              # Blog pages
│   ├── projects/          # Project pages
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── sections/          # Page sections
│   ├── ui/                # UI components
│   └── providers/         # Context providers
├── lib/                   # Utilities and helpers
│   ├── cms-content.server.ts  # Sanity data fetching
│   ├── media.ts           # Media utilities
│   └── features.ts        # Feature flags
├── types/                 # TypeScript types
└── __tests__/             # Tests
    ├── components/        # Component tests
    ├── api/               # API tests
    └── lib/               # Utility tests
```

## Conventions

### Components
- Functional components with hooks
- TypeScript interfaces for props
- Framer Motion for animations
- Tailwind CSS for styling
- `<JsonLd>` for structured data

### API Routes
- Zod for validation
- Structured logging
- Rate limiting
- Error handling

### Testing
- Unit tests for utilities
- Component tests for UI
- Integration tests for features
- No snapshot tests

### Git
- Conventional commits
- One commit per feature
- Tests pass before merge
- No comments in code

## Quality Gates

### PR Checklist
- [ ] All tests pass
- [ ] TypeScript compiles
- [ ] ESLint passes
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Accessible (keyboard, screen reader)
- [ ] Performance acceptable
- [ ] Code reviewed

### Merge Checklist
- [ ] All CI checks pass
- [ ] At least one approval
- [ ] No merge conflicts
- [ ] Documentation updated
- [ ] Changelog updated
