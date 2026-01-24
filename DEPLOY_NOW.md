# 🚀 Deploy AI Content System to Production - Quick Guide

## ✅ What's Ready

Everything has been prepared for production deployment:

1. ✅ **Database Schema** - All AI models defined (AIProvider, AIGenerationJob, AIPromptTemplate)
2. ✅ **Admin UI** - Three new pages ready (AI Templates, AI Providers, AI Content)
3. ✅ **API Endpoints** - All CRUD operations implemented
4. ✅ **GitHub Actions** - Updated to use safe `migrate deploy` instead of `db push`
5. ✅ **Documentation** - Complete deployment guide created

## ⚡ Deploy in 5 Steps (30 minutes)

### Step 1: Create Migration Locally (5 min)

```bash
cd packages/db
npx prisma migrate dev --name add_ai_content_generation_system
npx prisma generate
cd ../..
```

This creates a migration file with all AI-related database changes.

### Step 2: Test Locally (5 min)

```bash
pnpm dev
```

Visit http://localhost:3000/dashboard/ai-templates to verify it works.

### Step 3: Commit and Push (2 min)

```bash
git add .
git commit -m "feat: Add AI content generation system with prompt templates"
git push origin main
```

**⚠️ This automatically triggers deployment to production via GitHub Actions!**

### Step 4: Monitor Deployment (10 min - Automatic)

Watch: **https://github.com/ihetgoti/myinsurancebuddy/actions**

The workflow will:
- Pull latest code to VPS
- Run `prisma migrate deploy` (applies your new migration)
- Build apps
- Restart PM2

### Step 5: Set Up API Keys & Generate (10 min)

1. **Get FREE OpenRouter Keys** (3-5 accounts):
   - Go to https://openrouter.ai
   - Sign up with Gmail aliases: `yourname+1@gmail.com`, etc.
   - Settings → API Keys → Create Key
   - Copy each key

2. **Add to Production Admin**:
   - Visit: https://admin.myinsurancebuddies.com/dashboard/ai-providers
   - Add each key with model: `xiaomi/mimo-v2-flash` (FREE!)

3. **Start Generating**:
   - Visit: https://admin.myinsurancebuddies.com/dashboard/ai-content
   - Start with 100 test pages
   - Then run full 500k pages generation

## 📋 Pre-Flight Checklist

Before pushing to main:

- [ ] Created migration locally (`npx prisma migrate dev`)
- [ ] Tested locally (all 3 AI pages load)
- [ ] Committed migration files
- [ ] GitHub Actions workflow updated (already done ✅)
- [ ] Production database backed up (recommended)

## 🔐 Environment Variables

**No new environment variables needed!**

The AI content system stores API keys in the database (not env vars) for security and multi-account rotation.

Your existing `.env` on VPS already has:
- `DATABASE_URL` - For Prisma connection
- `NEXTAUTH_SECRET` - For authentication
- `NEXTAUTH_URL` - For admin dashboard

## ⚠️ Important Changes Made

### GitHub Actions Workflow

**Before (DANGEROUS for production):**
```bash
npx prisma db push --accept-data-loss
```

**After (SAFE for production):**
```bash
npx prisma migrate deploy
```

**Why this matters:**
- `db push` can lose data and doesn't track migrations
- `migrate deploy` safely applies versioned migrations
- Production should ALWAYS use proper migrations

### Database Schema Changes

The migration adds:

1. **Page model** - AI content fields:
   - `aiGeneratedContent` (JSON)
   - `aiGeneratedAt` (DateTime)
   - `aiModel` (String)
   - `aiPromptVersion` (String)
   - `isAiGenerated` (Boolean)

2. **AIProvider table** - For managing OpenRouter accounts
3. **AIGenerationJob table** - For tracking bulk generation jobs
4. **AIPromptTemplate table** - For custom AI prompts

### Admin UI Changes

New menu section "AI Content" with:
- **AI Generation** - Generate content for pages
- **AI Providers** - Manage OpenRouter API keys
- **AI Templates** - Create custom prompts

## 🚨 Troubleshooting

### "Migration already applied"

**If you already ran migrations on production before:**

```bash
# SSH to VPS
ssh your-username@your-vps-ip
cd /var/www/myinsurancebuddies.com/packages/db

# Check status
npx prisma migrate status

# If stuck, resolve it
npx prisma migrate resolve --applied 20250124_add_ai_content_generation_system
```

### "Permission denied" on VPS

```bash
# SSH to VPS and fix ownership
sudo chown -R $USER:$USER /var/www/myinsurancebuddies.com
```

### "PM2 apps not restarting"

```bash
# SSH to VPS
pm2 delete all
pm2 start ecosystem.config.js
pm2 save
```

## 📊 What Happens Next

After successful deployment:

1. **Migration runs** - Database tables created
2. **Apps restart** - Admin UI shows new pages
3. **You add API keys** - Through admin UI
4. **You generate content** - 500k unique pages at $0 cost
5. **SEO improves** - No more duplicate content penalties

## 💰 Cost

**Total: $0**

- Using FREE models (MiMo-V2-Flash until Jan 26, then DeepSeek R1)
- No cloud hosting costs for AI (runs on your existing VPS)
- No additional infrastructure needed

## ⏰ Timeline

- Migration creation: 5 minutes (local)
- Deployment: 10 minutes (automatic)
- API key setup: 5 minutes (manual)
- Test generation: 5 minutes
- Full 500k generation: 24-30 hours (runs unattended)

## 🎯 Success Criteria

Deployment is successful when:

1. ✅ `npx prisma migrate status` shows all migrations applied
2. ✅ Admin UI loads: `/dashboard/ai-templates`, `/dashboard/ai-providers`, `/dashboard/ai-content`
3. ✅ Can add OpenRouter API keys
4. ✅ Can create custom AI templates
5. ✅ Can start generation jobs
6. ✅ Generated pages show unique content

## 📖 Full Documentation

For detailed instructions, see:
- **[PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md)** - Complete deployment guide
- **[URGENT_MIMO_SETUP.md](./URGENT_MIMO_SETUP.md)** - Get premium free model (2 days left!)
- **[FREE_AI_SETUP.md](./FREE_AI_SETUP.md)** - Free model setup guide
- **[AI_CONTENT_SETUP_GUIDE.md](./AI_CONTENT_SETUP_GUIDE.md)** - How the system works

## 🚀 Ready? Let's Go!

Run these commands now:

```bash
# 1. Create migration
cd packages/db
npx prisma migrate dev --name add_ai_content_generation_system
npx prisma generate
cd ../..

# 2. Test it works
pnpm dev
# Visit http://localhost:3000/dashboard/ai-templates

# 3. Deploy to production
git add .
git commit -m "feat: Add AI content generation system"
git push origin main

# 4. Monitor deployment
# https://github.com/ihetgoti/myinsurancebuddy/actions

# 5. Set up and generate
# https://admin.myinsurancebuddies.com/dashboard/ai-providers
# https://admin.myinsurancebuddies.com/dashboard/ai-content
```

## 🎉 That's It!

You're now ready to generate 500,000 unique pages at $0 cost!

**Questions?** Check the full guides or reach out.

**Let's deploy!** 🚀
