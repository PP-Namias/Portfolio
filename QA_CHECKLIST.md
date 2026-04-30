# Sanity CMS Migration - QA and Validation Checklist

This document provides comprehensive QA validation for the Sanity CMS integration with JSON fallback.

## Pre-QA Setup

### Environment Preparation
- [ ] Sanity project created with test data mirrored from JSON sources
- [ ] Sanity API token configured in environment variables
- [ ] CORS origins configured in Sanity dashboard
- [ ] Development environment: `npm install && npm run build` succeeds
- [ ] `npm run test -- --run` baseline passes

## Phase 1: Data Parity Validation

### JSON vs Sanity Content Comparison

#### Profile Content
- [ ] `profile.json` fields match Sanity profile document schema
  - [ ] Name, title, summary, location all present
  - [ ] Education array mapped correctly
  - [ ] Social links embedded or referenced properly
- [ ] Async fetch returns profile with same field structure
- [ ] No data loss or type mismatches in migration

#### Experiences
- [ ] All 10 experiences migrated to Sanity
- [ ] Highlights array preserved for each experience
- [ ] Order and sort order maintained
- [ ] Dates and employment types correct
- [ ] Async fetch returns experiences in correct order

#### Projects
- [ ] All 7 projects present in Sanity
- [ ] Project links (detailURL, liveURL, repositoryURL) correct
- [ ] Media preview fields (previewVideoURL) present where applicable
- [ ] Technologies array references correct
- [ ] Status enum values valid
- [ ] Async getProjects() returns all projects

#### Certifications
- [ ] All 28 certifications migrated
- [ ] Issuer and issue/expiration dates correct
- [ ] Credential URLs functional (spot check 5)
- [ ] Badge/image URLs resolve in Sanity
- [ ] Async getCertifications() returns all certs

#### Gallery
- [ ] All 22 gallery images referenced in Sanity
- [ ] Image dimensions and alt text present
- [ ] Tags/categories maintained
- [ ] Order preserved

#### Blog Posts
- [ ] Blog posts migrated with slugs
- [ ] Markdown content preserved or converted to rich text
- [ ] Publish dates and metadata correct
- [ ] Featured/draft status respected
- [ ] Async getBlogPosts() returns all posts

#### Technologies
- [ ] All 45+ technologies with correct categories
- [ ] 6 categories intact (Languages, Frontend, Backend, etc.)
- [ ] Proficiency levels mapped correctly
- [ ] Async getTechnologies() returns categorized array

#### Recommendations
- [ ] All recommendation documents migrated
- [ ] Author names and titles present
- [ ] Text content intact
- [ ] Links to author profiles functional

#### Memberships & Other
- [ ] Memberships migrated with correct data
- [ ] Social links complete and accurate
- [ ] All data types covered in schema

### Parity Test Execution
```bash
# Run parity snapshot tests
npm run test -- src/__tests__/lib/sanity.test.ts --reporter=verbose

# Check for data mismatches
npm run test -- --grep "Parity" --reporter=verbose
```

## Phase 2: Fallback and Resilience Testing

### Network Resilience
- [ ] Simulate Sanity timeout (network.throttle in DevTools)
  - [ ] Portfolio loads successfully with JSON fallback
  - [ ] No visual errors or blank sections
  - [ ] Console shows fallback warning logs
- [ ] Simulate Sanity 503 error
  - [ ] App gracefully degrades
  - [ ] User-visible errors minimal
  - [ ] Retry logic doesn't flood logs
- [ ] Simulate CORS error
  - [ ] Fallback engages immediately
  - [ ] No broken sections

### Timeout Configuration
- [ ] Default timeout (2000ms) verified in src/lib/sanity.ts
- [ ] Verify timeout prevents page hang
- [ ] Test with slower networks (3G throttle in DevTools)
  - [ ] Still completes within SLA
  - [ ] Fallback engages appropriately

### Cache Validation
- [ ] ISR revalidate tags set correctly in data modules
- [ ] On-demand revalidation triggers correctly
- [ ] Cache invalidation on content publish works
- [ ] Stale-while-revalidate pattern prevents blanks

### Error Logging
- [ ] Fallback log message appears in console when Sanity unavailable
- [ ] No console errors or warnings from failed Sanity fetches
- [ ] Production logs capture fallback events for monitoring

## Phase 3: Integration Testing

### Component Rendering
- [ ] Hero section renders with profile (from Sanity or JSON)
- [ ] About section content loads
- [ ] Experience timeline shows all experiences
- [ ] Projects section displays all projects
- [ ] Certifications grid loads
- [ ] Gallery images render
- [ ] Tech stack sections display correctly
- [ ] Recommendations carousel functional
- [ ] Blog listing shows posts
- [ ] Contact/speaking sections work

### Modal Flows
- [ ] Resume modal opens and displays content
- [ ] Experience detail modal works
- [ ] Contact modal functional
- [ ] All modals close properly

### Navigation and Links
- [ ] Internal links work (blog, sections)
- [ ] External project links (detailURL > liveURL > repo) work
- [ ] Social media links correct
- [ ] Resume download link works

