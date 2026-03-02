# AI Chatbot Implementation Prompt — Portfolio (Next.js 14)

> **Copy-paste this ENTIRE prompt into a new Copilot chat session to implement the AI chatbot widget.**

---

## TASK

Implement a fully working AI chatbot widget for my Next.js 14 portfolio website. The chatbot appears as a floating button in the bottom-right corner of every page. When clicked, it expands into a chat panel where visitors can ask questions about me (Jhon Keneth Namias) and get AI-powered responses based on my real portfolio data.

## TECH STACK (already installed)
- Next.js 14 (App Router) with TypeScript strict mode
- Tailwind CSS v3 with custom design tokens (see tailwind.config.ts)
- Framer Motion for animations
- Lucide React for icons
- next-themes for dark/light mode (class strategy, default dark)
- Deployed on AWS Amplify (standalone output)

## REQUIREMENTS

### 1. AI Provider: Google Gemini (Free Tier)

Install the official Google AI SDK:
```bash
npm install @google/generative-ai
```

Use `gemini-2.0-flash` model (free, fast, good quality).

The API key goes in `.env.local`:
```
GOOGLE_GEMINI_API_KEY=your_key_here
```

Add `.env.local` to `.gitignore` (already there via `.env.*` pattern).

### 2. API Route: `/api/chat`

Create `src/app/api/chat/route.ts`:

**Security requirements:**
- **Rate limiting**: In-memory Map tracking requests per IP. Max 10 requests per minute per IP. Return 429 if exceeded.
- **Input validation**: Max 500 characters per message. Reject empty messages. Strip HTML tags.
- **System prompt**: Inject ALL portfolio data (profile, experiences, projects, technologies, certifications, memberships, education, socials) into the system prompt so the AI can answer accurately.
- **Persona**: The AI responds as "Keneth's AI Portfolio Assistant". It only answers questions related to the portfolio owner. For off-topic questions, it politely redirects.
- **Response format**: JSON `{ message: string }` on success, `{ error: string }` on failure.
- **No streaming**: Simple request/response for security and simplicity.
- **Error handling**: Catch all errors, never expose internal details to client.

**System prompt must include:**
```
You are Keneth's AI Portfolio Assistant on namias.tech. You help visitors learn about Jhon Keneth Namias (PP Namias), a Full Stack Developer based in Caloocan City, Philippines.

RULES:
- Only answer questions about Keneth, his work, skills, projects, experience, and education.
- Be friendly, concise, and professional.
- If asked something unrelated, politely say "I can only help with questions about Keneth's portfolio and professional background."
- Include relevant links when helpful (GitHub, LinkedIn, Cal.com, project URLs).
- Format responses in plain text, not markdown.

PROFILE DATA:
[inject profile.json content]

EXPERIENCE:
[inject experiences.json content]

PROJECTS:
[inject projects.json content]

TECHNOLOGIES:
[inject technologies.json content — 45 technologies across 6 categories with proficiency percentages]

CERTIFICATIONS:
[inject certifications.json content — 28 certifications]

EDUCATION:
BS Computer Science at University of Caloocan City (2021-present), GPA 3.8, Dean's List, Academic Excellence Award.
Relevant courses: DSA, Software Engineering, DBMS, Web Dev, Mobile Dev, AI.

MEMBERSHIPS:
- Philippine Software Industry Association (PSIA) since 2024
- Analytics & AI Association of the Philippines (AAAP) since 2024

SOCIAL LINKS:
- Cal.com: https://cal.com/pp-namias
- GitHub: https://github.com/PP-Namias
- Email: pp.namias@gmail.com
- LinkedIn: https://www.linkedin.com/in/pp-namias/
```

