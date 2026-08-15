Copy everything below this line into a new OpenCode session to build the complete smarter AI chatbot.

---

You are implementing a complete smarter AI Chatbot for the PP Namias portfolio-v1. Read everything below carefully, then implement epic-by-epic.

## Context

- **Repo**: `D:\Users\ADMIN\Desktop\PP Namias\Portfolio`
- **App**: `portfolio-v1/` — Next.js 16.2.10, React 18, Tailwind CSS 3, TypeScript strict, Framer Motion 11, pnpm 11.5, Vitest 4
- **Current state**: A working but simplistic LangGraph chatbot exists — but it needs a **smarter rewrite** following the patterns from `tahirkorma/langgraph-chatbot`

## The 6 Key Improvements Needed

| Area | Current (bad) | Target (good) |
|------|--------------|---------------|
| **Tool calling** | `executeToolNode` manually parses keywords from user message | `llm.bind_tools(tools)` + `ToolNode(tools)` + `tools_condition` — Gemini decides when/what to call |
| **Persistence** | Custom JSON files (`.chat-data/`) | `SqliteSaver(conn=sqlite3.connect('chatbot.db'))` — proper LangGraph checkpointing |
| **Streaming** | Splits final response string into words via regex | `.streamEvents()` from compiled graph — real LLM token-by-token |
| **LLM binding** | Custom `generateWithGemini()` wrapper | `ChatGoogleGenerativeAI` from `@langchain/google-genai` |
| **Vector store** | Upstash Vector (cloud-only) | SQLite-based local vectors with cosine similarity |
| **Graph structure** | 6 custom nodes with manual routing | `generate`(bound tools) → `ToolNode` → `tools_condition` — 3-node flow |

## Files to Read First

Read ALL of these in parallel to understand existing patterns:

1. `portfolio-v1/src/lib/chat/graph.ts` — current graph (to replace)
2. `portfolio-v1/src/lib/chat/types.ts` — current types (to extend)
3. `portfolio-v1/src/lib/chat/persistence.ts` — current JSON persistence (to replace)
4. `portfolio-v1/src/lib/chat/tools/index.ts` — current tool registry
5. `portfolio-v1/src/lib/chat/tools/web-search.ts` — current DuckDuckGo tool
6. `portfolio-v1/src/lib/chat/tools/calculator.ts` — current calculator tool
7. `portfolio-v1/src/lib/chat/tools/stock-price.ts` — current stock price tool
8. `portfolio-v1/src/lib/chat/tools/portfolio-query.ts` — current portfolio query tool
9. `portfolio-v1/src/lib/chat/tools/send-message.ts` — current send message tool
10. `portfolio-v1/src/app/api/chat/route.ts` — current API route + SSE streaming handler
11. `portfolio-v1/src/app/api/chat/threads/route.ts` — current thread list/create
12. `portfolio-v1/src/app/api/chat/threads/[id]/route.ts` — current thread detail/PATCH/DELETE
13. `portfolio-v1/src/hooks/use-chat-stream.ts` — current SSE hook
14. `portfolio-v1/src/components/ui/ChatPanel.tsx` — current chat UI
15. `portfolio-v1/src/components/ui/ThreadSidebar.tsx` — current thread sidebar
16. `portfolio-v1/src/components/ui/FloatingHub.tsx` — current hub component
17. `portfolio-v1/src/components/ui/HubMenu.tsx` — current hub menu
18. `portfolio-v1/src/lib/features.ts` — feature flags
19. `portfolio-v1/src/app/api/chat/lib/providers.ts` — existing Gemini/OpenAI providers (keep)
20. `portfolio-v1/src/app/api/chat/lib/promptBuilder.ts` — existing system prompt builder (keep)
21. `portfolio-v1/src/app/api/chat/lib/smartFallback.ts` — existing fallback (keep)
22. `portfolio-v1/src/lib/rag/` — existing RAG pipeline (keep as fallback, add SQLite vectors)
23. `portfolio-v1/src/app/api/chat/admin/reindex/route.ts` — existing reindex API
24. `portfolio-v1/package.json` — current dependencies
25. `portfolio-v1/tailwind.config.ts` — Tailwind config
26. `portfolio-v1/src/types/` — type definitions
27. `portfolio-v1/src/lib/cms-content.server.ts` — CMS content loader
28. `portfolio-v1/src/__tests__/chat/` — existing chat tests (update/extend)

