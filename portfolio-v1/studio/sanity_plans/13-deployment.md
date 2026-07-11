# Deployment Plan

> **Priority:** P3 — Final phase  
> **Status:** Planning

---

## Goal

Deploy the enhanced Sanity Studio to production with zero downtime.

---

## Current State

### What Exists

- ✅ Studio builds successfully
- ✅ All tests pass (381 tests)
- ✅ TypeScript check passes
- ✅ Local development working

---

## Deployment Steps

### Phase 1: Pre-Deployment

1. **Verify Backup**
   - [ ] Data backup complete
   - [ ] Backup verified
   - [ ] Restore tested

2. **Verify Build**
   - [ ] `npx tsc --noEmit` passes
   - [ ] `npx sanity build` succeeds
   - [ ] No warnings or errors

3. **Verify Tests**
   - [ ] `npm run test -- --run` passes
   - [ ] All 381 tests green
   - [ ] No flaky tests

### Phase 2: Deployment

1. **Deploy Studio**
   ```powershell
   cd studio
   npx sanity deploy
   ```

2. **Verify Deployment**
   - [ ] Studio accessible at URL
   - [ ] Login works
   - [ ] All features functional

3. **Test Production**
   - [ ] Presentation tool works
   - [ ] Draft mode works
   - [ ] Content health works
   - [ ] Inspector panels work

### Phase 3: Post-Deployment

1. **Monitor**
   - [ ] Check for errors
   - [ ] Monitor performance
   - [ ] Gather feedback

2. **Document**
   - [ ] Update documentation
   - [ ] Note any issues
   - [ ] Plan follow-up tasks

---

## Deployment Checklist

### Pre-Deployment

- [ ] Backup complete (`data/exports/documents.ndjson`)
- [ ] Backup verified
- [ ] Schema changes tested
- [ ] Migration scripts tested
- [ ] Build passes
- [ ] Tests pass
- [ ] No TypeScript errors
- [ ] No ESLint errors

### Deployment

- [ ] Run `npx sanity deploy`
- [ ] Confirm deployment URL
- [ ] Login to production
- [ ] Verify all features

### Post-Deployment

- [ ] Test Presentation tool
- [ ] Test draft mode
- [ ] Test content health
- [ ] Test inspector panels
- [ ] Test automation
- [ ] Monitor for errors

---

## Rollback Plan

### If Deployment Fails

1. **Check Logs**
   ```powershell
   # Check Sanity CLI output for errors
   ```

2. **Fix Issues**
   - Fix any build errors
   - Fix any deployment errors
   - Re-deploy

3. **Rollback if Needed**
   ```powershell
   # Revert to previous version
   git revert HEAD
   npx sanity deploy
   ```

### If Production Breaks

1. **Immediate Rollback**
   ```powershell
   # Find last working commit
   git log --oneline
   
   # Revert to that commit
   git revert <commit-hash>
   npx sanity deploy
   ```

2. **Investigate**
   - Check error logs
   - Identify root cause
   - Fix issue
   - Re-deploy

---

## Environment Variables

### Required

| Variable | Purpose |
|----------|---------|
| `SANITY_API_READ_TOKEN` | Read content |
| `SANITY_API_WRITE_TOKEN` | Write content |
| `SANITY_REVALIDATE_SECRET` | Revalidation |
| `NEXT_PUBLIC_SITE_URL` | Site URL |

### Optional

| Variable | Purpose |
|----------|---------|
| `SANITY_STUDIO_URL` | Studio URL |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | Public studio URL |

---

## Post-Deployment Verification

### Manual Checks

1. **Login**
   - [ ] Can login to studio
   - [ ] Can access all sections

2. **Content**
   - [ ] Can view all documents
   - [ ] Can edit documents
   - [ ] Can publish documents

3. **Features**
   - [ ] Presentation tool works
   - [ ] Draft mode works
   - [ ] Content health works
   - [ ] Inspector panels work

4. **Performance**
   - [ ] Studio loads quickly
   - [ ] No lag when editing
   - [ ] Publish is fast

### Automated Checks

```powershell
# scripts/verify-production.ps1

# Check studio URL
$studioUrl = "https://namias.sanity.studio"
$response = Invoke-WebRequest -Uri $studioUrl -UseBasicParsing
if ($response.StatusCode -eq 200) {
    Write-Host "Studio accessible: OK"
} else {
    Write-Error "Studio accessible: FAILED"
}

# Check API
$apiUrl = "https://nl0qw78w.api.sanity.io/v2024-01-01/data/production/production"
$response = Invoke-WebRequest -Uri $apiUrl -UseBasicParsing
if ($response.StatusCode -eq 200) {
    Write-Host "API accessible: OK"
} else {
    Write-Error "API accessible: FAILED"
}
```

---

## Commit Strategy

```
plan(sanity): add deployment plan
deploy(sanity): deploy studio to production
verify(sanity): verify production deployment
```