Import the actual JSON data from `portfolio-resources/data/` to build this prompt dynamically (don't hardcode).

### 3. ChatWidget Component

Create `src/components/ui/ChatWidget.tsx` ('use client'):

**UI Design:**
- **Closed state**: Floating circular button (48x48) in bottom-right corner (`fixed bottom-6 right-6 z-50`). Pink accent background (`bg-accent-pink`). MessageCircle icon from Lucide. Subtle pulse animation on mount.
- **Open state**: Expandable panel (384px wide, 500px tall on desktop; full-width on mobile). Slides up with Framer Motion `AnimatePresence`. Rounded corners, card-bg background, border matching theme.
- **Header**: "Chat with Keneth's AI" title + X close button. Pink accent bar at top.
- **Messages area**: Scrollable div with auto-scroll to bottom. Bot messages: left-aligned, card-bg with border. User messages: right-aligned, accent-pink background, white text.
- **Input area**: Text input + send button. Disabled while loading. Enter to send.
- **Suggested questions**: Show 3-4 quick-reply chip buttons when chat is empty:
  - "What tech stack do you use?"
  - "Tell me about your experience"
  - "What projects have you built?"
  - "How can I contact you?"
- **Loading state**: Animated typing indicator (3 bouncing dots) while waiting for AI response.
- **Error state**: "Something went wrong. Try again." with retry button.
- **Theme**: Must work in both dark and light mode using portfolio's Tailwind color tokens (text-primary, text-secondary, text-muted, card-bg, border, accent-pink).
- **Accessibility**: `aria-label` on button, `role="dialog"` on panel, focus trap when open, Escape to close.
- **Mobile**: Full-screen overlay on screens < 640px (sm breakpoint).

### 4. ChatMessage Component

Create `src/components/ui/ChatMessage.tsx`:

**Props:** `{ role: 'user' | 'assistant'; content: string; timestamp?: Date }`

**Styling:**
- User: aligned right, pink bg, white text, rounded-2xl with rounded-br-md
- Bot: aligned left, card-bg with border, primary text, rounded-2xl with rounded-bl-md
- Timestamp: tiny muted text below message
- Entrance animation: fade-in + slide-up (Framer Motion)

### 5. Types

Add to `src/types/index.ts`:
```typescript
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
```

### 6. Mount in Layout

Add `<ChatWidget />` inside `<Providers>` in `src/app/layout.tsx`, after `{children}`. It must appear on every page.

### 7. Testing

Create these test files using the testing framework already available (or install vitest + @testing-library/react if needed):

**`src/__tests__/api/chat.test.ts`:**
- Test rate limiting (11th request should return 429)
- Test empty message rejection (400)
- Test message too long (400)
- Test HTML stripping
- Test successful response format

**`src/__tests__/components/ChatWidget.test.tsx`:**
- Test widget renders floating button
- Test clicking button opens chat panel
- Test Escape key closes panel
- Test suggested questions render when no messages
- Test sending a message adds it to the chat
- Test loading state shows typing indicator

**`src/__tests__/components/ChatMessage.test.tsx`:**
- Test user message styling (right-aligned)
- Test bot message styling (left-aligned)
- Test content renders correctly

## FILE STRUCTURE (create these files)

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # API route handler
│   └── layout.tsx                # Add <ChatWidget /> here
├── components/
│   └── ui/
│       ├── ChatWidget.tsx        # Main floating widget
│       └── ChatMessage.tsx       # Message bubble component
├── types/
│   └── index.ts                  # Add ChatMessage interface
└── __tests__/
    ├── api/
    │   └── chat.test.ts
    └── components/
        ├── ChatWidget.test.tsx
        └── ChatMessage.test.tsx
```

## VALIDATION CHECKLIST

After implementing everything:
1. Run `npm run lint` — 0 errors
2. Run `npm run build` — 0 errors, all pages compile
3. Run tests — all pass
4. Verify dark mode works
5. Verify mobile responsiveness
6. Verify rate limiting works
7. Verify the AI responds with accurate portfolio data
8. Verify off-topic questions are rejected
9. Verify Escape key closes the panel
10. Verify auto-scroll works on new messages

## IMPORTANT RULES
- Follow the existing code patterns in the codebase (see `.github/copilot-instructions.md`)
- Use the portfolio's exact Tailwind color tokens (text-primary-light/dark, accent-pink, card-bg-dark, border-light/dark, etc.)
- All portfolio data comes from `portfolio-resources/data/*.json` — never hardcode content
- Use `'use client'` only on interactive components
- Use Next.js `<Image>` for any images
- The API route must NEVER expose the API key to the client
- Add `.env.local` variables to `.env.example` (without real values)
- Update `.github/copilot-instructions.md` project structure and component list after implementation
