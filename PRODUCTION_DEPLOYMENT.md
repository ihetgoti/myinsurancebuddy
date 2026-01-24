# 🚀 Production Deployment Guide - AI Content System

## ⚠️ IMPORTANT: Pre-Deployment Checklist

Before pushing to production, complete these steps locally:

---

## Step 1: Create Prisma Migration (LOCAL - 5 minutes)

The AI content system includes new database tables that need to be migrated.

### Create the Migration

```bash
cd packages/db
npx prisma migrate dev --name add_ai_content_generation_system
```

This will create a new migration file in `packages/db/prisma/migrations/` with all the AI-related changes:
- Add AI fields to `Page` model (aiGeneratedContent, aiModel, etc.)
- Create `AIProvider` table
- Create `AIGenerationJob` table
- Create `AIPromptTemplate` table
- Add necessary indexes

### Verify the Migration

```bash
# Check that migration was created
ls -la packages/db/prisma/migrations/

# You should see a new folder like: 20250124_add_ai_content_generation_system/
```

### Test Locally

```bash
# Run the migration on your local database
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Test that it works
cd ../..
pnpm dev
```

Visit http://localhost:3000/dashboard/ai-templates and verify the new page loads.

---

## Step 2: Update GitHub Actions Workflow (LOCAL - 2 minutes)

We need to change from `prisma db push` (dangerous for production) to `prisma migrate deploy` (safe, proper migrations).

### What's Being Changed

The current workflow uses:
```bash
npx prisma db push --accept-data-loss  # ❌ DANGEROUS for production!
```

We're updating it to:
```bash
npx prisma migrate deploy  # ✅ SAFE - uses proper migrations
```

### Changes Made

The GitHub Actions workflow has been updated to:
1. Use `prisma migrate deploy` instead of `db push`
2. Add migration status check
3. Keep seed command for initial setup

---

## Step 3: Commit and Push (LOCAL - 2 minutes)

```bash
# Add the migration files
git add packages/db/prisma/migrations/
git add packages/db/prisma/schema.prisma
git add .github/workflows/deploy.yml
git add apps/admin/app/dashboard/ai-templates/
git add apps/admin/app/api/ai-templates/
git add apps/admin/components/AdminLayout.tsx
git add PRODUCTION_DEPLOYMENT.md

# Commit
git commit -m "feat: Add AI content generation system with prompt templates

- Add AIProvider model for managing OpenRouter accounts
- Add AIGenerationJob model for tracking bulk generation
- Add AIPromptTemplate model for custom AI prompts
- Add AI content fields to Page model
- Create admin UI for AI templates management
- Update deployment workflow to use proper migrations"

# Push to main (this will trigger deployment)
git push origin main
```

---

## Step 4: Monitor Deployment (VPS - Auto)

Once you push, GitHub Actions will automatically:

1. ✅ Checkout code
2. ✅ Install dependencies
3. ✅ Generate Prisma client
4. ✅ Build apps
5. ✅ Deploy to VPS via SSH
6. ✅ Run `prisma migrate deploy` (applies all pending migrations)
7. ✅ Seed database (creates defaults if needed)
8. ✅ Build production bundles
9. ✅ Restart PM2 apps

### Watch the Deployment

Go to: **https://github.com/ihetgoti/myinsurancebuddy/actions**

You'll see the deployment workflow running. Click on it to see real-time logs.

---

## Step 5: Verify Production (5 minutes)

### 5.1 Check Database Migration

SSH into your VPS:

```bash
ssh your-username@your-vps-ip
cd /var/www/myinsurancebuddies.com/packages/db
npx prisma migrate status
```

You should see:
```
✔ Database schema is up to date!

Applied migrations:
  └─ 20250124_add_ai_content_generation_system
```

### 5.2 Verify Admin UI

Visit your production admin:
- **https://admin.myinsurancebuddies.com/dashboard/ai-templates**
- **https://admin.myinsurancebuddies.com/dashboard/ai-providers**
- **https://admin.myinsurancebuddies.com/dashboard/ai-content**

All three pages should load without errors.

### 5.3 Check Database Tables

```bash
# SSH to VPS
ssh your-username@your-vps-ip
cd /var/www/myinsurancebuddies.com/packages/db

# Check tables exist
npx prisma db execute --stdin <<SQL
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('AIProvider', 'AIGenerationJob', 'AIPromptTemplate')
ORDER BY table_name;
SQL
```

