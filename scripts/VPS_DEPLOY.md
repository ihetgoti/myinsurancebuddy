# VPS Deployment Guide

Your VPS: The one configured in GitHub secrets (VPS_HOST)
Project path: `/var/www/myinsurancebuddies.com`

## Quick Deploy

```bash
# 1. SSH into your VPS (use your credentials)
ssh root@YOUR_VPS_IP

# 2. Navigate to project
cd /var/www/myinsurancebuddies.com

# 3. Create scripts directory if needed
mkdir -p scripts/data scripts/output/car-insurance

# 4. Copy the generator script
cat > scripts/car-insurance-vps.js << 'SCRIPT_EOF'
# (paste the full script content here, or use git pull)
SCRIPT_EOF

# 5. Or simply pull latest from GitHub
git pull origin main

# 6. Navigate to scripts
cd scripts

# 7. Install dependencies
npm install

# 8. Create .env
cat > .env << 'EOF'
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=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
OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct:free
EOF

# 9. Make sure your data files exist
# states.csv and cities.csv should be in ./data/

# 10. Run the generator in background
screen -S generator -d -m node car-insurance-vps.js

# Done! Now forget about it.
```

## Monitor Progress

```bash
# View live log
tail -f /var/www/myinsurancebuddies.com/scripts/output/car-insurance/generator.log

# Check how many done
cat /var/www/myinsurancebuddies.com/scripts/output/car-insurance/progress.json
```

## Auto-Resume

If VPS restarts or script crashes, just run again:
```bash
cd /var/www/myinsurancebuddies.com/scripts
screen -S generator -d -m node car-insurance-vps.js
```

It automatically resumes from where it stopped.

## When Complete

You'll see in the log:
```
🎉 COMPLETE!
States: 51/51
Cities: XXX/XXX
```

Output files:
- `output/car-insurance/states_content.csv`
- `output/car-insurance/cities_content.csv`
