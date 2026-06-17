---
name: opencode-optimization
description: Optimize OpenCode IDE configuration and workflows for this portfolio
---

# OpenCode Optimization Skill

Optimize OpenCode IDE configuration for maximum productivity with MiMo v2.5 on this portfolio.

## When to use this skill

- Setting up OpenCode IDE for this portfolio
- Adding or updating MCP servers in `opencode.json`
- Configuring LSP servers for better code intelligence
- Troubleshooting MCP/LSP server issues

## Current MCP servers (opencode.json)

| Server | Purpose | Requires API key |
|--------|---------|-----------------|
| `chrome-devtools` | Browser debugging, performance traces, screenshots | No |
| `@21st-dev/magic` | Generate UI components from natural language | Yes (`API_KEY_21ST_DEV`) |
| `@magicuidesign/mcp` | Magic UI animated components (marquee, bento, dock) | No |
| `github` | GitHub API — issues, PRs, repos, code search | Yes (`GITHUB_TOKEN`) |
| `filesystem` | File system read/write with path restrictions | No |
| `sequential-thinking` | Structured reasoning, step-by-step problem solving | No |
| `memory` | Knowledge graph memory for persistent context | No |
| `brave-search` | Web search for docs, Stack Overflow, API references | Yes (`BRAVE_API_KEY`) |
| `fetch` | Fetch and analyze web content, API docs | No |
| `puppeteer` | Advanced browser automation, screenshots, scraping | No |
| `sqlite` | Local SQLite for caching, analytics, data analysis | No |
| `sanity-cms` | Direct Sanity CMS operations, schema, content queries | Yes (`SANITY_AUTH_TOKEN`) |
| `sentry` | Sentry error tracking and performance monitoring | Yes (`SENTRY_AUTH_TOKEN`) |
| `vercel` | Vercel deployment, edge functions, analytics | Yes (`VERCEL_TOKEN`) |
| `docker` | Docker container management | No |

## Current LSP servers

| Server | Extensions | Purpose |
|--------|-----------|---------|
| `typescript` | `.ts, .tsx, .js, .jsx` | Type checking, inlay hints, go-to-definition |
| `eslint` | `.ts, .tsx, .js, .jsx` | Real-time linting, auto-fix |
| `prettier` | `.ts, .tsx, .js, .jsx, .css, .json, .md` | Code formatting |
| `tailwindcss` | `.ts, .tsx, .js, .jsx, .css` | Tailwind class completion, validation |
| `html` | `.html, .htm` | HTML validation, formatting |
| `css` | `.css, .scss, .less` | CSS validation, completion |
| `json` | `.json, .jsonc` | JSON schema validation |
| `markdown` | `.md, .mdx` | Markdown editing |
| `graphql` | `.graphql, .gql` | GraphQL schema validation (not actively used) |
| `yaml` | `.yaml, .yml` | YAML validation |
| `dockerfile` | `Dockerfile` | Dockerfile linting |

## Workflow

### Adding a new MCP server

1. Edit `opencode.json` at the repo root
2. Add the server under `"mcp"`:
```json
{
  "mcp": {
    "server-name": {
      "type": "local",
      "command": ["npx", "-y", "package-name@latest"],
      "env": {
        "API_KEY": "${ENVIRONMENT_VARIABLE}"
      },
      "description": "What this server does"
    }
  }
}
```
3. Restart OpenCode to pick up changes

### Adding a new LSP server

1. Edit `opencode.json` at the repo root
2. Add the server under `"lsp"`:
```json
{
  "lsp": {
    "language-name": {
      "command": "npx",
      "args": ["-y", "language-server-package", "--stdio"],
      "extensions": [".ext"]
    }
  }
}
```
3. Restart OpenCode

### Troubleshooting MCP servers

**Server not starting:**
1. Check the command in `opencode.json` is correct
2. Verify required environment variables are set
3. Check OpenCode logs for errors

**Server crashes:**
1. Try running the command manually in terminal
2. Check for version conflicts
3. Update to latest version

## Checklist

- [ ] MCP servers configured in `opencode.json`
- [ ] LSP servers enabled for all file types
- [ ] Environment variables set for authenticated servers
- [ ] Servers restart cleanly after config changes
