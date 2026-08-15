# Copy-Paste Prompt for New Session — portfolio-v1 AI Chatbot

---

Copy everything below this line into a new opencode session:

---

You are implementing a LangGraph.js-powered AI Chatbot upgrade for the **portfolio-v1** version of the PP Namias portfolio. This is NOT a greenfield build — you are upgrading an existing, fully functional chat system with state-graph orchestration, threading, streaming, and tools.

## Context

This repo is at `D:\Users\ADMIN\Desktop\PP Namias\Portfolio`. All work goes in **`portfolio-v1/`**.

### What Already Exists

Portfolio-v1 already has a complete chat system at `portfolio-v1/src/app/api/chat/`:

- **`route.ts`** — POST endpoint with input validation, rate limiting (Upstash Redis), RAG retrieval, multi-provider AI generation (Gemini → OpenAI → smart fallback), and response
- **`lib/providers.ts`** — Gemini (3 models) + OpenAI providers with circuit breaker, retry, timeout
- **`lib/promptBuilder.ts`** — System prompt builder with tsundere personality, action tags, RAG context injection
- **`lib/rateLimiter.ts`** — 10 req/min/IP rate limiting
- **`lib/intentClassifier.ts`** — Keyword-based intent detection
- **`lib/questionCatalog.ts`** — 18 catalog entries with preset responses
- **`lib/smartFallback.ts`** — Orchestrates RAG → catalog → generic fallback
- **`lib/ragResponseBuilder.ts`** — RAG chunk grouping and response formatting

Plus a full RAG pipeline at `portfolio-v1/src/lib/rag/`:
- **`chunker.ts`** — Type-aware chunking for 10 doc types
- **`embedder.ts`** — Gemini embedding with batch processing
- **`retriever.ts`** — Upstash Vector query + context formatting
- **`vector-store.ts`** — Upstash Vector REST client
- **`indexer.ts`** — Reindex all/single document

And a complete chat UI in `portfolio-v1/src/components/ui/`:
- **`FloatingHub.tsx`** — Animated FAB with menu/chat panel toggle, focus trap, keyboard nav
- **`HubMenu.tsx`** — Quick actions menu with social links
- **`ChatPanel.tsx`** — Full chat panel with welcome, message display, typing indicator, follow-ups, error states
- **`ChatMessage.tsx`** — Message rendering with ACTION tag parsing + action buttons

### Tech Stack (portfolio-v1)

| Tech | Version |
|------|---------|
| Next.js | 16.2.10 |
| React | ^18.3.1 |
| Tailwind CSS | ^3.4.17 (NOT v4) |
| Framer Motion | ^11.15.0 (NOT motion 12) |
| TypeScript | ^5.7.3 (strict) |
| Package Manager | pnpm 11.5 |
| Testing | Vitest ^4.1.10 |
| Quality | react-doctor 0.7.3 (100/100 gate) |
| AI SDK | @google/generative-ai ^0.24.1 |
| Vector Store | @upstash/vector (existing) |
| Cache | @upstash/redis (existing) |
| State | jotai ^2.18.1 |
| Data Fetch | SWR ^2.4.2 |

## What to Build

Upgrade the existing chat system with:

1. **LangGraph.js state graph** — replace the linear provider-call flow with a directed graph: `classifyIntent → retrieveContext (existing RAG) → generate (existing providers) → routeToTool → executeTool (loop, max 5)`
2. **SQLite threading** — use better-sqlite3 with LangGraph's SqliteSaver for persistent multi-thread conversations (same pattern as langgraph-chatbot's `SqliteSaver(conn=sqlite3.connect('chatbot.db'))`)
3. **SSE streaming** — pipe LangGraph's `.streamEvents()` to the client as Server-Sent Events via ReadableStream
4. **Tools** — web search (DuckDuckGo via @langchain/community), calculator (add/sub/mul/div), stock price (Alpha Vantage), portfolio query, send message
5. **Updated ChatPanel** — add streaming display (progressive tokens), thread sidebar (list/switch/create/delete threads), tool call indicators

### MUST PRESERVE

