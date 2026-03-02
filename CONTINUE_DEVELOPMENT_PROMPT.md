# AI Agent Prompt — Continue Portfolio Development

> **Copy-paste this ENTIRE prompt into a new Copilot chat session (Claude Opus 4.6) to continue development.**

---

## CONTEXT — What Was Already Done

The portfolio at **namias.tech** has been fully built and recently had a major feature added: a **Floating Hub Widget** (Teal HQ-inspired). Here's the current state:

### Floating Hub (COMPLETED — DO NOT rebuild)
The single-purpose `ChatWidget.tsx` FAB was replaced by a multi-purpose `FloatingHub` with 3-state interaction:
- **Closed**: Pink FAB with Sparkles icon (bottom-right)
- **Hub Menu**: Panel with 6 quick actions (Ask AI, Download Resume, Schedule Meeting, Send Email, Connect socials, Read Blog)
- **Chat Panel**: Full AI chat with back-to-menu button, messages persist across panel switches

### Files Created/Modified for FloatingHub
| File | Status | Lines | Purpose |
|------|--------|-------|---------|
| `src/components/ui/FloatingHub.tsx` | NEW | ~85 | Main orchestrator: FAB + 3-state machine + AnimatePresence panel |
| `src/components/ui/HubMenu.tsx` | NEW | ~155 | 6 action items, Connect expands inline showing social icons |
| `src/components/ui/HubMenuItem.tsx` | NEW | ~75 | Reusable row (icon + label + subtitle), renders `<a>` or `<button>` |
| `src/components/ui/ChatPanel.tsx` | NEW | ~230 | Refactored chat-only panel (no FAB), receives messages/setMessages as props |
| `src/components/ui/ChatWidget.tsx` | SUPERSEDED | ~275 | **Still exists but NO LONGER imported** — replaced by FloatingHub |
| `src/app/layout.tsx` | MODIFIED | — | `<ChatWidget />` → `<FloatingHub />` |
| `src/types/index.ts` | MODIFIED | — | Added `HubState = 'closed' \| 'menu' \| 'chat'` |
| `src/__tests__/components/FloatingHub.test.tsx` | NEW | ~200 | 16 test cases |
| `src/__tests__/components/ChatWidget.test.tsx` | REFACTORED | — | Now tests `ChatPanel` (9 tests) |

### Current Validation Status (all passing)
```
✔ npm run lint    — 0 errors
✔ npm run build   — Compiled successfully (13/13 static pages)
✔ npm run test    — 41/41 tests passing (4 suites)
```

---

## TASK — Cleanup & Improvements

Perform the following tasks in order. Follow the agent workflow from `.github/copilot-instructions.md`:

### Task 1: Delete Old ChatWidget.tsx (Dead Code Cleanup)
`src/components/ui/ChatWidget.tsx` is no longer imported anywhere — `layout.tsx` now uses `FloatingHub`. **Delete it.**
- Verify no other file imports `ChatWidget` before deleting (search the entire codebase)
- Do NOT delete `ChatMessage.tsx` — that's still used by `ChatPanel.tsx`

### Task 2: Update `.github/copilot-instructions.md`
Update the copilot instructions file to reflect the new FloatingHub architecture:

