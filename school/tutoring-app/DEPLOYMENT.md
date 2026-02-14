# LionLearn — Deployment Guide

Production deployment using **Docker Compose** with PostgreSQL.

---

## Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| Docker | 24+ | `docker --version` |
| Docker Compose | v2+ | `docker compose version` |
| Git | any | `git --version` |

A server with at least **1 GB RAM** and **10 GB disk** (any cheap VPS works — Hetzner, DigitalOcean, OVH, Contabo).

---

## 1. First-Time Installation

### 1.1 Clone the repository

```bash
git clone https://github.com/YOUR_ORG/lionlearn.git
cd lionlearn
```

### 1.2 Configure environment

```bash
cp .env.production.example .env
```

Edit `.env` with your values:

```bash
nano .env
```

| Variable | Description | Example |
|----------|-------------|---------|
| `POSTGRES_PASSWORD` | **Required.** Strong database password | `kX9#mP2$vL7nQ4` |
| `AUTH_SECRET` | **Required.** Generate with `openssl rand -hex 32` | `a2cdb903...` |
| `AUTH_URL` | **Required.** Your public URL | `https://learn.yourdomain.com` |
| `GEMINI_API_KEY` | **Required.** From [AI Studio](https://aistudio.google.com/apikey) | `AIzaSy...` |
| `POSTGRES_USER` | Database user (default: `lionlearn`) | `lionlearn` |
| `POSTGRES_DB` | Database name (default: `lionlearn`) | `lionlearn` |
| `APP_PORT` | Host port (default: `3000`) | `3000` |

### 1.3 Build and start

```bash
docker compose up -d --build
```

This will:
1. Pull PostgreSQL 16
2. Build the Next.js application image
3. Run database migrations automatically (via entrypoint)
4. Start the app on port 3000

### 1.4 Seed the database (first time only)

```bash
docker compose exec app node seed.js
```

> The seed creates demo accounts and loads course materials from `/app/course-materials/`.

### 1.5 Verify

```bash
# Check services are running
docker compose ps

# Check app logs
docker compose logs app --tail 50

# Check database is healthy
docker compose exec db pg_isready -U lionlearn
```

Visit `http://your-server-ip:3000` (or your domain).

**Demo accounts:**
- Student: `etudiant@uit.cm` / `student123`
- Admin: `admin@lionai.com` / `admin123`

---

## 2. Updating (Deploy New Code)

```bash
# Pull latest code
git pull origin main

# Rebuild and restart (zero-downtime with --no-deps)
docker compose up -d --build app

# If schema changed, migrations run automatically via entrypoint.
# To force a fresh migration push:
docker compose exec app npx prisma db push --skip-generate
```

**Quick one-liner:**
```bash
git pull && docker compose up -d --build app
```

---

## 3. Backup

### 3.1 Database backup

```bash
# Create a compressed SQL dump
docker compose exec db pg_dump -U lionlearn lionlearn | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

### 3.2 Automated daily backups (cron)

```bash
# Edit crontab
crontab -e

# Add this line (runs daily at 2 AM, keeps backups in ~/backups/)
0 2 * * * mkdir -p ~/backups && docker compose -f /path/to/lionlearn/docker-compose.yml exec -T db pg_dump -U lionlearn lionlearn | gzip > ~/backups/lionlearn_$(date +\%Y\%m\%d).sql.gz
```

### 3.3 Restore from backup

```bash
# Stop the app (keep DB running)
docker compose stop app

# Drop and recreate the database
docker compose exec db psql -U lionlearn -c "DROP DATABASE IF EXISTS lionlearn;"
docker compose exec db psql -U lionlearn -c "CREATE DATABASE lionlearn;"

# Restore
gunzip -c backup_20260214_020000.sql.gz | docker compose exec -T db psql -U lionlearn lionlearn

# Restart everything
docker compose up -d
```

---

## 4. Wipe Out (Full Reset)

### 4.1 Reset database only (keep Docker images)

```bash
# Stop everything
docker compose down

# Delete the PostgreSQL data volume
docker volume rm $(docker compose config --volumes | head -1) 2>/dev/null || docker volume prune -f

# Start fresh
docker compose up -d

# Wait for DB to be ready, then re-seed
sleep 5
docker compose exec app node seed.js
```

### 4.2 Full nuclear reset (everything)

```bash
# Stop and remove containers, networks, volumes, AND images
docker compose down -v --rmi all

# Rebuild from scratch
docker compose up -d --build

# Re-seed
sleep 10
docker compose exec app node seed.js
```

---

## 5. Redeploying (Different Server)

### 5.1 On the old server — export

```bash
# Backup database
docker compose exec db pg_dump -U lionlearn lionlearn | gzip > lionlearn_migration.sql.gz

# Save your .env
cp .env env_backup.txt
```

### 5.2 On the new server — import

```bash
# Clone repo
git clone https://github.com/YOUR_ORG/lionlearn.git
cd lionlearn

# Restore .env
cp /path/to/env_backup.txt .env

# Start services
docker compose up -d --build

# Wait for DB
sleep 10

# Restore data
gunzip -c lionlearn_migration.sql.gz | docker compose exec -T db psql -U lionlearn lionlearn
```

---

## 6. Useful Commands

| Action | Command |
|--------|---------|
| View live logs | `docker compose logs -f app` |
| View DB logs | `docker compose logs -f db` |
| Open DB shell | `docker compose exec db psql -U lionlearn lionlearn` |
| Run Prisma Studio | `docker compose exec app npx prisma studio` |
| Check disk usage | `docker system df` |
| Restart app only | `docker compose restart app` |
| Stop everything | `docker compose stop` |
| Remove stopped containers | `docker compose down` |
| Re-seed database | `docker compose exec app node seed.js` |

---

## 7. Reverse Proxy (HTTPS with Nginx)

For production, put Nginx + Let's Encrypt in front of the app.

### 7.1 Install Nginx + Certbot

```bash
sudo apt update && sudo apt install -y nginx certbot python3-certbot-nginx
```

### 7.2 Nginx config

Create `/etc/nginx/sites-available/lionlearn`:

```nginx
server {
    server_name learn.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Allow large file uploads (course materials)
        client_max_body_size 50M;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/lionlearn /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 7.3 SSL certificate

```bash
sudo certbot --nginx -d learn.yourdomain.com
```

Update your `.env`:
```
AUTH_URL=https://learn.yourdomain.com
```

Then restart:
```bash
docker compose restart app
```

---

## 8. Domain Name

To buy a `.cm` domain (Cameroon):
- [Camtel](https://www.camtel.cm) — official registrar
- [Namecheap](https://www.namecheap.com) — international, supports many TLDs
- [Gandi](https://www.gandi.net) — supports `.cm`

Point your domain's **A record** to your server's IP address, then set up HTTPS as shown above.

---

## Architecture Overview

```
┌─────────────────────────────────────────┐
│              Your Server                │
│                                         │
│  ┌──────────────┐   ┌───────────────┐   │
│  │ Nginx (443)  │──▶│ LionLearn App │   │
│  │ + SSL/HTTPS  │   │ (port 3000)   │   │
│  └──────────────┘   └───────┬───────┘   │
│                             │           │
│                     ┌───────▼───────┐   │
│                     │ PostgreSQL 16 │   │
│                     │ (port 5432)   │   │
│                     └───────────────┘   │
│                             │           │
│                     ┌───────▼───────┐   │
│                     │  pgdata vol   │   │
│                     │  (persistent) │   │
│                     └───────────────┘   │
└─────────────────────────────────────────┘
```
