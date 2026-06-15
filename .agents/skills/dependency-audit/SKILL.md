---
name: dependency-audit
description: Audit dependencies for security vulnerabilities, licensing, and maintenance.
---

# Dependency Audit Skill

Audit project dependencies for security vulnerabilities, licensing issues, and maintenance status.

## When to use this skill

- Regular security audits
- Before deploying to production
- When adding new dependencies
- Investigating vulnerability reports
- Updating outdated packages

## Workflow

1. **Run audit tools** — npm audit, license-checker
2. **Analyze results** — Identify critical vulnerabilities
3. **Research fixes** — Find updates or alternatives
4. **Test updates** — Ensure compatibility
5. **Document decisions** — Record audit findings

## Audit Commands

```bash
# Security audit
npm audit
npm audit --json

# License audit
npx license-checker --summary
npx license-checker --failOn "GPL-3.0"

# Outdated packages
npm outdated
npx npm-check-updates

# Bundle analysis
npx webpack-bundle-analyzer stats.json
```

## Vulnerability Severity

| Severity | Action |
|----------|--------|
| Critical | Fix immediately |
| High | Fix within 24 hours |
| Moderate | Fix within 1 week |
| Low | Plan for next sprint |

## Common Vulnerabilities

- **prototype pollution** — Use Object.create(null) or Map
- **SQL injection** — Use parameterized queries
- **XSS** — Sanitize user input
- **CSRF** — Use CSRF tokens
- **Dependency confusion** — Use scoped packages

## Checklist

- [ ] npm audit passes with no critical vulnerabilities
- [ ] All licenses are compatible
- [ ] No deprecated packages in use
- [ ] Dependencies are up-to-date
- [ ] Bundle size is acceptable
