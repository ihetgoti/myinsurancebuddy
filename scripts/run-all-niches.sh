#!/bin/bash
# run-all-niches.sh
# Runs the working ai-seo-content-generator.js for all 6 niches in parallel

cd /var/www/myinsurancebuddies.com/scripts

# Kill any existing screens
pkill screen 2>/dev/null
screen -wipe 2>/dev/null

# Define niches
NICHES=(
    "health insurance"
    "auto insurance"
    "homeowners insurance"
    "life insurance"
    "disability insurance"
    "long-term care insurance"
)

echo "🚀 Starting 6 parallel content generators..."

for niche in "${NICHES[@]}"; do
    slug=$(echo "$niche" | tr ' ' '-')
    screen_name="gen-${slug}"
    
    echo "Starting: $niche -> screen: $screen_name"
    
    # Create output directory
    mkdir -p "output/${slug}"
    
    # Start in detached screen with INSURANCE_TYPE set
    screen -dmS "$screen_name" bash -c "
        cd /var/www/myinsurancebuddies.com/scripts
        export INSURANCE_TYPE='$niche'
        node ai-seo-content-generator.js 2>&1 | tee output/${slug}/generate.log
    "
    
    sleep 1
done

echo ""
echo "✅ All 6 generators started!"
echo ""
screen -ls
echo ""
echo "📊 Check logs: tail -f output/<niche>/generate.log"
echo "📊 Check all: watch 'wc -l output/*/states_content.csv output/*/cities_content.csv'"