Also fetch these reference files from the tahirkorma/langgraph-chatbot repo:
- `https://raw.githubusercontent.com/tahirkorma/langgraph-chatbot/main/langgraph_backend_chatbot.py`
- `https://raw.githubusercontent.com/tahirkorma/langgraph-chatbot/main/langgraph_database_backend.py`
- `https://raw.githubusercontent.com/tahirkorma/langgraph-chatbot/main/langgraph_tool_backend.py`

## Step-by-Step Implementation

### Step 1: Install dependencies

Run in `portfolio-v1/`:
```bash
pnpm add @langchain/google-genai better-sqlite3 @types/better-sqlite3
```

No other deps needed — `@langchain/langgraph`, `@langchain/core`, `@langchain/community` are already installed.

### Step 2: Rewrite `src/lib/chat/persistence.ts` — SqliteSaver

Replace the JSON-file persistence with a proper SQLite-based system:

- Create `chatbot.db` in `process.cwd()` using `better-sqlite3`
- Use `SqliteSaver(conn)` for LangGraph checkpoint persistence
- Create custom `threads` table: `id TEXT PK, title TEXT, created_at TEXT, updated_at TEXT, message_count INTEGER`
- Create custom `messages` table: `id INTEGER PK AUTOINCREMENT, thread_id TEXT, role TEXT, content TEXT, tool_calls TEXT, created_at TEXT`
- Export: `getCheckpointer()`, `listThreads()`, `createThread()`, `getThread()`, `updateThread()`, `deleteThread()`, `getThreadMessages()`, `saveMessage()`, `deleteThreadMessages()`, `retrieveAllThreads()`
- Max 50 threads with LRU eviction on `createThread()`
- Keep the SAME export signatures as the current `persistence.ts` so thread route imports don't break

### Step 3: Rewrite `src/lib/chat/graph.ts` — bind_tools + ToolNode + streamEvents

Replace the 6-node graph with:

```typescript
// State
const GraphState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({ reducer: addMessagesReducer, default: () => [] }),
  threadId: Annotation<string>({ reducer: (_, next) => next, default: () => '' }),
  chatDataContext: Annotation<ChatDataContext | null>({ ... }),
  ragContext: Annotation<string>({ ... }),
  ragChunks: Annotation<RetrievedChunk[]>({ ... }),
  systemPrompt: Annotation<string>({ ... }),
  providerAttempts: Annotation<Record[]>({ ... }),
  userMessage: Annotation<string>({ ... }),
  history: Annotation<ConversationHistoryMessage[]>({ ... }),
});

// Tools — bind to Gemini
const llm = new ChatGoogleGenerativeAI({
  model: 'gemini-2.0-flash',
  temperature: 0.7,
  maxRetries: 2,
});
const tools = [webSearchTool, calculatorTool, stockPriceTool, portfolioQueryTool, sendMessageTool];
const llmWithTools = llm.bindTools(tools);

// Nodes
// 1. loadContextNode — load CMS data + build system prompt (same logic as current)
// 2. classifyIntentNode — lightweight keyword check for routing (keeping existing logic)
// 3. generateNode — invoke llmWithTools with system prompt + history + RAG context
// 4. ToolNode — LangGraph's built-in tool executor
//    const toolNode = new ToolNode(tools);

// Edges
// START → loadContext → classifyIntent → generate → tools_condition (built-in)
//   → route to ToolNode if tool_calls exist → back to generate
//   → route to END if no tool_calls
// Route generate → END when toolIterations >= 5

// The key: Do NOT route to ToolNode manually. Use tools_condition which checks
// AIMessage.tool_calls automatically. The LLM decides which tool to call.
```

Key implementation details:
- `classifyIntentNode` stays lightweight — just sets intent based on keywords
- `generateNode` calls `llmWithTools.invoke(messages)` — the LLM can respond OR call tools
- `tools_condition` is a LangGraph built-in that checks `AIMessage.tool_calls`
- Add `toolIterations` counter; after 5 iterations, force-end the graph

