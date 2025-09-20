# 🔐 GitHub Secrets Setup Guide

This document provides step-by-step instructions for setting up the required GitHub secrets for your CI/CD pipeline automation.

## 🎯 **Quick Setup Checklist**

- [ ] Create Vercel account and project
- [ ] Generate Vercel tokens and IDs  
- [ ] Configure GitHub repository secrets
- [ ] Test deployment pipeline
- [ ] Verify automation works

## 📋 **Required Secrets**

### For Vercel Deployment (Required for CI/CD)
To enable automatic deployment to Vercel through GitHub Actions, configure these three secrets:

### 1. **VERCEL_TOKEN** 🔑
**Purpose**: Authenticates GitHub Actions with your Vercel account

**Steps to get token**:
1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Click **"Create Token"**
3. Name: `Portfolio CI/CD Token`
4. Scope: Select your account/team
5. Expiration: Set to **No expiration** (recommended for CI/CD)
6. Click **"Create"**
7. **Copy the token immediately** (you won't see it again!)

### 2. **VERCEL_ORG_ID** 🏢
**Purpose**: Identifies your Vercel organization/team

**Steps to get Org ID**:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your **team/account name** (top-left)
3. Go to **"Settings"** → **"General"** 
4. Find **"Team ID"** or **"Organization ID"**
5. Copy the ID (format: `team_xxxxxxxxxxxxxx`)

### 3. **VERCEL_PROJECT_ID** 📁
**Purpose**: Identifies your specific portfolio project

**Steps to get Project ID**:
1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your **portfolio project**
3. Go to **"Settings"** tab
4. In **"General"** section, find **"Project ID"**
5. Copy the ID (format: `prj_xxxxxxxxxxxxxx`)

## 🔧 **How to Add Secrets to GitHub**

### Step-by-Step Process:

1. **Navigate to Repository Settings**:
   - Go to your GitHub repository: `https://github.com/PP-Namias/Portfolio`
   - Click the **"Settings"** tab (top menu)

2. **Access Secrets Configuration**:
   - In left sidebar, click **"Secrets and variables"**
   - Select **"Actions"**

3. **Add Each Secret**:
   - Click **"New repository secret"**
   - Enter secret name exactly as shown below
   - Paste the corresponding value
   - Click **"Add secret"**

### Secret Configuration Table:

| Secret Name | Value Source | Example Format |
|-------------|--------------|----------------|
| `VERCEL_TOKEN` | Vercel Account Tokens | `vercel_token_abc123...` |
| `VERCEL_ORG_ID` | Vercel Team Settings | `team_abc123xyz...` |
| `VERCEL_PROJECT_ID` | Vercel Project Settings | `prj_abc123xyz...` |

## 🚀 **Testing Your Setup**

### 1. **Verify Secrets Are Set**:
```bash
# In your repository settings, you should see:
✅ VERCEL_TOKEN - Set (Hidden)
✅ VERCEL_ORG_ID - Set (Hidden) 
✅ VERCEL_PROJECT_ID - Set (Hidden)
```

### 2. **Test the Pipeline**:
1. Make a small change to your code (e.g., update README)
2. Commit and push to main branch:
   ```bash
   git add .
   git commit -m "test: trigger CI/CD pipeline"
   git push origin main
   ```
3. Go to **Actions** tab in GitHub
4. Watch the workflow run and verify deployment succeeds

### 3. **Verify Deployment**:
- Check Vercel dashboard for new deployment
- Visit your live site to confirm changes are live
- Review GitHub Actions logs for any warnings

## 🔒 **Automatic Secrets (Pre-configured)**

These secrets are automatically provided by GitHub Actions:

| Secret | Purpose | Auto-Generated |
|--------|---------|----------------|
| `GITHUB_TOKEN` | GitHub API access | ✅ Yes |
| `GITHUB_ACTOR` | Current user | ✅ Yes |
| `GITHUB_REPOSITORY` | Repo name (owner/repo) | ✅ Yes |
| `GITHUB_REF` | Branch reference | ✅ Yes |

## 🌟 **Deployment Environments**

### Production Environment Protection:
1. Go to **Settings** → **Environments**
2. Create **"production"** environment
3. Add protection rules:
   - ✅ Required reviewers (optional)
   - ✅ Wait timer (optional)
   - ✅ Deployment branches: `main` only

### Environment-Specific Secrets:
```bash
# Production-only secrets (if needed):
PRODUCTION_DATABASE_URL=your_prod_db_url
PRODUCTION_API_KEY=your_prod_api_key
```

## 🚨 **Security Best Practices**

### ✅ **Do's**:
- Use tokens with minimal required permissions
- Set token expiration dates when possible
- Regularly rotate tokens (quarterly)
- Use environment-specific secrets for production
- Monitor token usage in Vercel dashboard

### ❌ **Don'ts**:
- Never commit tokens to code
- Don't share tokens in chat/email
- Avoid overly broad token permissions
- Don't use personal tokens for team projects

## 🔧 **Troubleshooting**

### Common Issues & Solutions:

**1. "Invalid token" error**:
- ✅ Verify token is copied correctly (no extra spaces)
- ✅ Check token hasn't expired
- ✅ Ensure token has deployment permissions

**2. "Project not found" error**:
- ✅ Verify PROJECT_ID is correct
- ✅ Check if project exists in Vercel
- ✅ Ensure ORG_ID matches project's team

**3. "Permission denied" error**:
- ✅ Verify your Vercel account has deployment permissions
- ✅ Check if team settings allow deployments
- ✅ Ensure token scope includes the target team

**4. Deployment succeeds but changes not visible**:
- ✅ Check if deployment went to correct domain
- ✅ Verify browser cache (hard refresh)
- ✅ Check Vercel dashboard for active deployment

## 📞 **Getting Help**

### If you encounter issues:

1. **Check GitHub Actions Logs**:
   - Go to Actions tab → Failed workflow
   - Expand failed steps for detailed error messages

2. **Vercel Deployment Logs**:
   - Check Vercel dashboard → Project → Deployments
   - Review build and function logs

3. **Contact Support**:
   - GitHub Actions: [GitHub Community](https://github.community/)
   - Vercel: [Vercel Help](https://vercel.com/help)

---

## ✅ **Setup Complete Checklist**

Once you've completed setup, verify:

- [ ] All 3 Vercel secrets are configured in GitHub
- [ ] Test deployment pipeline runs successfully  
- [ ] Live site updates when you push to main
- [ ] No errors in GitHub Actions or Vercel logs
- [ ] Environment protection rules are configured
- [ ] Team members have appropriate access levels

**🎉 Congratulations! Your automated deployment pipeline is now active!**

---

> **💡 Pro Tip**: After setup, create a test branch, make a small change, and open a PR to see the full CI/CD pipeline in action, including preview deployments!

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