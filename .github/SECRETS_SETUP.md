# 🔐 GitHub Secrets Setup Guide

This document provides instructions for setting up the required GitHub secrets for the CI/CD pipeline.

## Required Secrets

### For Vercel Deployment (Optional)
If you want to enable automatic deployment to Vercel, you'll need to set up these secrets:

1. **VERCEL_TOKEN**
   - Go to [Vercel Account Settings](https://vercel.com/account/tokens)
   - Create a new token
   - Copy the token value

2. **VERCEL_ORG_ID**
   - Go to your Vercel team settings
   - Find your Team ID or Organization ID
   - Copy the ID value

3. **VERCEL_PROJECT_ID**
   - Go to your project settings in Vercel
   - Find the Project ID in the General tab
   - Copy the project ID

## How to Add Secrets

1. Go to your GitHub repository
2. Click on **Settings** tab
3. Navigate to **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add each secret with the corresponding name and value

## Secret Configuration

```bash
# Repository Secrets to Configure:
VERCEL_TOKEN=your_vercel_token_here
VERCEL_ORG_ID=your_vercel_org_id_here  
VERCEL_PROJECT_ID=your_vercel_project_id_here
```

## Automatic Secrets

These secrets are automatically provided by GitHub Actions:

- **GITHUB_TOKEN**: Automatically provided for GitHub API access
- **GITHUB_ACTOR**: Current user triggering the workflow
- **GITHUB_REPOSITORY**: Repository name in format owner/repo

## Deployment Environments

The CI/CD pipeline uses GitHub Environments for production deployment protection:

1. Go to **Settings** → **Environments**
2. Create a new environment named `production`
3. Configure protection rules:
   - Required reviewers (optional)
   - Wait timer (optional)
   - Deployment branches (recommend: main branch only)

## Testing Without Deployment

If you don't want to set up Vercel deployment immediately:

1. The pipeline will skip deployment steps if secrets are not configured
2. All other features (code quality, build, testing) will work normally
3. You can add deployment secrets later when ready

## Security Best Practices

- Never commit secrets to your repository
- Use environment-specific secrets for different deployment targets
- Regularly rotate API tokens and access keys
- Monitor secret usage in Actions logs
- Use GitHub's secret scanning features

## Troubleshooting

### Common Issues

1. **Deployment fails with authentication error**
   - Verify Vercel token is valid and has correct permissions
   - Check if token has expired

2. **Wrong project deployment**
   - Ensure VERCEL_PROJECT_ID matches your intended project
   - Verify VERCEL_ORG_ID is correct for your team/account

3. **Permissions errors**
   - Ensure the Vercel token has deployment permissions
   - Check if GitHub Actions has necessary repository permissions

### Testing Secrets

You can test if secrets are configured correctly by:

1. Running the workflow manually
2. Checking the workflow logs for authentication steps
3. Verifying deployment URLs in successful runs

---

> **Note**: The CI/CD pipeline is designed to work with or without deployment secrets. Core functionality (code quality, building, testing) will work regardless of deployment configuration.