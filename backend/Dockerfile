# =============================================================================
# Stage 1: Dependencies (cached unless package*.json change)
# =============================================================================
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

# =============================================================================
# Stage 2: Builder (compile + Prisma generate)
# =============================================================================
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV npm_config_update_notifier=false \
    npm_config_audit=false

# Build NestJS and generate Prisma client (needed for runtime)
RUN npm run build && npx prisma generate

# =============================================================================
# Stage 3: Production runner (runtime deps only, non-root)
# =============================================================================
FROM node:20-alpine AS runner

# Create non-root user
RUN addgroup -g 1001 -S app && adduser -S app -u 1001 -G app

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3001

# Copy only production dependencies (smaller image, no devDependencies)
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Copy built app and Prisma artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# Persistent uploads directory (mounted as volume in docker-compose)
RUN mkdir -p /app/uploads && chown app:app /app/uploads

# Optional: tune Node for containers (override via env in compose)
ENV NODE_OPTIONS="--max-old-space-size=256"

USER app

EXPOSE 3001

# Health check (optional; compose can override)
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://127.0.0.1:3001/health/live', (r) => { r.resume(); r.on('end', () => process.exit(r.statusCode === 200 ? 0 : 1)); }).on('error', () => process.exit(1))"

# Migrations run via compose command; app entrypoint
CMD ["node", "dist/main.js"]
