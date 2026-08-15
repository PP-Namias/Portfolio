---
name: playwright-mcp
description: Browser automation and testing using Playwright MCP server for visual regression, accessibility, route testing, and screenshot capture.
---

# Playwright MCP Skill

## Overview

Playwright MCP provides browser automation capabilities through the Model Context Protocol, enabling AI agents to interact with web pages using structured accessibility snapshots.

## Capabilities

### Browser Automation
- Navigate to URLs and interact with pages
- Click elements, type text, fill forms
- Take screenshots and capture page state
- Run Playwright code directly

### Testing
- Visual regression testing with screenshot comparison
- Accessibility auditing (WCAG 2.1 AA)
- Route testing (all pages return 200)
- Performance testing (Core Web Vitals)
- SEO validation (meta tags, structured data)

### Screenshot Capture
- Full-page screenshots of all routes
- Responsive screenshots at mobile, tablet, desktop
- Dark/light mode screenshots

## Configuration

### MCP Server Config
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

### Playwright Config
- Config file: `playwright.config.ts`
- Test directory: `tests/playwright/`
- Reports: `tests/playwright/reports/`
- Screenshots: `tests/playwright/screenshots/`

## Usage Patterns

### Running Tests
```bash
# Run all tests
pnpm exec playwright test

# Run specific test file
pnpm exec playwright test routes.spec.ts

# Run with UI
pnpm exec playwright test --ui

# Run headed (visible browser)
pnpm exec playwright test --headed

# Run in debug mode
pnpm exec playwright test --debug
```

### Taking Screenshots
```bash
# Run screenshot capture tests
pnpm exec playwright test screenshots.spec.ts

# View screenshots
open tests/playwright/screenshots/
```

### Viewing Reports
```bash
# Open HTML report
pnpm exec playwright show-report
```

## Test Categories

| Category | File | Description |
|----------|------|-------------|
| Routes | `routes.spec.ts` | All pages return 200 OK |
| Dynamic Routes | `dynamic-routes.spec.ts` | Blog, components, blocks |
| API Routes | `api-routes.spec.ts` | Sanity API, RSS, SEO |
| Visual Regression | `visual-regression.spec.ts` | Screenshot comparison |
| Accessibility | `accessibility.spec.ts` | WCAG 2.1 AA compliance |
| Performance | `performance.spec.ts` | Core Web Vitals |
| SEO | `seo-meta.spec.ts` | Meta tags, structured data |
| Interactions | `command-menu.spec.ts` | Command menu, theme toggle |
| Screenshots | `screenshots.spec.ts` | Full-page, responsive |

## MCP Tools Available

When Playwright MCP server is connected, these tools are available:

### Navigation
- `browser_navigate` - Navigate to a URL
- `browser_go_back` - Go back in history
- `browser_go_forward` - Go forward in history
- `browser_refresh` - Refresh the page

### Interaction
- `browser_click` - Click an element
- `browser_type` - Type text into an element
- `browser_fill` - Fill a form field
- `browser_select_option` - Select dropdown option
- `browser_hover` - Hover over an element
- `browser_drag` - Drag and drop

### Screenshots
- `browser_screenshot` - Take a screenshot
- `browser_take_screenshot` - Take element screenshot

### Keyboard
- `browser_press_key` - Press a keyboard key
- `browser_tab_list` - List open tabs
- `browser_tab_new` - Open new tab
- `browser_tab_select` - Select a tab
- `browser_tab_close` - Close a tab

### Advanced
- `browser_run_code` - Run Playwright code
- `browser_network_requests` - List network requests
- `browser_console_messages` - Get console messages
- `browser_save_state` - Save browser state
- `browser_load_state` - Load browser state

## Best Practices

1. **Use accessibility snapshots** - Playwright MCP uses accessibility tree, not pixels
2. **Wait for elements** - Use proper waits before interacting
3. **Test across browsers** - Use matrix strategy for chromium, firefox, webkit
4. **Capture on failure** - Screenshots and traces are captured on test failure
5. **Use CI integration** - Run tests on every PR and push to main

## Troubleshooting

### Browser Not Found
```bash
pnpm exec playwright install
```

### Tests Timing Out
Increase timeout in `playwright.config.ts` or use `--timeout` flag

### Screenshots Differing
Adjust `maxDiffPixelRatio` in visual regression tests
