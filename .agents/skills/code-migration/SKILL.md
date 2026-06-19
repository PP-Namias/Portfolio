---
name: code-migration
description: Migrate between frameworks, libraries, and code patterns safely.
---

# Code Migration Skill

Safely migrate codebases between frameworks, libraries, and architectural patterns with minimal risk.

## When to use this skill

- Upgrading Next.js versions (currently on 16.2.9 with `--dangerouslyUseUnsupportedNextVersion`)
- Upgrading React versions (currently on 18.x with React 19 in Sanity studio)
- Updating Sanity packages (`sanity`, `next-sanity`, `@sanity/client`)
- Migrating between UI libraries or animation frameworks
- Updating `@opennextjs/cloudflare` or `wrangler`

## Portfolio-specific migration notes

### Next.js 16 migration (done)

The portfolio migrated from Next.js 15 to 16. Key changes:
- `middleware.ts` → `proxy.ts` convention (but OpenNext requires `middleware.ts`, so we kept `middleware.ts`)
- GROQ parser is stricter in Sanity API v2026-02-19 (field ordering matters)
- `output: 'standalone'` set conditionally for Cloudflare builds
- `--dangerouslyUseUnsupportedNextVersion` flag required for OpenNext

### Sanity package updates

When updating Sanity packages:
1. Check `next-sanity` peer dependency (`^14.2 || ^15.0.0` — may not officially support Next.js 16)
2. Run `npm run build` to verify GROQ queries still parse
3. Check `studio/package.json` for Sanity studio compatibility
4. Verify `studio/package-lock.json` doesn't introduce new vulnerabilities

### OpenNext/Cloudflare updates

When updating `@opennextjs/cloudflare`:
1. Check release notes for Next.js 16 support status
2. Test `npm run cloudflare:build` locally
3. Verify `wrangler.jsonc` compatibility_date is current
4. Check if `--dangerouslyUseUnsupportedNextVersion` is still needed

## Workflow

1. **Assess current state** — Document dependencies and patterns
2. **Plan migration** — Create step-by-step migration plan
3. **Set up safety nets** — Tests, feature flags, rollback plan
4. **Incremental migration** — Move in small, verifiable chunks
5. **Validate** — Run `npm run build`, `npm run test -- --run`, `npm run cloudflare:build`
6. **Clean up** — Remove old code and dependencies

## Migration Checklist Template

```markdown
## Migration: [Source] → [Target]

### Pre-Migration
- [ ] Backup repository
- [ ] Run full test suite
- [ ] Document current behavior
- [ ] Create feature branch

### Migration Steps
- [ ] Step 1: [Description]
- [ ] Step 2: [Description]
- [ ] ...

### Post-Migration
- [ ] Run full test suite
- [ ] Manual testing
- [ ] Performance comparison
- [ ] Code review
- [ ] Merge to main
```

## Next.js Pages → App Router

```typescript
// Before: pages/about.tsx
export default function About() {
  return <div>About</div>;
}

// After: app/about/page.tsx
export default function AboutPage() {
  return <div>About</div>;
}
```

## React Class → Functional Component

```tsx
// Before: Class component
class MyComponent extends React.Component<Props, State> {
  state = { count: 0 };

  render() {
    return <div>{this.state.count}</div>;
  }
}

// After: Functional component
function MyComponent() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}
```

## Checklist

- [ ] Migration plan documented
- [ ] Tests written for current behavior
- [ ] Feature flag for gradual rollout
- [ ] Rollback plan defined
- [ ] Performance baseline captured
- [ ] Code review completed
