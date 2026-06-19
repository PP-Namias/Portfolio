# Automation Plan

> **Priority:** P2 — Studio features  
> **Status:** Planning

---

## Goal

Automate content management tasks with scheduling, reminders, and bulk actions.

---

## Current State

### What Exists

- ✅ AutomationPanel component
- ✅ Scheduled publishing display
- ✅ Bulk actions (Publish Due, Clear Scheduling)
- ✅ Welcome page integration

---

## Enhancements

### 1. Add Content Scheduling

```typescript
// automation/ContentScheduler.tsx
- Calendar view
- Drag-and-drop scheduling
- Recurring schedules
- Timezone support
```

### 2. Add Publish Reminders

```typescript
// automation/PublishReminders.tsx
- Email notifications
- In-app notifications
- Slack integration
- Custom reminder rules
```

### 3. Add Bulk Actions

```typescript
// automation/BulkActions.tsx
- Multi-select documents
- Batch publish/unpublish
- Batch update fields
- Batch delete
```

### 4. Add Workflow Automation

```typescript
// automation/WorkflowAutomation.tsx
- Custom workflows
- Trigger-based actions
- Conditional logic
- Action chains
```

---

## Automation Features

### 1. Content Scheduling

```typescript
const schedulingFeatures = [
  {
    name: 'Schedule Publish',
    description: 'Set publish date for documents',
    action: (doc) => ({publishAt: doc.publishAt}),
  },
  {
    name: 'Schedule Unpublish',
    description: 'Set unpublish date for documents',
    action: (doc) => ({unpublishAt: doc.unpublishAt}),
  },
  {
    name: 'Schedule Archive',
    description: 'Set archive date for documents',
    action: (doc) => ({archiveAt: doc.archiveAt}),
  },
]
```

### 2. Publish Reminders

```typescript
const reminderRules = [
  {
    name: 'Publish Due Soon',
    condition: (doc) => {
      const daysUntilPublish = (new Date(doc.publishAt) - new Date()) / (1000 * 60 * 60 * 24)
      return daysUntilPublish <= 3 && daysUntilPublish > 0
    },
    message: (doc) => `Document "${doc.title}" is scheduled to publish in ${Math.ceil((new Date(doc.publishAt) - new Date()) / (1000 * 60 * 60 * 24))} days`,
  },
  {
    name: 'Stale Content',
    condition: (doc) => {
      const daysSinceUpdate = (new Date() - new Date(doc._updatedAt)) / (1000 * 60 * 60 * 24)
      return daysSinceUpdate > 90
    },
    message: (doc) => `Document "${doc.title}" hasn't been updated in ${Math.floor((new Date() - new Date(doc._updatedAt)) / (1000 * 60 * 60 * 24))} days`,
  },
]
```

### 3. Bulk Actions

```typescript
const bulkActions = [
  {
    name: 'Publish All Drafts',
    description: 'Publish all draft documents',
    action: async (docs) => {
      for (const doc of docs) {
        await client.patch(doc._id).unset(['publishAt']).commit()
      }
    },
  },
  {
    name: 'Unpublish All',
    description: 'Unpublish all published documents',
    action: async (docs) => {
      for (const doc of docs) {
        await client.patch(doc._id).set({publishedAt: null}).commit()
      }
    },
  },
  {
    name: 'Delete All Drafts',
    description: 'Delete all draft documents',
    action: async (docs) => {
      for (const doc of docs) {
        await client.delete(doc._id).commit()
      }
    },
  },
]
```

---

## Files to Modify

| File | Action |
|------|--------|
| `studio/components/automation/AutomationPanel.tsx` | ENHANCE |
| `studio/components/automation/ContentScheduler.tsx` | CREATE |
| `studio/components/automation/PublishReminders.tsx` | CREATE |
| `studio/components/automation/BulkActions.tsx` | CREATE |
| `studio/components/automation/WorkflowAutomation.tsx` | CREATE |

---

## Implementation Steps

### Step 1: Add Content Scheduling

1. Create ContentScheduler component
2. Add calendar view
3. Add drag-and-drop

### Step 2: Add Publish Reminders

1. Create PublishReminders component
2. Add notification system
3. Add custom rules

### Step 3: Add Bulk Actions

1. Create BulkActions component
2. Add multi-select
3. Add batch operations

### Step 4: Add Workflow Automation

1. Create WorkflowAutomation component
2. Add custom workflows
3. Add trigger-based actions

### Step 5: Test

- [ ] Scheduling works
- [ ] Reminders send
- [ ] Bulk actions complete
- [ ] Workflows execute

---

## Workflow Definition

```typescript
interface Workflow {
  id: string
  name: string
  description: string
  triggers: Trigger[]
  conditions: Condition[]
  actions: Action[]
}

interface Trigger {
  type: 'schedule' | 'event' | 'manual'
  config: Record<string, any>
}

interface Condition {
  type: 'field' | 'reference' | 'date'
  field: string
  operator: string
  value: any
}

interface Action {
  type: 'patch' | 'publish' | 'unpublish' | 'delete'
  config: Record<string, any>
}
```

---

## Commit Strategy

```
plan(sanity): add automation plan
feat(sanity): add content scheduler
feat(sanity): add publish reminders
feat(sanity): add bulk actions
feat(sanity): add workflow automation
```
