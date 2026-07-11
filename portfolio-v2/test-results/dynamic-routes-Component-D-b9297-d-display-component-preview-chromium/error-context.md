# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dynamic-routes.spec.ts >> Component Dynamic Routes >> should display component preview
- Location: tests\playwright\dynamic-routes.spec.ts:24:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-testid=\'component-preview\']')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('[data-testid=\'component-preview\']')

```

```yaml
- banner:
  - link "Home":
    - /url: /
  - navigation:
    - link "Components":
      - /url: /components
    - link "Blocks":
      - /url: /blocks
    - link "Blog":
      - /url: /blog
    - link "Sponsors":
      - /url: /sponsors
  - button "Ctrl K"
  - text: Command Palette
  - paragraph: Search for a command to run...
  - link "0 GitHub stars":
    - /url: https://github.com/PP-Namias/Portfolio?utm_source=namias.tech
  - button "Toggle mode"
- main:
  - complementary:
    - button:
      - img
    - link "Apple Hello Effect":
      - /url: /components/apple-hello-effect
    - link "Brand Assets Menu":
      - /url: /components/brand-assets-menu
    - link "Chevrons Up Down Icon":
      - /url: /components/chevrons-up-down-icon
    - link "Code Block Command":
      - /url: /components/code-block-command
    - link "Consent Manager":
      - /url: /components/consent-manager
    - link "Copy Button":
      - /url: /components/copy-button
    - link "Dot Grid Spotlight":
      - /url: /components/dot-grid-spotlight
    - link "Elastic Slider":
      - /url: /components/elastic-slider
    - link "Fluid Gradient Text":
      - /url: /components/fluid-gradient-text
    - link "GitHub Contributions":
      - /url: /components/github-contributions
    - link "GitHub Stars":
      - /url: /components/github-stars
    - link "Glow Card Grid":
      - /url: /components/glow-card-grid
    - link "Haptic Feedback":
      - /url: /components/haptic
    - link "Icon Swap":
      - /url: /components/icon-swap
    - link "Line Nav":
      - /url: /components/line-nav
    - link "Logos Carousel":
      - /url: /components/logos-carousel
    - link "Middle Truncation":
      - /url: /components/middle-truncation
    - link "Mobius Loop Icon":
      - /url: /components/mobius-loop-icon
    - link "React Wheel Picker":
      - /url: /components/react-wheel-picker
    - link "Scroll Fade Effect":
      - /url: /components/scroll-fade-effect
    - link "Share Menu":
      - /url: /components/share-menu
    - link "Shimmering Text":
      - /url: /components/shimmering-text
    - link "Slide to Unlock":
      - /url: /components/slide-to-unlock
    - link "Spinning Circular Text":
      - /url: /components/spinning-circular-text
    - link "Spotlight Logo":
      - /url: /components/spotlight-logo
    - link "Testimonial":
      - /url: /components/testimonial
    - link "Testimonial 2":
      - /url: /components/testimonial-2
    - link "Testimonial Spotlight":
      - /url: /components/testimonial-spotlight
    - link "Testimonials Marquee":
      - /url: /components/testimonials-marquee
    - link "Text Flip":
      - /url: /components/text-flip
    - link "Theme Switcher":
      - /url: /components/theme-switcher
    - link "Theme Toggle Effect":
      - /url: /components/theme-toggle-effect
    - link "TOC Minimap":
      - /url: /components/toc-minimap
    - link "Twemoji":
      - /url: /components/twemoji
    - link "Work Experience":
      - /url: /components/work-experience-component
  - link "Components":
    - /url: /components
  - group:
    - button "Copy page":
      - img
      - text: Copy page
    - button "View Options"
  - button
  - link "Previous Component":
    - /url: /components/share-menu
  - link "Next component":
    - /url: /components/slide-to-unlock
  - heading "Shimmering Text" [level=1]
  - paragraph: Smooth, light-sweeping shimmer animation for text.
  - alert:
    - text: Recommended alternative
    - paragraph:
      - text: The Shimmering Text component uses JS-based animations. For better performance, consider using the CSS-based shadcn/ui
      - link "shimmer":
        - /url: https://ui.shadcn.com/docs/utils/shimmer?utm_source=namias.tech
      - text: utilities instead.
  - tablist:
    - tab "Preview" [selected]
    - tab "Code"
  - tabpanel "Preview":
    - link "Open in v0":
      - /url: https://v0.app/chat/api/open?url=https://chanhdai.com/r/shimmering-text.json
    - text: Shimmering Text
  - figure "Matt, Creator of ui.bklit.com":
    - blockquote:
      - paragraph: Using an adapted version of your Shimmer here @iamncdai
    - link "Matt":
      - /url: https://x.com/uixmat/status/2061477189506187332
    - text: ", Creator of ui.bklit.com"
  - heading "Installation Copy link to section" [level=2]:
    - link "Installation":
      - /url: "#installation"
    - button "Copy link to section"
  - tablist:
    - tab "Command" [selected]
    - tab "Manual"
  - tabpanel "Command":
    - figure:
      - tablist:
        - tab "pnpm" [selected]
        - tab "yarn"
        - tab "npm"
        - tab "bun"
      - tabpanel "pnpm":
        - code: pnpm dlx shadcn@latest add @ncdai/shimmering-text
      - button "Copy"
  - heading "Usage Copy link to section" [level=2]:
    - link "Usage":
      - /url: "#usage"
    - button "Copy link to section"
  - figure:
    - code: "import { ShimmeringText } from \"@/components/shimmering-text\""
    - button "Copy"
  - figure:
    - code: <ShimmeringText text="slide to unlock" />
    - button "Copy"
  - heading "API reference Copy link to section" [level=2]:
    - link "API reference":
      - /url: "#api-reference"
    - button "Copy link to section"
  - heading "ShimmeringText Copy link to section" [level=3]:
    - link "ShimmeringText":
      - /url: "#shimmeringtext"
    - button "Copy link to section"
  - paragraph: Prop
  - paragraph: Type
  - button "text string":
    - code: text
    - code: string
  - button "duration? number":
    - code: duration?
    - code: number
  - button "isStopped? union":
    - code: isStopped?
    - code: union
  - heading "Examples Copy link to section" [level=2]:
    - link "Examples":
      - /url: "#examples"
    - button "Copy link to section"
  - heading "Custom color Copy link to section" [level=3]:
    - link "Custom color":
      - /url: "#custom-color"
    - button "Copy link to section"
  - tablist:
    - tab "Preview" [selected]
    - tab "Code"
  - tabpanel "Preview": Processing your request with AI ...
  - paragraph: "CSS Variables explanation:"
  - list:
    - listitem:
      - code: "--color"
      - text: ": Base text color (the default/resting state of characters)"
    - listitem:
      - code: "--shimmering-color"
      - text: ": Peak highlight color (the bright color characters transition to during the shimmer effect)"
  - complementary "Sponsors":
    - heading "Sponsors" [level=2]
    - button "Close"
    - list:
      - listitem:
        - link "shadcn/studio logo":
          - /url: https://shadcnstudio.com/?utm_source=namias.tech
      - listitem:
        - link "Shadcn Space logo":
          - /url: https://shadcnspace.com/?utm_source=namias.tech
      - listitem:
        - link "shadcncraft logo":
          - /url: https://shadcncraft.com/?atp=ncdai&utm_source=namias.tech
      - listitem:
        - link "Shadcnblocks logo":
          - /url: https://www.shadcnblocks.com/?via=ncdai&utm_source=namias.tech
      - listitem:
        - link "React Bits logo":
          - /url: https://reactbits.dev/?utm_source=namias.tech
  - complementary
