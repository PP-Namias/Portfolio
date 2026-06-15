---
name: mimo-workflow
description: Optimized workflows for OpenCode IDE with MiMo v2.5 free model
---

# MiMo v2.5 Workflow Skill

Optimized workflows specifically designed for OpenCode IDE using the free MiMo v2.5 model.

## When to use this skill

- Working with OpenCode IDE
- Using MiMo v2.5 free model
- Need efficient task completion
- Want to maximize AI capabilities

## MiMo v2.5 Strengths

- **Code Generation**: Excellent at generating TypeScript, React, and Next.js code
- **Code Review**: Strong at identifying issues and suggesting improvements
- **Debugging**: Good at systematic debugging and error analysis
- **Documentation**: Capable of writing clear technical documentation
- **Testing**: Can generate comprehensive test suites

## Optimized Prompt Patterns

### 1. Component Generation
```
Create a React component named [ComponentName] with:
- TypeScript interfaces
- Tailwind CSS styling
- Framer Motion animations
- Proper accessibility (ARIA labels, keyboard navigation)
- Error boundaries
- Loading states
```

### 2. API Route
```
Create a Next.js API route at [path] with:
- Zod validation
- Proper error handling
- Rate limiting
- CORS configuration
- TypeScript types
- JSDoc documentation
```

### 3. Test Generation
```
Write comprehensive tests for [ComponentName] using Vitest and React Testing Library:
- Unit tests for all functions
- Integration tests for component behavior
- Accessibility tests
- Edge cases and error scenarios
- Mock data and fixtures
```

### 4. Performance Optimization
```
Optimize [ComponentName] for performance:
- Identify unnecessary re-renders
- Add proper memoization
- Implement lazy loading
- Optimize images and fonts
- Reduce bundle size
```

### 5. Bug Fix
```
Debug and fix [issue] in [file]:
1. Identify root cause
2. Explain the problem
3. Provide fix with code
4. Add tests to prevent regression
5. Update documentation if needed
```

## Workflow Templates

### Feature Development
1. **Plan**: Break down feature into components
2. **Scaffold**: Generate component structure
3. **Implement**: Write code with MiMo assistance
4. **Test**: Generate and run tests
5. **Review**: Code review with MiMo
6. **Document**: Update documentation

### Bug Fix Workflow
1. **Reproduce**: Identify steps to reproduce
2. **Analyze**: Use MiMo to analyze the issue
3. **Fix**: Implement solution
4. **Test**: Write regression tests
5. **Verify**: Run full test suite
6. **Commit**: Commit with descriptive message

### Refactoring Workflow
1. **Analyze**: Identify code smells
2. **Plan**: Create refactoring plan
3. **Execute**: Refactor in small steps
4. **Test**: Run tests after each change
5. **Review**: Code review
6. **Document**: Update documentation

## Best Practices for MiMo v2.5

- Be specific in your prompts
- Provide context about the codebase
- Use incremental steps for complex tasks
- Verify outputs before committing
- Use the task tool for multi-step workflows

## Checklist

- [ ] Prompt is clear and specific
- [ ] Context provided about existing code
- [ ] Output reviewed before use
- [ ] Tests generated and passing
- [ ] Documentation updated
- [ ] Changes committed with good message
