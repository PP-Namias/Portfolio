---
name: add-a-new-skill
description: Adds a new skill MD file to the studio's skills collection. Use when the user wants to author a new step-by-step recipe for the studio's in-app Skills tool or the .agents mirror.
---

# Add a New Skill

Use this skill when the user wants to add a new step-by-step recipe
to the studio's skills corpus.

## When to use this skill

- Use this when the user says "add a skill", "write a skill", "document
  this workflow", or "add a new recipe to the studio".

## Where skills live

- `studio/skills/<slug>.md` — in-app, surfaced via the **Skills**
  tool and as cards on the Welcome screen.
- `.agents/skills/<slug>/SKILL.md` — for the dev assistant to know
  the same recipe. Mirror the top 6 most-edited recipes so the
  assistant can suggest them.

## File format

The in-app format (`studio/skills/<slug>.md`):

```md
---
title: <short human title>
trigger: "<phrases that match user requests>"
audience: editors | devs | both
time: <minutes>
---

# <Title>

## What it does
<1-2 sentence summary>

## Steps
1. <First action>
2. <Second action>
3. ...

## Common mistakes
- <anti-pattern>

## Related skills
- <slug>.md
```

The assistant format (`.agents/skills/<slug>/SKILL.md`):

```md
---
name: <kebab-slug>
description: <one-line summary for tool selection>
---

# <Title>

## When to use this skill
- <user phrasing>

## Workflow
1. ...
```

## Workflow

1. **Pick a slug** — kebab-case, verb-led, 2-4 words. Examples:
   `add-a-project`, `use-ai-assist`, `deploy-the-studio`.
2. **Write the MD** under `studio/skills/<slug>.md`.
3. **Mirror to `.agents/skills/<slug>/SKILL.md`** if it's a recipe
   the dev assistant should know.
4. **Verify** — the **Skills** tool reads these files at runtime,
   no rebuild required.

## What makes a good skill

- One task per file. If your skill has more than 5 steps, split it.
- Use the trigger phrases in the body so the file is searchable.
- Include the **Common mistakes** section — that's what new users
  hit first.
- Link to related skills at the bottom to encourage flow.