You should see:
```
AIGenerationJob
AIPromptTemplate
AIProvider
```

---

## Step 6: Set Up OpenRouter API Keys (Production - 5 minutes)

### 6.1 Get FREE OpenRouter Keys

1. Go to https://openrouter.ai
2. Sign up for 3-5 FREE accounts using Gmail aliases:
   - yourname+prod1@gmail.com
   - yourname+prod2@gmail.com
   - yourname+prod3@gmail.com
3. For each account:
   - Go to Settings → API Keys
   - Create new key
   - Copy it (starts with `sk-or-...`)

### 6.2 Add Keys to Production Admin

Visit: **https://admin.myinsurancebuddies.com/dashboard/ai-providers**

For each key:
- **Name:** "Production Account 1", "Production Account 2", etc.
- **API Key:** Paste the `sk-or-v1-xxx...` key
- **Model:** `xiaomi/mimo-v2-flash` (FREE, expires Jan 26!)
- **Budget:** Leave empty (unlimited free tier)
- **Priority:** 0, 1, 2 (in order)
- Click "Add Provider"

---

## Step 7: Start AI Generation (Production - 2 minutes)

Visit: **https://admin.myinsurancebuddies.com/dashboard/ai-content**

### Test Run (100 pages - 5 minutes)

- **Insurance Type:** Auto Insurance
- **State:** California
- **Priority:** Major Cities Only
- **Sections:** ✅ All checked
- **Model:** `xiaomi/mimo-v2-flash`
- **Batch Size:** 20
- **Delay:** 2000ms

Click **"Start AI Generation"**

### Monitor Progress

The "Recent Jobs" section will show:
- Real-time progress
- Pages processed
- Success/failure counts
- Estimated cost (should stay at $0 with free models!)

### Verify Generated Content

After the test job completes, visit a generated page:
- **https://myinsurancebuddies.com/car-insurance/us/california/los-angeles**

Check that:
- ✅ Intro content is unique and location-specific
- ✅ FAQs mention Los Angeles
- ✅ Tips are relevant to California
- ✅ No hardcoded template fallbacks shown

---

## 🎯 Full Production Rollout

Once the test is successful, generate all 500k pages:

### Phase 1: Major Cities (FREE - 2-3 hours)

```
Insurance Type: All
State: All
Priority: Major Cities Only
Model: xiaomi/mimo-v2-flash
Batch Size: 20
Delay: 2000ms
```

**Result:** ~50,000 high-value pages with premium quality

### Phase 2: State Pages (FREE - 5 minutes)

```
Insurance Type: All
GeoLevel: STATE
Priority: States Only
Model: xiaomi/mimo-v2-flash
```

**Result:** ~1,500 state-level pages

### Phase 3: All Remaining (FREE - 20-24 hours)

```
Insurance Type: All
Priority: All Pages
Model: xiaomi/mimo-v2-flash (until Jan 26)
         deepseek/deepseek-r1 (after Jan 26 - still FREE!)
Batch Size: 20-30
Delay: 1000-2000ms
```

**Result:** All ~450,000 remaining pages

**Total Cost: $0** 🎉

---

## 🚨 Troubleshooting

### Migration Fails on Production

**Error:** "Migration failed to apply"

**Fix:**
```bash
# SSH to VPS
ssh your-username@your-vps-ip
cd /var/www/myinsurancebuddies.com/packages/db

# Check migration status
npx prisma migrate status

# If stuck, reset to a clean state (BE CAREFUL!)
npx prisma migrate resolve --rolled-back 20250124_add_ai_content_generation_system
npx prisma migrate deploy
```

### Admin Pages Show 404

**Error:** "Page not found"

**Fix:**
```bash
# SSH to VPS
cd /var/www/myinsurancebuddies.com

# Rebuild admin app
pnpm build --filter=admin

# Restart PM2
pm2 restart admin
```

### Database Connection Error

**Error:** "Can't reach database server"

**Fix:**
```bash
# Check .env file has correct DATABASE_URL
cd /var/www/myinsurancebuddies.com
cat .env | grep DATABASE_URL

# If missing, add it:
echo 'DATABASE_URL="postgresql://user:pass@localhost:5432/myinsurancebuddy_prod"' >> .env

# Restart apps
pm2 restart all
```

### Rate Limit Errors

**Error:** "Rate limit exceeded"

**Fix:**
- Add more free OpenRouter accounts (up to 5)
- Increase delay between batches (3000-5000ms)
- Decrease batch size (10 instead of 20)

