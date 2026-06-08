# Chrome DevTools MCP

Lets AI coding agents (opencode, Claude, Cursor, Copilot, Gemini) control and inspect a live Chrome browser. Gives your AI assistant access to the full power of Chrome DevTools for debugging, performance analysis, and browser automation.

**Package:** [`chrome-devtools-mcp`](https://www.npmjs.com/package/chrome-devtools-mcp) on npm
**Source:** [github.com/ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp)

## Key features

- **Performance insights** — Record traces and extract actionable performance data via CrUX API
- **Browser debugging** — Analyze network requests, take screenshots, inspect console messages with source-mapped stack traces
- **Reliable automation** — Uses Puppeteer to automate actions in Chrome with automatic wait-for-result
- **Memory analysis** — Take heap snapshots, analyze class nodes, retainers, and summaries
- **Lighthouse audits** — Run Lighthouse directly from your AI agent

## Available tools (abridged)

| Category | Tools |
|---|---|
| **Input automation** | `click`, `fill`, `fill_form`, `type_text`, `press_key`, `hover`, `drag`, `upload_file` |
| **Navigation** | `navigate_page`, `new_page`, `close_page`, `list_pages`, `select_page` |
| **Performance** | `performance_start_trace`, `performance_stop_trace`, `performance_analyze_insight` |
| **Network** | `list_network_requests`, `get_network_request` |
| **Debugging** | `evaluate_script`, `take_screenshot`, `take_snapshot`, `lighthouse_audit`, `list_console_messages` |
| **Memory** | `take_heapsnapshot`, `get_heapsnapshot_summary`, `get_heapsnapshot_retainers`, `get_heapsnapshot_details`, `get_heapsnapshot_class_nodes` |

## Setup

### With opencode

Add to `~/.config/opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "chrome-devtools": {
      "type": "local",
      "command": ["npx", "-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

### With VS Code / Copilot

Install via the VS Code marketplace plugin: `ChromeDevTools/chrome-devtools-mcp`

Or add manually in VS Code MCP settings:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

### With Cursor

Go to `Cursor Settings` → `MCP` → `New MCP Server` with the same config.

### With Claude Code

```bash
claude mcp add chrome-devtools --scope user npx chrome-devtools-mcp@latest
```

## Usage examples

- "Check the performance of https://example.com"
- "Take a screenshot of the current page"
- "Find any console errors on the page"
- "Run a Lighthouse audit on the homepage"
- "Analyze network requests and find slow API calls"
- "Check the accessibility tree for the navigation menu"

## Requirements

- Node.js LTS
- Google Chrome (stable or newer)
- npm

## Configuration flags

| Flag | Description |
|---|---|
| `--headless` | Run without UI |
| `--slim` | Expose only 3 core tools (navigation, script, screenshot) |
| `--channel=canary` | Use Chrome Canary |
| `--isolated` | Use temporary user data dir (auto-cleaned) |
| `--no-usage-statistics` | Opt out of Google usage collection |
