ALTER SCHEMA public OWNER TO myuser;#!/bin/bash
set -e

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | xargs)
fi

echo "🚀 Starting deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install -g pnpm
pnpm install

# Generate Prisma Client
echo "🗄️ Generating Prisma Client..."
pnpm --filter @myinsurancebuddy/db generate

# Run Migrations
echo "🔄 Running Database Migrations..."
pnpm --filter @myinsurancebuddy/db db:push

# Seed Database (Idempotent)
echo "🌱 Seeding Database..."
pnpm --filter @myinsurancebuddy/db seed

echo "📝 Seeding Templates..."
pnpm --filter @myinsurancebuddy/db exec ts-node prisma/seed-templates.ts

# Build Applications
echo "🏗️ Building Web App..."
pnpm --filter web build

echo "🏗️ Building Admin App..."
pnpm --filter admin build

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
