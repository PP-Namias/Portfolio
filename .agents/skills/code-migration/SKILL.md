---
name: code-migration
description: Migrate between frameworks, libraries, and code patterns safely.
---

# Code Migration Skill

Safely migrate codebases between frameworks, libraries, and architectural patterns with minimal risk.

## When to use this skill

- Upgrading Next.js versions
- Migrating from Pages Router to App Router
- Upgrading React versions
- Migrating state management solutions
- Updating UI libraries

## Workflow

1. **Assess current state** — Document dependencies and patterns
2. **Plan migration** — Create step-by-step migration plan
3. **Set up safety nets** — Tests, feature flags, rollback plan
4. **Incremental migration** — Move in small, verifiable chunks
5. **Validate** — Run tests and manual verification
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
