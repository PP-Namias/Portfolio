# Sanity Studio v4 — Master Plan

> **Status:** Planning  
> **Created:** 2026-06-12  
> **Goal:** Smarter Sanity Studio with full data safety, migration automation, and removal of unused features.

---

## Overview

This master plan covers the complete refactoring of the Namias Portfolio Sanity Studio:

1. **Data Backup** — Export all content before any changes
2. **Schema Consolidation** — Clean up schema types
3. **Content Migration** — Automated scripts to migrate data
4. **Skills Removal** — Remove the unused skills tool
5. **Studio Improvements** — Presentation, desk, health, validation, templates, inspector, onboarding, automation
6. **Deployment** — Final deploy to Sanity Hosting

---

## Phase 1: Data Safety (MUST DO FIRST)

| Task | File | Priority |
|------|------|----------|
| Export all documents | `01-data-backup.md` | P0 |
| Export all assets | `01-data-backup.md` | P0 |
| Export schema definitions | `01-data-backup.md` | P0 |
| Create restore scripts | `01-data-backup.md` | P0 |

**Rule:** No schema changes until backup is verified.

---

## Phase 2: Schema & Content

| Task | File | Priority |
|------|------|----------|
| Consolidate schema types | `02-schema-consolidation.md` | P1 |
| Remove heroSection | `02-schema-consolidation.md` | P1 |
| Migrate content | `03-content-migration.md` | P1 |
| Remove skills tool | `04-skills-removal.md` | P1 |

---

## Phase 3: Studio Features

| Task | File | Priority |
|------|------|----------|
| Presentation tool | `05-presentation-tool.md` | P2 |
| Desk structure | `06-desk-structure.md` | P2 |
| Content health | `07-content-health.md` | P2 |
| Validation | `08-validation.md` | P2 |
| Smart templates | `09-smart-templates.md` | P2 |
| Inspector panels | `10-inspector-panels.md` | P2 |
| Onboarding | `11-onboarding.md` | P2 |
| Automation | `12-automation.md` | P2 |

---

## Phase 4: Deploy

| Task | File | Priority |
|------|------|----------|
| Final verification | `13-deployment.md` | P3 |
| Deploy to Sanity | `13-deployment.md` | P3 |
| Post-deploy checks | `13-deployment.md` | P3 |

---

## Execution Order

```
Phase 1 → Phase 2 → Phase 3 → Phase 4
   ↓         ↓         ↓         ↓
 Backup   Schema    Features   Deploy
          Change
```

**Each phase must complete before the next begins.**

---

## Commit Strategy

Every task gets its own commit:

```
plan(sanity): add data backup strategy
plan(sanity): add schema consolidation plan
plan(sanity): add content migration plan
...
```

---

## Files in This Folder

| File | Description |
|------|-------------|
| `00-master-plan.md` | This file — overview |
| `01-data-backup.md` | Data backup strategy |
| `02-schema-consolidation.md` | Schema cleanup |
| `03-content-migration.md` | Content migration |
| `04-skills-removal.md` | Remove skills tool |
| `05-presentation-tool.md` | Presentation improvements |
| `06-desk-structure.md` | Desk structure |
| `07-content-health.md` | Content health |
| `08-validation.md` | Validation rules |
| `09-smart-templates.md` | Smart templates |
| `10-inspector-panels.md` | Inspector panels |
| `11-onboarding.md` | Onboarding |
| `12-automation.md` | Automation |
| `13-deployment.md` | Deployment |

---

## Key Decisions

1. **Backup before change** — No schema modifications until all data is exported and verified
2. **Idempotent scripts** — All migration scripts can run multiple times safely
3. **Rollback support** — Every migration has a rollback script
4. **No data loss** — Existing content is preserved, not recreated
5. **Automated migration** — Scripts handle data transformation
