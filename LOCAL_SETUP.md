# Local Setup Guide

## Prerequisites

1. **Node.js 18+** installed
2. **pnpm** installed: `npm install -g pnpm`
3. **PostgreSQL** installed and running

## Database Setup

### Option 1: Using Docker (Recommended)

```bash
# Start PostgreSQL in Docker
docker run --name myinsurancebuddy-db \
  -e POSTGRES_DB=myinsurancebuddy_dev \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:15
```

### Option 2: Using Local PostgreSQL

```bash
# Create database
createdb myinsurancebuddy_dev

# Or using psql
psql -U postgres -c "CREATE DATABASE myinsurancebuddy_dev;"
```

## Environment Setup

```bash
# Copy example environment file
cp .env.example .env.local

# Update DATABASE_URL if needed
# Default: postgresql://postgres:postgres@localhost:5432/myinsurancebuddy_dev
```

## Installation & Setup

```bash
# Install dependencies
pnpm install

# Generate Prisma Client
cd packages/db
pnpm generate

# Push database schema
pnpm db:push

# Seed database with initial data
pnpm seed

# Seed templates
pnpm exec ts-node prisma/seed-templates.ts

# Go back to root
cd ../..
```

## Running Locally

### Terminal 1: Web App (Port 3000)
```bash
cd apps/web
pnpm dev
```

Visit: http://localhost:3000

### Terminal 2: Admin App (Port 3001)
```bash
cd apps/admin
pnpm dev
```

Visit: http://localhost:3001

## Test the Setup

1. **Web App** (http://localhost:3000)
   - Homepage should load
   - Check /api/health endpoint
   - Visit /state/california/insurance-guide
   - Visit /city/los-angeles/insurance-guide

2. **Admin App** (http://localhost:3001)
   - Sign in with: admin@myinsurancebuddies.com / changeme123
   - Dashboard should load with stats
   - Try creating a blog post
   - Try creating a template

## Common Issues

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Database Connection Error
```bash
# Check PostgreSQL is running
pg_isready

# For Docker:
docker ps | grep myinsurancebuddy-db

# Restart if needed:
docker restart myinsurancebuddy-db
```

### Prisma Client Not Found
```bash
cd packages/db
pnpm generate
cd ../..
pnpm install
```

### Type Errors
```bash
# Regenerate Prisma Client
cd packages/db
pnpm generate

# Rebuild workspace
cd ../..
pnpm install --force
```

## Build & Test Production Build

```bash
# Build all apps
pnpm --filter web build
pnpm --filter admin build

# Start production builds
pnpm --filter web start &
pnpm --filter admin start &
```

## Database Reset (If Needed)

```bash
cd packages/db

# Drop and recreate
pnpm db:push --force-reset

# Re-seed
pnpm seed
pnpm exec ts-node prisma/seed-templates.ts
```

## Default Admin Credentials

```
Email: admin@myinsurancebuddies.com
Password: changeme123
```

⚠️ Change this in production!

## File Structure

```
myinsurancebuddy/
├── apps/
│   ├── web/          # Main website (Port 3000)
│   └── admin/        # Admin portal (Port 3001)
├── packages/
│   └── db/           # Shared Prisma database
├── scripts/          # Deployment scripts
└── .env.local        # Local environment variables
```

## Next Steps

Once local testing is complete:
1. Update VPS environment variables
2. Run deployment script
3. Verify production deployment
