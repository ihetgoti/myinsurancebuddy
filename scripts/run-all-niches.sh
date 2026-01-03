#!/bin/bash
# run-all-niches.sh
# Runs ai-seo-content-generator.js for all 6 niches in parallel
# Each niche gets its own API key for maximum throughput

cd /var/www/myinsurancebuddies.com/scripts

# Kill any existing screens
pkill screen 2>/dev/null
screen -wipe 2>/dev/null

# Define niches with their assigned API keys
# 6 niches, 6 API keys = 1 key per niche = 20 req/min each = 120 req/min total

declare -A NICHE_KEYS
NICHE_KEYS["health insurance"]="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"
NICHE_KEYS["auto insurance"]="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"
NICHE_KEYS["homeowners insurance"]="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"
NICHE_KEYS["life insurance"]="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"
NICHE_KEYS["disability insurance"]="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"
NICHE_KEYS["long-term care insurance"]="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"

echo "🚀 Starting 6 parallel content generators (1 API key per niche)..."
echo ""

for niche in "${!NICHE_KEYS[@]}"; do
    slug=$(echo "$niche" | tr ' ' '-')
    screen_name="gen-${slug}"
    api_key="${NICHE_KEYS[$niche]}"
    
    echo "Starting: $niche"
    echo "   Screen: $screen_name"
    echo "   API Key: ${api_key:0:20}..."
    
    # Create output directory
    mkdir -p "output/${slug}"
    
    # Start in detached screen with its own API key
    screen -dmS "$screen_name" bash -c "
        cd /var/www/myinsurancebuddies.com/scripts
        export INSURANCE_TYPE='$niche'
        export OPENROUTER_API_KEY='$api_key'
        node ai-seo-content-generator.js 2>&1 | tee output/${slug}/generate.log
    "
    
    sleep 1
    echo ""
done

echo "✅ All 6 generators started with separate API keys!"
echo ""
screen -ls
echo ""
echo "📊 Monitor: tail -f output/<niche>/generate.log"
echo "📊 Count:   watch 'wc -l output/*/states_content.csv'"
