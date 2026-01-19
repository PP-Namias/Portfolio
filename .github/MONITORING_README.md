# 📊 Monitoring & Health Checks - README

## Overview

The Monitoring and Health Checks workflow provides automated 24/7 monitoring of your portfolio website with comprehensive health checks running every 6 hours.

## Quick Start

### 1. Update Production URL

**IMPORTANT**: Update the production URL in the workflow file first!

Edit [`.github/workflows/monitoring-health.yml`](.github/workflows/monitoring-health.yml):

```yaml
env:
  PRODUCTION_URL: 'https://jadecabrera.com'  # Update this to your domain
```

### 2. Verify Configuration

The workflow includes an optional Lighthouse configuration file at the root: `lighthouserc.json`

### 3. Manual Trigger

You can manually trigger the workflow:
- Go to Actions → Monitoring and Health Checks
- Click "Run workflow"

## Health Checks Performed

### 🌐 Uptime & Availability Check
- **Purpose**: Verifies website is accessible and responsive
- **Checks**: 
  - Main domain availability
  - Key pages (if configured)
  - Response time under 30 seconds
- **Runs**: Every 6 hours
- **Alerts**: Creates GitHub issue if site is down

### ⚡ Performance Monitoring
- **Purpose**: Tracks website performance metrics
- **Tool**: Lighthouse CI
- **Metrics**:
  - Performance Score
  - First Contentful Paint (FCP)
  - Largest Contentful Paint (LCP)
  - Cumulative Layout Shift (CLS)
  - Time to Interactive (TTI)
- **Non-Blocking**: Uses `continue-on-error` to not fail entire workflow
- **Artifacts**: Results uploaded for review

### 🔗 Broken Links Detection
- **Purpose**: Identifies broken internal links
- **Tool**: broken-link-checker (npm)
- **Features**:
  - Recursive site crawling
  - Rate limiting (10 max connections)
  - External links excluded (for performance)
  - Report uploaded as artifact
- **Non-Blocking**: Won't fail entire workflow

### 🔒 SSL Certificate Monitoring
- **Purpose**: Tracks SSL certificate expiration
- **Alerts**:
  - ⚠️ Warning: 30 days before expiration
  - 🚨 Critical: 7 days before expiration
- **Auto-Issue**: Creates GitHub issue when certificate needs renewal
- **Non-Blocking**: Continues even if check fails

### 📊 Monitoring Summary
- **Purpose**: Provides overall system health dashboard
- **Output**: Summary in GitHub Actions step
- **Status Table**: Shows status of all checks
- **Always Runs**: Even if other jobs fail

## Workflow Improvements (Latest Update)

✅ **Updated Production URL**: Changed from placeholder to `jadecabrera.com`
✅ **Non-Blocking Checks**: Added `continue-on-error` to prevent workflow failures
✅ **Better Error Handling**: SSL and link checks handle errors gracefully
✅ **Rate Limiting**: Link checker won't overwhelm the server
✅ **Lighthouse Config**: Optional configuration for performance budgets
✅ **Robust SSL Check**: Better date parsing and error handling

## Troubleshooting

### All Checks Failing?
1. Verify `PRODUCTION_URL` is set correctly
2. Check if the domain is accessible from GitHub Actions runners
3. Ensure SSL certificate is valid

### Performance Check Failing?
- Check if Lighthouse can access your site
- Verify `lighthouserc.json` exists (optional but recommended)
- Review Lighthouse CI logs in the workflow run

### Broken Links Timing Out?
- The checker now has rate limiting enabled
- External links are excluded by default
- Check if your site has bot protection

### SSL Check Not Working?
- Verify SSL certificate is properly installed
- Check firewall rules allowing port 443
- Manually test: `openssl s_client -servername yourdomain.com -connect yourdomain.com:443`

## Configuration Files

### Required
- `.github/workflows/monitoring-health.yml` - Main workflow file

### Optional
- `lighthouserc.json` - Lighthouse performance budgets and configuration

## Schedule

```yaml
on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:        # Manual trigger
  deployment_status:        # After deployments
```

## Alerts & Notifications

The workflow automatically creates GitHub issues for:
- 🚨 Website downtime
- 🔒 SSL certificate expiration warnings
- 🔗 Broken links (in artifacts, not auto-issue)

## Viewing Results

1. **GitHub Actions**: Check the workflow run for step summaries
2. **Artifacts**: Download link check reports from completed runs
3. **Issues**: Review auto-created issues for critical alerts
4. **Summary Dashboard**: View the monitoring summary at the end of each run

## Best Practices

1. ✅ Keep `PRODUCTION_URL` updated
2. ✅ Review auto-created issues promptly
3. ✅ Download and review link check artifacts periodically
4. ✅ Monitor SSL certificate expiration dates
5. ✅ Adjust cron schedule based on your needs

## Need Help?

- Check [WORKFLOWS_DOCUMENTATION.md](WORKFLOWS_DOCUMENTATION.md#-troubleshooting) for detailed troubleshooting
- Review workflow run logs in GitHub Actions
- Check individual job step summaries for detailed information

---

**Last Updated**: January 2026
**Status**: ✅ All systems configured and running
