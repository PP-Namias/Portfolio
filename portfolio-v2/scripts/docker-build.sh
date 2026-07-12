#!/bin/sh
set -e

REGISTRY="${DOCKER_REGISTRY:-ghcr.io}"
IMAGE_NAME="${DOCKER_IMAGE:-pp-namias/portfolio-v2}"
VERSION="${VERSION:-$(git rev-parse --short HEAD)}"
FULL_TAG="${REGISTRY}/${IMAGE_NAME}:${VERSION}"
LATEST_TAG="${REGISTRY}/${IMAGE_NAME}:latest"

echo "Building Docker image..."
echo "  Registry: ${REGISTRY}"
echo "  Image: ${IMAGE_NAME}"
echo "  Version: ${VERSION}"
echo ""

docker build \
  --tag "${FULL_TAG}" \
  --tag "${LATEST_TAG}" \
  --label "org.opencontainers.image.source=https://github.com/PP-Namias/Portfolio" \
  --label "org.opencontainers.image.revision=$(git rev-parse HEAD)" \
  --label "org.opencontainers.image.version=${VERSION}" \
  .

echo ""
echo "Build complete: ${FULL_TAG}"
echo ""

if [ "${PUSH:-false}" = "true" ]; then
  echo "Pushing to registry..."
  docker push "${FULL_TAG}"
  docker push "${LATEST_TAG}"
  echo "Push complete."
fi

if [ "${SCAN:-false}" = "true" ]; then
  echo "Running Trivy scan..."
  docker run --rm \
    -v /var/run/docker.sock:/var/run/docker.sock \
    aquasec/trivy image \
    --severity HIGH,CRITICAL \
    --exit-code 1 \
    "${FULL_TAG}"
  echo "Scan complete."
fi

echo ""
echo "Done. Image: ${FULL_TAG}"
