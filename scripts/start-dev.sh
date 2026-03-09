#!/usr/bin/env bash
# ZDN — Start development stack (hot reload, MySQL, Nginx)
set -e
cd "$(dirname "$0")/.."

if [[ ! -f .env ]]; then
  echo "Creating .env from .env.development.example"
  cp .env.development.example .env
fi

docker compose -f docker-compose.dev.yml up "$@"
