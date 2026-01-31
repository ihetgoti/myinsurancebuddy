#!/bin/bash
# Fresh VPS Deployment Script for MyInsuranceBuddy
# Run on a fresh Ubuntu 22.04+ VPS

set -e

echo "🚀 Starting fresh VPS deployment..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
read -p "Enter domain name (e.g., myinsurancebuddies.com): " DOMAIN
read -p "Enter GitHub repo URL: " REPO_URL
read -p "Enter PostgreSQL password: " DB_PASSWORD
read -p "Enter admin email for SSL: " ADMIN_EMAIL

APP_DIR="/opt/myinsurancebuddy"
WEB_PORT=3000
ADMIN_PORT=3002

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Fresh VPS Deployment Setup${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 1. System Update & Dependencies
echo -e "${YELLOW}[1/10] Updating system...${NC}"
apt-get update && apt-get upgrade -y
apt-get install -y curl wget git nginx certbot python3-certbot-nginx \
    postgresql postgresql-contrib redis-server ufw htop fail2ban

# 2. Install Node.js 20
echo -e "${YELLOW}[2/10] Installing Node.js 20...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# 3. Install pnpm
echo -e "${YELLOW}[3/10] Installing pnpm...${NC}"
npm install -g pnpm

# 4. Setup PostgreSQL
echo -e "${YELLOW}[4/10] Setting up PostgreSQL...${NC}"
sudo -u postgres psql -c "CREATE DATABASE myinsurancebuddy;" 2>/dev/null || echo "Database exists"
sudo -u postgres psql -c "CREATE USER mibuser WITH ENCRYPTED PASSWORD '$DB_PASSWORD';" 2>/dev/null || echo "User exists"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE myinsurancebuddy TO mibuser;"
sudo -u postgres psql -c "ALTER DATABASE myinsurancebuddy OWNER TO mibuser;"

# Configure PostgreSQL for remote connections (localhost only)
sed -i "s/#listen_addresses = 'localhost'/listen_addresses = 'localhost'/" /etc/postgresql/14/main/postgresql.conf
systemctl restart postgresql

# 5. Clone Repository
echo -e "${YELLOW}[5/10] Cloning repository...${NC}"
rm -rf $APP_DIR
mkdir -p $APP_DIR
git clone $REPO_URL $APP_DIR
cd $APP_DIR

# 6. Install Dependencies
echo -e "${YELLOW}[6/10] Installing dependencies...${NC}"
pnpm install

# 7. Setup Environment
echo -e "${YELLOW}[7/10] Setting up environment...${NC}"
cat > apps/web/.env << EOF
# Database
DATABASE_URL="postgresql://mibuser:$DB_PASSWORD@localhost:5432/myinsurancebuddy?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# MarketCall
MARKETCALL_API_KEY="your_marketcall_api_key"

# OpenRouter
OPENROUTER_API_KEY="your_openrouter_api_key"

# AI Providers
OPENAI_API_KEY="your_openai_key"
ANTHROPIC_API_KEY="your_anthropic_key"

# Google Ads
GOOGLE_ADSENSE_ID=""
GOOGLE_ANALYTICS_ID=""

# Site
NEXT_PUBLIC_SITE_URL="https://$DOMAIN"
DEFAULT_PHONE_NUMBER="1-855-205-2412"

# Security
JWT_SECRET="$(openssl rand -base64 32)"
EOF

cp apps/web/.env apps/admin/.env

# 8. Database Migrations
echo -e "${YELLOW}[8/10] Running database migrations...${NC}"
cd packages/db
pnpm prisma migrate deploy
pnpm prisma generate
cd ../..

# 9. Build Applications
echo -e "${YELLOW}[9/10] Building applications...${NC}"
pnpm build

# 10. Setup PM2
echo -e "${YELLOW}[10/10] Setting up PM2...${NC}"
npm install -g pm2

cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'mib-web',
      cwd: '$APP_DIR/apps/web',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p $WEB_PORT',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: $WEB_PORT
      }
    },
    {
      name: 'mib-admin',
      cwd: '$APP_DIR/apps/admin',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p $ADMIN_PORT',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: $ADMIN_PORT
      }
    }
  ]
};
EOF

# Setup Nginx
echo -e "${YELLOW}Configuring Nginx...${NC}"

# Web app config
cat > /etc/nginx/sites-available/$DOMAIN << 'EOF'
server {
    listen 80;
    server_name DOMAIN www.DOMAIN;
    
    location / {
        proxy_pass http://localhost:WEB_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Admin config
cat > /etc/nginx/sites-available/admin.$DOMAIN << 'EOF'
server {
    listen 80;
    server_name admin.DOMAIN;
    
    location / {
        proxy_pass http://localhost:ADMIN_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Replace variables
sed -i "s/DOMAIN/$DOMAIN/g" /etc/nginx/sites-available/$DOMAIN
sed -i "s/WEB_PORT/$WEB_PORT/g" /etc/nginx/sites-available/$DOMAIN
sed -i "s/DOMAIN/$DOMAIN/g" /etc/nginx/sites-available/admin.$DOMAIN
sed -i "s/ADMIN_PORT/$ADMIN_PORT/g" /etc/nginx/sites-available/admin.$DOMAIN

# Enable sites
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/admin.$DOMAIN /etc/nginx/sites-enabled/

# Test nginx config
nginx -t

# Restart nginx
systemctl restart nginx

# Setup SSL
echo -e "${YELLOW}Setting up SSL certificates...${NC}"
certbot --nginx -d $DOMAIN -d www.$DOMAIN -d admin.$DOMAIN --non-interactive --agree-tos --email $ADMIN_EMAIL

# Configure Firewall
echo -e "${YELLOW}Configuring firewall...${NC}"
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https
ufw --force enable

# Setup fail2ban
echo -e "${YELLOW}Configuring fail2ban...${NC}"
systemctl enable fail2ban
systemctl start fail2ban

# Create deploy script
cat > $APP_DIR/deploy.sh << EOF
#!/bin/bash
cd $APP_DIR
git pull origin main
pnpm install
pnpm build
pm2 restart all
EOF
chmod +x $APP_DIR/deploy.sh

# Start applications with PM2
echo -e "${YELLOW}Starting applications with PM2...${NC}"
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✅ VPS Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Your application is now live:${NC}"
echo -e "  🌐 Website: https://$DOMAIN"
echo -e "  🔧 Admin: https://admin.$DOMAIN"
echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo -e "  pm2 status              - Check app status"
echo -e "  pm2 logs                - View logs"
echo -e "  pm2 restart all         - Restart all apps"
echo -e "  ./deploy.sh             - Deploy updates"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update environment variables in apps/web/.env"
echo "2. Configure your DNS to point to this server"
echo "3. Set up database seed data: cd packages/db && pnpm prisma db seed"
echo "4. Create admin user in the database"
