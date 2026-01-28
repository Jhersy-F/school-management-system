# Multi-stage Dockerfile for Nuxt 4 Application

# Stage 1: Base
FROM node:20-alpine AS base
WORKDIR /app

# Stage 2: Dependencies
FROM base AS deps
# Copy package files
COPY package.json package-lock.json ./
# Install dependencies
RUN npm ci

# Stage 3: Builder
FROM base AS builder
# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
# Copy application code
COPY . .
# Build the application
RUN npm run build

# Stage 4: Runner (Production)
FROM base AS runner
ENV NODE_ENV=production
# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nuxtjs
# Copy built application
COPY --from=builder --chown=nuxtjs:nodejs /app/.output /app/.output
COPY --from=builder --chown=nuxtjs:nodejs /app/package.json /app/package.json
# Switch to non-root user
USER nuxtjs
# Expose port
EXPOSE 3000
# Set host to 0.0.0.0 to allow external connections
ENV HOST=0.0.0.0
ENV PORT=3000
# Start the application
CMD ["node", ".output/server/index.mjs"]
