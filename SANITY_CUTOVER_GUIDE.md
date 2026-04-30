# Sanity CMS Cutover Plan - Launch Guide

This document provides the complete procedure for cutting over from JSON-only data to Sanity CMS as the primary source while maintaining the JSON fallback as emergency backup.

## Pre-Cutover Requirements

All must be complete before proceeding:

- [ ] SANITY-MIG-PREREQ-001: Sanity project credentials provided
- [ ] SANITY-MIG-SCHEMA-001: Schema complete and tested
- [ ] SANITY-MIG-MIGRATION-001: Data migrated and verified
- [ ] SANITY-MIG-FETCH-001: Async data fetchers integrated
- [ ] SANITY-MIG-REFAC-001: Server components converted to async
- [ ] SANITY-MIG-STUDIO-OPS-001: Studio deployment pipeline ready
- [ ] SANITY-MIG-QA-001: QA validation passed
- [ ] Stakeholder sign-off obtained

## Cutover Readiness Checklist

### Data Validation
- [ ] All 10 experiences migrated to Sanity
- [ ] All 7 projects migrated with links functional
- [ ] All 28 certifications present with valid dates
- [ ] All 22 gallery images accessible
- [ ] Blog posts migrated with correct slugs
- [ ] 45+ technologies with correct categories
- [ ] Profile, memberships, recommendations, socials complete
- [ ] No data loss detected in parity checks
- [ ] Sanity document counts match JSON arrays

### Infrastructure Readiness
- [ ] Studio deployment to cms.namias.tech successful
- [ ] Studio accessible and authenticated
- [ ] DNS propagated and verified
- [ ] CORS configured correctly
- [ ] API tokens secured in environment
- [ ] ISR revalidation tags functional
- [ ] Monitoring and logging configured
- [ ] Rollback procedure documented and tested

### Testing Complete
- [ ] All unit tests pass: `npm run test -- --run`
- [ ] Build succeeds: `npm run build`
- [ ] Lint clean: `npm run lint`
- [ ] Integration tests passed (all components render)
- [ ] E2E tests passed (navigation works, links functional)
- [ ] Fallback behavior tested and verified
- [ ] Performance benchmarks met
- [ ] Accessibility validation passed

## Cutover Execution - Step by Step

### Step 1: Create Release Branch

```bash
git checkout main
git pull origin main
git checkout -b release/sanity-cutover-2026-05-01
```

### Step 2: Update Sanity Fetch Configuration

In `src/lib/sanity.ts`, adjust fetch strategy for production:

```typescript
// CHANGE THIS:
// useCdn: true,  // Use CDN for production
useCdn: process.env.NEXT_PUBLIC_SANITY_DATASET === 'production', // CDP for prod, live for dev
```

### Step 3: Enable Sanity Primary in Configuration

In `.env.production` (or Amplify env vars):
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your-actual-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_CUTOVER_ENABLED=true
```

In `src/lib/sanity.ts`, optionally add feature flag:
```typescript
const isCutoverComplete = process.env.SANITY_CUTOVER_ENABLED === 'true';
```

### Step 4: Pre-Production Dry Run

Deploy to staging environment:

```bash
# Staging deployment (if using separate staging)
git push origin release/sanity-cutover-2026-05-01 --force

# Monitor staging for 24 hours:
# - Check Sanity fetch success rate > 99%
# - Verify no fallback logs
# - Test all content edits in Studio push to staging
# - Validate performance metrics
```

### Step 5: Monitoring Preparation

Set up CloudWatch logs, Sentry alerts:

```bash
# Example: Check Sanity fallback rate
# CloudWatch query:
fields @timestamp, @message
| stats count() as total_fetches, 
        count(field like /Sanity Fetch failed/) as fallback_events
| stats avg(fallback_events/total_fetches) as fallback_rate
```

Create alert:
- Alert if fallback_rate > 0.05 (5%) in any 1-hour window
- Alert if Sanity API timeout errors spike > 10 per minute
- Alert if portfolio response time > 4s sustained

### Step 6: Create Maintenance Window (Optional)

For zero-downtime cutover, schedule during low-traffic window:

```
Best time: 2:00 AM - 4:00 AM UTC (adjust for timezone)
Expected downtime: 0 (zero-downtime deployment via Next.js)
Estimated testing time: 30 minutes post-deployment
```

### Step 7: Production Deployment

Merge and deploy to production:

```bash
# Code review and approval
git push origin release/sanity-cutover-2026-05-01

# Create pull request
# Request approval from: DevOps, Product Lead

# Once approved, merge to main
git checkout main
git merge --no-ff release/sanity-cutover-2026-05-01
git push origin main

# Amplify auto-deploys from main branch
# Monitor deployment progress in Amplify console
```

### Step 8: Immediate Post-Deployment Validation (First 30 minutes)

**Portfolio checks (namias.tech):**
```bash
# Health check
curl -i https://namias.tech/
# Response should be 200 OK

