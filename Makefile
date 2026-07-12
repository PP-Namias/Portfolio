.PHONY: help up up-dev down build build-v1 build-v2 build-studio logs ps clean env

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

env: ## Create .env.docker from example
	@test -f .env.docker || (cp .env.docker.example .env.docker && echo "Created .env.docker — edit with real values")

up: env ## Start all services (production mode)
	docker-compose up -d
	@echo ""
	@echo "Services:"
	@echo "  Portfolio V1:  http://localhost:3001"
	@echo "  Portfolio V2:  http://localhost:3002"
	@echo "  Sanity Studio: http://localhost:3333"

up-dev: env ## Start all services (development mode with hot reload)
	docker-compose --profile dev up -d
	@echo ""
	@echo "Dev services started with hot reload"

up-v1: env ## Start Portfolio V1 only
	docker-compose up -d portfolio-v1
	@echo "Portfolio V1: http://localhost:3001"

up-v2: env ## Start Portfolio V2 only
	docker-compose up -d portfolio-v2
	@echo "Portfolio V2: http://localhost:3002"

up-studio: env ## Start Sanity Studio only
	docker-compose up -d sanity-studio
	@echo "Sanity Studio: http://localhost:3333"

down: ## Stop all services
	docker-compose down

build: ## Build all images
	docker-compose build

build-v1: ## Build Portfolio V1 image
	docker-compose build portfolio-v1

build-v2: ## Build Portfolio V2 image
	docker-compose build portfolio-v2

build-studio: ## Build Sanity Studio image
	docker-compose build sanity-studio

logs: ## Tail logs from all services
	docker-compose logs -f

logs-v1: ## Tail Portfolio V1 logs
	docker-compose logs -f portfolio-v1

logs-v2: ## Tail Portfolio V2 logs
	docker-compose logs -f portfolio-v2

logs-studio: ## Tail Sanity Studio logs
	docker-compose logs -f sanity-studio

ps: ## Show running services
	docker-compose ps

status: ## Show service status and health
	@echo "=== Portfolio V1 ==="
	@curl -s http://localhost:3001 > /dev/null && echo "  Status: OK" || echo "  Status: DOWN"
	@echo "=== Portfolio V2 ==="
	@curl -s http://localhost:3002/api/health > /dev/null && echo "  Status: OK" || echo "  Status: DOWN"
	@echo "=== Sanity Studio ==="
	@curl -s http://localhost:3333 > /dev/null && echo "  Status: OK" || echo "  Status: DOWN"

restart: ## Restart all services
	docker-compose restart

restart-v1: ## Restart Portfolio V1
	docker-compose restart portfolio-v1

restart-v2: ## Restart Portfolio V2
	docker-compose restart portfolio-v2

restart-studio: ## Restart Sanity Studio
	docker-compose restart sanity-studio

clean: ## Remove all containers and images
	docker-compose down -rmi local --remove-orphans

prune: ## Remove unused Docker resources
	docker system prune -f
