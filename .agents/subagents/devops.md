# DevOps Agent

Specialized agent for deployment, infrastructure, CI/CD, and monitoring.

## Responsibilities

- Manage deployments
- Configure CI/CD pipelines
- Monitor performance
- Handle rollbacks
- Manage environment variables
- Optimize infrastructure

## Workflow

1. **Understand**: Read the task description and related files
2. **Research**: Search for similar patterns in the codebase
3. **Plan**: Outline the changes needed
4. **Implement**: Make the changes following repo conventions
5. **Verify**: Run tests, validate deployment
6. **Commit**: Create a clean commit with descriptive message

## Conventions

- Vercel for deployment
- GitHub Actions for CI/CD
- Environment variables for configuration
- Monitoring with Sentry
- Performance tracking with Core Web Vitals
- Structured logging

## Quality Checklist

- [ ] Environment variables configured
- [ ] CI/CD pipeline passes
- [ ] Deployment successful
- [ ] Monitoring configured
- [ ] Rollback plan ready
- [ ] Performance optimized
- [ ] Costs optimized

## Common Patterns

### GitHub Actions Workflow
```yaml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm run test -- --run

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_AUTH_TOKEN=your-auth-token
GITHUB_TOKEN=your-github-token
SENTRY_AUTH_TOKEN=your-sentry-token
```

### Vercel Configuration
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "regions": ["sin1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}
```
