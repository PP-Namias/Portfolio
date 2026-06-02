---
title: Add an AI Action
trigger: "ai action", "agent action", "generate with ai"
audience: devs
time: 5 min
---

# Add an AI Action

## What it does
AI Actions are user-triggered AI tasks exposed in the studio. They
appear in the **AI Assist** field actions menu.

## Steps

1. **Define the action** in `studio/ai/prompts.ts`:
   ```ts
   export const AI_ACTIONS = {
     generateProjectSummary: {
       title: 'Generate project summary',
       prompt: 'Write a 2-sentence project summary for: {title}',
     },
   }
   ```

2. **Use AI Assist** in the field:
   - The v4 `@sanity/assist` plugin handles the UI.
   - The `instructions` field is configured globally in
     `sanity.config.ts` via `assist({instructions: [...]})`.

3. **Test** in the studio: open a doc, click the sparkle icon, pick
   the action.

## Where actions are scoped
- **Field actions** show up in the field toolbar.
- **Document actions** show up in the doc action menu.
- **Instruction actions** are custom instructions added to the AI
  assist prompt bar.
