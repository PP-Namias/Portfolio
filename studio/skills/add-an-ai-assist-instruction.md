---
title: Add an AI Assist Instruction
trigger: "ai assist", "instruction", "global prompt"
audience: devs
time: 5 min
---

# Add an AI Assist Instruction

## What it does
AI Assist **instructions** are global system-level prompts the AI
agent follows for every task. The `@sanity/assist` v4 plugin
exposes them via the `assist({instructions: [...]})` config.

## Steps

1. **Open** `sanity.config.ts`.

2. **Add the instruction** to the array:
   ```ts
   import {assist} from '@sanity/assist'

   assist({
     instructions: [
       /* ...existing... */
       {
         title: 'Never invent certifications',
         message: 'Only suggest certifications the user has previously mentioned. If you do not know, ask.',
       },
     ],
   })
   ```

3. **Deploy** the studio. The instruction is now part of the
   default context for every AI assist action.

## Difference: action vs instruction
- **Action** — user-triggered, single task ("generate summary").
- **Instruction** — global rule, applies to everything the AI does.
