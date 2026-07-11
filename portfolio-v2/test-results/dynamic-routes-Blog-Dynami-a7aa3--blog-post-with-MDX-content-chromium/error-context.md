# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dynamic-routes.spec.ts >> Blog Dynamic Routes >> should load blog post with MDX content
- Location: tests\playwright\dynamic-routes.spec.ts:10:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.textContent: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('article')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - link "Home" [ref=e6] [cursor=pointer]:
          - /url: /
          - img [ref=e7]
        - navigation [ref=e9]:
          - link "Components" [ref=e10] [cursor=pointer]:
            - /url: /components
          - link "Blocks" [ref=e11] [cursor=pointer]:
            - /url: /blocks
          - link "Blog" [ref=e12] [cursor=pointer]:
            - /url: /blog
          - link "Sponsors" [ref=e13] [cursor=pointer]:
            - /url: /sponsors
        - generic [ref=e14]:
          - button "Ctrl K" [ref=e15]:
            - img
            - generic [ref=e16]:
              - generic: Ctrl
              - generic: K
          - generic [ref=e17]:
            - generic [ref=e18]: Command Palette
            - paragraph [ref=e19]: Search for a command to run...
          - link "0 GitHub stars" [ref=e20] [cursor=pointer]:
            - /url: https://github.com/PP-Namias/Portfolio?utm_source=namias.tech
            - img
            - generic [ref=e21]: "0"
            - generic [ref=e22]: GitHub stars
          - button "Toggle mode" [ref=e23]:
            - generic [ref=e24]:
              - img
    - main [ref=e25]:
      - generic [ref=e27]:
        - generic [ref=e28]:
          - generic [ref=e30]:
            - link "Blog" [ref=e31] [cursor=pointer]:
              - /url: /blog
              - img
              - text: Blog
            - generic [ref=e32]:
              - group [ref=e33]:
                - button "Copy page" [ref=e34]:
                  - generic [ref=e35]:
                    - img
                  - generic [ref=e36]: Copy page
                - button "View Options" [ref=e37]:
                  - img
              - button [ref=e38]:
                - img
              - link "Previous post" [ref=e39] [cursor=pointer]:
                - /url: /blog/uptime-kuma
                - img
          - heading "Welcome to chanhdai.com" [level=1] [ref=e42]
        - generic [ref=e43]:
          - complementary [ref=e44]
          - generic [ref=e46]:
            - paragraph [ref=e47]: A pixel-perfect dev portfolio and shadcn registry showcasing my work as a Design Engineer.
            - generic [ref=e48]:
              - heading "Stack Copy link to section" [level=2] [ref=e49]:
                - link "Stack" [ref=e50] [cursor=pointer]:
                  - /url: "#stack"
                - button "Copy link to section" [ref=e51]:
                  - generic [ref=e52]:
                    - img
              - list [ref=e53]:
                - listitem [ref=e54]: Next.js 16
                - listitem [ref=e55]: Tailwind CSS v4
                - listitem [ref=e56]: shadcn/ui
              - heading "Featured Copy link to section" [level=2] [ref=e57]:
                - link "Featured" [ref=e58] [cursor=pointer]:
                  - /url: "#featured"
                - button "Copy link to section" [ref=e59]:
                  - generic [ref=e60]:
                    - img
              - list [ref=e61]:
                - listitem [ref=e62]: Clean & modern design
                - listitem [ref=e63]: Light/Dark themes
                - listitem [ref=e64]: vCard integration
                - listitem [ref=e65]:
                  - text: SEO optimized (
                  - link "JSON-LD schema" [ref=e66] [cursor=pointer]:
                    - /url: https://json-ld.org/?utm_source=namias.tech
                  - text: ", sitemap, robots)"
                - listitem [ref=e67]:
                  - text: AI-ready with
                  - link "/llms.txt" [ref=e68] [cursor=pointer]:
                    - /url: https://llmstxt.org/?utm_source=namias.tech
                - listitem [ref=e69]: Spam-protected email
                - listitem [ref=e70]: Installable as PWA
                - listitem [ref=e71]:
                  - text: Analytics with
                  - link "PostHog" [ref=e72] [cursor=pointer]:
                    - /url: https://posthog.com/?utm_source=namias.tech
                  - text: and
                  - link "OpenPanel" [ref=e73] [cursor=pointer]:
                    - /url: https://openpanel.dev/?utm_source=namias.tech
              - heading "Content Copy link to section" [level=2] [ref=e74]:
                - link "Content" [ref=e75] [cursor=pointer]:
                  - /url: "#content"
                - button "Copy link to section" [ref=e76]:
                  - generic [ref=e77]:
                    - img
              - paragraph [ref=e78]: "Centralized document system powered by MDX:"
              - list [ref=e79]:
                - listitem [ref=e80]: Unified content layer for blog posts and component docs
                - listitem [ref=e81]: Category-based content organization
                - listitem [ref=e82]:
                  - text: Raw
                  - code [ref=e83]: .mdx
                  - text: endpoints for AI readability
                - listitem [ref=e84]: Syntax highlighting with code blocks
                - listitem [ref=e85]: Dynamic OG images for rich link previews
                - listitem [ref=e86]: RSS feed for content distribution
              - heading "Registry Copy link to section" [level=2] [ref=e87]:
                - link "Registry" [ref=e88] [cursor=pointer]:
                  - /url: "#registry"
                - button "Copy link to section" [ref=e89]:
                  - generic [ref=e90]:
                    - img
              - paragraph [ref=e91]:
                - text: Easily build and distribute reusable components, hooks, and pages using a custom registry powered by the
                - link "shadcn CLI" [ref=e92] [cursor=pointer]:
                  - /url: https://ui.shadcn.com/docs/cli?utm_source=namias.tech
                - text: .
              - paragraph [ref=e93]: "Each entry is well-documented and includes:"
              - list [ref=e94]:
                - listitem [ref=e95]: Live preview & code snippets
                - listitem [ref=e96]: Beautiful, readable code blocks
                - listitem [ref=e97]: One-click command blocks (pnpm, npm, yarn, bun)
              - heading "License Copy link to section" [level=2] [ref=e98]:
                - link "License" [ref=e99] [cursor=pointer]:
                  - /url: "#license"
                - button "Copy link to section" [ref=e100]:
                  - generic [ref=e101]:
                    - img
              - paragraph [ref=e102]:
                - text: Licensed under the
                - link "MIT license" [ref=e103] [cursor=pointer]:
                  - /url: https://github.com/ncdai/chanhdai.com/blob/main/LICENSE?utm_source=namias.tech
                - text: . The source code is available on
                - link "GitHub" [ref=e104] [cursor=pointer]:
                  - /url: https://github.com/ncdai/chanhdai.com?utm_source=namias.tech
                - text: .
              - blockquote [ref=e105]:
                - paragraph [ref=e106]: You’re free to use my code! Just make sure to remove all my personal information before publishing your website. It’s awesome to see my code being useful to someone!
          - complementary [ref=e108]
    - contentinfo [ref=e112]:
      - generic [ref=e113]:
        - generic [ref=e116]:
          - generic [ref=e117]:
            - term [ref=e118]: Crafted by
            - definition [ref=e119]:
              - link "@PP_Namias" [ref=e120] [cursor=pointer]:
                - /url: https://x.com/PP_Namias
          - generic [ref=e121]:
            - term [ref=e122]: Inspired by
            - definition [ref=e123]:
              - list [ref=e124]:
                - listitem [ref=e125]: Tailwind CSS
                - listitem [ref=e126]: shadcn/ui
                - listitem [ref=e127]: Vercel
                - listitem [ref=e128]: Evil Charts
                - listitem [ref=e129]: Devouring Details
                - listitem [ref=e130]: Skiper UI
                - listitem [ref=e131]: Making Software
          - generic [ref=e132]:
            - term [ref=e133]: Deployed on
            - definition [ref=e134]: Vercel
          - generic [ref=e135]:
            - term [ref=e136]: Analytics
            - definition [ref=e137]:
              - list [ref=e138]:
                - listitem [ref=e139]: OpenPanel
                - listitem [ref=e140]: PostHog
          - generic [ref=e141]:
            - term [ref=e142]: Source code
            - definition [ref=e143]:
              - link "GitHub" [ref=e144] [cursor=pointer]:
                - /url: https://github.com/PP-Namias/Portfolio
          - generic [ref=e145]:
            - term [ref=e146]: License
            - definition [ref=e147]:
              - link "MIT License" [ref=e148] [cursor=pointer]:
                - /url: https://github.com/PP-Namias/Portfolio/blob/main/LICENSE
        - generic [ref=e150]:
          - link "X Profile" [ref=e151] [cursor=pointer]:
            - /url: https://x.com/PP_Namias
            - img [ref=e152]
          - link "GitHub Profile" [ref=e155] [cursor=pointer]:
            - /url: https://github.com/PP-Namias
            - img [ref=e156]
          - link "LinkedIn Profile" [ref=e159] [cursor=pointer]:
            - /url: https://linkedin.com/in/pp-namias/
            - img [ref=e160]
          - link "DMCA.com Protection Status" [ref=e163] [cursor=pointer]:
            - /url: https://www.dmca.com
            - img [ref=e164]
      - img [ref=e169]
    - button "Scroll to top" [ref=e174]:
      - img
  - region "Notifications alt+T"
  - alert [ref=e175]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Blog Dynamic Routes", () => {
  4  |   test("should load blog post pages", async ({ page }) => {
  5  |     const response = await page.goto("/blog/welcome");
  6  |     expect(response?.status()).toBe(200);
  7  |     await expect(page.locator("h1")).toBeVisible();
  8  |   });
  9  | 
  10 |   test("should load blog post with MDX content", async ({ page }) => {
  11 |     await page.goto("/blog/welcome");
> 12 |     const content = await page.locator("article").textContent();
     |                                                   ^ Error: locator.textContent: Test timeout of 30000ms exceeded.
  13 |     expect(content).toBeTruthy();
  14 |   });
  15 | });
  16 | 
  17 | test.describe("Component Dynamic Routes", () => {
  18 |   test("should load component documentation pages", async ({ page }) => {
  19 |     const response = await page.goto("/components/shimmering-text");
  20 |     expect(response?.status()).toBe(200);
  21 |     await expect(page.locator("h1")).toBeVisible();
  22 |   });
  23 | 
  24 |   test("should display component preview", async ({ page }) => {
  25 |     await page.goto("/components/shimmering-text");
  26 |     await expect(page.locator("[data-testid='component-preview']")).toBeVisible();
  27 |   });
  28 | });
  29 | 
  30 | test.describe("Block Routes", () => {
  31 |   test("should load blocks list page", async ({ page }) => {
  32 |     const response = await page.goto("/blocks");
  33 |     expect(response?.status()).toBe(200);
  34 |   });
  35 | 
  36 |   test("should load marketing blocks category", async ({ page }) => {
  37 |     const response = await page.goto("/blocks/marketing");
  38 |     expect(response?.status()).toBe(200);
  39 |   });
  40 | });
  41 | 
```