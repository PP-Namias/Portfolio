# Smarter AI Chatbot — Implementation Plan

## Current State (Already Implemented)

The portfolio-v1 has a working LangGraph chatbot with:
- 6-node graph using manual string-matching tool dispatch
- JSON-file persistence (`.chat-data/`)
- Word-level token streaming (splitting final response by regex)
- 5 tools: web_search (DuckDuckGo), calculator, stock_price, portfolio_query, send_message
- Thread CRUD UI with sidebar
- SSE streaming hook
- 636 passing tests

## Gaps vs tahirkorma/langgraph-chatbot Reference

| Feature | Reference (langgraph-chatbot) | Current Implementation |
|---------|------------------------------|----------------------|
| Tool binding | `llm.bind_tools(tools)` + `ToolNode` + `tools_condition` — native LangGraph tool-calling | Manual string matching in `executeToolNode` — fragile, doesn't use LLM's native tool-calling |
| Checkpointer | `SqliteSaver(conn=sqlite3.connect('chatbot.db'))` — proper LangGraph checkpointing | Custom JSON file-based persistence, no checkpoint saver integration |
| Streaming | `.streamEvents()` from compiled graph — yields LLM tokens progressively | Word-splitting the final response after full generation |
| LLM binding | `ChatGoogleGenerativeAI(model='gemini-2.0-flash')` — native LangChain model | Custom `generateWithGemini()` wrapper — no streaming support |
| Vector store | SQLite-based local vectors | Upstash Vector (cloud) |
| Graph structure | Single `chat_node` + `tool_node` with conditional edges | 6 custom nodes with manual routing |
| RAG | Packaged as vector store tool | Separate `retrieveContextNode` in graph |

## Smarter Architecture (Target)

### 1. Native LangGraph Tool Binding

Replace `executeToolNode` with:
- `llm.bind_tools(tools)` — let Gemini decide when to call tools via native tool schema
- `ToolNode(tools)` — LangGraph's built-in tool execution node
- `tools_condition` — LangGraph's built- in conditional edge that checks `AIMessage.tool_calls`

Benefits:
- LLM decides which tool to call and with what arguments — not keyword matching
- Tools return results back to LLM for synthesis
- Multi-tool calls in a single turn

### 2. SqliteSaver for Thread Persistence

Replace JSON-file persistence with `SqliteSaver`:
- `SqliteSaver(conn=sqlite3.connect('chatbot.db'))` — matches reference exactly
- Thread metadata stored in a custom `threads` table
- Messages cached in `messages` table for fast listing
- `retrieve_all_threads()` helper for thread list API

### 3. True SSE Streaming via `streamEvents()`

Replace word-splitting with LangGraph's `.streamEvents()`:
- Invoke graph with `await graph.streamEvents(initialState, { version: 'v2' })`
- Stream `on_chat_model_stream` events for progressive token delivery
- Stream `on_tool_start`/`on_tool_end` events for tool call indicators
- No artificial delay — real LLM token-by-token streaming

### 4. LangChain Gemini Bindings

Add `@langchain/google-genai` and use `ChatGoogleGenerativeAI` directly:
- Direct model binding with native streaming + tool calling
- Template-based prompt construction
- Consistent interface with `@langchain/core`

### 5. SQLite Vector Store (Local RAG)

Add SQLite-based vector storage:
- Store embeddings in SQLite via simple BLOB columns
- Cosine similarity computation in JS
- No cloud dependency for RAG — works offline
- Falls back to Upstash Vector when configured

### 6. Enhanced Graph Architecture

```
loadContext → classifyIntent → generate (with bound tools)
                                   ↓
                          tools_condition check
                                   ↓
                    ┌──── has_tool_calls ────┐
                    ↓                         ↓
                ToolNode                   END
                    ↓
              (back to generate)
```

Single `generate` node with bound tools + `ToolNode` + `tools_condition` — simpler, more robust.

## Implementation Order

1. Install deps: `@langchain/google-genai better-sqlite3`
2. Add types for tool binding (tool definitions as LangChain `DynamicStructuredTool`)
3. Refactor `graph.ts`: replace manual tool dispatch with `bind_tools` + `ToolNode`
4. Add `SqliteSaver`: replace JSON persistence with SQLite checkpoints
5. Refactor streaming: replace word-splitting with `streamEvents()`
6. Update route.ts to use `streamEvents()` output
7. Update useChatStream hook for new event format
8. Test full flow end-to-end
9. Quality gate: `tsc --noEmit`, `npm run lint`, `npm run test:run`
