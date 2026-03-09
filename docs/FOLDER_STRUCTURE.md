# ZDN — Recommended Project Folder Structure

This document describes the deployment-oriented layout for the ZDN Measurement Reports monorepo.

```
ZDN/
├── backend/                    # NestJS 11 API
│   ├── prisma/
│   │   ├── schema.prisma       # MySQL schema
│   │   ├── migrations/         # Versioned migrations
│   │   └── seed.ts             # Optional seed
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── controllers/
│   │   ├── services/
│   │   └── ...
│   ├── Dockerfile              # Multi-stage production build
│   ├── .dockerignore
│   └── package.json
│
├── frontend/                   # React 19 + Vite
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   ├── Dockerfile              # Multi-stage: build → nginx
│   ├── nginx.conf              # SPA config inside image
│   ├── .dockerignore
│   └── package.json
│
├── docker/                     # Shared Docker / runtime config
│   ├── nginx.conf              # Production reverse proxy
│   ├── nginx-dev.conf          # Dev proxy (Vite + backend)
│   └── mysql-production.cnf   # MySQL 8 production tuning
│
├── docs/
│   ├── DEPLOYMENT.md           # Deployment and runbook
│   └── FOLDER_STRUCTURE.md     # This file
│
├── docker-compose.yml          # Production stack
├── docker-compose.dev.yml      # Development stack (hot reload)
├── .env.example                # Env template
├── .env.production.example
├── .env.development.example
├── .dockerignore               # Root build context
└── package.json                # Monorepo root (workspaces)
```

## Notes

- **Secrets:** Never commit `.env`; use `.env.example` and `.env.*.example` as templates.
- **Docker:** Build context is per-service (`./backend`, `./frontend`); root `.dockerignore` applies when using the repo root in compose.
- **Networks (production):** Only the `nginx` service is on the public network and exposes ports; `backend`, `frontend`, and `mysql` are on an internal network.
