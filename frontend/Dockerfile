# =============================================================================
# Stage 1: Dependencies (cached unless package*.json change)
# =============================================================================
FROM node:20-alpine AS deps
WORKDIR /app

# Install only dependencies for better layer caching
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

# =============================================================================
# Stage 2: Builder (Vite build)
# =============================================================================
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time API URL: same-origin /api (reverse proxy will route to backend)
ARG VITE_API_URL=
ENV VITE_API_URL=${VITE_API_URL}

# Reproducible build: disable telemetry, use exact versions
ENV npm_config_update_notifier=false \
    npm_config_audit=false

RUN npm run build

# =============================================================================
# Stage 3: Production runner (nginx, non-root)
# =============================================================================
FROM nginx:1.27-alpine AS runner

# Create non-root user for nginx (Alpine uses nginx user by default; we lock it down)
RUN chown -R nginx:nginx /var/cache/nginx /var/log/nginx /etc/nginx/conf.d \
    && touch /var/run/nginx.pid \
    && chown nginx:nginx /var/run/nginx.pid

# Remove default content and copy our build
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

# SPA config: try_files for client-side routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Switch to non-root (nginx user in Alpine)
USER nginx

EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
