#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/home/deploy/insurance-site"
ENV_FILE="$APP_DIR/.env"
UPLOADS_DIR="/var/www/site/uploads"

echo "=== Updating system ==="
sudo apt update -y
sudo apt upgrade -y

echo "=== Installing Node ==="
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs

echo "=== Installing PM2 ==="
sudo npm install -g pm2

echo "=== Installing PostgreSQL ==="
sudo apt install -y postgresql postgresql-contrib

echo "=== Creating PostgreSQL user and database ==="
sudo -u postgres psql -c "DO \$\$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='app_user') THEN
    CREATE ROLE app_user WITH LOGIN PASSWORD 'StrongPasswordHere!';
  END IF;
END \$\$;"

sudo -u postgres psql -c "CREATE DATABASE insurance_site OWNER app_user;" || true

echo "=== Setting up uploads directory ==="
sudo mkdir -p $UPLOADS_DIR
sudo chown -R deploy:deploy $UPLOADS_DIR

echo "=== Creating .env ==="
cat > $ENV_FILE <<EOF
NODE_ENV=production
PORT=3000
DOMAIN=yourdomain.com
DATABASE_URL=postgresql://app_user:StrongPasswordHere!@localhost:5432/insurance_site
NEXTAUTH_SECRET=$(openssl rand -hex 32)
JWT_SECRET=$(openssl rand -hex 32)
UPLOADS_DIR=$UPLOADS_DIR
EOF

chmod 600 $ENV_FILE

cd $APP_DIR

echo "=== Installing dependencies ==="
npm install --production

echo "=== Prisma generate & migrate ==="
npx prisma generate
npx prisma migrate deploy

echo "=== Building project ==="
npm run build

echo "=== Starting server with PM2 ==="
pm2 start "npm start" --name insurance-site
pm2 save

echo "=== Auto setup completed successfully! ==="
