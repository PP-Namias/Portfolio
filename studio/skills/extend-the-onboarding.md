---
title: Extend the Onboarding
trigger: "onboarding", "tour", "first run", "task"
audience: devs
time: 10 min
---

# Extend the Onboarding

The Onboarding tool runs on first login. We use 4 task-oriented
steps: **Edit your Hero → Add a Project → Add a Cert → Publish
something**.

## Steps

1. **Open** `studio/components/Onboarding.tsx`.

2. **Add a new task** to the array:
   ```tsx
   const TASKS = [
     /* ...existing... */
     {
       id: 'add-recommendation',
       title: 'Add a recommendation',
       body: 'Ask a colleague for a public recommendation and add it here.',
       cta: 'Add recommendation',
       onComplete: () => router.openDocument('recommendation', 'new'),
     },
   ]
   ```

3. **Wire a checkpoint** so the task is marked done when the user
   creates the relevant document. We use a `useCheckpoints` hook
   backed by Sanity Content Lake `*[_type == "recommendation"]`.

4. **Deploy** the studio.

## What makes a good onboarding task
- 60 seconds or less to complete.
- Single, clear CTA.
- Result is visible on the marketing site.
- Skip-able but not dismissable forever.
