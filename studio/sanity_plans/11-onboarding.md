# Onboarding Plan

> **Priority:** P2 — Studio features  
> **Status:** Planning

---

## Goal

Improve onboarding experience with progress tracking and personalized guidance.

---

## Current State

### What Exists

- ✅ 5-step onboarding tour
- ✅ Progress tracking (step dots)
- ✅ Task completion checkboxes
- ✅ Progress bar
- ✅ localStorage persistence

---

## Enhancements

### 1. Add Content Completion Dashboard

```typescript
// onboarding/ContentCompletion.tsx
- Overall completion percentage
- Per-section completion
- Missing content alerts
- Quick-fix buttons
```

### 2. Add Personalized Tips

```typescript
// onboarding/PersonalizedTips.tsx
- Tips based on document type
- Best practices
- Common mistakes
- Success patterns
```

### 3. Add Video Tutorials

```typescript
// onboarding/VideoTutorials.tsx
- Embedded video tutorials
- Step-by-step guides
- Interactive walkthroughs
- Progress tracking
```

### 4. Add Achievement System

```typescript
// onboarding/AchievementSystem.tsx
- Badges for completing tasks
- Milestone celebrations
- Leaderboard
- Progress sharing
```

---

## Onboarding Steps

### Current Steps

1. Edit your profile
2. Write about yourself
3. Add a project
4. Add a certification
5. Publish something

### Proposed Steps

1. **Getting Started**
   - Welcome message
   - Overview of studio
   - Quick tour

2. **Profile Setup**
   - Edit profile
   - Add profile image
   - Set social links

3. **Content Creation**
   - Add project
   - Add experience
   - Add certification

4. **Blog Setup**
   - Create first post
   - Add author
   - Add categories

5. **Publishing**
   - Preview content
   - Publish document
   - Verify on live site

6. **Advanced Features**
   - Presentation mode
   - Content health
   - Automation

---

## Files to Modify

| File | Action |
|------|--------|
| `studio/components/Onboarding.tsx` | ENHANCE |
| `studio/components/onboarding/ContentCompletion.tsx` | CREATE |
| `studio/components/onboarding/PersonalizedTips.tsx` | CREATE |
| `studio/components/onboarding/VideoTutorials.tsx` | CREATE |
| `studio/components/onboarding/AchievementSystem.tsx` | CREATE |

---

## Implementation Steps

### Step 1: Add Content Completion Dashboard

1. Create ContentCompletion component
2. Calculate completion percentages
3. Display missing content alerts

### Step 2: Add Personalized Tips

1. Create PersonalizedTips component
2. Add tips per document type
3. Add best practices

### Step 3: Add Video Tutorials

1. Create VideoTutorials component
2. Add video embeds
3. Add progress tracking

### Step 4: Add Achievement System

1. Create AchievementSystem component
2. Add badge definitions
3. Add milestone celebrations

### Step 5: Test

- [ ] Completion dashboard works
- [ ] Tips are helpful
- [ ] Videos play correctly
- [ ] Achievements track

---

## Achievement Definitions

```typescript
const achievements = [
  {
    id: 'first-login',
    name: 'First Login',
    description: 'Logged into the studio for the first time',
    icon: '🎉',
  },
  {
    id: 'profile-complete',
    name: 'Profile Complete',
    description: 'Completed all profile fields',
    icon: '👤',
  },
  {
    id: 'first-project',
    name: 'First Project',
    description: 'Created your first project',
    icon: '🚀',
  },
  {
    id: 'first-post',
    name: 'First Post',
    description: 'Published your first blog post',
    icon: '📝',
  },
  {
    id: 'health-champion',
    name: 'Health Champion',
    description: 'All content health checks pass',
    icon: '💪',
  },
]
```

---

## Commit Strategy

```
plan(sanity): add onboarding plan
feat(sanity): add content completion dashboard
feat(sanity): add personalized tips
feat(sanity): add video tutorials
feat(sanity): add achievement system
```
