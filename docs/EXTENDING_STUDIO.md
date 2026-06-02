# Extending the Studio

How to add a field, a validation, an action, or a Sanity Function in five minutes.

## 1. Add a field to an existing document type

```ts
// studio/schemaTypes/experience.ts
defineField({
  name: 'managerEmail',
  title: 'Manager email',
  type: 'string',
  validation: (Rule) => Rule.email(),
})
```

Save. The field appears in the studio immediately. No restart needed.

## 2. Add a computed field

Computed fields read other fields on the same document and display the result. The value is read-only and not stored.

```ts
// 1. Create the input component
// studio/components/inputs/ManagerName.tsx
import {set, type StringInputProps} from 'sanity'

export function ManagerNameField(props: StringInputProps) {
  const manager = (props.document?.manager as {name?: string} | undefined)?.name
  if (!manager) {
    return <div style={{padding: 12, color: 'rgba(0,0,0,0.55)'}}>Add a manager reference to compute the name.</div>
  }
  return <div style={{padding: 12, fontWeight: 600, color: '#6366f1'}}>{manager}</div>
}

// 2. Wire it into the schema
defineField({
  name: 'computedManager',
  title: 'Manager (auto)',
  type: 'string',
  readOnly: true,
  components: {input: ManagerNameField},
})
```

## 3. Add a validation

```ts
// studio/validation/rules.ts
export const managerEmailShape = (rule: Rule) =>
  rule
    .custom((value) => {
      if (typeof value !== 'string') return true
      return /@(pp-namias|ppnamias)\.com$/.test(value) || 'Use a PP Namias corporate email.'
    })
    .warning()
```

Use it on a field:

```ts
validation: managerEmailShape,
```

## 4. Add a document action

```ts
// studio/actions/duplicateDocument.tsx
import {useDocumentOperation, type DocumentActionComponent} from 'sanity'

export const duplicateAction: DocumentActionComponent = (props) => {
  const {duplicate} = useDocumentOperation(props.id, props.type)
  return {
    label: 'Duplicate',
    icon: () => '⧉',
    onHandle: () => duplicate.execute(),
  }
}
```

Register it in `sanity.config.ts`:

```ts
document: {
  actions: (prev) => [duplicateAction, ...prev],
}
```

## 5. Add a Sanity Function

```ts
// functions/auto-tag-manager/index.ts
import {createClient} from '@sanity/client'

const client = createClient({/* ... */})

export async function autoTagManager(event: {data?: {documentId?: string}}) {
  const id = event.data?.documentId
  if (!id) return {ok: false}
  const doc = await client.fetch<{manager?: {name?: string}}>(`*[_id == $id][0]{manager->{name}}`, {id})
  if (!doc?.manager?.name) return {ok: false}
  await client.patch(id).set({managerTag: doc.manager.name}).commit()
  return {ok: true}
}
```

Deploy:

```bash
cd functions
npm run deploy:auto-tag-manager
```

## 6. Add a custom list item preview

```ts
// studio/components/previews/listItems.tsx
export function ManagerListItem(props) {
  return (
    <div>
      <strong>{props.title}</strong>
      <span style={{marginLeft: 8, opacity: 0.6}}>{props.subtitle}</span>
    </div>
  )
}
```

Wire it in the structure:

```ts
S.listItem()
  .title('Managers')
  .child(S.documentTypeList('manager').title('Managers'))
```

## 7. Add a status badge

```ts
// studio/components/badges/statusBadges.tsx
export const managerBadge: DocumentBadgeComponent = (props) => {
  const manager = (props.document as {manager?: unknown})?.manager
  if (!manager) return null
  return {label: 'Manager linked', color: 'blue', title: 'This document has a manager reference.'}
}
```

Append `managerBadge` to the `studioBadges` array.

## 8. Add an AI assist action

```ts
// studio/ai/prompts.ts
export const AI_ACTIONS = {
  experience: [
    {
      id: 'rewrite-shorter',
      title: 'Rewrite shorter',
      description: 'Cut the summary to 1 sentence.',
      tone: 'shorten',
      prompt: (value) => `Rewrite the following experience summary in one sentence (under 140 chars).\n\n${value}`,
    },
  ],
}
```

Then enable the AI assist plugin in `sanity.config.ts` and bind the `experience` type to the actions above.

## 9. Add a template

Templates pre-fill a new document so the editor doesn't start from a blank form.

```ts
// studio/templates/index.ts
export const managerTemplates: InitialValueTemplateItem[] = [
  {
    id: 'manager-current',
    title: 'New manager (current)',
    description: 'Manager marked as current role.',
    schemaType: 'manager',
    value: () => ({status: 'current', joinedAt: today()}),
  } as any,
]
```

Then add the array to the `templateRegistry`:

```ts
export const templateRegistry: Record<string, InitialValueTemplateItem[]> = {
  // ...existing
  manager: managerTemplates,
}
```

The template shows up in the **Create new** dropdown on the manager list.

## 10. Add a GROQ saved query

```ts
// studio/vision/queries.ts
export const visionQueries = {
  // ...existing
  managerCoverage: {
    title: 'Manager coverage',
    description: 'Managers grouped by department.',
    query: /* groq */ `
*[_type == "manager"] | order(department asc) {
  _id, name, department, "reports": count(*[_type=="report" && manager._ref == ^._id])
}
    `.trim(),
  },
}
```

The Saved Queries tool auto-discovers the new entry.

## 11. Add a skill (recipe)

Drop a Markdown file under `studio/skills/<slug>.md`:

```md
---
title: Add a Manager
trigger: "add manager", "new manager"
audience: editors
time: 2 min
---

# Add a Manager

## What it does
Creates a new entry in the `manager` collection.

## Steps
1. Open **Pages > Profile > Managers**.
2. Click **Create new**.
3. Fill the form. **Name** is required.
4. Publish.

## Common mistakes
- Forgetting to set the **Department** reference.

## Related skills
- `add-a-reference-data-type.md`
```

The Skills tool auto-discovers the file. No rebuild required.

## 12. Add a custom tool

Custom tools appear in the studio's top nav.

```ts
// studio/plugins/myTool/index.ts
import {definePlugin, type Tool} from 'sanity'
import {StarIcon} from '@sanity/icons'
import {MyToolView} from './MyToolView'

const myTool: Tool = {
  name: 'my-tool',
  title: 'My Tool',
  icon: StarIcon,
  component: MyToolView,
}

export const myToolPlugin = definePlugin(() => ({
  name: 'my-tool',
  tools: [myTool],
}))
```

Register in `sanity.config.ts`:

```ts
plugins: [myToolPlugin()],
```

The new tool shows up in the top nav as **My Tool**.

## 13. Add a presentation tool landing page

The left navigator of the Presentation tool can be replaced:

```ts
// studio/presentation/PresentationNavigator.tsx
export function PresentationNavigator() {
  return (
    <Box padding={4}>
      <Heading size={3}>Welcome to Presentation</Heading>
      <Text>Pick a document on the left, edit on the right.</Text>
    </Box>
  )
}
```

Wire it in `sanity.config.ts`:

```ts
presentationTool({
  // ...existing
  components: {unstable_navigator: {component: PresentationNavigator}},
})
```

## After any change

- Run `cd studio && npm run lint`.
- Run `cd studio && npx tsc --noEmit` (or `npm run build`).
- Reload the studio tab.
- Commit. PR validation re-runs the Quality Check.

