---
title: Add a New Skill
trigger: "add a skill", "new skill", "skill author"
audience: devs
time: 5 min
---

# Add a New Skill

## Where skills live
- `studio/skills/<slug>.md` — in-app, surfaced via the **Skills**
  tool and as cards on the Welcome screen.
- `.opencode/skills/<slug>.md` — for the dev assistant to know the
  same recipe. Mirror the top 6 most-edited recipes so the
  assistant can suggest them.

## File format

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

## Steps to add a new one

1. **Pick a slug** — kebab-case, verb-led, 2-4 words. Examples:
   `add-a-project`, `use-ai-assist`, `deploy-the-studio`.
2. **Write the MD** under `studio/skills/<slug>.md`.
3. **Mirror to `.opencode/skills/<slug>.md`** if it's a recipe the
   dev assistant should know.
4. **Verify** — the **Skills** tool reads these files at runtime,
   no rebuild required.

## What makes a good skill
- One task per file. If your skill has more than 5 steps, split it.
- Use the trigger phrases in the body so the file is searchable.
- Include the **Common mistakes** section — that's what new users
  hit first.
- Link to related skills at the bottom to encourage flow.
