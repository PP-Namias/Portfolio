---
title: Add a Custom Badge
trigger: "badge", "document badge", "status indicator"
audience: devs
time: 10 min
---

# Add a Custom Badge

## Steps

1. **Define the badge** in `studio/components/badges/statusBadges.tsx`:
   ```ts
   import type {DocumentBadgeComponent} from 'sanity'

   export const OverdueBadge: DocumentBadgeComponent = (props) => {
     const dueAt = props.dueAt as string | undefined
     if (!dueAt) return null
     const overdue = new Date(dueAt).getTime() < Date.now()
     return {
       label: overdue ? 'Overdue' : 'On track',
       color: overdue ? 'danger' : 'success',
       title: `Due ${dueAt}`,
     }
   }
   ```

2. **Register the badge** in `sanity.config.ts`:
   ```ts
   import {OverdueBadge} from './components/badges/statusBadges'

   document: {
     badges: (prev, context) => {
       if (context.schemaType === 'project') {
         return [...prev, OverdueBadge]
       }
       return prev
     },
   }
   ```

3. **Deploy** the studio.

## Badge colors
`gray` / `success` / `primary` / `warning` / `danger` /
`transparent` (Sanity 4.22+).
