# AI Chatbot Skill

Build and maintain the LangGraph-powered AI chatbot for the PP Namias portfolio (portfolio-v1).

## Reference

- PRD: `docs/prd/prd.ai-chatbot.json`
- Location: `portfolio-v1/`
- Chat engine: `portfolio-v1/src/lib/chat/`
- API routes: `portfolio-v1/src/app/api/chat/`
- Chat UI: `portfolio-v1/src/components/ui/ChatPanel.tsx`, `FloatingHub.tsx`, `ChatMessage.tsx`
- Existing RAG: `portfolio-v1/src/lib/rag/`

## Architecture

- **LangGraph.js** state graph wrapping existing Gemini/OpenAI providers
- **SQLite** (better-sqlite3) via SqliteSaver for thread persistence
- **SSE streaming** from Route Handler ReadableStream
- **Existing RAG** (Upstash Vector) reused by retrieveContext node
- **Tools**: web search (DuckDuckGo), calculator, stock price (Alpha Vantage), portfolio query, contact

## Key Design Decisions

- Wraps existing `generateWithGemini()`, `generateWithOpenAI()`, `buildSmartFallback()` — does not replace them
- Preserves existing personality, action tags, rate limiting, and RAG
- Backward compatible: no threadId = stateless mode
- Feature flags in `src/lib/features.ts`: `IS_LANGGRAPH_ENABLED`, `IS_CHAT_STREAMING_ENABLED`, `IS_CHAT_THREADING_ENABLED`

## Workflow

1. Review PRD tasks before starting
2. Implement per-story in the PRD
3. Run quality gate after each epic: `pnpm check-types && pnpm lint && pnpm test:run`
4. All existing tests must continue to pass
