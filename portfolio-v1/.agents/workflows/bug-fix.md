# Bug Fix Workflow

Systematic approach to finding and fixing bugs.

## Steps

### 1. Reproduce
- Understand the bug description
- Find the relevant files
- Reproduce the issue locally
- Document the expected vs actual behavior

### 2. Investigate
- Check console errors
- Review network requests
- Examine component state
- Look for similar issues in codebase

### 3. Root Cause
- Identify the underlying cause
- Check for edge cases
- Review related code
- Consider systemic issues

### 4. Fix
- Implement the minimal fix
- Follow repo conventions
- Add error handling if needed
- Consider preventive measures

### 5. Verify
- Test the fix locally
- Run relevant tests
- Check for regressions
- Verify edge cases

### 6. Commit
- Create descriptive commit message
- Reference issue if applicable
- Include test if new behavior
- Update documentation if needed

## Template

```markdown
## Bug Fix

### Issue
[Description of the bug]

### Root Cause
[What was causing the bug]

### Fix
[What was changed to fix it]

### Verification
- [ ] Bug is fixed
- [ ] Tests pass
- [ ] No regressions
- [ ] Edge cases handled
```

## Common Bug Patterns

### React State Issues
```tsx
// Wrong - state not updating
const [count, setCount] = useState(0);
setCount(count + 1); // May not update immediately

// Correct - use functional update
setCount(prev => prev + 1);
```

### Async Issues
```tsx
// Wrong - missing await
fetchData().then(data => setData(data));

// Correct - proper async/await
useEffect(() => {
  const loadData = async () => {
    const data = await fetchData();
    setData(data);
  };
  loadData();
}, []);
```

### Memory Leaks
```tsx
// Wrong - missing cleanup
useEffect(() => {
  const interval = setInterval(() => {}, 1000);
}, []);

// Correct - cleanup on unmount
useEffect(() => {
  const interval = setInterval(() => {}, 1000);
  return () => clearInterval(interval);
}, []);
```
