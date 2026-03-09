# ZDN Measurement Reports — Deployment Guide

## Recommended project folder structure

```
ZDN/
├── backend/                 # NestJS API
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── package.json
├── frontend/                 # React + Vite
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── nginx.conf            # SPA config inside frontend image
│   ├── .dockerignore
│   └── package.json
├── docker/
│   ├── nginx.conf            # Production reverse proxy
│   ├── nginx-dev.conf        # Development proxy (Vite + backend)
│   └── mysql-production.cnf  # MySQL production tuning
├── docs/
│   └── DEPLOYMENT.md
├── docker-compose.yml        # Production
├── docker-compose.dev.yml    # Development (hot reload)
├── .env.example
├── .env.production.example
├── .env.development.example
├── .dockerignore
└── package.json              # Monorepo root
```

---

## Production deployment

### 1. Prerequisites

- Docker Engine 24+ and Docker Compose v2
- Server with at least 2 GB RAM; 4 GB recommended for MySQL + app

### 2. Clone and configure

```bash
cd /opt/zdn  # or your deploy path
git clone <repo> .
cp .env.production.example .env
# Edit .env: set MYSQL_* passwords, JWT_SECRET, API_KEY_SECRET, FRONTEND_URL
```

### 3. Secrets (never commit)

- `MYSQL_ROOT_PASSWORD`, `MYSQL_PASSWORD`: strong random passwords
- `JWT_SECRET`, `API_KEY_SECRET`: min 32 characters (e.g. `openssl rand -base64 32`)

### 4. Build and run

```bash
docker compose build --no-cache   # first time or when Dockerfile/deps change
docker compose up -d
```

### 5. Verify

- Frontend: `http://<server>:80`
- API: `http://<server>/api/...`
- Health: `http://<server>/api/health` (or `/health` depending on app routes)

### 6. HTTPS (recommended)

**Option A — Compose with TLS:**

```bash
mkdir -p docker/ssl
# Copy your certs (e.g. from Let's Encrypt) into docker/ssl:
#   fullchain.pem, privkey.pem
docker compose -f docker-compose.yml -f docker-compose.https.yml up -d
```

Nginx will listen on 80 (redirect to HTTPS) and 443. Config: `docker/nginx-https.conf`.

**Option B — External terminator:** Put Nginx, Traefik, or Caddy in front of the stack and terminate TLS there; set `FRONTEND_URL=https://your-domain.com` and ensure `X-Forwarded-Proto` is set.

### 7. Updates

```bash
git pull
docker compose build
docker compose up -d
# Migrations run automatically on backend startup (prisma migrate deploy)
```

---

## Development

### Option A: Docker (MySQL + hot reload)

```bash
cp .env.development.example .env
docker compose -f docker-compose.dev.yml up
```

- Frontend (Vite): http://localhost:5173  
- Backend (NestJS): http://localhost:3001  
- Via Nginx: http://localhost (proxies /api to backend, / to frontend:5173)

### Option B: Local (no Docker)

- **Backend:** SQLite  
  - In `backend/.env`: `DATABASE_URL=file:./prisma/dev.db`  
  - `cd backend && npx prisma migrate dev && npm run start:dev`
- **Frontend:** `cd frontend && npm run dev`  
  - Set `VITE_API_URL=http://localhost:3001/api` if calling backend directly

---

## Improvements made

| Area | Change | Why |
|------|--------|-----|
| **Dockerfiles** | Multi-stage (deps → builder → runner) | Smaller images; deps layer cached; only production artifacts in final stage |
| **Dockerfiles** | Node 20 Alpine | Smaller base; LTS |
| **Dockerfiles** | Non-root user (backend: `app`, frontend: `nginx`) | Security best practice |
| **Backend** | `npm ci --omit=dev` in runner | No devDependencies in production image |
| **Backend** | Copy only `.prisma` from builder | Prisma client generated at build time |
| **Compose** | Separate `public` and `internal` networks | Only Nginx exposed; backend/MySQL/frontend on internal network |
| **Compose** | Health checks (MySQL, backend) | Proper startup order; restarts if unhealthy |
| **Compose** | MySQL config file | Production-safe charset and connection settings |
| **Nginx** | Gzip, static caching, security headers | Performance and security |
| **Nginx** | `client_max_body_size 50M` | Large file uploads |
| **Env** | `.env.example` + production/development templates | Clear split; secrets not in repo |
| **.dockerignore** | Root + package-level | Faster builds; no secrets in context |

---

## Troubleshooting

- **Backend won’t start:** Check `DATABASE_URL` and that MySQL is healthy: `docker compose ps`
- **502 from Nginx:** Ensure backend is healthy: `docker compose logs backend`
- **Migrations:** Run automatically on backend start; for manual: `docker compose run --rm backend npx prisma migrate deploy`

### Graceful shutdown

NestJS can handle SIGTERM (e.g. from `docker stop`) if shutdown hooks are enabled. In `backend/src/main.ts`, after `app.listen()`:

```ts
app.enableShutdownHooks();
```

Then on SIGTERM the app closes connections and exits cleanly.