- ✅ Full existing system prompt and tsundere personality (promptBuilder.ts)
- ✅ ACTION tags ([ACTION:resume], [ACTION:booking], [ACTION:email]) parsed by ChatMessage.tsx
- ✅ Multi-provider fallback chain (Gemini → OpenAI → buildSmartFallback)
- ✅ Existing RAG pipeline (Upstash Vector) — reuse in retrieveContext node
- ✅ Rate limiting (isRateLimited in route.ts)
- ✅ All existing tests (src/__tests__/api/chat.test.ts — 600 lines)
- ✅ FloatingHub.tsx, HubMenu.tsx, HubMenuItem.tsx, ChatMessage.tsx — no changes unless adding thread selector to hub menu
- ✅ Feature flags: IS_LANGGRAPH_ENABLED, IS_CHAT_STREAMING_ENABLED, IS_CHAT_THREADING_ENABLED in src/lib/features.ts

### CRITICAL: Run commands from portfolio-v1/

```bash
cd portfolio-v1
pnpm install  # after adding deps
pnpm check-types
pnpm lint
pnpm test:run
```

All commands MUST be run inside `portfolio-v1/` directory, not the repo root.

## Files to Create/Modify

### New: Core Engine (`portfolio-v1/src/lib/chat/`)
- `graph.ts` — LangGraph state graph with SqliteSaver checkpointing
- `types.ts` — ChatState, intent enums (extend existing chat lib types)

### New: Tools (`portfolio-v1/src/lib/chat/tools/`)
- `web-search.ts` — DuckDuckGo search (langgraph-chatbot compatible)
- `calculator.ts` — add/sub/mul/div (langgraph-chatbot compatible)
- `stock-price.ts` — Alpha Vantage (langgraph-chatbot compatible)
- `portfolio-query.ts` — portfolio data by category
- `send-message.ts` — contact/booking with confirmation
- `index.ts` — aggregator

### New: Hooks (`portfolio-v1/src/hooks/`)
- `use-chat-stream.ts` — SSE consumer hook

### New: UI Components (`portfolio-v1/src/components/ui/`)
- `ThreadSidebar.tsx` — thread list with CRUD
- `ThreadToggle.tsx` — toggle button for thread sidebar

### Modified: API Routes (`portfolio-v1/src/app/api/chat/`)
- `route.ts` — refactor to use LangGraph graph + SSE streaming (keep validation, rate limiting, error handling)
- `threads/route.ts` — NEW: GET list, POST create
- `threads/[id]/route.ts` — NEW: GET/PATCH/DELETE

### Modified: UI (`portfolio-v1/src/components/ui/`)
- `ChatPanel.tsx` — add streaming via useChatStream, thread sidebar integration, tool call indicators
- `FloatingHub.tsx` — optional: show recent threads in hub menu

### Modified: Feature Flags (`portfolio-v1/src/lib/`)
- `features.ts` — add IS_LANGGRAPH_ENABLED, IS_CHAT_STREAMING_ENABLED, IS_CHAT_THREADING_ENABLED

## Execution Order

1. Install deps: `@langchain/langgraph @langchain/google-genai @langchain/core @langchain/community better-sqlite3 @types/better-sqlite3`
2. Build the graph engine (graph.ts, types.ts) — wire existing providers into graph nodes
3. Build tools (web-search, calculator, stock-price, portfolio-query, send-message)
4. Bind tools to Gemini, wire executeTool node with 5-iteration loop
5. Refactor POST /api/chat to use graph + SSE
6. Build thread management API routes
7. Build useChatStream SSE hook
8. Update ChatPanel with streaming display
9. Build ThreadSidebar + integrate
10. Add feature flags
11. Run quality gate: `pnpm check-types && pnpm lint && pnpm test:run`
12. Run existing chat test suite to confirm zero regression

## Reference Files (READ THESE FIRST)

- PRD: `D:\Users\ADMIN\Desktop\PP Namias\Portfolio\docs\prd\prd.ai-chatbot.json`
- Existing chat route: `portfolio-v1/src/app/api/chat/route.ts`
- Existing providers: `portfolio-v1/src/app/api/chat/lib/providers.ts`
- Existing prompt builder: `portfolio-v1/src/app/api/chat/lib/promptBuilder.ts`
- Existing RAG retriever: `portfolio-v1/src/lib/rag/retriever.ts`
- Existing chat types: `portfolio-v1/src/app/api/chat/lib/types.ts`
- Existing chat UI: `portfolio-v1/src/components/ui/ChatPanel.tsx`
- Existing features: `portfolio-v1/src/lib/features.ts`
- Existing tests: `portfolio-v1/src/__tests__/api/chat.test.ts`
- langgraph-chatbot reference: https://github.com/tahirkorma/langgraph-chatbot (Python, but patterns translate to TS)

Start by reading the PRD and the existing chat files to understand the full architecture, then build epic-by-epic.
