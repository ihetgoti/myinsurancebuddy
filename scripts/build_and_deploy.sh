#!/bin/bash
set -e

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | xargs)
fi

echo "🚀 Starting deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install -g pnpm
pnpm install --no-frozen-lockfile

# Generate Prisma Client FIRST - critical for workspace
echo "🗄️ Generating Prisma Client..."
cd packages/db
pnpm generate
cd ../..

# Verify Prisma Client exists
if [ ! -d "node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0" ]; then
  echo "⚠️  Prisma Client not found in expected location"
  echo "Installing dependencies again..."
  pnpm install --force
fi

# Run Migrations
echo "🔄 Running Database Migrations..."
cd packages/db
pnpm db:push
cd ../..

# Seed Database (Idempotent)
echo "🌱 Seeding Database..."
cd packages/db
pnpm seed
cd ../..

echo "📝 Seeding Templates..."
cd packages/db
pnpm exec ts-node prisma/seed-templates.ts
cd ../..

# Build Applications
echo "🏗️ Building Applications..."
pnpm build

# Setup Standalone Deployment
echo "📁 Setting up standalone deployment..."

# Copy static files to standalone folders
echo "  - Copying static files..."
cp -r ./apps/web/.next/static ./apps/web/.next/standalone/apps/web/.next/
cp -r ./apps/admin/.next/static ./apps/admin/.next/standalone/apps/admin/.next/

# Copy public folders
echo "  - Copying public folders..."
cp -r ./apps/web/public ./apps/web/.next/standalone/apps/web/ 2>/dev/null || true
cp -r ./apps/admin/public ./apps/admin/.next/standalone/apps/admin/ 2>/dev/null || true

# Copy environment files
echo "  - Copying environment files..."
cp ./apps/web/.env.local ./apps/web/.next/standalone/apps/web/.env.local 2>/dev/null || true
cp ./apps/admin/.env.local ./apps/admin/.next/standalone/apps/admin/.env.local 2>/dev/null || true

# Copy Prisma engine to standalone folders (CRITICAL for database access)
echo "  - Copying Prisma engine..."
PRISMA_PATH="./node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/.prisma"
if [ -d "$PRISMA_PATH" ]; then
  mkdir -p ./apps/web/.next/standalone/apps/web/.prisma
  mkdir -p ./apps/admin/.next/standalone/apps/admin/.prisma
  cp -r $PRISMA_PATH/client ./apps/web/.next/standalone/apps/web/.prisma/
  cp -r $PRISMA_PATH/client ./apps/admin/.next/standalone/apps/admin/.prisma/
  echo "  ✓ Prisma engine copied successfully"
else
  echo "  ⚠️  Prisma engine not found at $PRISMA_PATH"
fi

# Create startup scripts if they don't exist
echo "📜 Creating startup scripts..."
cat > ./apps/web/start.sh << 'EOF'
#!/bin/bash
cd /var/www/myinsurancebuddy/apps/web/.next/standalone/apps/web
set -a
source .env.local 2>/dev/null || true
set +a
export PORT=3000
export HOSTNAME=0.0.0.0
exec node server.js
EOF

cat > ./apps/admin/start.sh << 'EOF'
#!/bin/bash
cd /var/www/myinsurancebuddy/apps/admin/.next/standalone/apps/admin
set -a
source .env.local 2>/dev/null || true
set +a
export PORT=3001
export HOSTNAME=0.0.0.0
exec node server.js
EOF

chmod +x ./apps/web/start.sh ./apps/admin/start.sh

# Generate Sitemaps
echo "🗺️ Generating Sitemaps..."
node scripts/generate-sitemaps.js 2>/dev/null || true

# Restart Services
echo "🔄 Restarting Services..."
if command -v pm2 &> /dev/null; then
    pm2 delete all 2>/dev/null || true
    pm2 start ./apps/web/start.sh --name web
    pm2 start ./apps/admin/start.sh --name admin
    pm2 save
else
    echo "PM2 not found, skipping restart. Ensure services are managed by systemd or similar."
fi

echo "✅ Deployment Complete!"

