.PHONY: help up up-dev down build build-v1 build-v2 build-studio logs ps status restart clean

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

env: ## Create .env.docker from example
	@test -f .env.docker || (cp .env.docker.example .env.docker && echo "Created .env.docker — edit with real values")

# ═══════════════════════════════════════════════════════════════
# Start Services
# ═══════════════════════════════════════════════════════════════

up: env ## Start all services
	docker-compose up -d
	@echo ""
	@echo "All services started:"
	@echo "  Portfolio V1:  http://localhost:3001"
	@echo "  Portfolio V2:  http://localhost:3002"
	@echo "  Sanity Studio: http://localhost:3333"

up-dev: env ## Start all services (dev mode with hot reload)
	docker-compose --profile dev up -d
	@echo ""
	@echo "Dev services started with hot reload"

up-v1: env ## Start Portfolio V1 ONLY (independent)
	docker-compose up -d portfolio-v1
	@echo "Portfolio V1 started: http://localhost:3001"

up-v2: env ## Start Portfolio V2 ONLY (independent)
	docker-compose up -d portfolio-v2
	@echo "Portfolio V2 started: http://localhost:3002"

up-studio: env ## Start Sanity Studio ONLY (independent)
	docker-compose up -d sanity-studio
	@echo "Sanity Studio started: http://localhost:3333"

# ═══════════════════════════════════════════════════════════════
# Stop Services
# ═══════════════════════════════════════════════════════════════

down: ## Stop all services
	docker-compose down

down-v1: ## Stop Portfolio V1 ONLY
	docker-compose stop portfolio-v1

down-v2: ## Stop Portfolio V2 ONLY
	docker-compose stop portfolio-v2

down-studio: ## Stop Sanity Studio ONLY
	docker-compose stop sanity-studio

# ═══════════════════════════════════════════════════════════════
# Build Images
# ═══════════════════════════════════════════════════════════════

build: ## Build all images
	docker-compose build

build-v1: ## Build Portfolio V1 image
	docker-compose build portfolio-v1

build-v2: ## Build Portfolio V2 image
	docker-compose build portfolio-v2

build-studio: ## Build Sanity Studio image
	docker-compose build sanity-studio

# ═══════════════════════════════════════════════════════════════
# View Logs
# ═══════════════════════════════════════════════════════════════

logs: ## Tail logs from all services
	docker-compose logs -f

logs-v1: ## Tail Portfolio V1 logs
	docker-compose logs -f portfolio-v1

logs-v2: ## Tail Portfolio V2 logs
	docker-compose logs -f portfolio-v2

logs-studio: ## Tail Sanity Studio logs
	docker-compose logs -f sanity-studio

# ═══════════════════════════════════════════════════════════════
# Status & Health
# ═══════════════════════════════════════════════════════════════

ps: ## Show running containers
	docker-compose ps

status: ## Check health of all services
	@echo "=== Portfolio V1 (port 3001) ==="
	@docker inspect --format='{{.State.Health.Status}}' namias-v1 2>/dev/null || echo "  Not running"
	@echo "=== Portfolio V2 (port 3002) ==="
	@docker inspect --format='{{.State.Health.Status}}' namias-v2 2>/dev/null || echo "  Not running"
	@echo "=== Sanity Studio (port 3333) ==="
	@docker inspect --format='{{.State.Health.Status}}' namias-studio 2>/dev/null || echo "  Not running"

# ═══════════════════════════════════════════════════════════════
# Restart Services
# ═══════════════════════════════════════════════════════════════

restart: ## Restart all services
	docker-compose restart

restart-v1: ## Restart Portfolio V1 ONLY
	docker-compose restart portfolio-v1

restart-v2: ## Restart Portfolio V2 ONLY
	docker-compose restart portfolio-v2

restart-studio: ## Restart Sanity Studio ONLY
	docker-compose restart sanity-studio

# ═══════════════════════════════════════════════════════════════
# Cleanup
# ═══════════════════════════════════════════════════════════════

clean: ## Remove all containers, images, and networks
	docker-compose down -rmi local --remove-orphans

prune: ## Remove unused Docker resources
	docker system prune -f