For streaming — expose a `streamEvents` version of `runChatGraph`:
```typescript
export async function streamChatGraph(params: {
  message: string;
  history: ConversationHistoryMessage[];
  threadId?: string;
  onToken?: (token: string) => void;
  onToolCall?: (name: string, args: Record<string, unknown>) => void;
  onStatus?: (step: string) => void;
  onToolResult?: (name: string, result: string) => void;
}): Promise<{ response: string; threadId: string }> {
  const { message, history, threadId, onToken, onToolCall, onStatus, onToolResult } = params;
  // ...
  const eventStream = await graph.streamEvents(initialState, {
    version: 'v2',
    configurable: { thread_id: resolvedThreadId },
  });
  for await (const event of eventStream) {
    const { event: eventName, data } = event;
    if (eventName === 'on_chat_model_stream') {
      const chunk = data.chunk;
      if (chunk?.content) {
        onToken?.(chunk.content);
      }
    } else if (eventName === 'on_tool_start') {
      onToolCall?.(data.name, data.input);
    } else if (eventName === 'on_tool_end') {
      onToolResult?.(data.name, data.output);
    }
  }
  // ...
}
```

Also keep the existing `runChatGraph()` function (non-streaming, backward compatible) that calls `graph.invoke()`.

### Step 4: Update `src/app/api/chat/route.ts`

Replace `handleStreamingResponse` to use `streamChatGraph()` instead of `runChatGraph()` + word-splitting:

```typescript
async function handleStreamingResponse(...) {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        controller.enqueue(encoder.encode(encodeSSE('status', { step: 'start', threadId })));
        const result = await streamChatGraph({
          message, history, threadId,
          onToken: (token) => {
            controller.enqueue(encoder.encode(encodeSSE('token', { content: token })));
          },
          onToolCall: (name, args) => {
            controller.enqueue(encoder.encode(encodeSSE('tool_call', { name, args })));
          },
          onStatus: (step) => {
            controller.enqueue(encoder.encode(encodeSSE('status', { step, threadId })));
          },
        });
        // save messages...
        controller.enqueue(encoder.encode(encodeSSE('done', { threadId: result.threadId })));
      } catch (e) {
        controller.enqueue(encoder.encode(encodeSSE('error', { error: e.message })));
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, { headers: { 'Content-Type': 'text/event-stream', ... } });
}
```

Keep the existing non-streaming path (`IS_LANGGRAPH_ENABLED && !acceptsStreaming`) using `runChatGraph()`.

### Step 5: Update threads API — use SqliteSaver

Update `src/app/api/chat/threads/route.ts` and `src/app/api/chat/threads/[id]/route.ts`:
- Replace imports from `@/lib/chat/persistence` with the new SQLite-based persistence
- The export signatures stay the same so the routes don't need logic changes

### Step 6: Add SQLite vector store for RAG

Create `src/lib/chat/rag/` with local SQLite-based vector storage:

```typescript
// src/lib/chat/rag/vector-store.ts
// SQLite-based vector store with cosine similarity
// Table: vectors(id TEXT PK, embedding BLOB, doc_type TEXT, doc_id TEXT, chunk_index INT, chunk_text TEXT, metadata TEXT)
// Export: upsertVectors(), queryVectors(embedding, topK), deleteVectors(), getCount()
// Cosine similarity computed in JS using Float32Array
```

```typescript
// src/lib/chat/rag/indexer.ts
// Uses @google/generative-ai to embed chunks
// Stores in SQLite vector store
// Export: reindexAll(), getStats()
```

```typescript
// src/lib/chat/rag/retriever.ts
// Query → embed via Gemini → search SQLite → deduplicate → format context
// Export: retrieve(), formatContext()
```

### Step 7: Update tools — add Tavily search

- Keep existing tools (web_search, calculator, stock_price, portfolio_query, send_message)
- Add Tavily search as primary web search: `npm install @tavily/core`
- Fall back to DuckDuckGo if Tavily is not configured
- Keep calculator as-is (already correct)
- Enhance stock_price with better error handling

### Step 8: Add admin reindex API using SQLite vector store

Update `src/app/api/chat/admin/reindex/route.ts`:
- Use the new SQLite-based vector store
- POST to trigger full reindex
- GET to get stats

