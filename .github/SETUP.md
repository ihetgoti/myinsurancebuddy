# GitHub Actions CI/CD Setup

This project uses GitHub Actions for automated deployment to your VPS on every push to main branch.

## Required GitHub Secrets

Go to your repository Settings → Secrets and variables → Actions, and add the following secrets:

### 1. VPS_HOST
Your VPS IP address or domain
```
185.128.78.155
```

### 2. VPS_USERNAME
SSH username for your VPS (usually `root`)
```
root
```

### 3. VPS_SSH_KEY
Your private SSH key for VPS access. Generate if you don't have one:

```bash
# On your local machine
ssh-keygen -t ed25519 -C "github-actions-deploy"
# Copy the private key (starts with -----BEGIN OPENSSH PRIVATE KEY-----)
cat ~/.ssh/id_ed25519
```

Then add the public key to your VPS:
```bash
# On your VPS
mkdir -p ~/.ssh
echo "your-public-key-here" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### 4. VPS_PORT (Optional)
SSH port if different from 22
```
22
```

### 5. VPS_PROJECT_PATH
Path to your project on VPS (the workflow will auto-detect, but you can set it)
```
/var/www/myinsurancebuddy
```

### 6. DATABASE_URL
PostgreSQL connection string for build-time environment
```
postgresql://user:password@localhost:5432/myinsurancebuddy
```

### 7. NEXTAUTH_SECRET
NextAuth secret key (same as in your .env)
```
your-nextauth-secret-here
```

### 8. NEXTAUTH_URL
Public URL for NextAuth (production URL)
```
https://myinsurancebuddies.com
```

## VPS Prerequisites

Your VPS should have:
- ✅ Node.js 20+ installed
- ✅ pnpm installed globally (`npm install -g pnpm`)
- ✅ PM2 installed globally (`npm install -g pm2`)
- ✅ PostgreSQL running
- ✅ Git repository cloned
- ✅ .env file configured in project root
- ✅ SSH access configured

## Manual Deployment (if needed)

If you need to deploy manually or test the workflow:

```bash
# On your VPS
cd /path/to/myinsurancebuddy
git pull origin main
pnpm install --frozen-lockfile
cd packages/db && pnpm prisma generate && pnpm prisma migrate deploy && cd ../..
pnpm build --filter=@myinsurancebuddy/db
pnpm build --filter=web
pnpm build --filter=admin
pm2 restart all
```

## Workflow Triggers

The workflow runs:
- ✅ Automatically on every push to `main` branch
- ✅ Manually via "Actions" tab → "Run workflow" button

## What the Workflow Does

1. **Build Phase (GitHub Runner)**
   - Checks out code
   - Sets up Node.js 20 and pnpm
   - Installs dependencies
   - Generates Prisma client
   - Builds database package
   - Lints code
   - Builds web and admin apps

2. **Deploy Phase (VPS)**
   - SSHs into your VPS
   - Finds project directory
   - Pulls latest code
   - Installs dependencies
   - Runs database migrations
   - Builds all packages
   - Restarts PM2 processes

## Monitoring

Check deployment status:
- GitHub Actions tab in your repository
- VPS logs: `pm2 logs`
- PM2 status: `pm2 status`

## Troubleshooting

**Build fails on GitHub:**
- Check if all secrets are set correctly
- Verify DATABASE_URL is a valid PostgreSQL connection string

**Deployment fails on VPS:**
- Ensure SSH key has proper permissions
- Verify pnpm and PM2 are installed globally
- Check VPS disk space: `df -h`
- Check PM2 processes: `pm2 list`

**Apps not restarting:**
```bash
# On VPS - manually restart
pm2 restart all
# Or delete and recreate
pm2 delete all
pm2 start npm --name myinsurancebuddy-web -- run start:web
pm2 start npm --name myinsurancebuddy-admin -- run start:admin
pm2 save
```
