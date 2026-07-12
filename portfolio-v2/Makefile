.PHONY: help build push scan deploy-staging deploy-prod status logs port-forward clean

REGISTRY ?= ghcr.io
IMAGE ?= pp-namias/portfolio-v2
VERSION ?= $(shell git rev-parse --short HEAD)
NAMESPACE ?= namias

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

build: ## Build Docker image
	cd portfolio-v2 && docker build -t $(REGISTRY)/$(IMAGE):$(VERSION) -t $(REGISTRY)/$(IMAGE):latest .

push: ## Push Docker image to registry
	docker push $(REGISTRY)/$(IMAGE):$(VERSION)
	docker push $(REGISTRY)/$(IMAGE):latest

scan: ## Run Trivy security scan
	docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image --severity HIGH,CRITICAL $(REGISTRY)/$(IMAGE):$(VERSION)

dev: ## Start local development with docker-compose
	cd portfolio-v2 && docker-compose up dev

up: ## Start production container locally
	cd portfolio-v2 && docker-compose up portfolio -d

down: ## Stop all containers
	cd portfolio-v2 && docker-compose down

deploy-staging: ## Deploy to staging cluster
	kubectl apply -f portfolio-v2/k8s/namespace.yaml
	kubectl apply -f portfolio-v2/k8s/configmap.yaml
	kubectl apply -f portfolio-v2/k8s/secret.yaml
	kubectl apply -f portfolio-v2/k8s/deployment.yaml
	kubectl apply -f portfolio-v2/k8s/service.yaml
	kubectl apply -f portfolio-v2/k8s/ingress.yaml
	kubectl apply -f portfolio-v2/k8s/hpa.yaml
	kubectl apply -f portfolio-v2/k8s/pdb.yaml
	kubectl rollout status deployment/portfolio -n $(NAMESPACE)

deploy-prod: ## Deploy to production cluster
	$(MAKE) deploy-staging NAMESPACE=$(NAMESPACE)

status: ## Show Kubernetes resources
	kubectl get all -n $(NAMESPACE)

logs: ## Tail portfolio logs
	kubectl logs -f -l app.kubernetes.io/name=portfolio -n $(NAMESPACE) --all-containers

port-forward: ## Port-forward to local machine
	kubectl port-forward svc/portfolio 3000:80 -n $(NAMESPACE)

describe: ## Describe deployment
	kubectl describe deployment/portfolio -n $(NAMESPACE)

restart: ## Restart deployment
	kubectl rollout restart deployment/portfolio -n $(NAMESPACE)

rollback: ## Rollback to previous version
	kubectl rollout undo deployment/portfolio -n $(NAMESPACE)

clean: ## Remove all Kubernetes resources
	kubectl delete namespace $(NAMESPACE) --ignore-not-found

test: ## Test health endpoint
	curl -s http://localhost:3000/api/health | jq .
