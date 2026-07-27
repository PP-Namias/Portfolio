Copy everything below this line into a new OpenCode/Claude session to generate the PRD.

---

You are creating a **Product Requirements Document (PRD)** in the existing JSON format at `docs/prd/prd.ai-chatbot-2.json` for a smarter AI chatbot implementation on the PP Namias portfolio.

## Context

This repo is at `D:\Users\ADMIN\Desktop\PP Namias\Portfolio`. It is a **Next.js 16.2.10** App Router project with **React 18**, **Tailwind CSS v3**, **TypeScript strict**, **Framer Motion 11**, **pnpm 11.5**, and **Vitest**. The project has **two sub-projects**:
- `portfolio-v1/` — the main portfolio application
- root — shared config/meta

There is already a **fully working LangGraph chatbot** at `portfolio-v1/src/lib/chat/` with:
- 6-node graph (loadContext→classifyIntent→retrieveContext→generate←→executeTool)
- 5 tools (web_search, calculator, stock_price, portfolio_query, send_message)
- JSON-file persistence (`.chat-data/`)
- Thread CRUD UI with sidebar
- SSE streaming hook
- 636 passing tests

BUT this implementation has **gaps** vs the reference `tahirkorma/langgraph-chatbot` (https://github.com/tahirkorma/langgraph-chatbot):
- Uses **manual string-matching** for tool dispatch instead of `bind_tools` + `ToolNode` + `tools_condition`
- Uses **JSON files** for persistence instead of `SqliteSaver`
- Splits final response into **words** for streaming instead of `.streamEvents()`
- Uses custom `generateWithGemini()` wrapper instead of `ChatGoogleGenerativeAI` LangChain binding
- Uses **Upstash Vector** (cloud) for RAG instead of SQLite-based local vectors

## What to Create

A **PRD** at `docs/prd/prd.ai-chatbot-2.json` following the exact JSON format of existing PRDs at `docs/prd/` (e.g., `prd.ai-chatbot.json`). The PRD must plan a **smarter implementation** that:

### Architecture Changes

1. **Native `bind_tools` + `ToolNode`** — Replace manual string-matching `executeToolNode` with LangGraph's built-in `llm.bind_tools(tools)`, `ToolNode(tools)`, and `tools_condition` conditional edge. Gemini decides when and with what args to call tools via native function-calling.

2. **`SqliteSaver` persistence** — Replace JSON-file persistence with `SqliteSaver(conn=sqlite3.connect('chatbot.db'))` matching the reference exactly. Keep thread metadata in a custom `threads` table and messages in a `messages` table for fast listing.

3. **`.streamEvents()` streaming** — Replace word-splitting with `await graph.streamEvents(initialState, { version: 'v2' })`. Pipe `on_chat_model_stream` events as SSE `token` events, `on_tool_start` as `tool_call` events.

4. **`ChatGoogleGenerativeAI` binding** — Use `@langchain/google-genai`'s `ChatGoogleGenerativeAI(model='gemini-2.0-flash')` instead of custom `generateWithGemini()` wrapper. This gives native streaming + tool calling.

5. **SQLite vector store** — Add local SQLite-based vector storage for RAG so it works offline without Upstash dependency. Store embeddings as BLOBs, compute cosine similarity in JS. Keep Upstash as optional cloud tier.

### Features to Plan

- **Epic 1**: Core graph refactor — bind_tools + ToolNode + tools_condition, SqliteSaver, streamEvents
- **Epic 2**: RAG pipeline upgrade — SQLite vector store, Gemini embeddings, type-aware chunking
- **Epic 3**: Tool improvements — add Tavily web search as primary (DuckDuckGo fallback), math.js calculator, enhanced portfolio query with multi-category support, contact form submission via API
- **Epic 4**: Threading upgrade — SqliteSaver-based persistence, thread-aware graph state, thread listing API (existing routes stay), auto-archive at 50 threads
- **Epic 5**: Streaming UI — update useChatStream for streamEvents event format, progressive token display with cursor, tool call indicators with timing, source citations from RAG
- **Epic 6**: Admin API — reindex endpoint, stats endpoint, health check
- **Epic 7**: Testing & Quality — 85%+ coverage on src/lib/chat/*, backward compat tests with mocked feature flags, tsc/lint/doctor gates
- **Epic 8**: Documentation — ARCHITECTURE.md, SKILL.md, AGENTS.md update

### Tech Stack
- `@langchain/langgraph` — graph orchestration
- `@langchain/google-genai` — Gemini model + embedding bindings
- `@langchain/core` — BaseMessage, AIMessage, ToolMessage types
- `@langchain/community` — DuckDuckGo search (fallback), math tool
- `better-sqlite3` — SQLite for checkpoints + vector store
- `@tavily/core` — primary web search tool
- `mathjs` — calculator tool
- `@google/generative-ai` — direct Gemini client for embeddings
- `framer-motion@11` — UI animations
- `lucide-react` — icons

### Success Metrics
- <2s time-to-first-token streaming
- <5s total response for 95% of queries
- 100/100 react-doctor score
- All existing tests pass
- 85%+ coverage on new chat code
- Full keyboard navigation
- Dark/light theme support

## Files to Read First

Read these to understand the existing patterns:
1. `docs/prd/prd.ai-chatbot.json` — existing PRD format + current implementation details
2. `docs/prd/ai-chatbot-plan.md` — the gap analysis and plan
3. `portfolio-v1/src/lib/chat/graph.ts` — current graph implementation
4. `portfolio-v1/src/lib/chat/persistence.ts` — current JSON persistence
5. `portfolio-v1/src/lib/chat/types.ts` — current type definitions
6. `portfolio-v1/src/app/api/chat/route.ts` — current API route + SSE streaming
7. `portfolio-v1/src/lib/rag/` — existing RAG pipeline (6 files)
8. `portfolio-v1/src/app/api/chat/lib/providers.ts` — existing Gemini/OpenAI providers
9. `portfolio-v1/package.json` — current dependencies
10. `portfolio-v1/src/hooks/use-chat-stream.ts` — current SSE hook
11. `portfolio-v1/src/components/ui/ChatPanel.tsx` — current chat UI
12. `portfolio-v1/src/components/ui/ThreadSidebar.tsx` — current thread sidebar
13. `portfolio-v1/src/components/ui/FloatingHub.tsx` — current hub component
14. `portfolio-v1/src/lib/features.ts` — feature flags
15. `portfolio-v1/tailwind.config.ts` — Tailwind config

Also fetch the reference implementation patterns from:
- https://raw.githubusercontent.com/tahirkorma/langgraph-chatbot/main/langgraph_backend_chatbot.py
- https://raw.githubusercontent.com/tahirkorma/langgraph-chatbot/main/langgraph_database_backend.py
- https://raw.githubusercontent.com/tahirkorma/langgraph-chatbot/main/langgraph_tool_backend.py

## PRD Format

Follow the exact JSON schema used by existing PRDs. Each PRD has:
- `id`, `title`, `version`, `status`, `created`, `appliesTo`, `description`
- `objectives` — array of high-level goals
- `architecture` — object with `overview`, `graphArchitecture` (nodes, edges, state schema, streaming), `threading`, `tools`, `rag`, `uiComponents`
- `techStack` — all dependencies with versions
- `envVars` — environment variables with description/purpose/required
- `epics` — array of epic objects, each with:
  - `id`, `title`, `description`, `priority`
  - `stories` — array of user stories with `id`, `description`, `acceptanceCriteria`, `files` (array of file paths to create/modify)
- `successMetrics` — array of measurable criteria
- `risks` — potential risks and mitigations
- `appendix` — additional notes, references

## Deliverable

Write the file `docs/prd/prd.ai-chatbot-2.json` with the complete PRD. Then run `python -c "import json; json.load(open('docs/prd/prd.ai-chatbot-2.json')); print('Valid JSON')"` to verify the JSON is valid.
