# Deployment Guide

## URLs
- **Main Site**: https://myinsurancebuddies.com
- **Admin Panel**: https://admin.myinsurancebuddies.com

## Prerequisites

1. **VPS** with Node.js 20+, pnpm, PM2, and nginx installed
2. **DNS** records pointing to VPS:
   - `myinsurancebuddies.com` → VPS IP
   - `www.myinsurancebuddies.com` → VPS IP
   - `admin.myinsurancebuddies.com` → VPS IP
3. **GitHub Secrets** configured:
   - `VPS_HOST`, `VPS_USERNAME`, `VPS_SSH_KEY`, `VPS_PORT`
   - `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`

## Automatic Deployment

Push to `main` branch triggers automatic deployment via GitHub Actions.

```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

## Manual VPS Setup (First Time)

```bash
# On VPS
cd /var/www
sudo mkdir -p myinsurancebuddies.com
sudo chown $USER:$USER myinsurancebuddies.com
cd myinsurancebuddies.com

# Clone and setup
git clone https://github.com/ihetgoti/myinsurancebuddy.git .
pnpm install

# Database
cd packages/db
pnpm prisma generate
pnpm prisma migrate deploy
cd ../..

# Build
pnpm build

# Nginx
sudo cp nginx.conf /etc/nginx/sites-available/myinsurancebuddies.com
sudo ln -sf /etc/nginx/sites-available/myinsurancebuddies.com /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# SSL
sudo certbot --nginx -d myinsurancebuddies.com -d www.myinsurancebuddies.com -d admin.myinsurancebuddies.com

# PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Troubleshooting

```bash
# Check app status
pm2 status
pm2 logs

# Check nginx
sudo nginx -t
sudo tail -f /var/log/nginx/error.log

# Restart everything
pm2 restart all
sudo systemctl reload nginx
```
