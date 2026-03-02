# AI Agent Prompt — Floating Hub Widget (Teal HQ-Inspired)

> **Copy-paste this ENTIRE prompt into a new Copilot chat session (Claude Opus 4.6) to implement the floating hub widget.**

---

## TASK

Refactor the existing AI chatbot floating button into a **multi-purpose floating hub widget** inspired by [Teal HQ's](https://app.tealhq.com/) bottom-right widget. The hub expands from a single FAB (Floating Action Button) into a panel with multiple quick-action options — the AI chatbot being one of them. This replaces the current single-purpose `ChatWidget.tsx`.

---

## CURRENT STATE (What Exists)

The portfolio at namias.tech already has a fully working AI chatbot:

### Existing Files (DO NOT break these — refactor into the hub)
- `src/components/ui/ChatWidget.tsx` — Floating pink button + slide-up chat panel (172 lines, fully working)
- `src/components/ui/ChatMessage.tsx` — Chat message bubble component (39 lines)
- `src/app/api/chat/route.ts` — POST /api/chat with Gemini 2.0 Flash, rate limiting, input validation (180 lines)
- `src/app/layout.tsx` — `<ChatWidget />` mounted after `{children}` in root layout (line 96)
- `src/__tests__/components/ChatWidget.test.tsx` — 12 test cases
- `src/__tests__/api/chat.test.ts` — 16 test cases
- `src/__tests__/components/ChatMessage.test.tsx` — 5 test cases
- `src/types/index.ts` — `ChatMessage` interface already defined

### Existing Design System
- Tailwind CSS v3 with custom tokens (see `tailwind.config.ts`)
- Framer Motion for all animations
- Lucide React for icons
- `next-themes` dark/light mode (class strategy, default dark)
- Card-based design with `<Card>` from `src/components/ui/Card.tsx`
- Accent color: `accent-pink` (#db2777)
- Theme classes: `text-text-primary-light dark:text-text-primary-dark`, `bg-surface-light dark:bg-surface-dark`, etc.

### Data Available (from portfolio-resources/data/)
- `socials.json` — 8 social links (calendly featured, github, email, linkedin, facebook, discord, x, instagram)
- `profile.json` — Name, title, email, location, education, highlights
- `blog.json` — 6 blog posts with slugs
- `projects.json` — 7 projects
- Resume at `/resume.pdf`

---

## DESIGN VISION — Teal HQ-Inspired Floating Hub

### Interaction Flow

```
┌─────────────────────────────────────────────┐
│  STATE 1: CLOSED                            │
│                                             │
│  [Pink circular FAB with sparkle/grid icon] │
│  Fixed bottom-6 right-6, z-50              │
│  Hover: scale 1.1 + tooltip "Quick Actions" │
│  Pulse animation on first visit (attention) │
└─────────────────────────────────────────────┘
           │ Click
           ▼
┌─────────────────────────────────────────────┐
│  STATE 2: HUB MENU (expanded)               │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  Quick Actions           [X close]  │    │
│  ├─────────────────────────────────────┤    │
│  │                                     │    │
│  │  🤖 Ask AI Assistant               │    │
│  │     Chat with Keneth's AI          │    │
│  │                                     │    │
│  │  📄 Download Resume                │    │
│  │     Get my latest CV (PDF)          │    │
│  │                                     │    │
│  │  📅 Schedule a Meeting              │    │
│  │     Book 15 min on Calendly         │    │
│  │                                     │    │
│  │  📧 Send Email                      │    │
│  │     pp.namias@gmail.com             │    │
│  │                                     │    │
│  │  🔗 Connect                         │    │
│  │     GitHub · LinkedIn · X           │    │
│  │                                     │    │
│  │  📝 Read Blog                       │    │
│  │     Latest articles & tutorials     │    │
│  │                                     │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  Same positioning: bottom-6 right-6        │
│  Width: w-80 (320px) on desktop            │
│  Full-screen on mobile (sm:)               │
│  Framer Motion slide-up + fade-in          │
└─────────────────────────────────────────────┘
           │ Click "Ask AI Assistant"
           ▼
┌─────────────────────────────────────────────┐
│  STATE 3: AI CHAT PANEL                     │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  [←back] Keneth's AI    [X close]  │    │
│  ├─────────────────────────────────────┤    │
│  │                                     │    │
│  │  (Existing chat UI — messages,      │    │
│  │   suggested questions, typing       │    │
│  │   indicator, input field)           │    │
│  │                                     │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  Same panel, just swaps content             │
│  Back button returns to hub menu            │
│  Chat state persists across panel switches  │
└─────────────────────────────────────────────┘
```

### Hub Menu Items (6 actions)

| # | Icon (Lucide) | Label | Subtitle | Action |
|---|---------------|-------|----------|--------|
| 1 | `Bot` | Ask AI Assistant | Chat with Keneth's AI | Switch to chat panel (State 3) |
| 2 | `FileDown` | Download Resume | Get my latest CV (PDF) | `<a href="/resume.pdf" download>` direct download |
| 3 | `Calendar` | Schedule a Meeting | Book 15 min on Calendly | `window.open(calendlyLink, '_blank')` |
| 4 | `Mail` | Send Email | pp.namias@gmail.com | `window.location.href = 'mailto:pp.namias@gmail.com'` |
| 5 | `Share2` | Connect | GitHub · LinkedIn · X | Expand inline to show 3-4 social icon buttons |
| 6 | `PenLine` | Read Blog | Latest articles & tutorials | `router.push('/blog')` or `window.open('/blog')` |

### Visual Design Rules

1. **Hub menu items**: Each is a row with icon (left, 40x40 rounded-lg bg), label + subtitle (right). Hover: subtle bg highlight + slight x-translate.
2. **Icons**: Use accent-pink backgrounds with white icon color for the icon containers.
3. **Panel**: Same dimensions and positioning as current chat panel — `sm:w-96 sm:h-auto sm:max-h-[520px]` with `sm:rounded-2xl`.
4. **Transitions**: Use Framer Motion `AnimatePresence` with `mode="wait"` for smooth panel-to-panel transitions.
5. **FAB**: Replace `MessageCircle` icon with `Sparkles` or `LayoutGrid` icon (indicates multi-purpose). Keep pink color.
6. **Badge**: Optional — show a small dot/badge on the FAB if the user hasn't interacted yet (attention indicator).
7. **Backdrop**: No full-page overlay (unlike modals) — the hub is a discrete floating panel.
8. **Mobile**: Full-screen takeover on `< sm:` breakpoint, same as current chat.

---

## ARCHITECTURE

### New File Structure

```
src/components/ui/
├── FloatingHub.tsx          # NEW — Main hub container (FAB + panel + state machine)
├── HubMenu.tsx              # NEW — Hub menu with 6 action items
├── HubMenuItem.tsx          # NEW — Individual menu item row component
├── ChatPanel.tsx            # RENAMED from ChatWidget.tsx — Chat-only panel (no FAB)
├── ChatMessage.tsx          # UNCHANGED — Message bubble component
└── ... (existing files)
```

### Component Hierarchy

```
<FloatingHub>                    # Manages: isOpen, activePanel state
  ├── <FAB />                    # Floating button (when closed)
  ├── <HubPanel>                 # AnimatePresence container
  │   ├── <HubMenu />           # activePanel === 'menu'
  │   │   └── <HubMenuItem />×6 # Each action row
  │   └── <ChatPanel />         # activePanel === 'chat'
  │       └── <ChatMessage />×N # Individual messages
  └── </HubPanel>
</FloatingHub>
```

### State Machine

```typescript
type HubState = 'closed' | 'menu' | 'chat';

// FloatingHub manages this state:
const [hubState, setHubState] = useState<HubState>('closed');

// Chat messages persist independently (don't reset when switching panels):
const [messages, setMessages] = useState<ChatMessage[]>([]);
```

### Integration

In `src/app/layout.tsx`, replace:
```tsx
<ChatWidget />
```
with:
```tsx
<FloatingHub />
```

---

## IMPLEMENTATION STEPS

### Step 1: Create `HubMenuItem.tsx`
A reusable row component for each hub action:

```tsx
// Props: icon, label, subtitle, onClick, href?, external?
// Design: 
//   - Left: 40x40 rounded-lg bg-accent-pink/10 with icon in accent-pink
//   - Right: label (font-medium, text-sm) + subtitle (text-xs, text-muted)
//   - Hover: bg-surface-light/dark slight highlight + translateX(2px)
//   - Framer Motion: staggered entrance (delay: index * 0.05)
```

### Step 2: Create `HubMenu.tsx`
The menu panel showing all 6 actions:

```tsx
// Header: "Quick Actions" title + X close button
// Body: 6 HubMenuItem instances
// The "Connect" item has special behavior:
//   - Click toggles inline expansion showing 4 social icons in a row
//   - Social icons: GitHub, LinkedIn, X/Twitter, Instagram (from socials.json)
// Footer: Optional — small "Built with ❤️ by Keneth" or "Powered by Gemini"
```

### Step 3: Refactor `ChatWidget.tsx` → `ChatPanel.tsx`
Extract the chat-only functionality:

```tsx
// REMOVE: The floating button (FAB) — now in FloatingHub
// REMOVE: The isOpen state — now managed by FloatingHub parent
// KEEP: All chat logic (messages, sendMessage, input, loading, error, typing indicator)
// KEEP: Suggested questions, auto-scroll, keyboard handling
// ADD: "Back to menu" button in header (← icon + "Back") that calls onBack prop
// ADD: Close button in header that calls onClose prop
// Props: { onBack: () => void; onClose: () => void }
// Chat state (messages) should be managed in FloatingHub and passed as props
//   so messages persist when switching between menu and chat
```

### Step 4: Create `FloatingHub.tsx`
The main container orchestrating everything:

```tsx
// State:
//   hubState: 'closed' | 'menu' | 'chat'
//   messages: ChatMessage[] (persists across panel switches)
//   input, isLoading, error (chat state — lifted from ChatPanel)
//
// FAB: Render when hubState === 'closed'
//   - Sparkles or LayoutGrid icon, pink bg, rounded-full
//   - AnimatePresence scale entrance
//   - onClick → setHubState('menu')
//
// Panel: AnimatePresence with mode="wait"
//   - hubState === 'menu' → <HubMenu />
//   - hubState === 'chat' → <ChatPanel />
//   - Shared panel wrapper: same positioning, border, shadow, rounded corners
//
// Escape key: 
//   - If chat → go back to menu
//   - If menu → close hub
//
// Click outside: close hub (optional — be careful with mobile)
```

### Step 5: Update `layout.tsx`
Replace `<ChatWidget />` with `<FloatingHub />`:
```tsx
import { FloatingHub } from '@/components/ui/FloatingHub';
// ...
<Providers>
  {children}
  <FloatingHub />
</Providers>
```

### Step 6: Update Tests

#### `src/__tests__/components/FloatingHub.test.tsx` (NEW — ~15 tests)
```
- Renders floating action button when closed
- Opens hub menu on FAB click
- Displays all 6 menu items
- "Ask AI Assistant" opens chat panel
- "Download Resume" triggers download (href check)
- "Schedule a Meeting" opens Calendly in new tab
- "Send Email" opens mailto link
- "Connect" expands to show social icons
- "Read Blog" navigates to /blog
- Back button in chat returns to menu
- Close button closes entire hub
- Escape key behavior (chat → menu → closed)
- Chat messages persist when switching panels
- Accessibility: dialog role, aria-label, aria-modal
- Mobile: full-screen rendering
```

#### Update `src/__tests__/components/ChatWidget.test.tsx` → `ChatPanel.test.tsx`
Rename and adapt tests for the new `ChatPanel` component:
- Remove FAB-related tests (moved to FloatingHub tests)
- Add back button test
- Keep all chat functionality tests
- Update imports

#### Keep `src/__tests__/api/chat.test.ts` — UNCHANGED
The API route doesn't change at all.

#### Keep `src/__tests__/components/ChatMessage.test.tsx` — UNCHANGED

### Step 7: Validate
```bash
npm run lint    # Fix all ESLint errors
npm run build   # Fix all TypeScript/compilation errors  
npm run test    # All unit tests pass
```

---

## IMPORTANT CONSTRAINTS

### Security
- **NEVER hardcode API keys.** The Gemini key is in `.env.local` and accessed server-side only in `/api/chat/route.ts`.
- **All URLs must come from data files** (`socials.json`, `profile.json`). Never hardcode URLs in components.
- External links must use `rel="noopener noreferrer"` with `target="_blank"`.
- Resume download uses `<a href="/resume.pdf" download>` — NO JavaScript `window.open` for downloads.

### Data Sources
All content must come from the existing data layer:
```
portfolio-resources/data/socials.json  → Calendly URL, GitHub, LinkedIn, etc.
portfolio-resources/data/profile.json  → Email address, name
/resume.pdf                            → Resume download
/blog                                  → Blog page route
```
Import data via `src/data/*.ts` modules (e.g., `import { socials } from '@/data/socials'`).

### Design System Compliance
```tsx
// Theme colors (MANDATORY for all visible elements):
className="text-text-primary-light dark:text-text-primary-dark"
className="text-text-secondary-light dark:text-text-secondary-dark"
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

// Staggered children:
transition={{ delay: index * 0.05, duration: 0.2 }}
```

### Framer Motion Specifics
- Use `AnimatePresence mode="wait"` for panel transitions (menu ↔ chat)
- FAB entrance: `initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}`
- Panel entrance: `initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}`
- Menu items: staggered fade-in with slight y-translate

### Testing Rules
- Mock `framer-motion` in all component tests (same pattern as existing tests)
- Mock `fetch` for API calls in chat tests
- Mock `next/navigation` if using `useRouter`
- Use `@testing-library/react` + `@testing-library/user-event`
- Test runner: `vitest` (already configured in `vitest.config.ts`)
- Test files go in `src/__tests__/components/`

### Accessibility
- Hub panel: `role="dialog"`, `aria-modal="true"`, `aria-label="Quick Actions"`
- Chat panel: `aria-label="Chat with Keneth's AI"`
- All interactive elements need `aria-label` attributes
- Focus trap within open panels (or at minimum, focus the first element on open)
- Keyboard navigation: Tab through menu items, Enter to activate

---

## FILES TO CREATE/MODIFY (Summary)

| Action | File | Description |
|--------|------|-------------|
| CREATE | `src/components/ui/FloatingHub.tsx` | Main hub container (FAB + state machine + panel wrapper) |
| CREATE | `src/components/ui/HubMenu.tsx` | Menu panel with 6 action items |
| CREATE | `src/components/ui/HubMenuItem.tsx` | Reusable action row component |
| RENAME+REFACTOR | `src/components/ui/ChatWidget.tsx` → preserve but refactor to `ChatPanel.tsx` | Extract chat-only panel (remove FAB, add back/close props) |
| MODIFY | `src/app/layout.tsx` | Replace `<ChatWidget />` with `<FloatingHub />` |
| CREATE | `src/__tests__/components/FloatingHub.test.tsx` | ~15 test cases for hub behavior |
| MODIFY | `src/__tests__/components/ChatWidget.test.tsx` | Rename or refactor for ChatPanel |
| UNCHANGED | `src/components/ui/ChatMessage.tsx` | Keep as-is |
| UNCHANGED | `src/app/api/chat/route.ts` | Keep as-is |
| UNCHANGED | `src/__tests__/api/chat.test.ts` | Keep as-is |
| UNCHANGED | `src/__tests__/components/ChatMessage.test.tsx` | Keep as-is |
| UPDATE | `.github/copilot-instructions.md` | Update project structure + component docs |

---

## TYPE DEFINITIONS

Add to `src/types/index.ts`:

```typescript
export type HubState = 'closed' | 'menu' | 'chat';

export interface HubMenuItemData {
  id: string;
  icon: string;         // Lucide icon name
  label: string;
  subtitle: string;
  action: 'chat' | 'download' | 'external' | 'mailto' | 'navigate' | 'expand';
  href?: string;        // For download, external, mailto, navigate actions
  expandItems?: {       // For 'expand' action (Connect → social icons)
    name: string;
    icon: string;
    href: string;
  }[];
}
```

---

## VALIDATION CHECKLIST

After implementation, verify ALL of these:

- [ ] FAB renders on every page (layout.tsx)
- [ ] FAB click opens hub menu, NOT chat directly
- [ ] All 6 menu items render with correct icons and labels
- [ ] "Ask AI Assistant" → opens chat panel with back button
- [ ] Chat messages persist when going Back → Forward
- [ ] "Download Resume" downloads `/resume.pdf` (check `download` attribute)
- [ ] "Schedule a Meeting" opens Calendly URL from `socials.json`
- [ ] "Send Email" opens `mailto:pp.namias@gmail.com` from `profile.json`
- [ ] "Connect" expands inline showing GitHub/LinkedIn/X icons from `socials.json`
- [ ] "Read Blog" navigates to `/blog`
- [ ] Back button in chat returns to hub menu
- [ ] X close button closes entire hub from any state
- [ ] Escape key: chat → menu, menu → closed
- [ ] Works in both dark and light mode
- [ ] Mobile: full-screen panel (< sm breakpoint)
- [ ] Desktop: floating panel (sm: breakpoint and up)
- [ ] All existing chat tests pass (or are properly adapted)
- [ ] New FloatingHub tests pass (~15 tests)
- [ ] `npm run lint` — zero errors
- [ ] `npm run build` — zero errors
- [ ] `npm run test` — all tests pass
- [ ] No hardcoded URLs — all from data files
- [ ] External links use `rel="noopener noreferrer"`
- [ ] API key is NOT in any client-side code

---

## TECH STACK (already installed — do NOT install new packages)

- Next.js 14 (App Router) + TypeScript strict
- Tailwind CSS v3
- Framer Motion
- Lucide React
- next-themes
- vitest + @testing-library/react + @testing-library/user-event + @testing-library/jest-dom
- @google/generative-ai (for API route only, not client-side)

---

## WORKFLOW

Follow the agent workflow from `.github/copilot-instructions.md`:

1. **ANALYZE**: Read all affected files first. Read `copilot-instructions.md`, existing `ChatWidget.tsx`, `ChatMessage.tsx`, `layout.tsx`, existing tests.
2. **PLAN**: Create a todo list with `manage_todo_list`. Break into atomic steps.
3. **IMPLEMENT**: One file at a time. Mark todos in-progress/completed.
4. **VALIDATE**: Run `npm run lint`, `npm run build`, `npm run test`.
5. **REPORT**: Summarize changes and update `copilot-instructions.md`.

---

## FINAL NOTES

- The current `ChatWidget.tsx` is 172 lines of working code. **Do not rewrite from scratch** — extract the chat logic into `ChatPanel.tsx` and wrap it in the new `FloatingHub.tsx`.
- The `ChatMessage.tsx` component is perfect as-is — don't touch it.
- The `/api/chat/route.ts` is battle-tested with rate limiting and input validation — don't touch it.
- All 33 existing tests should continue passing (rename/adapt as needed).
- Keep the pink accent color consistent across all new components.
- The hub should feel lightweight and fast — avoid animations longer than 200ms.
