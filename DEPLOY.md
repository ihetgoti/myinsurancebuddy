# Deployment Guide

## Option 1: Docker Compose (Recommended)

### Prerequisites
- Ubuntu 22.04+ VPS
- Docker & Docker Compose installed
- Domain pointing to VPS

### Quick Deploy

```bash
# 1. Clone repo
git clone https://github.com/ihetgoti/myinsurancebuddy.git
cd myinsurancebuddy

# 2. Create environment file
cp .env.example .env
# Edit .env with your values

# 3. Start services
docker-compose -f docker-compose.production.yml up -d

# 4. Run migrations
docker-compose -f docker-compose.production.yml exec web npx prisma migrate deploy

# 5. Seed database (optional)
docker-compose -f docker-compose.production.yml exec web npx prisma db seed
```

### Setup SSL with Certbot

```bash
# Run certbot for initial certificate
docker run -it --rm \
  -v certbot_data:/etc/letsencrypt \
  -v certbot_www:/var/www/certbot \
  -p 80:80 \
  certbot/certbot certonly --standalone \
  -d myinsurancebuddies.com -d www.myinsurancebuddies.com -d admin.myinsurancebuddies.com

# Reload nginx
docker-compose -f docker-compose.production.yml restart nginx
```

## Option 2: VPS Script (Traditional)

```bash
# Run the deployment script on your VPS
curl -fsSL https://raw.githubusercontent.com/ihetgoti/myinsurancebuddy/main/scripts/fresh-vps-deploy.sh | sudo bash
```

Or manually:

```bash
# Download and run
wget https://raw.githubusercontent.com/ihetgoti/myinsurancebuddy/main/scripts/fresh-vps-deploy.sh
chmod +x fresh-vps-deploy.sh
./fresh-vps-deploy.sh
```

## Option 3: Fresh GitHub Repo

```bash
# Run locally to create fresh GitHub repo
curl -fsSL https://raw.githubusercontent.com/ihetgoti/myinsurancebuddy/main/scripts/fresh-github-setup.sh | bash
```

## Environment Variables

Create `.env` file:

```bash
# Database
POSTGRES_USER=mibuser
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=myinsurancebuddy
DATABASE_URL="postgresql://mibuser:your_secure_password@localhost:5432/myinsurancebuddy?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# AI Providers
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."
OPENROUTER_API_KEY="sk-or-..."

# MarketCall
MARKETCALL_API_KEY="your_key"
MARKETCALL_CAMPAIGN_ID="your_campaign"

# Google
GOOGLE_ANALYTICS_ID="G-..."
GOOGLE_ADSENSE_ID="pub-..."

# Site
NEXT_PUBLIC_SITE_URL="https://myinsurancebuddies.com"
DEFAULT_PHONE_NUMBER="1-855-205-2412"

# Security
JWT_SECRET="$(openssl rand -base64 32)"
ADMIN_SECRET="$(openssl rand -base64 32)"
```

## Update Deployment

### Docker:
```bash
cd /opt/myinsurancebuddy
git pull origin main
docker-compose -f docker-compose.production.yml up -d --build
```

### Traditional PM2:
```bash
cd /opt/myinsurancebuddy
./deploy.sh
```

## Troubleshooting

### Check logs
```bash
# Docker
docker-compose -f docker-compose.production.yml logs -f

# PM2
pm2 logs
```

### Database issues
```bash
# Reset database
docker-compose -f docker-compose.production.yml down -v
docker-compose -f docker-compose.production.yml up -d postgres
sleep 5
docker-compose -f docker-compose.production.yml exec web npx prisma migrate deploy
```

### SSL renewal
```bash
# Manual renewal
docker-compose -f docker-compose.production.yml run --rm certbot renew
docker-compose -f docker-compose.production.yml restart nginx
```

## Monitoring

### Setup basic monitoring
```bash
# Install node-exporter for Prometheus
docker run -d \
  --net="host" \
  --pid="host" \
  -v "/:/host:ro,rslave" \
  prom/node-exporter:latest \
  --path.rootfs=/host
```

### Health checks
- Website: https://myinsurancebuddies.com/api/health
- Admin: https://admin.myinsurancebuddies.com/api/health
