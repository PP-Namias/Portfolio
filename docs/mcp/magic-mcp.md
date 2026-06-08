# Magic MCP

AI-powered component generation for frontend development. Combine 21st.dev Magic MCP (component library) with Magic UI MCP (animated components) for instant UI generation from natural language.

## 21st.dev Magic MCP

**Package:** [`@21st-dev/magic`](https://www.npmjs.com/package/@21st-dev/magic) on npm
**Source:** [github.com/21st-dev/magic-mcp](https://github.com/21st-dev/magic-mcp)

Creates crafted UI components inspired by the best 21st.dev design engineers. Like v0 but directly in your editor.

### Setup

**Via CLI:**
```bash
npx @21st-dev/cli@latest install <client> --api-key <key>
```

Supported clients: `cursor`, `windsurf`, `cline`, `claude`

**Manual configuration:**
```json
{
  "mcpServers": {
    "@21st-dev/magic": {
      "command": "npx",
      "args": ["-y", "@21st-dev/magic@latest"],
      "env": {
        "API_KEY": "<your-api-key>"
      }
    }
  }
}
```

### Usage

In your AI agent's chat, type `/ui` and describe the component you want:

- `/ui create a modern navigation bar with responsive design`
- `/ui build a testimonial carousel with avatars`
- `/ui add a pricing table with three tiers`

### Requirements

- Node.js (Latest LTS recommended)
- API key from [21st.dev Magic Console](https://21st.dev/magic/console)

---

## Magic UI Design MCP

**Package:** [`@magicuidesign/mcp`](https://www.npmjs.com/package/@magicuidesign/mcp) on npm
**Source:** [github.com/magicuidesign/mcp](https://github.com/magicuidesign/mcp)

Provides access to [Magic UI](https://magicui.design/) animated components — marquees, bento grids, animated lists, docks, globes, hero video dialogs, terminals, and more.

### Setup

```json
{
  "mcpServers": {
    "@magicuidesign/mcp": {
      "command": "npx",
      "args": ["-y", "@magicuidesign/mcp@latest"]
    }
  }
}
```

Or via CLI:
```bash
npx @magicuidesign/cli@latest install cursor
```

Supported clients: `cursor`, `windsurf`, `claude`, `cline`, `roo-cline`

### Available tools

- `getUIComponents` — Lists all available Magic UI components
- `getComponents` — Implementation details for core components (marquee, terminal, hero-video-dialog, bento-grid, animated-list, dock, globe, etc.)

### Usage examples

- "Make a marquee of logos"
- "Add a blur fade text animation"
- "Add a grid background"
- "Create a bento grid layout"
- "Add an animated list with staggered entrance"

### Requirements

- Node.js LTS
- No API key needed (open source)
