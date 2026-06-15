---
name: opencode-optimization
description: Optimize OpenCode IDE configuration and workflows
---

# OpenCode Optimization Skill

Optimize OpenCode IDE configuration for maximum productivity with MiMo v2.5.

## When to use this skill

- Setting up OpenCode IDE
- Optimizing AI workflows
- Configuring LSP servers
- Managing MCP servers

## OpenCode Configuration

### MCP Server Categories

| Category | Servers | Purpose |
|----------|---------|---------|
| **Core** | chrome-devtools, github, filesystem | Essential development tools |
| **UI/UX** | @21st-dev/magic, @magicuidesign/mcp | Component generation |
| **Reasoning** | sequential-thinking, memory | Enhanced AI reasoning |
| **Search** | brave-search, fetch | Web research capabilities |
| **Database** | sqlite, redis, postgres | Data management |
| **Cloud** | aws, cloudflare, vercel, docker | Deployment and infrastructure |
| **Monitoring** | sentry, performance, analytics | Application monitoring |
| **Integration** | slack, notion, linear, figma | Team collaboration |
| **Security** | security, dependency-check | Vulnerability scanning |

### LSP Server Configuration

```json
{
  "lsp": {
    "typescript": {
      "command": "npx",
      "args": ["-y", "typescript-language-server", "--stdio"],
      "extensions": [".ts", ".tsx", ".js", ".jsx"]
    },
    "eslint": {
      "command": "npx",
      "args": ["-y", "vscode-eslint-language-server", "--stdio"],
      "extensions": [".ts", ".tsx", ".js", ".jsx"]
    },
    "tailwindcss": {
      "command": "npx",
      "args": ["-y", "@tailwindcss/language-server", "--stdio"],
      "extensions": [".ts", ".tsx", ".js", ".jsx", ".css"]
    }
  }
}
```

## Workflow Optimization

### 1. Task Decomposition
Break complex tasks into smaller, manageable pieces:
- **Component**: Create individual components first
- **Logic**: Implement business logic separately
- **Tests**: Write tests for each piece
- **Integration**: Combine and test together

### 2. Incremental Development
- Start with basic functionality
- Add features incrementally
- Test after each change
- Commit frequently

### 3. Code Quality Pipeline
1. **Write**: Generate code with MiMo
2. **Lint**: Run ESLint checks
3. **Type Check**: Run TypeScript compiler
4. **Test**: Run Vitest suite
5. **Review**: Code review with MiMo
6. **Commit**: Commit with good message

### 4. Performance Monitoring
- Use Lighthouse audits
- Monitor Core Web Vitals
- Track bundle size
- Analyze runtime performance

## MiMo v2.5 Prompt Engineering

### Effective Prompts
- **Be Specific**: "Create a React component for..."
- **Provide Context**: "In the existing codebase, we have..."
- **Show Examples**: "Like the existing [ComponentName]..."
- **Specify Requirements**: "Must include accessibility..."

### Prompt Templates
```
# Component Template
Create [ComponentName] component with:
- TypeScript interface for props
- Tailwind CSS styling
- Framer Motion animations
- ARIA accessibility
- Loading and error states
- Unit tests

# API Template
Create Next.js API route at [path] with:
- Zod request validation
- Proper error responses
- Rate limiting
- CORS headers
- TypeScript types

# Test Template
Write tests for [ComponentName]:
- Test all props and states
- Test user interactions
- Test accessibility
- Test error scenarios
- Mock external dependencies
```

## Checklist

- [ ] MCP servers configured
- [ ] LSP servers enabled
- [ ] Workflow templates created
- [ ] Prompt patterns documented
- [ ] Quality pipeline established
- [ ] Performance monitoring set up
