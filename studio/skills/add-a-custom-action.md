---
title: Add a Custom Action
trigger: "action", "document action", "publish hook"
audience: devs
time: 10 min
---

# Add a Custom Action

## Steps

1. **Create the action file** `studio/actions/myAction.tsx`:
   ```tsx
   import {useDocumentOperation} from 'sanity'
   import type {DocumentActionComponent, DocumentActionProps} from 'sanity'

   export const MyAction: DocumentActionComponent = (props: DocumentActionProps) => {
     const {patch, publish} = useDocumentOperation(props.id, props.type)
     return {
       label: 'Mark as reviewed',
       onHandle: () => {
         patch.execute([{set: {reviewedAt: new Date().toISOString()}}])
         props.onComplete()
       },
     }
   }
   ```

2. **Register** in `sanity.config.ts`:
   ```ts
   document: {
     actions: (prev) => [MyAction, ...prev],
   }
   ```

## What goes where
- `useDocumentOperation` — call `patch` / `publish` / `unpublish` /
  `delete` / `restore`.
- `onHandle` — your logic.
- `onComplete` — call to close the action menu.
- `disabled` — set true to grey out the button.

## Common pattern: publish + revalidate
See `publishAndRevalidateAction.tsx` for the full example using
`fetch('/api/sanity/webhook')` after publish.
