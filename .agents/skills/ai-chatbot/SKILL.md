# AI Chatbot Skill

## Description

Maintains the portfolio-v1 LangGraph.js chatbot — graph engine, tools, persistence, SSE streaming, thread management.

## Architecture

See `portfolio-v1/docs/chatbot/ARCHITECTURE.md` for full documentation.

## Core Files

| File | Purpose |
|------|---------|
| `src/lib/chat/graph.ts` | 6-node LangGraph state graph |
| `src/lib/chat/types.ts` | State schema, SSE types, thread metadata |
| `src/lib/chat/persistence.ts` | JSON-file persistence layer |
| `src/lib/chat/tools/` | 5 tools: web-search, calculator, stock-price, portfolio-query, send-message |
| `src/hooks/use-chat-stream.ts` | SSE consumer hook |
| `src/app/api/chat/route.ts` | SSE streaming POST route + graph integration |
| `src/app/api/chat/threads/route.ts` | Thread list + create |
| `src/app/api/chat/threads/[id]/route.ts` | Thread detail, rename, delete |
| `src/components/ui/ChatPanel.tsx` | Streaming message UI with thread sidebar |
| `src/components/ui/ThreadSidebar.tsx` | Thread CRUD sidebar |
| `src/components/ui/FloatingHub.tsx` | Entry point with thread state |
| `src/components/ui/HubMenu.tsx` | Recent conversations in hub |

## Feature Flags (`src/lib/features.ts`)

- `IS_LANGGRAPH_ENABLED` — use LangGraph graph vs legacy flow
- `IS_CHAT_STREAMING_ENABLED` — SSE streaming
- `IS_CHAT_THREADING_ENABLED` — thread sidebar + persistence

## Tests

```
npm run test -- --run src/__tests__/chat/
npm run test -- --run src/__tests__/api/chat.test.ts
npm run test -- --run src/__tests__/api/chat-threads.test.ts
npm run test -- --run src/__tests__/hooks/use-chat-stream.test.tsx
```

When adding features: mock feature flags to `false` for tests testing legacy behavior.
