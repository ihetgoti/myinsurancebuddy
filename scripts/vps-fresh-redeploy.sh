#!/bin/bash
# FRESH REDEPLOY - Wipes everything and deploys current version
# ⚠️  WARNING: This will delete the old deployment!

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${RED}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${RED}║  ⚠️  FRESH REDEPLOY - ALL DATA WILL BE RESET              ║${NC}"
echo -e "${RED}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

read -p "Are you sure? Type 'yes' to continue: " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
    echo "Cancelled."
    exit 1
fi

APP_DIR="/var/www/myinsurancebuddy"
BACKUP_DIR="/root/mib-backup-$(date +%Y%m%d-%H%M%S)"
DOMAIN="myinsurancebuddies.com"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Fresh Redeploy Starting${NC}"
echo -e "${BLUE}========================================${NC}"

# 1. Backup database
echo -e "${YELLOW}[1/8] Backing up database...${NC}"
mkdir -p $BACKUP_DIR
if sudo -u postgres pg_dump myinsurancebuddy > $BACKUP_DIR/database.sql 2>/dev/null; then
    echo -e "${GREEN}✓ Database backed up to $BACKUP_DIR/database.sql${NC}"
else
    echo -e "${YELLOW}⚠ No database to backup${NC}"
fi

# 2. Stop and delete PM2 processes
echo -e "${YELLOW}[2/8] Stopping PM2 processes...${NC}"
pm2 delete all 2>/dev/null || true
pm2 save --force 2>/dev/null || true

# 3. Remove old app directory
echo -e "${YELLOW}[3/8] Removing old deployment...${NC}"
if [ -d "/var/www/myinsurancebuddies.com" ]; then
    mv /var/www/myinsurancebuddies.com $BACKUP_DIR/old-app
    echo -e "${GREEN}✓ Old app moved to $BACKUP_DIR/old-app${NC}"
fi

# 4. Reset database (optional - fresh start)
echo -e "${YELLOW}[4/8] Resetting database...${NC}"
sudo -u postgres dropdb myinsurancebuddy 2>/dev/null || true
sudo -u postgres createdb myinsurancebuddy
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE myinsurancebuddy TO mibuser;" 2>/dev/null || {
    sudo -u postgres psql -c "CREATE USER mibuser WITH PASSWORD 'changeme';"
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE myinsurancebuddy TO mibuser;"
    sudo -u postgres psql -c "ALTER DATABASE myinsurancebuddy OWNER TO mibuser;"
}
echo -e "${GREEN}✓ Database reset${NC}"

# 5. Clone fresh repository
echo -e "${YELLOW}[5/8] Cloning fresh repository...${NC}"
cd /var/www
git clone https://github.com/ihetgoti/myinsurancebuddy.git
ln -sf /var/www/myinsurancebuddy /var/www/myinsurancebuddies.com 2>/dev/null || true
cd myinsurancebuddy

# 6. Setup environment
echo -e "${YELLOW}[6/8] Setting up environment...${NC}"

# Read env values
read -p "Enter PostgreSQL password [changeme]: " DB_PASS
DB_PASS=${DB_PASS:-changeme}
read -p "Enter OpenAI API key: " OPENAI_KEY
read -p "Enter MarketCall API key: " MARKETCALL_KEY

cat > apps/web/.env << EOF
# Database
DATABASE_URL="postgresql://mibuser:${DB_PASS}@localhost:5432/myinsurancebuddy?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# AI Providers
OPENAI_API_KEY="${OPENAI_KEY}"
ANTHROPIC_API_KEY=""
OPENROUTER_API_KEY=""

# MarketCall
MARKETCALL_API_KEY="${MARKETCALL_KEY}"

# Site
NEXT_PUBLIC_SITE_URL="https://${DOMAIN}"
DEFAULT_PHONE_NUMBER="1-855-205-2412"

# Security
JWT_SECRET="$(openssl rand -base64 32)"
EOF

cp apps/web/.env apps/admin/.env
echo -e "${GREEN}✓ Environment configured${NC}"

# 7. Install and build
echo -e "${YELLOW}[7/8] Installing dependencies and building...${NC}"
npm install -g pnpm
pnpm install

# Database setup
cd packages/db
pnpm prisma generate
pnpm prisma migrate deploy
pnpm prisma db seed 2>/dev/null || echo "No seed data"
cd ../..

# Build
pnpm build
echo -e "${GREEN}✓ Build complete${NC}"

# 8. Start with PM2
echo -e "${YELLOW}[8/8] Starting applications...${NC}"

cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'mib-web',
      cwd: '${APP_DIR}/apps/web',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'mib-admin',
      cwd: '${APP_DIR}/apps/admin',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3002',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      }
    }
  ]
};
EOF

pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root 2>/dev/null || true

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✅ Fresh Redeploy Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Your site:${NC}"
echo -e "  🌐 https://${DOMAIN}"
echo -e "  🔧 https://admin.${DOMAIN}"
echo ""
echo -e "${YELLOW}Backup saved to:${NC} $BACKUP_DIR"
echo ""
echo -e "${CYAN}Commands:${NC}"
echo -e "  pm2 status       - Check apps"
echo -e "  pm2 logs         - View logs"
echo -e "  pm2 restart all  - Restart"
