#!/usr/bin/env bash
# ZDN — Hardened backend build + deploy (PM2)
#
# Why this exists: a stale TypeScript incremental cache once produced a partial
# `dist/` (missing app.controller.js etc.). The app crashed on boot, PM2 looped
# the restart thousands of times, and the gateway returned 502. This script
# makes that class of failure impossible to ship:
#   1. clean build (no stale cache / leftover artifacts)
#   2. static verification of the compiled output
#   3. PM2 (re)start ONLY if the build is complete
#   4. health check after start, with rollback-friendly failure
#
# Usage:
#   ./scripts/deploy-backend.sh
# Env overrides:
#   APP_NAME (default: zdn-backend)
#   PORT     (default: 3001)
#   SKIP_INSTALL=1   to skip dependency install
set -Eeuo pipefail

APP_NAME="${APP_NAME:-zdn-backend}"
PORT="${PORT:-3001}"
HEALTH_URL="http://localhost:${PORT}/health"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd "$SCRIPT_DIR/../backend" && pwd)"

log()  { printf '\n\033[1;34m==>\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33mWARN:\033[0m %s\n' "$*" >&2; }
fail() { printf '\n\033[1;31mERROR:\033[0m %s\n' "$*" >&2; exit 1; }

cd "$BACKEND_DIR"

if [[ "${SKIP_INSTALL:-0}" != "1" ]]; then
  log "Installing backend dependencies"
  if [[ -f package-lock.json ]]; then
    npm ci --no-audit --no-fund || npm install --no-audit --no-fund
  else
    npm install --no-audit --no-fund
  fi
fi

log "Generating Prisma client"
npx prisma generate

log "Cleaning previous build artifacts (dist + TS incremental cache)"
rm -rf dist
rm -f node_modules/.cache/tsbuildinfo tsconfig.build.tsbuildinfo ./*.tsbuildinfo

log "Building backend"
npm run build

log "Verifying compiled output"
node scripts/verify-build.js dist \
  || fail "Build verification failed — NOT touching the running process."

log "(Re)starting PM2 app: $APP_NAME"
if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
  pm2 reset "$APP_NAME" > /dev/null 2>&1 || true
  pm2 restart "$APP_NAME" --update-env
else
  pm2 start dist/main.js --name "$APP_NAME"
fi

pm2 save > /dev/null 2>&1 || warn "pm2 save failed (process list not persisted)"

log "Health check: $HEALTH_URL"
ok=0
for i in $(seq 1 15); do
  code="$(curl -s -m 5 -o /dev/null -w '%{http_code}' "$HEALTH_URL" || true)"
  if [[ "$code" == "200" ]]; then
    ok=1
    break
  fi
  sleep 2
done

if [[ "$ok" != "1" ]]; then
  warn "Health check did not return 200 after ~30s. Recent logs:"
  pm2 logs "$APP_NAME" --lines 20 --nostream || true
  fail "Deploy completed the build but the service is not healthy. Check logs above."
fi

log "Deploy OK — $APP_NAME is healthy at $HEALTH_URL"
pm2 list
