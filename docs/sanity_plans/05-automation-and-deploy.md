# EPIC-5: Automation & Deploy

## Goal
Add CI/CD checks for schema validation, automate data health reports, clean up unused scripts, and deploy the upgraded studio.

## 1. Schema Validation CI Check

### What it does
A GitHub Actions workflow that validates the Sanity schema compiles and matches the production dataset.

### Workflow: `.github/workflows/sanity-schema-check.yml`

```yaml
name: Sanity Schema Check

on:
  pull_request:
    paths:
      - 'studio/**'
      - 'scripts/sanity-migrate/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: cd studio && npx sanity schema validate
      - run: npx tsc --noEmit
```

### What it checks
1. Schema compiles without errors
2. No TypeScript errors in studio code
3. All referenced schemas exist
4. No duplicate field names within a schema
5. All custom components (inputs, badges, inspectors) resolve

## 2. Data Health Report Script

### `scripts/sanity-migrate/health-report.ts`

Generates a markdown report of data health across all Sanity documents.

### Report sections

```markdown
# Sanity Data Health Report
Generated: 2026-06-12T16:00:00Z

## Singletons
| Schema | Status | Fields Populated | Last Edited |
|---|---|---|---|
| profile | ✅ | 12/15 | 2 days ago |
| aboutSection | ✅ | 5/5 | 1 day ago |
| siteSettings | ⚠️ | 10/14 | 30 days ago |
| ... | | | |

## Collections
| Schema | Count | With Images | With Alt Text | Orphaned |
|---|---|---|---|---|
| project | 18 | 15/18 | 14/18 | 0 |
| experience | 4 | 2/4 | 2/4 | 0 |
| certification | 8 | 8/8 | 6/8 | 1 |
| ... | | | | |

## Issues Found
1. ⚠️ `project:klaro` — missing alt text on image
2. ⚠️ `certification:old-cert` — expired 6 months ago
3. ❌ `galleryImage:orphan` — no category assigned

## Recommendations
- Add alt text to 4 project images
- Archive expired certifications
- Assign categories to 1 gallery image
```

### Usage

```bash
# Generate report
npx tsx scripts/sanity-migrate/health-report.ts

# Generate report and save to file
npx tsx scripts/sanity-migrate/health-report.ts --output docs/sanity-health-report.md

# Check only specific types
npx tsx scripts/sanity-migrate/health-report.ts --only projects,certifications
```

## 3. Automated Migration on Deploy

### Strategy
Add a post-deploy hook that runs migrations automatically when the studio is deployed.

### Implementation

In `studio/sanity.config.ts`, add a `postDeploy` hook:

```typescript
// This runs after the studio is deployed to Sanity Hosting
// It checks if migrations are needed and runs them
if (typeof window !== 'undefined' && window.location.search.includes('?migrate=true')) {
  // Show migration status in the studio
}
```

Better approach: Run migrations via GitHub Actions before deploy:

```yaml
# .github/workflows/deploy-studio.yml
jobs:
  migrate-and-deploy:
    steps:
      - run: npx tsx scripts/sanity-migrate/runner.ts --validate-only
      - run: npx tsx scripts/sanity-migrate/runner.ts  # only runs pending migrations
      - run: cd studio && npx sanity deploy --yes
```

## 4. Unused Scripts Cleanup

### Scripts to review and potentially remove

| Script | Status | Action |
|---|---|---|
| `scripts/sanity/seed.ts` | May be outdated | Review, update or remove |
| `scripts/sanity/seed-demo.ts` | May be outdated | Review, update or remove |
| `scripts/sanity/seed-site-settings.ts` | May be outdated | Review, update or remove |
| `scripts/sanity/manifest.ts` | Useful | Keep |
| `scripts/sanity/dry-run.ts` | Useful | Keep |
| `scripts/sanity/README.md` | Useful | Update with new scripts |
| `scripts/import-github-projects.mjs` | Active | Keep |
| `scripts/import-report.json` | Data | Keep |
| `scripts/update-about-section.mjs` | Active | Keep (or merge into migrate) |
| `scripts/qa-projects.mjs` | Active | Keep |
| `scripts/write-404.mjs` | Active | Keep |
| `scripts/static-security-check.mjs` | Active | Keep |
| `scripts/setup-pentestagent.*` | Active | Keep |
| `scripts/pre-commit-zizmor.sh` | Active | Keep |
| `scripts/ocr-a.woff.b64` | Data | Keep |
| `scripts/lib/*` | Active | Keep |

### Action plan
1. Read each script in `scripts/sanity/`
2. Check if it's still functional with current schema
3. Update or remove as needed
4. Update `scripts/sanity/README.md` with new migration scripts

## 5. Deploy Pipeline

### Current deploy method
Manual: `cd studio && npx sanity deploy`

### Proposed deploy pipeline

```yaml
# .github/workflows/deploy-studio.yml
name: Deploy Sanity Studio

on:
  push:
    branches: [main]
    paths:
      - 'studio/**'
      - 'scripts/sanity-migrate/**'

jobs:
  pre-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - name: Validate schema
        run: cd studio && npx sanity schema validate
      - name: Type check
        run: npx tsc --noEmit
      - name: Run migrations (dry-run)
        run: npx tsx scripts/sanity-migrate/runner.ts --dry-run
      - name: Run migrations
        run: npx tsx scripts/sanity-migrate/runner.ts
        env:
          SANITY_AUTH_TOKEN: ${{ secrets.SANITY_STUDIO_DEPLOY_TOKEN }}

  deploy:
    needs: pre-deploy
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - name: Deploy studio
        run: cd studio && npx sanity deploy --yes
        env:
          SANITY_AUTH_TOKEN: ${{ secrets.SANITY_STUDIO_DEPLOY_TOKEN }}
```

## 6. Package.json Scripts

### Add to root package.json

```json
{
  "scripts": {
    "sanity:migrate": "npx tsx scripts/sanity-migrate/runner.ts",
    "sanity:migrate:dry": "npx tsx scripts/sanity-migrate/runner.ts --dry-run",
    "sanity:migrate:validate": "npx tsx scripts/sanity-migrate/runner.ts --validate-only",
    "sanity:migrate:rollback": "npx tsx scripts/sanity-migrate/rollback.ts",
    "sanity:health": "npx tsx scripts/sanity-migrate/health-report.ts",
    "sanity:validate-schema": "cd studio && npx sanity schema validate"
  }
}
```

## Execution Order

1. Create `scripts/sanity-migrate/health-report.ts`
2. Add schema validation CI workflow
3. Add deploy pipeline workflow
4. Review and clean up unused scripts in `scripts/sanity/`
5. Update `scripts/sanity/README.md`
6. Add package.json scripts
7. Test the full pipeline
8. Commit

## Commit Log
- `feat(sanity): add data health report script`
- `ci: add Sanity schema validation workflow`
- `ci: add Sanity studio deploy pipeline`
- `chore(sanity): clean up unused scripts`
- `chore: add sanity migration scripts to package.json`
