# RUNBOOK - MyInsuranceBuddies Operations Guide

## Table of Contents
1. [Application Architecture](#architecture)
2. [Deployment Procedures](#deployment)
3. [Database Management](#database)
4. [Backup & Recovery](#backup)
5. [Monitoring & Health](#monitoring)
6. [Troubleshooting](#troubleshooting)
7. [Common Tasks](#common-tasks)

## Architecture

### System Components
- **Web Application** (Next.js): Port 3000, public-facing site + blog
- **Admin Application** (Next.js): Port 3001, blog admin + super admin
- **Database**: PostgreSQL on localhost:5432
- **Media Storage**: `/var/www/myinsurancebuddies.com/uploads`
- **Backups**: `/var/www/myinsurancebuddies.com/backups`
- **Web Server**: Nginx reverse proxy with SSL (Certbot/Let's Encrypt)
- **Process Manager**: PM2

### File Structure
```
/var/www/myinsurancebuddies.com/
├── apps/
│   ├── web/          # Public site
│   └── admin/        # Admin portals
├── packages/
│   └── db/           # Prisma schema & migrations
├── scripts/          # Automation scripts
├── uploads/          # User-uploaded media
├── backups/          # Database & file backups
└── .env              # Environment variables
```

## Deployment

### Initial Deployment
See [QUICKSTART.md](./QUICKSTART.md) for first-time setup.

### Standard Deployment Process
```bash
# 1. SSH into VPS
ssh root@157.173.205.228

# 2. Navigate to app directory
cd /var/www/myinsurancebuddies.com

# 3. Pull latest changes
git pull origin main

# 4. Run deployment script
./scripts/build_and_deploy.sh
```

### Manual Deployment Steps
If the script fails, run steps individually:

```bash
# Install dependencies
pnpm install

# Generate Prisma Client
pnpm --filter @myinsurancebuddy/db generate

# Run migrations
pnpm --filter @myinsurancebuddy/db db:push

# Seed data
pnpm --filter @myinsurancebuddy/db seed
pnpm --filter @myinsurancebuddy/db exec ts-node prisma/seed-templates.ts

# Build apps
pnpm --filter web build
pnpm --filter admin build

# Generate sitemaps
node scripts/generate-sitemaps.js

# Restart PM2
pm2 reload ecosystem.config.js
```

## Database Management

### Database Access
```bash
# Connect to database
psql -U myuser -d myinsurancebuddy

# Common queries
SELECT * FROM "User" WHERE role = 'SUPER_ADMIN';
SELECT COUNT(*) FROM "Post" WHERE status = 'PUBLISHED';
SELECT * FROM "Region" WHERE type = 'STATE';
SELECT COUNT(*) FROM "ProgrammaticPage" WHERE "isPublished" = true;
```

### Run Migrations
```bash
cd /var/www/myinsurancebuddies.com
pnpm --filter @myinsurancebuddy/db db:push
```

### Reset Database (CAUTION)
```bash
# This will delete all data!
pnpm --filter @myinsurancebuddy/db db:reset
```

## Backup & Recovery

### Create Manual Backup
```bash
cd /var/www/myinsurancebuddies.com
./scripts/backup.sh
```

Backups are saved to `/var/www/myinsurancebuddies.com/backups/` and include:
- `db_<name>_<timestamp>.dump.gz` - Database dump
- `uploads_<timestamp>.tar.gz` - Uploaded media files

### Restore from Backup
```bash
# List available backups
ls -lh /var/www/myinsurancebuddies.com/backups/

# Restore database
./scripts/restore.sh /var/www/myinsurancebuddies.com/backups/db_myinsurancebuddy_20241211_120000.dump.gz

# Restore uploads (if needed)
cd /var/www/myinsurancebuddies.com
tar -xzf backups/uploads_20241211_120000.tar.gz

# Restart application
pm2 restart all
```

### Automated Backups
Set up a daily cron job:

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * cd /var/www/myinsurancebuddies.com && ./scripts/backup.sh >> /var/log/myinsurancebuddy-backup.log 2>&1
```

## Monitoring & Health

### Health Check Endpoint
```bash
curl https://myinsurancebuddies.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-12-11T12:00:00.000Z",
  "services": {
    "database": "up",
    "app": "up"
  }
}
```

### PM2 Monitoring
```bash
# View all processes
pm2 status

# View logs
pm2 logs

# View specific app logs
pm2 logs web
pm2 logs admin

# Real-time monitoring
pm2 monit
```

### Nginx Status
```bash
# Check nginx status
systemctl status nginx

# Test configuration
nginx -t

# Reload configuration
systemctl reload nginx

# View error logs
tail -f /var/log/nginx/error.log

# View access logs
tail -f /var/log/nginx/access.log
```

### Database Monitoring
```bash
# Check database size
psql -U myuser -d myinsurancebuddy -c "SELECT pg_size_pretty(pg_database_size('myinsurancebuddy'));"

# Check active connections
psql -U myuser -d myinsurancebuddy -c "SELECT count(*) FROM pg_stat_activity;"

# Check slow queries (if configured)
psql -U myuser -d myinsurancebuddy -c "SELECT query, calls, total_time FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;"
```

## Troubleshooting

### Application Won't Start
```bash
# Check PM2 status
pm2 status

# Check logs for errors
pm2 logs --err

# Try restarting
pm2 restart all

# If still failing, rebuild
cd /var/www/myinsurancebuddies.com
pnpm install
pnpm --filter web build
pnpm --filter admin build
pm2 restart all
```

### Database Connection Errors
```bash
# Check PostgreSQL is running
systemctl status postgresql

# Test connection
psql -U myuser -d myinsurancebuddy -c "SELECT 1;"

# Check .env file has correct DATABASE_URL
cat .env | grep DATABASE_URL

# Restart PostgreSQL
systemctl restart postgresql
```

### SSL Certificate Issues
```bash
# Check certificate expiry
certbot certificates

# Renew certificate
certbot renew

# Test renewal
certbot renew --dry-run
```

### Upload Failures
```bash
# Check uploads directory permissions
ls -la /var/www/myinsurancebuddies.com/uploads/

# Fix permissions if needed
chown -R www-data:www-data /var/www/myinsurancebuddies.com/uploads/
chmod -R 755 /var/www/myinsurancebuddies.com/uploads/

# Check disk space
df -h
```

### High Memory Usage
```bash
# Check memory usage
free -h

# Check which process is using memory
ps aux --sort=-%mem | head -10

# Restart PM2 apps
pm2 restart all
```

## Common Tasks

### Create New Super Admin User
```bash
# Connect to database
psql -U myuser -d myinsurancebuddy

# Generate password hash (use bcrypt online or Node.js)
# Then insert user:
INSERT INTO "User" (id, email, name, "passwordHash", role, "isActive", "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'newemail@example.com', 'Admin Name', '<bcrypt-hash>', 'SUPER_ADMIN', true, now(), now());
```

Or use the API (from web app console):
```javascript
const bcrypt = require('bcryptjs');
const hash = await bcrypt.hash('password123', 10);
// Use hash in INSERT query above
```

### Generate Programmatic Pages
Use Super Admin UI or API:

```bash
# Via API (requires authentication)
curl -X POST https://myinsurancebuddies.com/api/templates/{template-id}/generate \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=<token>" \
  -d '{"bulk": true, "regionType": "STATE"}'
```

### Regenerate Sitemaps
```bash
cd /var/www/myinsurancebuddies.com
node scripts/generate-sitemaps.js
```

### Clear Next.js Cache
```bash
cd /var/www/myinsurancebuddies.com
rm -rf apps/web/.next
rm -rf apps/admin/.next
pnpm --filter web build
pnpm --filter admin build
pm2 restart all
```

### Update Node.js Version
```bash
# Using nvm
nvm install 20
nvm use 20
nvm alias default 20

# Rebuild apps
cd /var/www/myinsurancebuddies.com
pnpm install
./scripts/build_and_deploy.sh
```

### Rotate Secrets
```bash
# Generate new NEXTAUTH_SECRET
openssl rand -base64 32

# Update .env
nano /var/www/myinsurancebuddies.com/.env
# Replace NEXTAUTH_SECRET value

# Restart apps
pm2 restart all
```

### View Audit Logs
```bash
psql -U myuser -d myinsurancebuddy -c "SELECT * FROM \"AuditLog\" ORDER BY \"createdAt\" DESC LIMIT 20;"
```

## Emergency Contacts

- **VPS Provider**: Contabo Support
- **Domain Registrar**: [Your registrar]
- **Repository**: https://github.com/ihetgoti/myinsurancebuddy

## Version Information

- **Node.js**: 20.x
- **Next.js**: 14.1.0
- **PostgreSQL**: 14+
- **PM2**: Latest
- **Nginx**: Latest

---

**Last Updated**: December 2024
**Maintained By**: Infrastructure Team
