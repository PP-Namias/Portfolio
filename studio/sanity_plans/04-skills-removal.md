# Skills Removal Plan

> **Priority:** P1 — After schema consolidation  
> **Status:** Planning

---

## Goal

Remove the unused `skillsToolPlugin` from Sanity Studio. Skills live in `.agents/skills/` and are not used in production.

---

## Current State

### Skills Tool in Sanity

- Plugin: `skillsToolPlugin`
- Location: `studio/skills/skillsToolPlugin.ts`
- Content: 42 markdown files in `studio/skills/skills/`
- Usage: Not used in production

### Skills in .agents

- Location: `.agents/skills/`
- Content: Same 42 markdown files
- Usage: Used by opencode agent

---

## What to Remove

### 1. Skills Plugin

```diff
- studio/skills/skillsToolPlugin.ts
- studio/skills/index.ts
- studio/skills/skills/ (42 markdown files)
```

### 2. Config References

```diff
- sanity.config.ts: import {skillsToolPlugin} from './skills/skillsToolPlugin'
- sanity.config.ts: skillsToolPlugin(),
```

### 3. Welcome Page References

```diff
- components/Welcome.tsx: {title: 'Browse Skills', ...}
```

---

## What to Keep

### 1. .agents/skills/

Keep all skill files in `.agents/skills/` — these are used by opencode.

### 2. AGENTS.md

Keep the skills list in `AGENTS.md` — this is the source of truth.

---

## Migration Steps

### Step 1: Verify Skills Not Used

```powershell
# Check if skills are referenced anywhere in production code
Select-String -Path "src/**/*.{ts,tsx}" -Pattern "skill" -SimpleMatch
```

### Step 2: Remove Plugin

1. Delete `studio/skills/` folder
2. Remove import from `sanity.config.ts`
3. Remove plugin from config
4. Remove Welcome page reference

### Step 3: Verify

- [ ] Studio builds without errors
- [ ] No references to skills in studio code
- [ ] .agents/skills/ intact
- [ ] AGENTS.md intact

---

## Files to Modify

| File | Action |
|------|--------|
| `studio/skills/skillsToolPlugin.ts` | DELETE |
| `studio/skills/index.ts` | DELETE |
| `studio/skills/skills/` | DELETE (42 files) |
| `studio/sanity.config.ts` | REMOVE import + plugin |
| `studio/components/Welcome.tsx` | REMOVE skills card |

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Break studio build | Low | Test build after removal |
| Lose skill files | Low | Files exist in .agents/skills/ |
| Break agent workflows | None | .agents/skills/ unchanged |

---

## Verification Script

```powershell
# scripts/verify-skills-removal.ps1

# Check studio builds
cd studio
npx tsc --noEmit
npx sanity build

# Check no references
Select-String -Path "**/*.{ts,tsx}" -Pattern "skillsTool" -SimpleMatch

# Check .agents intact
Test-Path "../.agents/skills"
```

---

## Commit Strategy

```
plan(sanity): add skills removal plan
chore(sanity): remove skills plugin and files
chore(sanity): remove skills references from config
```
