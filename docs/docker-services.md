# Docker Services Guide

Run Portfolio V1, Portfolio V2, and Sanity CMS Studio as separate Docker containers.

## Prerequisites

- Docker Desktop or Docker Engine 24+
- Docker Compose v2+

## Quick Start

```bash
# 1. Create environment file
cp .env.docker.example .env.docker
# Edit .env.docker with real values

# 2. Start all services
make up

# 3. Access services
# Portfolio V1:  http://localhost:3001
# Portfolio V2:  http://localhost:3002
# Sanity Studio: http://localhost:3333
```

## Services

| Service | Description | Port | Stack |
|---------|-------------|------|-------|
| **portfolio-v1** | Legacy portfolio | 3001 | Next.js 16 + React 18 |
| **portfolio-v2** | Current portfolio | 3002 | Next.js 16 + React 19 |
| **sanity-studio** | CMS Studio | 3333 | Sanity v4 |

## Commands

### Start Services

```bash
# All services (production)
make up

# All services (development with hot reload)
make up-dev

# Individual services
make up-v1        # Portfolio V1 only
make up-v2        # Portfolio V2 only
make up-studio    # Sanity Studio only
```

### Stop Services

```bash
make down
```

### Build Images

```bash
# All images
make build

# Individual images
make build-v1
make build-v2
make build-studio
```

### View Logs

```bash
# All services
make logs

# Individual services
make logs-v1
make logs-v2
make logs-studio
```

### Check Status

```bash
make ps           # Docker container status
make status       # Health check all services
```

### Restart Services

```bash
make restart          # All services
make restart-v1       # Portfolio V1
make restart-v2       # Portfolio V2
make restart-studio   # Sanity Studio
```

### Cleanup

```bash
make clean       # Remove containers and images
make prune       # Remove unused Docker resources
```

## Development Mode

Development mode mounts source code as volumes for hot reload:

```bash
# Start in development mode
make up-dev

# This starts:
# - portfolio-v1-dev (npm run dev)
# - portfolio-v2-dev (pnpm dev)
# - sanity-studio-dev (sanity dev)
```

## Environment Variables

All services share environment variables from `.env.docker`:

```bash
# Create from template
cp .env.docker.example .env.docker

# Edit with real values
nano .env.docker
```

### Required Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset name |
| `SANITY_API_READ_TOKEN` | Sanity API read token |
| `SANITY_API_WRITE_TOKEN` | Sanity API write token |
| `SANITY_REVALIDATE_SECRET` | ISR revalidation secret |

### Optional Variables

| Variable | Service | Description |
|----------|---------|-------------|
| `GOOGLE_GEMINI_API_KEY` | V1 | Gemini AI chat |
| `ADMIN_API_KEY` | V1 | Admin API access |
| `GITHUB_API_TOKEN` | V2 | GitHub API rate limits |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | V1/V2 | Umami analytics |

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Compose                        │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Portfolio V1 │  │ Portfolio V2 │  │ Sanity Studio│  │
│  │  :3001       │  │  :3002       │  │  :3333       │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         │                  │                │            │
│         └──────────────────┴────────────────┘            │
│                            │                             │
│                    namias network                        │
│                            │                             │
│                    Sanity Cloud API                      │
└─────────────────────────────────────────────────────────┘
```

## Networking

All services communicate over the `namias` Docker bridge network. Services can reference each other by service name:

- `portfolio-v1:3000` (from within the network)
- `portfolio-v2:3000`
- `sanity-studio:3333`

## Troubleshooting

### Port Already in Use

```bash
# Check what's using the port
lsof -i :3001
lsof -i :3002
lsof -i :3333

# Stop conflicting services
make down
```

### Build Failures

```bash
# Rebuild without cache
docker-compose build --no-cache

# Check build logs
docker-compose build portfolio-v1 2>&1 | tail -50
```

### Service Won't Start

```bash
# Check container logs
docker-compose logs portfolio-v1

# Check container status
docker-compose ps -a
```

### Health Check Failures

```bash
# Test health endpoint manually
curl http://localhost:3002/api/health

# Check container health
docker inspect --format='{{.State.Health.Status}}' portfolio-v2
```

### Clean Start

```bash
# Remove everything and start fresh
make clean
make build
make up
```

## Production Deployment

For production, use the individual Dockerfiles with your preferred orchestration:

```bash
# Build production images
docker build -t portfolio-v1:latest ./portfolio-v1
docker build -t portfolio-v2:latest ./portfolio-v2
docker build -t sanity-studio:latest ./portfolio-v1/studio

# Run with docker run
docker run -d -p 3001:3000 --env-file .env.docker portfolio-v1:latest
docker run -d -p 3002:3000 --env-file .env.docker portfolio-v2:latest
docker run -d -p 3333:3333 --env-file .env.docker sanity-studio:latest
```

## Kubernetes

See `portfolio-v2/docs/deployment/docker-k8s.md` for Kubernetes deployment guides.
