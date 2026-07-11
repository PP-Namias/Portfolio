# Code Review Workflow

Systematic approach to reviewing code changes.

## Steps

### 1. Overview
- Understand the change purpose
- Review PR description
- Check linked issues
- Understand the scope

### 2. Correctness
- Logic is correct
- Edge cases handled
- Error handling present
- No off-by-one errors

### 3. Quality
- Code is readable
- Functions are small
- Names are descriptive
- No code duplication

### 4. Security
- No secrets exposed
- Input validation present
- Authentication required
- Rate limiting applied

### 5. Performance
- No unnecessary re-renders
- Efficient algorithms
- Proper memoization
- Lazy loading where needed

### 6. Accessibility
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Screen reader support

## Checklist

### General
- [ ] Code compiles
- [ ] Tests pass
- [ ] No lint errors
- [ ] No console errors

### React
- [ ] Components are pure
- [ ] Hooks dependencies correct
- [ ] Keys are stable
- [ ] No memory leaks

### API
- [ ] Input validation
- [ ] Error handling
- [ ] Rate limiting
- [ ] Authentication

### Styling
- [ ] Responsive design
- [ ] Dark mode support
- [ ] Consistent spacing
- [ ] No layout shift

## Review Comments

### Suggestion
```markdown
**Suggestion**: Consider using `useMemo` here to avoid recalculating on every render.

```tsx
// Current
const filtered = items.filter(item => item.active);

// Suggested
const filtered = useMemo(() => items.filter(item => item.active), [items]);
```
```

### Issue
```markdown
**Issue**: This could cause a memory leak if the component unmounts before the async operation completes.

```tsx
// Current
useEffect(() => {
  fetchData().then(setData);
}, []);

// Suggested
useEffect(() => {
  let cancelled = false;
  fetchData().then(data => {
    if (!cancelled) setData(data);
  });
  return () => { cancelled = true; };
}, []);
```
```

### Praise
```markdown
**Nice**: Clean implementation! I like how you handled the edge case with the fallback value.
```