### Step 9: Update tests

- `src/__tests__/chat/persistence.test.ts` — rewrite for SqliteSaver (mock SQLite with better-sqlite3)
- `src/__tests__/chat/graph.test.ts` — update for new graph structure (bind_tools + ToolNode)
- `src/__tests__/chat/tools.test.ts` — should still pass (tools unchanged)
- `src/__tests__/api/chat.test.ts` — update for new streaming format
- `src/__tests__/api/chat-threads.test.ts` — should still pass (API unchanged)
- `src/__tests__/hooks/use-chat-stream.test.tsx` — may need update for new event format

### Step 10: Quality gate

Run these in order:
```bash
pnpm add -D better-sqlite3 @types/better-sqlite3 @tavily/core
pnpm install

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Tests
npm run test -- --run

# If react-doctor is configured:
npm run doctor:check
```

## Critical Constraints

1. **Backward compatibility**: All existing imports from `@/lib/chat/persistence` must still work (same export names, same shapes)
2. **Feature flags**: Gate new graph behind `IS_LANGGRAPH_ENABLED` in `src/lib/features.ts`; mock to `false` in tests testing legacy flow
3. **Existing providers stay**: `generateWithGemini()`, `generateWithOpenAI()`, `buildSmartFallback()` are NOT removed — the new graph can use them via `ChatGoogleGenerativeAI` bindings, and the legacy code path keeps using them directly
4. **All existing tests must pass**: Do NOT break existing tests
5. **No comments in code** unless explicitly asked
6. **Follow Vercel Web Interface Guidelines**: keyboard nav, focus rings, 24px+ hit targets, `prefers-reduced-motion`, `touch-action: manipulation`
7. **Commit every slice**: After each step completes, commit with `git add -A && git commit --no-verify -m "type(scope): description"`

## File Manifest

### Files to CREATE:
- `src/lib/chat/rag/vector-store.ts` — SQLite vector store
- `src/lib/chat/rag/indexer.ts` — SQLite-based indexer
- `src/lib/chat/rag/retriever.ts` — SQLite-based retriever

### Files to REWRITE (complete replace):
- `src/lib/chat/persistence.ts` — SqliteSaver-based
- `src/lib/chat/graph.ts` — bind_tools + ToolNode + streamEvents

### Files to UPDATE (modify in place):
- `src/app/api/chat/route.ts` — use streamChatGraph in handleStreamingResponse
- `src/app/api/chat/threads/route.ts` — may need import updates
- `src/app/api/chat/threads/[id]/route.ts` — may need import updates
- `src/app/api/chat/admin/reindex/route.ts` — use SQLite vector store
- `src/__tests__/chat/persistence.test.ts` — SqliteSaver tests
- `src/__tests__/chat/graph.test.ts` — new graph structure tests
- `src/__tests__/api/chat.test.ts` — new streaming format tests
- `src/__tests__/hooks/use-chat-stream.test.tsx` — updated event format
- `portfolio-v1/package.json` — add new deps

### Files to NOT TOUCH:
- `src/app/api/chat/lib/providers.ts` — keep existing provider wrapper
- `src/app/api/chat/lib/promptBuilder.ts` — keep existing prompt builder
- `src/app/api/chat/lib/smartFallback.ts` — keep existing fallback
- `src/app/api/chat/lib/questionCatalog.ts` — keep existing catalog
- `src/app/api/chat/lib/intentClassifier.ts` — keep existing classifier
- `src/app/api/chat/lib/fallbackResponder.ts` — keep existing responder
- `src/app/api/chat/lib/rateLimiter.ts` — keep existing rate limiter
- `src/lib/rag/` — keep existing Upstash Vector RAG as fallback
- `src/components/ui/` — keep all existing UI components (ChatPanel, ThreadSidebar, FloatingHub, HubMenu)
- `src/hooks/use-chat-stream.ts` — keep existing SSE hook
- `src/lib/features.ts` — keep existing feature flags (add any new ones)
- `src/lib/cms-content.server.ts` — keep existing CMS loader
- All existing tests NOT in `src/__tests__/chat/` or `src/__tests__/api/chat*.test.*`

Start by reading all the listed files, then implement step-by-step, committing after each completed step.
