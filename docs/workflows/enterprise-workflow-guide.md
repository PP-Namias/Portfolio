# Professional Enterprise Workflow Guide

> A comprehensive guide to enterprise-grade development practices. This document explains **what**, **why**, and **how** for every workflow — designed to showcase professionalism to future teammates and employers.

---

## Table of Contents

1. [Why Enterprise Workflow Matters](#1-why-enterprise-workflow-matters)
2. [Git Branching Strategy](#2-git-branching-strategy)
3. [Environment Management](#3-environment-management)
4. [Blue-Green Deployment](#4-blue-green-deployment)
5. [CI/CD Pipeline](#5-cicd-pipeline)
6. [Code Review Process](#6-code-review-process)
7. [Testing Strategy](#7-testing-strategy)
8. [Monitoring & Observability](#8-monitoring--observability)
9. [Incident Response](#9-incident-response)
10. [Documentation Standards](#10-documentation-standards)
11. [Team Collaboration](#11-team-collaboration)
12. [Quick Reference Cheat Sheet](#12-quick-reference-cheat-sheet)

---

## 1. Why Enterprise Workflow Matters

### The Problem Without It

```
Developer A pushes directly to main
Developer B pulls and gets broken code
No one knows what changed or why
Production goes down at 2 AM
No one can rollback because there's no process
```

### The Enterprise Approach

```
Feature branch → Pull request → Code review → Automated tests → Staging → Production
     ↓              ↓              ↓              ↓              ↓          ↓
  Isolated      Discussed      Approved       Verified       Validated   Deployed
```

### What It Shows Employers

| Skill | What They See |
|-------|---------------|
| **Branching Strategy** | You understand team coordination |
| **Code Review** | You value quality and knowledge sharing |
| **Automated Testing** | You prevent bugs, not just fix them |
| **Blue-Green Deploy** | You understand zero-downtime deployments |
| **Monitoring** | You think about production health |
| **Documentation** | You communicate clearly |

---

## 2. Git Branching Strategy

### The Model: GitFlow with Staging

```
main (production)
  ↑
  ├── release/v1.2.0
  │     ↑
  │     ├── feature/user-auth
  │     ├── feature/blog-comments
  │     └── bugfix/login-error
  │
  ├── staging (pre-production)
  │     ↑
  │     ├── feature/user-auth
  │     └── feature/blog-comments
  │
  └── develop (integration)
        ↑
        ├── feature/new-component
        └── feature/api-endpoint
```

### Branch Types

| Branch | Purpose | Lifetime | Merges Into |
|--------|---------|----------|-------------|
| `main` | Production code | Permanent | — |
| `staging` | Pre-production testing | Permanent | `main` |
| `develop` | Integration branch | Permanent | `staging` |
| `feature/*` | New features | Temporary | `develop` |
| `bugfix/*` | Bug fixes | Temporary | `develop` |
| `hotfix/*` | Critical production fixes | Temporary | `main` + `staging` + `develop` |
| `release/*` | Release preparation | Temporary | `main` + `staging` |

### Branch Naming Convention

```bash
# Features
feature/user-authentication
feature/blog-comments-system
feature/sanity-cms-integration

# Bug fixes
bugfix/login-form-validation
bugfix/image-loading-error

# Hotfixes (critical production issues)
hotfix/security-vulnerability-patch

# Releases
release/v1.2.0
release/v2.0.0
```

### Workflow: Feature Development

```bash
# 1. Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/user-authentication

# 2. Work on feature (commit often)
git add .
git commit -m "feat(auth): add login form component"

# 3. Push and create PR
git push origin feature/user-authentication

# 4. Create PR: feature/user-authentication → develop
# 5. Code review + CI checks pass
# 6. Merge to develop

# 7. Delete feature branch
git branch -d feature/user-authentication
git push origin --delete feature/user-authentication
```

### Workflow: Hotfix (Critical Production Issue)

```bash
# 1. Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/security-patch

# 2. Fix the issue
# 3. Commit
git commit -m "fix(security): patch XSS vulnerability"

# 4. Create PR: hotfix → main
# 5. After merge to main, also merge to staging and develop
git checkout staging
git merge hotfix/security-patch
git checkout develop
git merge hotfix/security-patch

# 6. Tag the release
git tag -a v1.2.1 -m "Security patch"
git push origin v1.2.1
```

### Why This Works

- **Isolation**: Each feature is developed in isolation
- **Quality**: Code review before merge
- **Traceability**: Every change has a PR and commit history
- **Flexibility**: Hotfixes don't wait for release cycles
- **Safety**: `main` is always deployable

---

## 3. Environment Management

### Environment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        PRODUCTION                           │
│                    (main branch)                            │
│                    vercel.app                               │
├─────────────────────────────────────────────────────────────┤
│                        STAGING                              │
│                    (staging branch)                         │
│                    staging.vercel.app                       │
├─────────────────────────────────────────────────────────────┤
│                        DEVELOP                              │
│                    (develop branch)                         │
│                    develop.vercel.app                       │
├─────────────────────────────────────────────────────────────┤
│                        PREVIEW                              │
│                    (PR branches)                            │
│                    pr-123.vercel.app                        │
├─────────────────────────────────────────────────────────────┤
│                        LOCAL                                │
│                    (your machine)                           │
│                    localhost:3000                           │
└─────────────────────────────────────────────────────────────┘
```

### Environment Variables

```bash
# .env.local (local development)
NEXT_PUBLIC_SANITY_PROJECT_ID=nl0qw78w
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_AUTH_TOKEN=local-dev-token
GITHUB_TOKEN=local-dev-token

# .env.staging (staging environment)
NEXT_PUBLIC_SANITY_PROJECT_ID=nl0qw78w
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_AUTH_TOKEN=staging-token
GITHUB_TOKEN=staging-token

# .env.production (production environment)
NEXT_PUBLIC_SANITY_PROJECT_ID=nl0qw78w
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_AUTH_TOKEN=production-token
GITHUB_TOKEN=production-token
```

### Environment-Specific Behavior

```typescript
// src/lib/env.ts
export const env = {
  isProduction: process.env.NODE_ENV === 'production',
  isStaging: process.env.VERCEL_ENV === 'staging',
  isPreview: process.env.VERCEL_ENV === 'preview',
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // Feature flags per environment
  enableAnalytics: process.env.NODE_ENV === 'production',
  enableErrorTracking: process.env.NODE_ENV === 'production',
  enableDebugLogs: process.env.NODE_ENV === 'development',
} as const;
```

### Why Multiple Environments

| Environment | Purpose | Risk Level |
|-------------|---------|------------|
| **Local** | Individual development | None |
| **Preview** | PR testing | None |
| **Develop** | Integration testing | Low |
| **Staging** | Pre-production validation | Medium |
| **Production** | Live users | High |

---

## 4. Blue-Green Deployment

### What Is Blue-Green Deployment?

Blue-green deployment is a strategy that maintains **two identical production environments**:

- **Blue**: Current live version
- **Green**: New version being deployed

At any time, only one is live. To deploy, you switch traffic from Blue to Green.

### How It Works with Vercel

Vercel implements blue-green deployment automatically through **Immutable Deployments**:

```
┌─────────────────────────────────────────────────────────┐
│                    VERCEL EDGE                           │
│                                                          │
│  ┌──────────────┐         ┌──────────────┐              │
│  │   BLUE       │         │   GREEN      │              │
│  │  (v1.0.0)    │◄───────│  (v1.1.0)    │              │
│  │  LIVE        │         │  STANDBY     │              │
│  └──────────────┘         └──────────────┘              │
│         │                        │                       │
│         │    ┌──────────┐        │                       │
│         └───►│  ROUTER   │◄───────┘                       │
│              └──────────┘                                │
│                   │                                       │
│                   ▼                                       │
│              ┌─────────┐                                 │
│              │  USER   │                                 │
│              └─────────┘                                 │
└─────────────────────────────────────────────────────────┘
```

### Deployment Process

```bash
# 1. Push to staging branch
git push origin staging

# 2. Vercel automatically deploys to staging.vercel.app
# 3. Run smoke tests on staging
npm run test:smoke

# 4. Create release PR: staging → main
# 5. After approval, merge to main
# 6. Vercel deploys to production with zero downtime
```

### Rollback Strategy

If something goes wrong after deployment:

```bash
# Option 1: Vercel Dashboard - Instant rollback
# Go to deployments → Click "Promote to Production" on previous version

# Option 2: Git rollback
git revert HEAD
git push origin main

# Option 3: Hotfix branch
git checkout -b hotfix/fix-critical-bug main
# Fix the issue
# Merge to main, staging, and develop
```

### Why Blue-Green

- **Zero downtime**: Users never see an error page
- **Instant rollback**: One click to revert
- **Testing in production**: Test the green environment before switching
- **Reduced risk**: If something fails, blue is still running

---

## 5. CI/CD Pipeline

### Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CI/CD PIPELINE                            │
│                                                                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │  COMMIT  │───►│  BUILD   │───►│  TEST    │───►│ DEPLOY   │  │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘  │
│       │               │               │               │         │
│       ▼               ▼               ▼               ▼         │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │ Lint     │    │ Compile  │    │ Unit     │    │ Preview  │  │
│  │ Format   │    │ Bundle   │    │ Integ    │    │ Staging  │  │
│  │ Type     │    │ Analyze  │    │ E2E      │    │ Prod     │  │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### GitHub Actions Configuration

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, staging, develop]
  pull_request:
    branches: [main, staging, develop]

env:
  NODE_VERSION: '20'

jobs:
  # Stage 1: Code Quality
  lint:
    name: Code Quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm run format:check

  # Stage 2: Testing
  test:
    name: Tests
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run test -- --run --coverage
      - uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}

  # Stage 3: Build
  build:
    name: Build
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build
          path: .next

  # Stage 4: Deploy to Preview (PRs only)
  deploy-preview:
    name: Deploy Preview
    runs-on: ubuntu-latest
    needs: build
    if: github.event_name == 'pull_request'
    environment:
      name: preview
      url: ${{ steps.deploy.outputs.url }}
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        id: deploy
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  # Stage 5: Deploy to Staging
  deploy-staging:
    name: Deploy Staging
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/staging'
    environment:
      name: staging
      url: https://staging.vercel.app
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--pre'

  # Stage 6: Deploy to Production
  deploy-production:
    name: Deploy Production
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://vercel.app
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Pipeline Stages Explained

| Stage | What It Does | Why It Matters |
|-------|--------------|----------------|
| **Lint** | Checks code style and types | Catches errors before they reach code review |
| **Test** | Runs unit and integration tests | Ensures changes don't break existing functionality |
| **Build** | Compiles the application | Verifies the app can be built successfully |
| **Preview** | Deploys PR to temporary URL | Allows testing before merge |
| **Staging** | Deploys to staging environment | Validates in production-like environment |
| **Production** | Deploys to live environment | Makes changes available to users |

---

## 6. Code Review Process

### The Code Review Checklist

```markdown
## Code Review Checklist

### Correctness
- [ ] Code does what it's supposed to do
- [ ] Edge cases are handled
- [ ] Error handling is present
- [ ] No off-by-one errors

### Quality
- [ ] Code is readable and understandable
- [ ] Functions are small and focused
- [ ] Names are descriptive
- [ ] No code duplication

### Security
- [ ] No secrets exposed
- [ ] Input validation present
- [ ] Authentication required where needed
- [ ] Rate limiting applied

### Performance
- [ ] No unnecessary re-renders
- [ ] Efficient algorithms used
- [ ] Proper memoization
- [ ] Lazy loading where appropriate

### Accessibility
- [ ] Semantic HTML used
- [ ] ARIA labels where needed
- [ ] Keyboard navigation works
- [ ] Screen reader compatible

### Testing
- [ ] Tests are included
- [ ] Edge cases are tested
- [ ] Tests are readable
- [ ] No flaky tests
```

### PR Template

```markdown
## Description
[What does this PR do?]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?
- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have updated documentation accordingly
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing unit tests pass locally

## Screenshots (if applicable)
[Add screenshots to illustrate changes]
```

### Review Comments Best Practices

```markdown
# Suggestion (non-blocking)
**Suggestion**: Consider using `useMemo` here to avoid recalculating on every render.

# Issue (blocking)
**Issue**: This could cause a memory leak if the component unmounts before the async operation completes.

# Question (non-blocking)
**Question**: Why did you choose this approach over using a custom hook?

# Praise (non-blocking)
**Nice**: Clean implementation! I like how you handled the edge case.
```

---

## 7. Testing Strategy

### Testing Pyramid

```
                    ┌─────────┐
                    │   E2E   │  ← Few, slow, high confidence
                    ├─────────┤
                  │ Integration │  ← Some, medium speed
                  ├─────────────┤
                │     Unit      │  ← Many, fast, low confidence
                └───────────────┘
```

### Test Types

| Type | What It Tests | Speed | Confidence | Quantity |
|------|---------------|-------|------------|----------|
| **Unit** | Individual functions/components | Fast | Low | Many |
| **Integration** | Component interactions | Medium | Medium | Some |
| **E2E** | Full user workflows | Slow | High | Few |

### Testing Commands

```bash
# Run all tests
npm run test -- --run

# Run tests in watch mode (development)
npm run test

# Run specific test file
npm run test -- --run src/__tests__/components/BlogSection.test.tsx

# Run tests with coverage
npm run test -- --run --coverage

# Run E2E tests (if configured)
npm run test:e2e
```

### Test Writing Best Practices

```typescript
// Good: Descriptive test names
describe('BlogSection', () => {
  it('renders the Blog header and a count badge', () => {
    // Test implementation
  });

  it('shows the latest 3 posts sorted by date desc', () => {
    // Test implementation
  });

  it('exposes a "View all N posts" link to /blog', () => {
    // Test implementation
  });
});

// Good: Arrange-Act-Assert pattern
it('sends a message and calls fetch', async () => {
  // Arrange
  const user = userEvent.setup();
  render(<ChatPanel />);
  
  // Act
  await user.type(screen.getByRole('textbox'), 'Hello');
  await user.click(screen.getByRole('button', { name: /send/i }));
  
  // Assert
  expect(mockFetch).toHaveBeenCalledWith('/api/chat', expect.objectContaining({
    method: 'POST',
    body: JSON.stringify({ message: 'Hello' }),
  }));
});
```

---

## 8. Monitoring & Observability

### The Three Pillars

```
┌─────────────────────────────────────────────────────────────┐
│                    OBSERVABILITY                             │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    LOGS      │  │   METRICS    │  │   TRACES     │      │
│  │              │  │              │  │              │      │
│  │ What happened│  │ How much     │  │ Where time   │      │
│  │              │  │              │  │ was spent    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Logging Strategy

```typescript
// src/lib/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  requestId?: string;
  userId?: string;
  action?: string;
  [key: string]: unknown;
}

export function log(level: LogLevel, message: string, context?: LogContext) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context,
  };

  if (process.env.NODE_ENV === 'development') {
    console.log(JSON.stringify(entry, null, 2));
  }

  // In production, send to logging service
  if (process.env.NODE_ENV === 'production') {
    // Send to Sentry, DataDog, etc.
  }
}

// Usage
log('info', 'User authenticated', { userId: '123', action: 'login' });
log('error', 'API request failed', { requestId: 'abc', error: 'Timeout' });
```

### Error Tracking with Sentry

```typescript
// src/lib/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.VERCEL_ENV || 'development',
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

// Capture errors
try {
  riskyOperation();
} catch (error) {
  Sentry.captureException(error);
}

// Capture messages
Sentry.captureMessage('Something happened', 'info');
```

### Performance Monitoring

```typescript
// src/lib/performance.ts
export function measurePerformance<T>(name: string, fn: () => T): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  console.log(`${name}: ${end - start}ms`);
  
  // Send to monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Send metric
  }
  
  return result;
}

// Usage
const data = measurePerformance('fetchPosts', () => {
  return fetchPosts();
});
```

---

## 9. Incident Response

### Incident Severity Levels

| Level | Description | Response Time | Example |
|-------|-------------|---------------|---------|
| **P0** | Complete outage | Immediate | Site is down |
| **P1** | Major feature broken | < 1 hour | Login doesn't work |
| **P2** | Minor feature broken | < 4 hours | Blog pagination fails |
| **P3** | Cosmetic issue | < 24 hours | Button misaligned |

### Incident Response Process

```
┌─────────────────────────────────────────────────────────────┐
│                  INCIDENT RESPONSE                           │
│                                                              │
│  1. DETECT    → Monitoring alerts, user reports              │
│  2. TRIAGE    → Assess severity, assign responder            │
│  3. MITIGATE  → Quick fix or rollback                        │
│  4. RESOLVE   → Root cause fix                               │
│  5. REVIEW    → Post-mortem, prevent recurrence              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Rollback Procedure

```bash
# Option 1: Vercel Dashboard (fastest)
# Go to Deployments → Find previous working deployment → Promote to Production

# Option 2: Git revert
git revert HEAD --no-edit
git push origin main

# Option 3: Hotfix branch
git checkout -b hotfix/rollback-v1.0.0 main
git revert HEAD
git push origin hotfix/rollback-v1.0.0
# Create PR, merge, deploy
```

### Post-Mortem Template

```markdown
# Incident Post-Mortem

## Summary
- **Date**: YYYY-MM-DD
- **Duration**: X hours Y minutes
- **Severity**: P0/P1/P2/P3
- **Impact**: [What users experienced]

## Timeline
- HH:MM - Issue detected
- HH:MM - Team notified
- HH:MM - Mitigation started
- HH:MM - Issue resolved
- HH:MM - Post-mortem started

## Root Cause
[What caused the incident]

## What Went Well
- [Positive aspect 1]
- [Positive aspect 2]

## What Went Wrong
- [Negative aspect 1]
- [Negative aspect 2]

## Action Items
- [ ] [Action 1] - Owner - Due date
- [ ] [Action 2] - Owner - Due date

## Lessons Learned
- [Lesson 1]
- [Lesson 2]
```

---

## 10. Documentation Standards

### README Structure

```markdown
# Project Name

[![CI](badge)](link)
[![Coverage](badge)](link)
[![License](badge)](link)

## Overview
[What is this project?]

## Quick Start
[How to get started]

## Architecture
[How it's built]

## Development
[How to contribute]

## Deployment
[How to deploy]

## API Reference
[API documentation]

## Contributing
[Contribution guidelines]

## License
[License information]
```

### Code Documentation

```typescript
/**
 * Fetches blog posts from Sanity CMS.
 * 
 * @param limit - Maximum number of posts to return (default: 10)
 * @param offset - Number of posts to skip (default: 0)
 * @returns Array of blog posts
 * 
 * @example
 * ```ts
 * const posts = await getPosts(5, 0);
 * console.log(posts.length); // 5
 * ```
 */
export async function getPosts(limit = 10, offset = 0): Promise<BlogPost[]> {
  // Implementation
}
```

### Changelog Format

```markdown
# Changelog

## [1.2.0] - 2024-01-15

### Added
- Blog comments system
- User authentication
- Dark mode toggle

### Changed
- Improved page load performance
- Updated UI components

### Fixed
- Login form validation error
- Image loading on mobile

### Removed
- Deprecated API endpoints

## [1.1.0] - 2024-01-01

### Added
- Project showcase section
- Gallery lightbox
```

---

## 11. Team Collaboration

### Communication Practices

| Situation | Channel | Response Time |
|-----------|---------|---------------|
| Quick question | Slack/Teams | < 1 hour |
| Code review | PR comment | < 4 hours |
| Bug report | Issue ticket | < 24 hours |
| Feature request | Issue ticket | < 48 hours |
| Urgent issue | Phone/Call | Immediate |

### Standup Format

```markdown
## Daily Standup

### Yesterday
- Completed user authentication feature
- Fixed login form validation

### Today
- Working on blog comments system
- Reviewing PR #123

### Blockers
- Waiting for design assets for new component
```

### Sprint Planning

```markdown
## Sprint Goal
Complete user authentication and blog features

## Stories
1. [ ] User login/signup (5 points)
2. [ ] Blog comments (3 points)
3. [ ] Gallery lightbox (2 points)
4. [ ] Performance optimization (3 points)

## Capacity
- Team velocity: 13 points
- Sprint duration: 2 weeks
- Team members: 2 developers
```

---

## 12. Quick Reference Cheat Sheet

### Git Commands

```bash
# Feature workflow
git checkout develop && git pull
git checkout -b feature/my-feature
# ... work ...
git push origin feature/my-feature
# Create PR: feature/my-feature → develop

# Hotfix workflow
git checkout main && git pull
git checkout -b hotfix/my-fix
# ... fix ...
git push origin hotfix/my-fix
# Create PR: hotfix → main, then merge to staging + develop

# Release workflow
git checkout develop && git pull
git checkout -b release/v1.2.0
# ... prepare release ...
git push origin release/v1.2.0
# Create PR: release → main + staging
# Tag: git tag -a v1.2.0 -m "Release v1.2.0"
```

### Vercel Commands

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# List deployments
vercel ls

# Promote deployment to production
vercel promote <deployment-url>
```

### Quality Checks

```bash
# Run all checks
npm run lint && npx tsc --noEmit && npm run test -- --run

# Build
npm run build

# Format code
npm run format
```

---

## Summary: What Makes You Look Professional

| Practice | What It Shows |
|----------|---------------|
| **GitFlow branching** | You understand team coordination |
| **PR templates** | You value communication |
| **Code reviews** | You prioritize quality |
| **CI/CD pipelines** | You automate everything |
| **Blue-green deployment** | You understand zero-downtime |
| **Testing strategy** | You prevent bugs |
| **Monitoring** | You think about production |
| **Documentation** | You communicate clearly |
| **Incident response** | You're prepared for emergencies |
| **Post-mortems** | You learn from mistakes |

---

*This guide is a living document. Update it as your team's practices evolve.*
