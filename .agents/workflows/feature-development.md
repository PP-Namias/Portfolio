# Feature Development Workflow

Systematic approach to implementing new features.

## Steps

### 1. Planning
- Understand the requirements
- Break into smaller tasks
- Estimate complexity
- Identify dependencies

### 2. Design
- Review existing patterns
- Plan component structure
- Design data flow
- Consider edge cases

### 3. Implementation
- Start with data layer
- Build components incrementally
- Add interactivity
- Implement error handling

### 4. Testing
- Write unit tests
- Add integration tests
- Test edge cases
- Verify accessibility

### 5. Polish
- Optimize performance
- Add animations
- Ensure responsive design
- Review code quality

### 6. Documentation
- Update README if needed
- Add JSDoc comments
- Document API changes
- Update changelog

## Template

```markdown
## Feature: [Feature Name]

### Requirements
- [ ] Requirement 1
- [ ] Requirement 2
- [ ] Requirement 3

### Tasks
- [ ] Data layer
- [ ] Component structure
- [ ] UI implementation
- [ ] Testing
- [ ] Documentation

### Technical Design
[Architecture decisions]

### Edge Cases
[Considerations]
```

## Feature Patterns

### New Component
```bash
# 1. Create component file
touch src/components/ui/NewComponent.tsx

# 2. Create test file
touch src/__tests__/components/NewComponent.test.tsx

# 3. Export from barrel
echo "export { NewComponent } from './NewComponent';" >> src/components/ui/index.ts
```

### New API Route
```bash
# 1. Create route file
touch src/app/api/new-endpoint/route.ts

# 2. Create test file
touch src/__tests__/api/new-endpoint.test.ts

# 3. Add to proxy.ts if needed
```

### New Page
```bash
# 1. Create page directory
mkdir -p src/app/new-page

# 2. Create page file
touch src/app/new-page/page.tsx

# 3. Create layout if needed
touch src/app/new-page/layout.tsx
```

## Quality Gates

Before merging:
- [ ] All tests pass
- [ ] TypeScript compiles
- [ ] ESLint passes
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Accessible (keyboard, screen reader)
- [ ] Performance acceptable
- [ ] Code reviewed