# Check for Sanity data
curl https://namias.tech/api/health

# Verify key pages load
curl -i https://namias.tech/blog
```

**Studio checks (cms.namias.tech):**
```bash
# Studio accessible
curl -i https://cms.namias.tech/

# Verify documents visible in Studio
# Login and inspect a few documents
```

**Log monitoring:**
- [ ] Check CloudWatch logs - no ERROR level events
- [ ] Sanity fetch success rate > 99.5%
- [ ] Zero fallback log entries in first 30 minutes
- [ ] API response times stable
- [ ] No CLS (layout shift) issues reported

### Step 9: Core Content Validation (First Hour)

Manually verify critical content:

1. **Home Page**
   - [ ] Hero section loads with profile
   - [ ] About section has summary text
   - [ ] Tech stack displays technologies
   - [ ] Projects show all 7 items
   - [ ] Experience timeline shows 10 entries
   - [ ] Certifications grid loads

2. **Blog**
   - [ ] Blog listing shows posts
   - [ ] Individual post loads correctly
   - [ ] Markdown renders properly

3. **Studio Operations**
   - [ ] Edit a document in Studio (e.g., update a project description)
   - [ ] Publish the change
   - [ ] Verify change appears on main site within ISR window (5-60 seconds)

### Step 10: Extended Monitoring (First 24 Hours)

Continue monitoring for 24 hours post-launch:

- [ ] Sanity API success rate remains > 99%
- [ ] No spike in error rates
- [ ] Page load times within SLA
- [ ] User-reported issues resolved
- [ ] No data corruption detected
- [ ] Fallback logs only appear in expected scenarios

## Rollback Plan - If Something Goes Wrong

### Immediate Rollback (< 5 minutes to restore)

If critical issues detected:

```bash
# Option 1: Revert commit and re-deploy
git revert HEAD
git push origin main
# Amplify re-deploys automatically

# Option 2: Disable Sanity via environment variable (fastest)
# In Amplify console, set:
NEXT_PUBLIC_SANITY_PROJECT_ID=dummy-project-id
# This forces all fetches to fallback immediately

# Option 3: Temporary DNS switch (if truly catastrophic)
# Point namias.tech to old backup server
# (Requires pre-setup, last resort only)
```

### Data Recovery

If data corruption detected in Sanity:

```bash
# 1. Restore Sanity documents from backup
# (Done in Sanity dashboard - they maintain backups)

# 2. Re-run migration script to sync cleaned data
npm run migrate:sanity

# 3. Test on staging first
# Deploy to staging and validate before re-pushing to production
```

### Communication

If rollback required, notify:
- [ ] Send Slack notification to team
- [ ] Update status page (if applicable)
- [ ] Document incident reason
- [ ] Schedule post-mortem within 24 hours

## Success Criteria - Cutover Complete

Mark cutover as successful after:

1. **24 hours** have passed without critical incidents
2. **Sanity fetch rate** remains > 99% consistently
3. **All content** is live from Sanity (verified by spot checks)
4. **Zero content** coming from JSON fallback (in logs)
5. **Performance** metrics stable or improved
6. **Studio** is accepting content updates without issue
7. **Team** reports normal operations

## Post-Cutover - First Week

### Daily Checks
- [ ] 9:00 AM: Review error logs and metrics
- [ ] 5:00 PM: Spot-check portfolio content accuracy
- [ ] Weekend: Monitor for any weekend issues

### Content Editor Onboarding
- [ ] Provide access to studio.namias.tech to content team
- [ ] Training on document editing workflow
- [ ] Demonstrate publish/unpublish workflow
- [ ] Show ISR revalidation timing

### Performance Optimization
- [ ] Analyze Sanity query performance
- [ ] Optimize GROQ queries if needed
- [ ] Adjust ISR cache windows based on usage patterns
- [ ] Fine-tune timeout values if necessary

### Documentation Update
- [ ] Update CONTRIBUTING.md with content editing instructions
- [ ] Create runbook for common Studio tasks
- [ ] Document common issues and solutions

## Success Tracking

```
[CUTOVER COMPLETE: 2026-05-XX]

Phase      Status      Notes
--------   ---------   ---------
Pre-check  [PENDING]   Awaiting final approval
Deployment [PENDING]   Scheduled for 2026-05-XX
Validation [PENDING]   Will begin immediately post-deploy
Monitoring [PENDING]   24-hour observation window
Success    [PENDING]   Will update after validation complete

Release candidate: v1.1.0-sanity-cutover
Deployed by: [Deploy user]
Verified by: [QA lead]
Approved by: [Product lead]
```

## Contact & Support

For issues during or after cutover:

- **Technical Issues**: @devops-team in Slack
- **Content Issues**: Contact content administrator
- **Urgent Production Issue**: Declare SEV-1 incident and call engineering lead

---

**Remember:** The JSON fallback is always there. Even if Sanity is down, the portfolio continues to work. This cutover is safe and reversible.
