<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Live documentation: use Context7, not training data

The frameworks in this project move faster than model training data. Ground every framework API usage in current documentation fetched via the Context7 MCP tools (`resolve-library-id`, `get-library-docs` — project-scoped server `context7` in `.opencode/opencode.json`):

- Next.js 16: `/vercel/next.js` (topics: "app router", "server actions", "caching", "revalidation")
- Sanity: `/sanity-io/sanity` (GROQ, schemas, client, draft mode)
- LangGraph: `/langchain-ai/langgraph` (graph engine in `src/lib/chat/`)

Prefer fetched APIs over remembered ones. Heed deprecation notices. If a fetched API contradicts training data, the fetched documentation wins.
