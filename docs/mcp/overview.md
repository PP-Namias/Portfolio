# MCP Ecosystem for This Project

Model Context Protocol (MCP) servers extend AI agent capabilities by providing structured tools and data access. This document catalogs all MCP servers integrated with the PP Namias portfolio project.

## Why MCP?

MCP is the industry standard (USB-C for AI) for connecting AI agents to external tools. By adding MCP servers, your AI assistant can:

- Debug and inspect the running site in Chrome
- Generate UI components from natural language
- Access GitHub for code review and PR management
- Search the web for reference and research
- Run database queries and file operations
- And much more

## Configured MCP Servers

| Server | Purpose | Config |
|---|---|---|
| [Chrome DevTools MCP](chrome-devtools-mcp.md) | Browser debugging, performance, automation | `opencode.json` |
| [21st.dev Magic MCP](magic-mcp.md) | Component generation from natural language | API key required |
| [Magic UI MCP](magic-mcp.md) | Animated/animated UI components | No API key needed |

## Recommended Additional MCP Servers

These are not pre-configured but are recommended for the tech stack:

| Server | Install | Why |
|---|---|---|
| **GitHub MCP** | `npx -y @modelcontextprotocol/server-github` | PRs, issues, code search |
| **Filesystem MCP** | `npx -y @modelcontextprotocol/server-filesystem` | File read/write access |
| **Tailwind MCP** | `@tailwind/mcp-server` (community) | Tailwind class suggestions |
| **Sequential Thinking** | `npx -y @modelcontextprotocol/server-sequential-thinking` | Structured reasoning for complex problems |
| **Vercel MCP** | Community templates at [vercel-labs/mcp-on-vercel](https://github.com/vercel-labs/mcp-on-vercel) | Deployments, env, domains |

## Setting up MCP for opencode

See `opencode.json` at the project root for the MCP configuration.

## Setting up for other clients

- **VS Code / Copilot**: Use `.vscode/mcp.json` or VS Code MCP settings UI
- **Cursor**: Cursor Settings → MCP → New MCP Server
- **Claude Code**: `claude mcp add <name> <command>`
- **Cline**: `cline_mcp_settings.json`

## Getting an API key

- **21st.dev Magic**: Generate at [21st.dev Magic Console](https://21st.dev/magic/console) (free tier available)
- **Chrome DevTools MCP**: No API key needed (open source, Google Chrome required)
- **Magic UI MCP**: No API key needed (open source, MIT licensed)
