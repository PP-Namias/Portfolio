---
name: context7
description: "Fetch up-to-date, version-specific documentation for any major library (Next.js 16, Sanity, LangGraph, React, Tailwind CSS, Vitest, Framer Motion) via the Context7 MCP server. Use when writing code against unfamiliar or recently-changed framework APIs, when training data may be stale, when resolving deprecations or version-specific syntax, or when the repo warns about framework drift (e.g. the nextjs-agent-rules block in portfolio-v1/AGENTS.md). Invokes the resolve-library-id and get-library-docs MCP tools."
---

# context7

Fresh library documentation for agents. Context7 injects current, version-specific documentation and code examples for any major open-source library directly into agent context, eliminating hallucinated or outdated API usage caused by training-data drift.

The MCP server is registered project-scoped in `.opencode/opencode.json` (server key: `context7`; local stdio transport via `npx -y @upstash/context7-mcp`). It exposes exactly two tools:

| Tool | Purpose |
| --- | --- |
| `resolve-library-id` | Resolve a general library name (e.g. "nextjs") into a Context7-compatible library ID (e.g. `/vercel/next.js`) |
| `get-library-docs` | Fetch documentation for a library ID; `topic` narrows to a subject (e.g. "routing", "app router"), `page` paginates 1-10 |

## When to use

- Any code written against a framework whose API surface changed recently: Next.js 16 (App Router, Server Actions, caching), Sanity (GROQ, client, schemas), LangGraph (`src/lib/chat/`), Tailwind, Framer Motion, Vitest.
- The repo explicitly flags training-data drift: the `nextjs-agent-rules` block in `portfolio-v1/AGENTS.md` states "This is NOT the Next.js you know". Acknowledge it by grounding every Next.js change in `get-library-docs` output, not memory.
- Migration work (`nextjs-16-migration` skill), deprecation resolution, or writing new components with current idioms.
- Pairing: Graphify provides repo-local structure; Context7 provides library truth. Use both — never either alone when the task touches both codebase semantics and framework APIs.

## How to use

1. If unsure of the library ID, call `resolve-library-id` with the library name (e.g. `next.js`, `sanity`, `langgraph`).
2. Call `get-library-docs` with the resolved ID (e.g. `/vercel/next.js`, `/sanity-io/sanity`, `/langchain-ai/langgraph`).
3. Pass a `topic` when the question is focused (e.g. `routing`, `server-actions`, `revalidation`); request additional pages if context is insufficient.
4. Cite the fetched API shapes in the code you write. If a fetched API contradicts training data, prefer the fetched documentation.
5. If an API key is configured, higher rate limits apply automatically; without one, the public endpoint still serves all public libraries.

## Known library IDs (frequently used in this repo)

- Next.js: `/vercel/next.js`
- Sanity: `/sanity-io/sanity`
- LangGraph: `/langchain-ai/langgraph`
- React: `/facebook/react`
- Tailwind CSS: `/tailwindlabs/tailwindcss`
- Framer Motion: `/motiondivision/motion`
- Vitest: `/vitest-dev/vitest`

## Verification

After registering the server, restart opencode for the config to load. Confirm availability with the context7 tools listed in the MCP tool set; a cold boot can be verified by asking the agent to resolve a library ID and fetch one documentation page.