- contentinfo:
  - term: Crafted by
  - definition:
    - link "@PP_Namias":
      - /url: https://x.com/PP_Namias
  - term: Inspired by
  - definition:
    - list:
      - listitem: Tailwind CSS
      - listitem: shadcn/ui
      - listitem: Vercel
      - listitem: Evil Charts
      - listitem: Devouring Details
      - listitem: Skiper UI
      - listitem: Making Software
  - term: Deployed on
  - definition: Vercel
  - term: Analytics
  - definition:
    - list:
      - listitem: OpenPanel
      - listitem: PostHog
  - term: Source code
  - definition:
    - link "GitHub":
      - /url: https://github.com/PP-Namias/Portfolio
  - term: License
  - definition:
    - link "MIT License":
      - /url: https://github.com/PP-Namias/Portfolio/blob/main/LICENSE
  - link "X Profile":
    - /url: https://x.com/PP_Namias
  - link "GitHub Profile":
    - /url: https://github.com/PP-Namias
  - link "LinkedIn Profile":
    - /url: https://linkedin.com/in/pp-namias/
  - link "DMCA.com Protection Status":
    - /url: https://www.dmca.com
  - img
- button "Scroll to top"
- region "Notifications alt+T"
- alert
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
  12 |     const content = await page.locator("article").textContent();
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
> 26 |     await expect(page.locator("[data-testid='component-preview']")).toBeVisible();
     |                                                                     ^ Error: expect(locator).toBeVisible() failed
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