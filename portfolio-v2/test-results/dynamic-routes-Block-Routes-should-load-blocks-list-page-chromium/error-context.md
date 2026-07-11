# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dynamic-routes.spec.ts >> Block Routes >> should load blocks list page
- Location: tests\playwright\dynamic-routes.spec.ts:31:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://localhost:3000/blocks", waiting until "load"

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
      - generic [ref=e26]:
        - generic [ref=e27]:
          - generic [ref=e28]: Blocks
          - heading "Beautifully designed, production-ready." [level=1] [ref=e29]
        - navigation [ref=e33]:
          - link "All" [ref=e34] [cursor=pointer]:
            - /url: /blocks
          - link "Marketing" [ref=e35] [cursor=pointer]:
            - /url: /blocks/marketing
          - link "Application" [ref=e36] [cursor=pointer]:
            - /url: /blocks/application
          - link "Ecommerce" [ref=e37] [cursor=pointer]:
            - /url: /blocks/ecommerce
        - generic [ref=e41]:
          - generic [ref=e42]:
            - tablist [ref=e43]:
              - tab "Preview" [selected] [ref=e44]
              - tab "Code" [ref=e45]
            - link "A social proof section with a logos carousel" [ref=e46] [cursor=pointer]:
              - /url: "#social-proof-01"
            - generic [ref=e47]:
              - button "Theme" [ref=e48]
              - generic [ref=e54]:
                - group [ref=e55]:
                  - button "Mobile" [ref=e56]:
                    - img
                  - button "Tablet" [ref=e57]:
                    - img
                  - button "Desktop" [pressed] [ref=e58]:
                    - img
                - link "Open in New Tab" [ref=e59] [cursor=pointer]:
                  - /url: /preview/social-proof-01
                  - img
                - button "Refresh Preview" [ref=e60]:
                  - img
              - button "npx shadcn add @pp-namias/social-proof-01" [ref=e61]:
                - generic [ref=e62]:
                  - img
                - generic [ref=e63]: npx shadcn add @pp-namias/social-proof-01
              - link "Open in v0" [ref=e64] [cursor=pointer]:
                - /url: https://v0.app/chat/api/open?url=https://namias.tech/r/social-proof-01.json
                - img
          - tabpanel [ref=e66]:
            - generic [ref=e69]:
              - iframe [ref=e72]
              - separator [ref=e73]
        - generic [ref=e77]:
          - generic [ref=e78]:
            - tablist [ref=e79]:
              - tab "Preview" [selected] [ref=e80]
              - tab "Code" [ref=e81]
            - link "A social links section with a lined grid layout" [ref=e82] [cursor=pointer]:
              - /url: "#social-links-01"
            - generic [ref=e83]:
              - button "Theme" [ref=e84]
              - generic [ref=e90]:
                - group [ref=e91]:
                  - button "Mobile" [ref=e92]:
                    - img
                  - button "Tablet" [ref=e93]:
                    - img
                  - button "Desktop" [pressed] [ref=e94]:
                    - img
                - link "Open in New Tab" [ref=e95] [cursor=pointer]:
                  - /url: /preview/social-links-01
                  - img
                - button "Refresh Preview" [ref=e96]:
                  - img
              - button "npx shadcn add @pp-namias/social-links-01" [ref=e97]:
                - generic [ref=e98]:
                  - img
                - generic [ref=e99]: npx shadcn add @pp-namias/social-links-01
              - link "Open in v0" [ref=e100] [cursor=pointer]:
                - /url: https://v0.app/chat/api/open?url=https://namias.tech/r/social-links-01.json
                - img
          - tabpanel [ref=e102]:
            - generic [ref=e105]:
              - iframe [ref=e108]
              - separator [ref=e109]
        - generic [ref=e113]:
          - generic [ref=e114]:
            - tablist [ref=e115]:
              - tab "Preview" [selected] [ref=e116]
              - tab "Code" [ref=e117]
            - link "A metrics section with a line chart" [ref=e118] [cursor=pointer]:
              - /url: "#metrics-01"
            - generic [ref=e119]:
              - button "Theme" [ref=e120]
              - generic [ref=e126]:
                - group [ref=e127]:
                  - button "Mobile" [ref=e128]:
                    - img
                  - button "Tablet" [ref=e129]:
                    - img
                  - button "Desktop" [pressed] [ref=e130]:
                    - img
                - link "Open in New Tab" [ref=e131] [cursor=pointer]:
                  - /url: /preview/metrics-01
                  - img
                - button "Refresh Preview" [ref=e132]:
                  - img
              - button "npx shadcn add @pp-namias/metrics-01" [ref=e133]:
                - generic [ref=e134]:
                  - img
                - generic [ref=e135]: npx shadcn add @pp-namias/metrics-01
              - link "Open in v0" [ref=e136] [cursor=pointer]:
                - /url: https://v0.app/chat/api/open?url=https://namias.tech/r/metrics-01.json
                - img
          - tabpanel [ref=e138]:
            - generic [ref=e141]:
              - iframe [ref=e144]
              - separator [ref=e145]
        - generic [ref=e149]:
          - generic [ref=e150]:
            - tablist [ref=e151]:
              - tab "Preview" [selected] [ref=e152]
              - tab "Code" [ref=e153]
            - link "A team section with glowing cards" [ref=e154] [cursor=pointer]:
              - /url: "#team-01"
            - generic [ref=e155]:
              - button "Theme" [ref=e156]
              - generic [ref=e162]:
                - group [ref=e163]:
                  - button "Mobile" [ref=e164]:
                    - img
                  - button "Tablet" [ref=e165]:
                    - img
                  - button "Desktop" [pressed] [ref=e166]:
                    - img
                - link "Open in New Tab" [ref=e167] [cursor=pointer]:
                  - /url: /preview/team-01
                  - img
                - button "Refresh Preview" [ref=e168]:
                  - img
              - button "npx shadcn add @pp-namias/team-01" [ref=e169]:
                - generic [ref=e170]:
                  - img
                - generic [ref=e171]: npx shadcn add @pp-namias/team-01
              - link "Open in v0" [ref=e172] [cursor=pointer]:
                - /url: https://v0.app/chat/api/open?url=https://namias.tech/r/team-01.json
                - img
          - tabpanel [ref=e174]:
            - generic [ref=e177]:
              - iframe [ref=e180]
              - separator [ref=e181]
        - generic [ref=e185]:
          - generic [ref=e186]:
            - tablist [ref=e187]:
              - tab "Preview" [selected] [ref=e188]
              - tab "Code" [ref=e189]
            - link "A testimonials section with a lined layout" [ref=e190] [cursor=pointer]:
              - /url: "#testimonials-02"
            - generic [ref=e191]:
              - button "Theme" [ref=e192]
              - generic [ref=e198]:
                - group [ref=e199]:
                  - button "Mobile" [ref=e200]:
                    - img
                  - button "Tablet" [ref=e201]:
                    - img
                  - button "Desktop" [pressed] [ref=e202]:
                    - img
                - link "Open in New Tab" [ref=e203] [cursor=pointer]:
                  - /url: /preview/testimonials-02
                  - img
                - button "Refresh Preview" [ref=e204]:
                  - img
              - button "npx shadcn add @pp-namias/testimonials-02" [ref=e205]:
                - generic [ref=e206]:
                  - img
                - generic [ref=e207]: npx shadcn add @pp-namias/testimonials-02
              - link "Open in v0" [ref=e208] [cursor=pointer]:
                - /url: https://v0.app/chat/api/open?url=https://namias.tech/r/testimonials-02.json
                - img
          - tabpanel [ref=e210]:
            - generic [ref=e213]:
              - iframe [ref=e216]
              - separator [ref=e217]
        - generic [ref=e221]:
          - generic [ref=e222]:
            - tablist [ref=e223]:
              - tab "Preview" [selected] [ref=e224]
              - tab "Code" [ref=e225]
            - link "A work experience section with a lined layout" [ref=e226] [cursor=pointer]:
              - /url: "#experience-01"
            - generic [ref=e227]:
              - button "Theme" [ref=e228]
              - generic [ref=e234]:
                - group [ref=e235]:
                  - button "Mobile" [ref=e236]:
                    - img
                  - button "Tablet" [ref=e237]:
                    - img
                  - button "Desktop" [pressed] [ref=e238]:
                    - img
                - link "Open in New Tab" [ref=e239] [cursor=pointer]:
                  - /url: /preview/experience-01
                  - img
                - button "Refresh Preview" [ref=e240]:
                  - img
              - button "npx shadcn add @pp-namias/experience-01" [ref=e241]:
                - generic [ref=e242]:
                  - img
                - generic [ref=e243]: npx shadcn add @pp-namias/experience-01
              - link "Open in v0" [ref=e244] [cursor=pointer]:
                - /url: https://v0.app/chat/api/open?url=https://namias.tech/r/experience-01.json
                - img
          - tabpanel [ref=e246]:
            - generic [ref=e249]:
              - iframe [ref=e252]
              - separator [ref=e253]
        - generic [ref=e257]:
          - generic [ref=e258]:
            - tablist [ref=e259]:
              - tab "Preview" [selected] [ref=e260]
              - tab "Code" [ref=e261]
            - link "A testimonials section with dual marquees" [ref=e262] [cursor=pointer]:
              - /url: "#testimonials-01"
            - generic [ref=e263]:
              - button "Theme" [ref=e264]
              - generic [ref=e270]:
                - group [ref=e271]:
                  - button "Mobile" [ref=e272]:
                    - img
                  - button "Tablet" [ref=e273]:
                    - img
                  - button "Desktop" [pressed] [ref=e274]:
                    - img
                - link "Open in New Tab" [ref=e275] [cursor=pointer]:
                  - /url: /preview/testimonials-01
                  - img
                - button "Refresh Preview" [ref=e276]:
                  - img
              - button "npx shadcn add @pp-namias/testimonials-01" [ref=e277]:
                - generic [ref=e278]:
                  - img
                - generic [ref=e279]: npx shadcn add @pp-namias/testimonials-01
              - link "Open in v0" [ref=e280] [cursor=pointer]:
                - /url: https://v0.app/chat/api/open?url=https://namias.tech/r/testimonials-01.json
                - img
          - tabpanel [ref=e282]:
            - generic [ref=e285]:
              - iframe [ref=e288]
              - separator [ref=e289]
        - generic [ref=e293]:
          - generic [ref=e294]:
            - tablist [ref=e295]:
              - tab "Preview" [selected] [ref=e296]
              - tab "Code" [ref=e297]
            - link "A blog section with a lined grid layout" [ref=e298] [cursor=pointer]:
              - /url: "#blog-02"
            - generic [ref=e299]:
              - button "Theme" [ref=e300]
              - generic [ref=e306]:
                - group [ref=e307]:
                  - button "Mobile" [ref=e308]:
                    - img
                  - button "Tablet" [ref=e309]:
                    - img
                  - button "Desktop" [pressed] [ref=e310]:
                    - img
                - link "Open in New Tab" [ref=e311] [cursor=pointer]:
                  - /url: /preview/blog-02
                  - img
                - button "Refresh Preview" [ref=e312]:
                  - img
              - button "npx shadcn add @pp-namias/blog-02" [ref=e313]:
                - generic [ref=e314]:
                  - img
                - generic [ref=e315]: npx shadcn add @pp-namias/blog-02
              - link "Open in v0" [ref=e316] [cursor=pointer]:
                - /url: https://v0.app/chat/api/open?url=https://namias.tech/r/blog-02.json
                - img
          - tabpanel [ref=e318]:
            - generic [ref=e321]:
              - iframe [ref=e324]
              - separator [ref=e325]
        - generic [ref=e329]:
          - generic [ref=e330]:
            - tablist [ref=e331]:
              - tab "Preview" [selected] [ref=e332]
              - tab "Code" [ref=e333]
            - link "A blog section with a grid layout" [ref=e334] [cursor=pointer]:
              - /url: "#blog-01"
            - generic [ref=e335]:
              - button "Theme" [ref=e336]
              - generic [ref=e342]:
                - group [ref=e343]:
                  - button "Mobile" [ref=e344]:
                    - img
                  - button "Tablet" [ref=e345]:
                    - img
                  - button "Desktop" [pressed] [ref=e346]:
                    - img
                - link "Open in New Tab" [ref=e347] [cursor=pointer]:
                  - /url: /preview/blog-01
                  - img
                - button "Refresh Preview" [ref=e348]:
                  - img
              - button "npx shadcn add @pp-namias/blog-01" [ref=e349]:
                - generic [ref=e350]:
                  - img
                - generic [ref=e351]: npx shadcn add @pp-namias/blog-01
              - link "Open in v0" [ref=e352] [cursor=pointer]:
                - /url: https://v0.app/chat/api/open?url=https://namias.tech/r/blog-01.json
                - img
          - tabpanel [ref=e354]:
            - generic [ref=e357]:
              - iframe [ref=e360]
              - separator [ref=e361]
        - generic [ref=e365]:
          - generic [ref=e366]:
            - tablist [ref=e367]:
              - tab "Preview" [selected] [ref=e368]
              - tab "Code" [ref=e369]
            - link "A hero section with a golden spiral background" [ref=e370] [cursor=pointer]:
              - /url: "#hero-01"
            - generic [ref=e371]:
              - button "Theme" [ref=e372]
              - generic [ref=e378]:
                - group [ref=e379]:
                  - button "Mobile" [ref=e380]:
                    - img
                  - button "Tablet" [ref=e381]:
                    - img
                  - button "Desktop" [pressed] [ref=e382]:
                    - img
                - link "Open in New Tab" [ref=e383] [cursor=pointer]:
                  - /url: /preview/hero-01
                  - img
                - button "Refresh Preview" [ref=e384]:
                  - img
              - button "npx shadcn add @pp-namias/hero-01" [ref=e385]:
                - generic [ref=e386]:
                  - img
                - generic [ref=e387]: npx shadcn add @pp-namias/hero-01
              - link "Open in v0" [ref=e388] [cursor=pointer]:
                - /url: https://v0.app/chat/api/open?url=https://namias.tech/r/hero-01.json
                - img
          - tabpanel [ref=e390]:
            - generic [ref=e393]:
              - iframe [ref=e396]
              - separator [ref=e397]
        - generic [ref=e401]:
          - generic [ref=e402]:
            - tablist [ref=e403]:
              - tab "Preview" [selected] [ref=e404]
              - tab "Code" [ref=e405]
            - link "A simple login form" [ref=e406] [cursor=pointer]:
              - /url: "#login-01"
            - generic [ref=e407]:
              - button "Theme" [ref=e408]
              - generic [ref=e414]:
                - group [ref=e415]:
                  - button "Mobile" [ref=e416]:
                    - img
                  - button "Tablet" [ref=e417]:
                    - img
                  - button "Desktop" [pressed] [ref=e418]:
                    - img
                - link "Open in New Tab" [ref=e419] [cursor=pointer]:
                  - /url: /preview/login-01
                  - img
                - button "Refresh Preview" [ref=e420]:
                  - img
              - button "npx shadcn add @pp-namias/login-01" [ref=e421]:
                - generic [ref=e422]:
                  - img
                - generic [ref=e423]: npx shadcn add @pp-namias/login-01
              - link "Open in v0" [ref=e424] [cursor=pointer]:
                - /url: https://v0.app/chat/api/open?url=https://namias.tech/r/login-01.json
                - img
          - tabpanel [ref=e426]:
            - generic [ref=e429]:
              - iframe [ref=e432]
              - separator [ref=e433]
        - paragraph [ref=e438]: More blocks on the way…
    - contentinfo [ref=e443]:
      - generic [ref=e444]:
        - generic [ref=e447]:
          - generic [ref=e448]:
            - term [ref=e449]: Crafted by
            - definition [ref=e450]:
              - link "@PP_Namias" [ref=e451] [cursor=pointer]:
                - /url: https://x.com/PP_Namias
          - generic [ref=e452]:
            - term [ref=e453]: Inspired by
            - definition [ref=e454]:
              - list [ref=e455]:
                - listitem [ref=e456]: Tailwind CSS
                - listitem [ref=e457]: shadcn/ui
                - listitem [ref=e458]: Vercel
                - listitem [ref=e459]: Evil Charts
                - listitem [ref=e460]: Devouring Details
                - listitem [ref=e461]: Skiper UI
                - listitem [ref=e462]: Making Software
          - generic [ref=e463]:
            - term [ref=e464]: Deployed on
            - definition [ref=e465]: Vercel
          - generic [ref=e466]:
            - term [ref=e467]: Analytics
            - definition [ref=e468]:
              - list [ref=e469]:
                - listitem [ref=e470]: OpenPanel
                - listitem [ref=e471]: PostHog
          - generic [ref=e472]:
            - term [ref=e473]: Source code
            - definition [ref=e474]:
              - link "GitHub" [ref=e475] [cursor=pointer]:
                - /url: https://github.com/PP-Namias/Portfolio
          - generic [ref=e476]:
            - term [ref=e477]: License
            - definition [ref=e478]:
              - link "MIT License" [ref=e479] [cursor=pointer]:
                - /url: https://github.com/PP-Namias/Portfolio/blob/main/LICENSE
        - generic [ref=e481]:
          - link "X Profile" [ref=e482] [cursor=pointer]:
            - /url: https://x.com/PP_Namias
            - img [ref=e483]
          - link "GitHub Profile" [ref=e486] [cursor=pointer]:
            - /url: https://github.com/PP-Namias
            - img [ref=e487]
          - link "LinkedIn Profile" [ref=e490] [cursor=pointer]:
            - /url: https://linkedin.com/in/pp-namias/
            - img [ref=e491]
          - link "DMCA.com Protection Status" [ref=e494] [cursor=pointer]:
            - /url: https://www.dmca.com
            - img [ref=e495]
      - img [ref=e500]
    - button "Scroll to top" [ref=e505]:
      - img
  - region "Notifications alt+T"
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
  26 |     await expect(page.locator("[data-testid='component-preview']")).toBeVisible();
  27 |   });
  28 | });
  29 | 
  30 | test.describe("Block Routes", () => {
  31 |   test("should load blocks list page", async ({ page }) => {
> 32 |     const response = await page.goto("/blocks");
     |                                 ^ Error: page.goto: Test timeout of 30000ms exceeded.
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