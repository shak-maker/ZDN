#!/usr/bin/env bash
# ZDN — Start production stack (compose up -d)
set -e
cd "$(dirname "$0")/.."

if [[ ! -f .env ]]; then
  echo "Creating .env from .env.production.example — please edit .env and set secrets."
  cp .env.production.example .env
  echo "Aborting. Edit .env then run: ./scripts/start-production.sh"
  exit 1
fi

docker compose up -d "$@"
echo "Stack started. Frontend/API: http://localhost:${API_PORT:-80}"
