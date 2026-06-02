---
title: Extend the Welcome Screen
trigger: "welcome", "splash screen", "studio home"
audience: devs
time: 10 min
---

# Extend the Welcome Screen

The Welcome screen is what users see on first login. We use it to:
- Greet the user.
- Show quick links (Project, Post, Cert, etc.).
- Surface Skills cards.
- Surface changelog and status.

## Steps

1. **Open** `studio/components/Welcome.tsx`.

2. **Add a new card** to the grid:
   ```tsx
   <Card
     title="Skills"
     subtitle="Browse step-by-step recipes"
     icon={BookIcon}
     onClick={() => setShowSkills(true)}
   />
   ```

3. **Implement the modal** with the Skills tool you built.

4. **Keep it scannable** — 4-6 cards max, descriptive subtitles,
   no marketing-speak.

5. **Verify** in the studio by running `npm run dev`.

## Style guide
- Use `Card`, `Text`, `Stack`, `Inline` from `@sanity/ui` (theme-aware).
- No inline colors — use theme tokens.
- The Welcome screen is a Sanity component (not a React Router
  page), so `useStudioTool` is the way to navigate.
