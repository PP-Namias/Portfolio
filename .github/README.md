# 🚀 GitHub Actions CI/CD Pipeline Documentation

This repository includes a comprehensive GitHub Actions setup for automated code quality checking, deployment, logging, and error handling.

## 📋 Overview

The CI/CD pipeline consists of multiple workflows designed to ensure code quality, automate deployments, and maintain system health:

### 🔄 Main Workflows

1. **[ci-cd-pipeline.yml](.github/workflows/ci-cd-pipeline.yml)** - Complete CI/CD pipeline
2. **[quality-check.yml](.github/workflows/quality-check.yml)** - Fast quality checks for PRs
3. **[daily-health-check.yml](.github/workflows/daily-health-check.yml)** - Daily system health monitoring
4. **[dependency-updates.yml](.github/workflows/dependency-updates.yml)** - Automated dependency management

## 🏗️ Main CI/CD Pipeline Features

### 🔍 Code Quality Checks
- **Biome CI**: Linting, formatting, and import sorting
- **TypeScript**: Type checking with Astro
- **Security**: Automated security audits
- **Dependencies**: Outdated package detection

### 🏗️ Build & Test
- **Astro Build**: Static site generation
- **Pagefind**: Search index generation
- **Artifact Upload**: Build artifacts for deployment
- **Performance Metrics**: Build time tracking

### 📊 Commit Analytics & Logging
- **Commit Tracking**: Detailed commit history logging
- **File Change Analysis**: Modified files tracking
- **Contributor Statistics**: Development metrics
- **Automated Reports**: Generated summaries in GitHub

### 🚀 Deployment
- **Production Deployment**: Automated deployment to Vercel
- **Environment Protection**: Production environment controls
- **Deployment Logging**: Complete deployment history
- **Rollback Support**: Artifact-based rollback capability

### 🚨 Error Handling
- **Automatic Issue Creation**: Failed pipeline notifications
- **Error Logging**: Detailed error tracking
- **Debugging Information**: Complete failure context
- **Alert Management**: Automated issue labeling

### ✅ Success Management
- **Success Reporting**: Pipeline completion summaries
- **Artifact Cleanup**: Automated old artifact removal
- **Performance Tracking**: Pipeline duration metrics

## 🔧 Required Secrets

To use the full pipeline, configure these secrets in your repository:

```bash
# Vercel Deployment (Optional - for auto-deployment)
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id

# GitHub Token (Automatically provided)
GITHUB_TOKEN=automatically_provided_by_github
```

## 📝 Available Scripts

The following npm scripts are available for local development and CI:

```json
{
  "scripts": {
    "dev": "astro dev",                    // Start development server
    "build": "astro build && pagefind --site dist",  // Build for production
    "astro:check": "astro check",          // Type checking
    "biome:ci": "biome ci ./src --reporter=github",  // CI quality checks
    "biome:check": "biome check ./src",    // Local quality checks
    "biome:format": "biome format --write ./src",    // Format code
    "ci:quality": "pnpm run biome:ci && pnpm run astro:check", // Full quality check
    "ci:build": "pnpm run ci:quality && pnpm run build"        // Full CI build
  }
}
```

## 🔄 Workflow Triggers

### Main CI/CD Pipeline
- **Push to main/develop**: Full pipeline execution
- **Pull Requests to main**: Code quality and build checks
- **Manual Trigger**: Via GitHub Actions UI

### Quality Check
- **All Push Events**: Quick quality verification
- **All Pull Requests**: PR validation

### Daily Health Check
- **Schedule**: Daily at 6 AM UTC
- **Manual Trigger**: Via GitHub Actions UI

### Dependency Updates
- **Schedule**: Weekly on Mondays at 9 AM UTC
- **Manual Trigger**: Via GitHub Actions UI

## 📊 Logging and Monitoring

### 📈 Automated Logging
- **Commit History**: Detailed commit tracking with file changes
- **Deployment History**: Complete deployment records
- **Error History**: Failed pipeline debugging information
- **Success History**: Successful pipeline completion logs

### 📋 Generated Reports
- **Code Quality Reports**: Biome check results and metrics
- **Build Reports**: Build status, timing, and artifacts
- **Security Reports**: Vulnerability scans and audit results
- **Deployment Reports**: Deploy URLs, timing, and status

### 🚨 Error Handling
- **Automatic Issue Creation**: Failed pipelines create GitHub issues
- **Detailed Error Context**: Complete debugging information
- **Alert Labels**: Categorized issue labeling for easy management
- **Artifact Preservation**: Error logs saved for investigation

## 🎯 Best Practices

### 🔍 Code Quality
1. **Pre-commit Hooks**: Run `pnpm run ci:quality` before committing
2. **Local Testing**: Use `pnpm run ci:build` to test full pipeline locally
3. **Incremental Commits**: Small, focused commits for better tracking

### 🚀 Deployment
1. **Branch Protection**: Use branch protection rules for main
2. **Review Process**: Require PR reviews before merging
3. **Environment Variables**: Keep sensitive data in secrets

### 📊 Monitoring
1. **Daily Checks**: Monitor daily health check results
2. **Dependency Updates**: Review weekly dependency update PRs
3. **Error Tracking**: Address pipeline failures promptly

## 🔧 Customization

### Adding New Quality Checks
Edit `.github/workflows/ci-cd-pipeline.yml` and add steps to the `code-quality` job:

```yaml
- name: 🔍 Custom Quality Check
  run: |
    echo "Running custom quality check..."
    # Add your custom commands here
```

### Modifying Deployment
Update the `deploy-production` job to change deployment targets:

```yaml
- name: 🚀 Deploy to Custom Platform
  run: |
    echo "Deploying to custom platform..."
    # Add your deployment commands here
```

### Custom Notifications
Modify the error-handling job to add custom notification methods:

```yaml
- name: 📧 Send Custom Notification
  run: |
    echo "Sending custom notification..."
    # Add your notification logic here
```

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Biome Documentation](https://biomejs.dev/)
- [Astro Documentation](https://docs.astro.build/)
- [Vercel Deployment Documentation](https://vercel.com/docs)

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**: Check Astro and TypeScript errors in logs
2. **Quality Check Failures**: Run `pnpm run biome:ci` locally
3. **Deployment Failures**: Verify Vercel secrets are configured
4. **Permission Issues**: Ensure GitHub token has sufficient permissions

### Debug Commands

```bash
# Local quality check
pnpm run ci:quality

# Local build test
pnpm run ci:build

# Check outdated dependencies
pnpm outdated

# Security audit
pnpm audit
```

---

> **Note**: This pipeline is designed to maintain high code quality standards while providing comprehensive logging and monitoring. All workflows include detailed error handling and automatic issue creation for failed runs.