# Multi-stage Docker build for Astro portfolio
# Stage 1: Build stage
FROM node:18-alpine AS builder

# Set build arguments
ARG NODE_VERSION=18
ARG PNPM_VERSION=8

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm@${PNPM_VERSION}

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Stage 2: Production stage
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Install serve for static file serving
RUN npm install -g serve

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["serve", "-s", "dist", "-l", "3000"]

# Add labels for better container management
LABEL maintainer="Kenneth Namias <your-email@example.com>"
LABEL version="1.0"
LABEL description="Astro Portfolio - Containerized static site"
LABEL org.opencontainers.image.source="https://github.com/PP-Namias/Portfolio"
LABEL org.opencontainers.image.licenses="MIT"