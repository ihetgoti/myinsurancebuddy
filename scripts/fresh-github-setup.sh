#!/bin/bash
# Fresh GitHub Repository Setup Script
# Run this to create a clean GitHub repo structure

set -e

echo "🚀 Starting fresh GitHub setup..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get repo info
read -p "Enter GitHub username: " GITHUB_USER
read -p "Enter new repo name [myinsurancebuddy]: " REPO_NAME
REPO_NAME=${REPO_NAME:-myinsurancebuddy}
read -p "Enter repo description: " REPO_DESC

# Create new repo on GitHub
echo -e "${YELLOW}Creating GitHub repository...${NC}"
gh repo create "$REPO_NAME" --public --description "$REPO_DESC" --source=. --remote=origin --push 2>/dev/null || {
    echo -e "${YELLOW}Repo may already exist or gh CLI not configured. Continuing...${NC}"
}

# Backup old .git
echo -e "${YELLOW}Backing up old git history...${NC}"
mv .git .git-backup-$(date +%Y%m%d-%H%M%S) 2>/dev/null || true

# Initialize fresh git
echo -e "${YELLOW}Initializing fresh git repository...${NC}"
git init
git branch -m main

# Create clean .gitignore if not exists
if [ ! -f .gitignore ]; then
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
.next/
out/
dist/
build/

# Environment variables
.env
.env.local
.env.*.local

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Database
*.db
*.db-journal
prisma/*.db

# OS files
.DS_Store
Thumbs.db

# IDE
.idea/
.vscode/
*.swp
*.swo
*~

# Testing
coverage/
.nyc_output/

# Turbo
.turbo/

# Misc
*.pem
*.cert
*.key
.vercel
EOF
fi

# Add all files
echo -e "${YELLOW}Adding files to git...${NC}"
git add .

# Initial commit
echo -e "${YELLOW}Creating initial commit...${NC}"
git commit -m "Initial commit: Insurance lead generation platform

Features:
- Multi-niche insurance templates (Auto, Home, Health, Life, Pet, Business, Renters, Motorcycle, Umbrella)
- MarketCall integration with fallback lead forms
- Dynamic pricing system
- AI content generation
- SEO automation tools
- Admin dashboard
- PostgreSQL + Prisma ORM
- Next.js 14 + TypeScript + Tailwind CSS

Tech Stack:
- Frontend: Next.js 14, React, TypeScript, Tailwind CSS
- Backend: Next.js API routes, tRPC
- Database: PostgreSQL, Prisma ORM
- Cache: Redis (Upstash)
- AI: OpenAI, Anthropic, OpenRouter
- Analytics: Google Analytics, GTM
- Hosting: VPS with Docker
"

# Add remote and push
echo -e "${YELLOW}Setting up remote and pushing...${NC}"
git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git" 2>/dev/null || \
    git remote set-url origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"

git push -u origin main --force

echo -e "${GREEN}✅ Fresh GitHub repository setup complete!${NC}"
echo -e "${GREEN}Repository: https://github.com/$GITHUB_USER/$REPO_NAME${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Set up repository secrets (Settings > Secrets)"
echo "2. Configure GitHub Actions if needed"
echo "3. Update README with project details"
