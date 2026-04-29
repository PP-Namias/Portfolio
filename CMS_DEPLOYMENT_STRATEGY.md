# CMS Deployment Architecture: Separate Domains vs Integrated

You asked if deploying the Sanity CMS Studio to `cms.namias.tech` and the main portfolio to `namias.tech` is a good practice.

**Yes, this is an excellent practice. It is highly recommended for production architectures.**

## Why separating them is better (Recommended)
1. **Security Isolation:** By hosting the CMS on `cms.namias.tech`, you can apply strict firewall rules, VPN requirements, or entirely different authentication mechanisms to the backend without affecting public users.
2. **Bundle Size & Performance:** The main website (`namias.tech`) does not need to load or resolve any of the heavy CMS Studio libraries (`sanity`, `@sanity/desk-tool`). This keeps your portfolio build incredibly fast and lightweight.
3. **Independent Scalability:** Your public portfolio is highly cached on CDNs (Vercel/Amplify). The CMS is a heavy React SPA (Single Page Application) that communicates directly to Sanity's API. Keeping them separate means deploying a typo fix to the portfolio doesn't require rebuilding the entire CMS Studio.

## How to properly set this up
Instead of embedding Sanity into Next.js (`src/app/studio/[[...index]]/page.tsx`), you would:
1. Initialize a standalone Sanity Studio locally outside the Next.js app (or in a `/cms` folder) using `npm create sanity@latest`.
2. Deploy that `/cms` folder specifically to Vercel/Netlify/Amplify under `cms.namias.tech`.
3. In that CMS, set the CORS origins to allow your main domain.
4. Your main portfolio (`namias.tech`) only ever installs `@sanity/client` and fetches data. It never hosts the Studio UI. 

Since you requested the plan be fully integrated right now, I have embedded it into Next.js. However, if you want this isolated setup, we can decouple the Studio entirely in the upcoming phases.

## What is happening next?
To get the current automated setup building successfully, the latest Sanity toolkit requires React 19 (`compiler-runtime`). I am autonomously upgrading Next.js -> 15 and React -> 19 as you explicitly allowed, ensuring our tests and build pass properly!