### AI Content Not Showing on Pages

**Error:** Pages still show hardcoded content

**Fix:**
```bash
# Clear Next.js cache on VPS
ssh your-username@your-vps-ip
cd /var/www/myinsurancebuddies.com
rm -rf apps/web/.next
pnpm build --filter=web
pm2 restart web
```

---

## 📊 Production Monitoring

### Check AI Generation Progress

**Database Query:**
```sql
SELECT
  COUNT(*) as total_pages,
  SUM(CASE WHEN "isAiGenerated" = true THEN 1 ELSE 0 END) as generated,
  SUM(CASE WHEN "isAiGenerated" = false THEN 1 ELSE 0 END) as remaining,
  ROUND(SUM(CASE WHEN "isAiGenerated" = true THEN 1 ELSE 0 END)::numeric / COUNT(*) * 100, 2) as progress_pct
FROM "Page";
```

### Check Job Status

**Admin UI:** https://admin.myinsurancebuddies.com/dashboard/ai-content

Shows:
- Active jobs
- Completed jobs
- Success/failure rates
- Total cost (should be $0!)

### Check API Usage

**Admin UI:** https://admin.myinsurancebuddies.com/dashboard/ai-providers

Shows:
- Request count per account
- Budget used (should be $0!)
- Last used timestamp
- Active/inactive status

---

## 🔐 Security Checklist

- [ ] Database backups enabled (before migration)
- [ ] OpenRouter API keys stored only in production database
- [ ] API keys not exposed in GitHub repository
- [ ] Admin dashboard requires authentication
- [ ] Rate limiting enabled on AI generation
- [ ] Error logging configured
- [ ] Monitoring alerts set up

---

## 📈 Expected Results

After full deployment:

✅ **500,000 pages** with unique AI-generated content
✅ **$0 total cost** (using free models)
✅ **No duplicate content** - each page is unique
✅ **Location-specific** - mentions city/state details
✅ **SEO-optimized** - Google-friendly unique content
✅ **Better rankings** - unique content ranks higher
✅ **Higher engagement** - users get relevant local information

---

## 🎊 Success Criteria

Your deployment is successful when:

1. ✅ Migration applied successfully (`prisma migrate status` shows all green)
2. ✅ Admin UI loads all 3 AI pages (templates, providers, content)
3. ✅ OpenRouter accounts added and active
4. ✅ Test generation completes without errors
5. ✅ Generated pages show unique content (not hardcoded fallbacks)
6. ✅ Total cost remains $0 (using free models)
7. ✅ No errors in production logs

---

## 📞 Support

If you encounter issues:

1. **Check GitHub Actions logs:** https://github.com/ihetgoti/myinsurancebuddy/actions
2. **Check VPS logs:** `pm2 logs admin` and `pm2 logs web`
3. **Check database:** `npx prisma migrate status`
4. **Review documentation:**
   - [AI_CONTENT_SETUP_GUIDE.md](./AI_CONTENT_SETUP_GUIDE.md)
   - [URGENT_MIMO_SETUP.md](./URGENT_MIMO_SETUP.md)
   - [FREE_AI_SETUP.md](./FREE_AI_SETUP.md)

---

## 🚀 Ready to Deploy?

### Quick Command Summary

```bash
# 1. Create migration locally
cd packages/db
npx prisma migrate dev --name add_ai_content_generation_system
npx prisma generate
cd ../..

# 2. Test locally
pnpm dev
# Visit http://localhost:3000/dashboard/ai-templates

# 3. Commit and push
git add .
git commit -m "feat: Add AI content generation system with prompt templates"
git push origin main

# 4. Monitor deployment
# Watch: https://github.com/ihetgoti/myinsurancebuddy/actions

# 5. Verify production (SSH to VPS)
cd /var/www/myinsurancebuddies.com/packages/db
npx prisma migrate status

# 6. Set up OpenRouter keys
# Visit: https://admin.myinsurancebuddies.com/dashboard/ai-providers

# 7. Start generating!
# Visit: https://admin.myinsurancebuddies.com/dashboard/ai-content
```

---

**⏰ Time Estimate:**
- Local migration: 5 minutes
- Push and deploy: 10 minutes (automatic)
- Verify production: 5 minutes
- Set up API keys: 5 minutes
- Test generation: 5 minutes
- **Total: ~30 minutes to production!**

**💰 Total Cost: $0** (using free models!)

**🎉 Let's deploy!**
