# EPIC-2: Remove Skills Plugin

## Goal
Remove the `skillsToolPlugin` from the Sanity Studio. The skills are already maintained as markdown files in `.agents/skills/` and are loaded by the agent system. The Sanity plugin adds build-time weight and is not used in production.

## Current State

### What the plugin does
- Loads 42 markdown files from `studio/skills/*.md` at build time via `import.meta.glob`
- Parses YAML frontmatter (title, trigger, audience, time) and markdown body
- Renders a searchable card grid in a custom Sanity tool view
- Each skill is a step-by-step recipe for studio operations

### Where it's used
- `studio/sanity.config.ts` — imported and added to plugins array
- `studio/plugins/skillsTool/` — the plugin implementation (index.ts, SkillsTool.tsx)
- `studio/components/Welcome.tsx` — has a "Browse Skills" quick action button
- `studio/components/Onboarding.tsx` — references skills in step descriptions

### Where skills already live
- `.agents/skills/` — 25+ skill files, maintained by the agent system
- `AGENTS.md` — references all skills with descriptions
- These are the source of truth for agent workflows

## What to Remove

### Files to delete
```
studio/plugins/skillsTool/
  index.ts          <- plugin entry point
  SkillsTool.tsx    <- React component for the tool view
  SkillsCard.tsx    <- individual skill card component (if exists)
  types.ts          <- TypeScript types (if exists)
```

### Files to modify
```
studio/sanity.config.ts    <- remove skillsToolPlugin import and plugin entry
studio/components/Welcome.tsx  <- remove "Browse Skills" quick action button
```

### Files to keep
```
studio/skills/             <- DELETE entire directory (42 markdown files)
.agents/skills/            <- KEEP (this is the source of truth)
```

## Changes Detail

### studio/sanity.config.ts

Before:
```typescript
import { skillsToolPlugin } from './plugins/skillsTool'

export default defineConfig({
  plugins: [
    structureTool({ ... }),
    presentationTool({ ... }),
    visionTool(),
    assist(),
    skillsToolPlugin(),    // <- REMOVE THIS LINE
    savedQueriesToolPlugin(),
  ],
})
```

After:
```typescript
export default defineConfig({
  plugins: [
    structureTool({ ... }),
    presentationTool({ ... }),
    visionTool(),
    assist(),
    savedQueriesToolPlugin(),  // keep this
  ],
})
```

### studio/components/Welcome.tsx

Remove the "Browse Skills" card from the quick actions grid. The grid currently has 6 items:
1. New project — KEEP
2. New post — KEEP
3. New certification — KEEP
4. **Browse Skills** — REMOVE
5. Open Presentation — KEEP
6. Saved Queries — KEEP

After removal, the grid has 5 items. Rebalance if needed.

### studio/skills/ directory

Delete the entire `studio/skills/` directory. These 42 files are:
- Not imported by any runtime code (only by the plugin at build time)
- Duplicated (or out of date) compared to `.agents/skills/`
- Adding ~200KB to the studio build

## Risk Assessment

| Risk | Impact | Mitigation |
|---|---|---|
| Someone uses skills in Sanity Studio | Low — skills are for agents, not humans | Skills are in .agents/skills/ which agents can read |
| Build breaks after removal | Medium — import errors | Remove import + plugin in same commit |
| Welcome page breaks | Low — just remove one grid item | Update Welcome.tsx in same commit |

## Execution Order

1. Remove `skillsToolPlugin` import and usage from `sanity.config.ts`
2. Delete `studio/plugins/skillsTool/` directory
3. Delete `studio/skills/` directory
4. Update `Welcome.tsx` to remove "Browse Skills" button
5. Verify studio builds: `cd studio && npx sanity build`
6. Verify no TypeScript errors: `npx tsc --noEmit` (in studio)
7. Commit

## Verification

```bash
# In studio directory
npx sanity build        # should succeed without skills plugin
npx tsc --noEmit        # should have no errors

# In root directory
npm run lint            # should have no new errors
npx vitest run          # should pass (skills not tested)
```

## Commit Log
- `chore(sanity): remove skillsToolPlugin and studio/skills/ directory`
- `chore(sanity): update Welcome component to remove Browse Skills action`
