#!/bin/bash

echo "🧪 Testing MyInsuranceBuddies Local Setup"
echo "=========================================="
echo ""

# Wait for server to be ready
sleep 5

# Test Web App
echo "📍 Testing Web App (Port 3000)..."
echo ""

echo "1. Health Check:"
curl -s http://localhost:3000/api/health | jq '.' || echo "❌ Failed"
echo ""

echo "2. Homepage:"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$STATUS" = "200" ]; then
    echo "✅ Homepage: OK ($STATUS)"
else
    echo "❌ Homepage: Failed ($STATUS)"
fi
echo ""

echo "3. State Page (California):"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/state/california/insurance-guide)
if [ "$STATUS" = "200" ]; then
    echo "✅ State page: OK ($STATUS)"
else
    echo "❌ State page: Failed ($STATUS)"
fi
echo ""

echo "4. City Page (Los Angeles):"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/city/los-angeles/insurance-guide)
if [ "$STATUS" = "200" ]; then
    echo "✅ City page: OK ($STATUS)"
else
    echo "❌ City page: Failed ($STATUS)"
fi
echo ""

echo "5. Posts API:"
curl -s http://localhost:3000/api/posts | jq 'length' || echo "❌ Failed"
echo ""

echo "6. Templates API:"
curl -s http://localhost:3000/api/templates | jq 'length' || echo "❌ Failed"
echo ""

echo "=========================================="
echo "✅ Local testing complete!"
echo ""
echo "You can now:"
echo "  - Visit http://localhost:3000 (Web App)"
echo "  - Visit http://localhost:3001 (Admin Portal)"
echo "  - Sign in with: admin@myinsurancebuddies.com / changeme123"
