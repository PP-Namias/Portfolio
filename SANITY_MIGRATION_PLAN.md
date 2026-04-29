# Portfolio Sanity CMS Migration Plan

## 🚀 Objective
Migrate the existing static JSON-based Next.js 14 portfolio to **Sanity CMS** to enable real-time content management while preserving ultra-fast CDN-backed performance. The system must include a robust automated migration script for existing data and an infallible local fallback mechanism (JSON + local assets) if the CMS goes down.

This document serves as an autonomous execution plan for the AI Agent (Ralph).

---

## 🤖 Agent Execution Instructions

**Agent:** Follow these phases step by step.
**Protocol:**
1. Do not proceed to the next phase until the current phase passes all validation, linting (`npm run lint`), build (`npm run build`), and test gates (`npm run test`).
2. Mark completed steps inside this plan using checkmarks `[x]`.
3. Auto-commit locally after every successful phase using the prefix `feat(cms):`.

---

## 📋 Phase 1: Sanity Project Initialization & Configuration
**Goal:** Integrate Sanity Studio within the Next.js workspace and set up core dependencies.

- [ ] **1.1. Install Dependencies:** Install `next-sanity`, `@sanity/image-url`, `@sanity/client`, and `sanity` packages.
- [ ] **1.2. Initialize Sanity Project:** Create a `/sanity` folder at the project root for the Studio or integrate it at `/src/app/studio/[[...index]]/page.tsx` using `next-sanity/studio`.
- [ ] **1.3. Environment Variables:** Set up required `.env.local` variables (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN`, `SANITY_API_WRITE_TOKEN`).
- [ ] **1.4. Validation:** Ensure Next.js builds correctly with the integrated Studio route.

## 📋 Phase 2: Schema Architecture (Data Modeling)
**Goal:** Map the existing local JSON structures to Sanity schemas. Reference `src/types/index.ts`.

- [ ] **2.1. Define Schemas:** Create schemas in `sanity/schemas` for:
  - `profile` (Singleton)
  - `project` (Document)
  - `experience` (Document)
  - `certification` (Document)
  - `techStack` (Document/Singleton)
  - `blogPost` (Document)
  - `gallery` (Document)
  - `recommendation` (Document)
- [ ] **2.2. Register Schemas:** Export all schemas in `sanity/schema.ts`.
- [ ] **2.3. Validation:** Open Local Sanity Studio (`/studio`) and manually verify the schema fields match the strictly typed local JSON exactly.

## 📋 Phase 3: Automated Migration Script
**Goal:** Create an automated script to scrape `portfolio-resources/data/*.json` and `portfolio-resources/assets/` and batch upload to Sanity.

- [ ] **3.1. Build Upload Script:** Write `scripts/migrate-to-sanity.ts` using `dotenv` and `@sanity/client`.
- [ ] **3.2. Asset Pipeline:** Implement standard image/file uploading first. The script must resolve local file paths (e.g., `public/images/...` or `portfolio-resources/assets/`), upload them to Sanity using `client.assets.upload`, and retrieve the Sanity asset `_id`.
- [ ] **3.3. Document Pipeline:** Map JSON data to Sanity documents, replacing local image string paths with Sanity local asset references.
- [ ] **3.4. Idempotency:** Ensure the script uses `client.transaction().createOrReplace()` utilizing predictable generic IDs (e.g., `project-portfolio-v1`) so it can be run multiple times safely.
- [ ] **3.5. Validation:** Execute script in a dry-run mode, then commit to a development dataset. Verify data populated in Studio.

## 📋 Phase 4: Advanced Fetching & Failover Architecture (The Fallback)
**Goal:** Update `src/data/*.ts` files to fetch from Sanity *first*, then fall back to local JSON if it fails.

- [ ] **4.1. Sanity Client Setup:** Create `src/lib/sanity/client.ts` with `useCdn: true` (for edge caching) and the read token.
- [ ] **4.2. Fetch Wrappers:** Build a generic fetch utility `safeFetchSanity<T>(query, fallbackData)`.
  - Try fetching from Sanity via GROQ.
  - Set an aggressive timeout (e.g., 3500ms).
  - **Catch Block:** If network fails, API errors out, or data is null, immediately return the injected `fallbackData` (from `portfolio-resources/data/`).
- [ ] **4.3. Implement Queries:** Write GROQ queries for projects, experiences, profile, etc.
- [ ] **4.4. Validation:** Test the application with an invalid Sanity Project ID to ensure fallback assets and JSON data load perfectly without user-facing errors.

## 📋 Phase 5: Component Refactoring & Real-time Previews
**Goal:** Transition UI components to accept the potentially unified data shape.

- [ ] **5.1. Image Resolving:** Create a utility `urlFor(source).url()` or fallback to a standard `<img src={fallback_path}>`.
- [ ] **5.2. Component Updates:** Hook up `src/app/page.tsx` and all `src/components/sections/*.tsx` to await the new `safeFetchSanity` functions instead of static imports.
- [ ] **5.3. Visual Drafting (Optional):** Enable `next-sanity` active live preview mode (`draftMode()`) so Draft content appears instantly when editing in Studio.
- [ ] **5.4. Validation:** Check that the `npm run build` succeeds, indicating SSR is working with either live or fallback data.

## 📋 Phase 6: Edge CDN & Performance Tuning
**Goal:** Ensure server-side rendering is fast by using Next.js caching + Sanity CDN.

- [ ] **6.1. Next.js Data Cache:** Set `next: { revalidate: 3600 }` (1 hour) on Sanity fetch requests.
- [ ] **6.2. Webhooks for On-Demand ISR:** Create an API route (`/api/revalidate`) that Sanity calls on document publish. Use `revalidateTag` to purge the cache instantly upon CMS update.
- [ ] **6.3. Validation:** Measure page load metrics. Change a value via Sanity Studio, fire the webhook, and observe real-time updates in production without a full redeploy.

## 📋 Phase 7: Final Polish & AI QA
**Goal:** Ensure the migration meets all PRD and original application constraints.

- [ ] **7.1. Full Suite Test:** Run `npm run test` ensuring the UI layer renders seamlessly regardless of data source.
- [ ] **7.2. Fallback Stress Test:** Physically disconnect the internet or sabotage the API key to prove the portfolio boots from `portfolio-resources/` assets with no layout shift or 500 errors.
- [ ] **7.3. Documentation:** Update `README.md` and `.github/copilot-instructions.md` with instructions on how to use Sanity Studio and how the CDN / Fallback mechanisms work.