1. **PROJECT STRUCTURE section**: Add to `src/components/ui/` listing:
   - `FloatingHub.tsx` — Main hub container (FAB + state machine + panel wrapper)
   - `HubMenu.tsx` — Hub menu with 6 action items
   - `HubMenuItem.tsx` — Reusable action row component
   - `ChatPanel.tsx` — Chat-only panel (refactored from ChatWidget, receives messages as props)
   - Remove `ChatWidget.tsx` entry (it's deleted)

2. **COMPONENT PATTERNS section**: Add a "Floating Hub Pattern" subsection documenting the 3-state machine:
   ```
   HubState: 'closed' → 'menu' → 'chat'
   Messages lifted to FloatingHub for persistence across panel switches
   Escape key: chat → menu → closed
   ```

3. **KNOWN ISSUES section**: Add a new resolved entry:
   ```
   30. ~~**Single-purpose chat FAB** — ChatWidget was only for AI chat. 
       Fixed: Replaced with multi-purpose FloatingHub (6 actions: AI chat, resume, Calendly, email, social connect, blog).~~
   ```

4. **IMPROVEMENT ROADMAP section**: Mark these as completed:
   - [x] Replace single-purpose chat FAB with multi-purpose floating hub
   - [x] Delete old `ChatWidget.tsx` (dead code)

5. **Test files** listing: Update to reflect FloatingHub.test.tsx (16 tests) and ChatWidget.test.tsx now tests ChatPanel (9 tests)

### Task 3: Improve FloatingHub Accessibility
Add focus management to the hub:
1. When hub menu opens, auto-focus the first menu item (or the close button)
2. When chat panel opens, auto-focus the text input (already done in ChatPanel)
3. Add `tabIndex={-1}` to the panel wrapper so it can receive programmatic focus
4. Trap focus within the open panel (Tab should cycle through interactive elements, not escape to the page behind)

### Task 4: Add Click-Outside-to-Close for Hub
When the hub menu or chat panel is open, clicking outside the panel should close it:
- Use a `useRef` on the panel + a `mousedown` event listener on `document`
- Be careful not to close when clicking the FAB itself
- Don't apply on mobile (full-screen mode) — only on `sm:` and up
- Add a test for this behavior

### Task 5: Visual Polish — FAB Pulse Animation
Add an attention-grabbing pulse animation to the FAB for first-time visitors:
1. Add a CSS `@keyframes pulse-ring` animation in `globals.css`:
   ```css
   @keyframes pulse-ring {
     0% { transform: scale(1); opacity: 0.5; }
     100% { transform: scale(1.5); opacity: 0; }
   }
   ```
2. Render a pseudo-element or sibling `<span>` behind the FAB with `animate-[pulse-ring_2s_ease-out_infinite]`
3. Stop the pulse after the user clicks the FAB once (use a `hasInteracted` state, persisted in `sessionStorage`)
4. Add a test: FAB shows pulse ring initially, hides after first click

### Task 6: (Optional) Replace Placeholder Recommendations
`portfolio-resources/data/recommendations.json` contains 2 placeholder testimonials from:
- "Sample Recommender" at "Tech Company"
- "Another Recommender" at "Digital Agency"

If you have access to real testimonials, replace them. Otherwise, add a visible indicator in `RecommendationsCarousel.tsx` that these are placeholder data — perhaps a subtle "(Sample testimonials)" note or hide the section entirely until real data is provided.

---

## ARCHITECTURE REFERENCE

### Current Component Hierarchy
```
layout.tsx
└── <FloatingHub />                   # src/components/ui/FloatingHub.tsx
    ├── FAB (Sparkles icon)           # When hubState === 'closed'
    └── Panel (AnimatePresence)       # When hubState !== 'closed'
        ├── <HubMenu />              # When hubState === 'menu'
        │   └── <HubMenuItem /> ×6   # Each action row
        └── <ChatPanel />            # When hubState === 'chat'
            └── <ChatMessage /> ×N   # Individual messages
```

### State Machine
```typescript
type HubState = 'closed' | 'menu' | 'chat';

// FloatingHub.tsx manages:
const [hubState, setHubState] = useState<HubState>('closed');
const [messages, setMessages] = useState<ChatMessage[]>([]); // persists across panel switches
```

### Data Sources (all from portfolio-resources/data/ via src/data/*.ts)
- `socialLinks` from `@/data/socials` — Calendly URL, GitHub, LinkedIn, X, Instagram
- `profile` from `@/data/profile` — email address, name
- Resume at `/resume.pdf`
- Blog at `/blog` route

### Key Files
| File | Path | Lines | Purpose |
|------|------|-------|---------|
| FloatingHub | `src/components/ui/FloatingHub.tsx` | ~85 | FAB + state + panel wrapper |
| HubMenu | `src/components/ui/HubMenu.tsx` | ~155 | 6 actions, Connect expansion |
| HubMenuItem | `src/components/ui/HubMenuItem.tsx` | ~75 | Reusable action row |
| ChatPanel | `src/components/ui/ChatPanel.tsx` | ~230 | Chat UI (no FAB) |
| ChatMessage | `src/components/ui/ChatMessage.tsx` | ~39 | Message bubble |
| API route | `src/app/api/chat/route.ts` | ~180 | Gemini 2.0 Flash, rate limiting |
| Types | `src/types/index.ts` | — | All interfaces + HubState |
| Hub tests | `src/__tests__/components/FloatingHub.test.tsx` | ~200 | 16 tests |
| Chat tests | `src/__tests__/components/ChatWidget.test.tsx` | ~150 | 9 tests (ChatPanel) |
| API tests | `src/__tests__/api/chat.test.ts` | — | 12 tests |
| Msg tests | `src/__tests__/components/ChatMessage.test.tsx` | — | 4 tests |

---

## TECH STACK (already installed — do NOT install new packages)

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js 14 (App Router) | 14.2.21 |
| Language | TypeScript (strict) | ^5.7.3 |
| Styling | Tailwind CSS v3 | ^3.4.17 |
| Animations | Framer Motion | ^11.15.0 |
| Icons | Lucide React | ^0.468.0 |
| Theming | next-themes | ^0.4.4 |
| Markdown | react-markdown + remark-gfm + rehype-highlight | ^10/^4/^7 |
| AI | @google/generative-ai (Gemini 2.0 Flash) | ^0.24.1 |
| Tests | vitest + @testing-library/react | ^4.0.18 / ^16.3.2 |

---

## DESIGN SYSTEM COMPLIANCE

```tsx
// Theme colors (MANDATORY):
className="text-text-primary-light dark:text-text-primary-dark"
className="text-text-muted-light dark:text-text-muted-dark"
className="bg-surface-light dark:bg-surface-dark"
className="bg-white dark:bg-card-bg-dark"
className="border-border-light dark:border-border-dark"
className="bg-accent-pink text-white"

// Animation pattern:
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 20 }}
  transition={{ duration: 0.2 }}
/>
```

---

## TESTING RULES

- Mock `framer-motion` in all component tests (destructure and discard `whileHover`/`whileTap` props)
- Mock `fetch` for API calls
- Use `@testing-library/react` + `@testing-library/user-event`
- Test runner: `vitest` (configured in `vitest.config.ts`)
- Test files in `src/__tests__/components/`
- Run `npm run test` after changes

---

## VALIDATION (run after EVERY task)

```bash
npm run lint    # Fix all ESLint errors
npm run build   # Fix all TypeScript errors  
npm run test    # All tests must pass
```

---

## WORKFLOW

Follow `.github/copilot-instructions.md` agent workflow:
1. **ANALYZE**: Read all affected files first
2. **PLAN**: Create todo list with `manage_todo_list`
3. **IMPLEMENT**: One file at a time, mark todos in-progress → completed
4. **VALIDATE**: lint + build + test
5. **REPORT**: Summarize changes

---

## CONSTRAINTS

- **No new package installs** — everything needed is already installed
- **No hardcoded URLs** — all from data files (socials.json, profile.json)
- **External links**: `rel="noopener noreferrer"` + `target="_blank"`
- **All UI**: Must work in dark AND light mode
- **Security**: API key stays in `.env.local`, server-side only
- **Keep it minimal**: Don't add features beyond what's listed above
