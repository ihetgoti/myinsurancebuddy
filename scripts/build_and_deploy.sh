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
echo "🏗️ Building Web App..."
cd apps/web
pnpm build
cd ../..

echo "🏗️ Building Admin App..."
cd apps/admin
pnpm build
cd ../..

# Generate Sitemaps
echo "🗺️ Generating Sitemaps..."
node scripts/generate-sitemaps.js

# Restart Services
echo "🔄 Restarting Services..."
if command -v pm2 &> /dev/null; then
    pm2 reload ecosystem.config.js || pm2 start ecosystem.config.js
else
    echo "PM2 not found, skipping restart. Ensure services are managed by systemd or similar."
fi

echo "✅ Deployment Complete!"