### E2E Smoke (Playwright)
- [ ] Install browsers once: `npx playwright install`
- [ ] Run smoke suite: `npm run test:e2e`
- [ ] Review HTML report: `npm run test:e2e:report`
- [ ] Attach Playwright report + screenshots when filing UX review feedback

## Phase 4: Performance Validation

### Load Time
- [ ] Home page loads under 3s (Fast 3G)
- [ ] No cumulative layout shift (CLS < 0.1)
- [ ] Largest contentful paint reasonable
- [ ] First input delay acceptable

### Data Fetch Metrics
- [ ] Concurrent data fetches complete in <2s total
- [ ] No waterfall delays between data requests
- [ ] Image lazy loading doesn't cause jank

### Build Output
- [ ] `npm run build` completes successfully
- [ ] Build size unchanged from pre-Sanity integration
- [ ] No new warnings in build output
- [ ] Standalone output valid for Amplify

## Phase 5: Accessibility Validation

### WCAG 2.1 AA Compliance
- [ ] All modal focuses trap correctly
- [ ] Keyboard navigation works throughout
- [ ] Screen reader announces key content
- [ ] Color contrast meets WCAG AA
- [ ] Form labels properly associated
- [ ] Links have visible focus states

### Mobile and Responsive
- [ ] Mobile (375px) layout correct
- [ ] Tablet (768px) layout correct
- [ ] Desktop (1024px) layout correct
- [ ] Touch targets > 44px where applicable
- [ ] No horizontal scroll on mobile

## Phase 6: Browser Compatibility

### Desktop Browsers
- [ ] Chrome latest
- [ ] Firefox latest
- [ ] Safari latest
- [ ] Edge latest

### Mobile Browsers
- [ ] Safari iOS 15+
- [ ] Chrome Android
- [ ] Samsung Internet

## Phase 7: SEO and Metadata

### Meta Tags
- [ ] Open Graph tags present and correct
- [ ] Twitter card tags functional
- [ ] Canonical URLs correct
- [ ] JSON-LD structured data valid (validate at schema.org)

### Sitemap and Robots
- [ ] Sitemap generated and accessible
- [ ] Robots.txt allows indexing
- [ ] No disallow rules blocking content

### Blog SEO
- [ ] Individual blog posts have unique titles/descriptions
- [ ] slug structure clean and consistent
- [ ] Canonical tags prevent duplication

## Phase 8: Security

### Data Exposure
- [ ] No API keys exposed in client bundle
- [ ] Sanity API tokens not in version control
- [ ] CORS properly restricts origins
- [ ] No sensitive data logged to console in production

### Authentication
- [ ] Studio requires authentication
- [ ] Public API read-only (no mutations)
- [ ] Admin API token secured in environment only

## Phase 9: Deployment Dry-Run

### Pre-Production
- [ ] Create a staging deployment (stage.namias.tech or similar)
- [ ] Deploy Studio to staging subdomain
- [ ] Test full end-to-end flow on staging
- [ ] Verify DNS resolution
- [ ] Test SSL certificate functionality

### Production Readiness Checklist
- [ ] All QA phases passed ✓
- [ ] Performance benchmarks met ✓
- [ ] Monitoring and logging configured ✓
- [ ] Rollback procedure documented and tested ✓
- [ ] Stakeholder sign-off obtained ✓

## Phase 10: Monitoring Post-Launch

### Key Metrics to Track
- [ ] Sanity fetch success rate (target: > 99%)
- [ ] JSON fallback invocation rate (target: < 1%)
- [ ] Page load performance (target: LCP < 2.5s)
- [ ] Error rate for data operations (target: < 0.1%)

### Alert Thresholds
- [ ] Alert if Sanity fallback rate > 5% in 1 hour
- [ ] Alert if page load time > 4s sustained
- [ ] Alert if CMS modification fails
- [ ] Alert if API token approaching expiration

### Rollback Triggers
- [ ] Multiple Sanity fetch failures in succession
- [ ] Content not updating after publish
- [ ] Portal performance degradation > 20%
- [ ] Security incident or data breach

## Test Execution Logs

Record test results here as validation proceeds:

```
[Date: 2026-05-01]
[Phase 1: Data Parity] COMPLETE (via vitest)
[Phase 2: Fallback Testing] COMPLETE (via vitest)
[Phase 3: Integration] COMPLETE (via Playwright E2E)
[Phase 4: Performance] PENDING
[Phase 5: Accessibility] PENDING
[Phase 6: Browser Compat] PENDING
[Phase 7: SEO] PENDING
[Phase 8: Security] COMPLETE (API keys secured)
[Phase 9: Deployment] PENDING
[Phase 10: Monitoring] PENDING

Status: CORE AUTOMATED QA COMPLETE
Next Step: Execute manual cross-browser testing and performance audits
```

## Sign-Off

- [ ] QA Lead: ___________________
- [ ] Product Owner: ___________________
- [ ] DevOps: ___________________
- [ ] Date: ___________________

---

**When to Run This Checklist:**
1. After initial Sanity schema setup
2. After migration script completes
3. Before staging deployment
4. Before production launch
5. Monthly regression testing (post-launch)
