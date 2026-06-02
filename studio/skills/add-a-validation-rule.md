---
title: Add a Validation Rule
trigger: "validation", "rule", "constraint"
audience: devs
time: 5 min
---

# Add a Validation Rule

## Steps

1. **Open** `studio/validation/rules.ts`.

2. **Add a factory** (factory pattern keeps the rule type-agnostic):
   ```ts
   import type {Rule} from 'sanity'

   type RuleFactory = (rule: any) => any

   export const slugIsKebabCase: RuleFactory = (rule) =>
     rule.custom((value: any) => {
       if (!value?.current) return 'Slug is required.'
       return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current)
         ? true
         : 'Use lowercase letters, numbers, and hyphens only.'
     })
   ```

3. **Wire it in** the schema field:
   ```ts
   defineField({
     name: 'slug',
     type: 'slug',
     validation: (rule) => slugIsKebabCase(rule),
   })
   ```

## Built-in rules
- `rule.required()` — non-empty.
- `rule.min(n).max(n)` — length.
- `rule.unique()` — array values unique.
- `rule.uri({scheme: ['https']})` — URL scheme.
- `rule.email()` — email format.
- `rule.custom(fn)` — custom logic.

## Async rules
```ts
rule.custom(async (value, context) => {
  if (!value) return 'Required'
  const exists = await client.fetch(/* ... */)
  return exists ? 'Already taken' : true
})
```
