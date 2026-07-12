# Docker & Kubernetes Deployment Guide

## Prerequisites

- Docker Desktop or Docker Engine 24+
- kubectl 1.31+
- Helm 3.x (for cert-manager)
- Access to GitHub Container Registry (ghcr.io)
- Kubernetes cluster with nginx-ingress and cert-manager

## Quick Start

### Local Development

```bash
# Start development server with hot reload
cd portfolio-v2
docker-compose up dev

# Or use Makefile
make dev
```

### Build Docker Image

```bash
# Build locally
make build

# Build and push
VERSION=$(git rev-parse --short HEAD) make build push

# Run security scan
make scan
```

### Deploy to Kubernetes

```bash
# Apply all manifests
make deploy-staging

# Check status
make status

# View logs
make logs
```

## Architecture

### Docker

Multi-stage build with three stages:

1. **deps**: Install all dependencies
2. **builder**: Run registry build and Next.js build
3. **runner**: Minimal Alpine image with standalone output

Final image includes:
- Node.js 24 Alpine
- Standalone Next.js output
- Public assets
- .next/cache for ISR performance
- Non-root user (nextjs:nodejs)

### Kubernetes

Production-grade deployment with:

- **Namespace**: `namias`
- **Deployment**: 2-10 replicas with rolling updates
- **Service**: ClusterIP on port 80 -> 3000
- **Ingress**: Nginx with TLS via cert-manager
- **HPA**: CPU (70%) and Memory (80%) based scaling
- **PDB**: Minimum 1 pod available during disruptions

## Environment Variables

### Non-sensitive (ConfigMap)

| Variable | Value |
|----------|-------|
| NODE_ENV | production |
| NEXT_PUBLIC_APP_URL | https://namias.tech |
| NEXT_PUBLIC_SANITY_PROJECT_ID | nl0qw78w |
| NEXT_PUBLIC_SANITY_DATASET | production |

### Sensitive (Secret)

| Variable | Description |
|----------|-------------|
| SANITY_API_READ_TOKEN | Sanity API read token |
| SANITY_API_WRITE_TOKEN | Sanity API write token |
| SANITY_REVALIDATE_SECRET | ISR revalidation secret |
| SANITY_DRAFT_SECRET | Draft mode secret |
| GITHUB_API_TOKEN | GitHub API token |

## Secret Management

### Option 1: Sealed Secrets (Recommended for GitOps)

```bash
# Install kubeseal
brew install kubeseal

# Encrypt secret
kubeseal --format yaml < k8s/secret.yaml > k8s/sealed-secret.yaml

# Apply
kubectl apply -f k8s/sealed-secret.yaml
```

### Option 2: Manual Secret Creation

```bash
kubectl create secret generic portfolio-secrets \
  --namespace=namias \
  --from-literal=SANITY_API_READ_TOKEN=xxx \
  --from-literal=SANITY_REVALIDATE_SECRET=yyy \
  --from-literal=SANITY_API_WRITE_TOKEN=zzz
```

### Option 3: External Secrets Operator

Store secrets in AWS SSM, GCP Secret Manager, or Azure Key Vault and sync with External Secrets Operator.

## CI/CD Pipeline

### Workflow Overview

1. **Docker Build** (`docker-build.yml`):
   - Triggers on push to main (portfolio-v2 paths)
   - Builds multi-stage Docker image
   - Pushes to GitHub Container Registry
   - Tags: SHA, branch, latest

2. **K8s Deploy** (`k8s-deploy.yml`):
   - Auto-deploys to staging on successful build
   - Manual trigger for production (requires staging gate)
   - Uses kubectl set image for zero-downtime rolling updates

3. **Docker Scan** (`docker-scan.yml`):
   - Triggers on build completion, PRs, and weekly schedule
   - Runs Trivy vulnerability scanner
   - Fails on CRITICAL/HIGH vulnerabilities
   - Uploads results to GitHub Security tab

### GitHub Secrets Required

| Secret | Description |
|--------|-------------|
| KUBE_CONFIG_STAGING | Base64-encoded kubeconfig for staging |
| KUBE_CONFIG_PRODUCTION | Base64-encoded kubeconfig for production |
| CLOUDFLARE_API_TOKEN | (If using Cloudflare) |

## Operations

### Check Deployment Status

```bash
make status
kubectl get pods -n namias -l app.kubernetes.io/name=portfolio
```

### View Logs

```bash
make logs
kubectl logs -f -l app.kubernetes.io/name=portfolio -n namias
```

### Port Forward to Local

```bash
make port-forward
# Access at http://localhost:3000
```

### Restart Deployment

```bash
make restart
kubectl rollout restart deployment/portfolio -n namias
```

### Rollback

```bash
make rollback
kubectl rollout undo deployment/portfolio -n namias
```

### Scale Manually

```bash
kubectl scale deployment/portfolio --replicas=5 -n namias
```

## Health Checks

### Endpoint

```
GET /api/health
```

### Response

```json
{
  "status": "ok",
  "timestamp": "2026-07-12T11:00:00.000Z",
  "version": "0.1.0",
  "uptime": 12345.678
}
```

### Probe Configuration

| Probe | Initial Delay | Period | Timeout | Failure Threshold |
|-------|---------------|--------|---------|-------------------|
| Liveness | 10s | 30s | 5s | 3 |
| Readiness | 5s | 10s | 5s | 3 |
| Startup | 5s | 5s | - | 30 |

## Troubleshooting

### Pod CrashLoopBackOff

```bash
kubectl logs -n namias <pod-name> --previous
kubectl describe pod -n namias <pod-name>
```

### Image Pull Errors

```bash
kubectl get events -n namias --sort-by='.lastTimestamp'
kubectl get secret -n namias portfolio-secrets -o yaml
```

### Health Check Failures

```bash
kubectl exec -n namias <pod-name> -- wget -qO- http://localhost:3000/api/health
```

### TLS Certificate Issues

```bash
kubectl get certificate -n namias
kubectl describe certificate namias-tls -n namias
kubectl get certificaterequest -n namias
```

## Cleanup

```bash
# Remove all K8s resources
make clean

# Remove Docker images
docker rmi ghcr.io/pp-namias/portfolio-v2:latest
docker rmi ghcr.io/pp-namias/portfolio-v2:$(git rev-parse --short HEAD)
```
