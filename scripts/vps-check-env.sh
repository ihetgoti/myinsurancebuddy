#!/bin/bash
# Check VPS Environment - Non-destructive diagnostic

echo "🔍 Checking VPS Environment (No changes will be made)..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

APP_DIR=""
if [ -d "/var/www/myinsurancebuddies.com" ]; then
    APP_DIR="/var/www/myinsurancebuddies.com"
elif [ -d "/var/www/myinsurancebuddy" ]; then
    APP_DIR="/var/www/myinsurancebuddy"
elif [ -d "/opt/myinsurancebuddy" ]; then
    APP_DIR="/opt/myinsurancebuddy"
fi

echo -e "${BLUE}App Directory:${NC} $APP_DIR"
echo ""

# 1. Check .env files
echo -e "${CYAN}1. Environment Files${NC}"
echo "-------------------"

if [ -f "$APP_DIR/apps/web/.env" ]; then
    echo -e "${GREEN}✓${NC} Web .env exists"
    echo "   DATABASE_URL: $(grep DATABASE_URL $APP_DIR/apps/web/.env | cut -d'=' -f2 | head -c 50)..."
else
    echo -e "${RED}✗${NC} Web .env NOT FOUND"
fi

if [ -f "$APP_DIR/apps/admin/.env" ]; then
    echo -e "${GREEN}✓${NC} Admin .env exists"
else
    echo -e "${RED}✗${NC} Admin .env NOT FOUND"
fi
echo ""

# 2. Check PostgreSQL
echo -e "${CYAN}2. PostgreSQL${NC}"
echo "--------------"
if systemctl is-active --quiet postgresql 2>/dev/null; then
    echo -e "${GREEN}✓${NC} PostgreSQL is running"
    
    # Check databases
    echo "   Databases:"
    sudo -u postgres psql -l | grep -E "(myinsurance|Name)" | head -5
    
    # Check users
    echo "   Users:"
    sudo -u postgres psql -c "\du" | grep -E "(mibuser|postgres|Name)"
else
    echo -e "${RED}✗${NC} PostgreSQL is NOT running"
fi
echo ""

# 3. Check Redis
echo -e "${CYAN}3. Redis${NC}"
echo "---------"
if systemctl is-active --quiet redis 2>/dev/null || systemctl is-active --quiet redis-server 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Redis is running"
else
    echo -e "${RED}✗${NC} Redis is NOT running"
fi
echo ""

# 4. Check PM2
echo -e "${CYAN}4. PM2 Processes${NC}"
echo "----------------"
if command -v pm2 &> /dev/null; then
    pm2 list 2>/dev/null || echo -e "${YELLOW}⚠${NC} No PM2 processes"
else
    echo -e "${RED}✗${NC} PM2 not installed"
fi
echo ""

# 5. Check Nginx
echo -e "${CYAN}5. Nginx${NC}"
echo "---------"
if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✓${NC} Nginx is running"
    echo "   Config test:"
    sudo nginx -t 2>&1 | head -2
else
    echo -e "${RED}✗${NC} Nginx is NOT running"
fi
echo ""

# 6. Test connections
echo -e "${CYAN}6. Connection Tests${NC}"
echo "--------------------"

# Test database
echo -n "   Database connection: "
if sudo -u postgres psql -d myinsurancebuddy -c "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ OK${NC}"
else
    echo -e "${RED}✗ FAILED${NC}"
fi

# Test web app
echo -n "   Web app (port 3000): "
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ OK${NC}"
else
    echo -e "${RED}✗ FAILED${NC}"
fi

# Test admin app
echo -n "   Admin app (port 3002): "
if curl -s http://localhost:3002 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ OK${NC}"
else
    echo -e "${RED}✗ FAILED${NC}"
fi
echo ""

# 7. Check disk space
echo -e "${CYAN}7. Disk Space${NC}"
echo "-------------"
df -h / | tail -1 | awk '{print "   Used: "$5 " (" $3 "/" $2 ")"}'
echo ""

# 8. Git status
echo -e "${CYAN}8. Git Status${NC}"
echo "-------------"
if [ -d "$APP_DIR/.git" ]; then
    cd $APP_DIR
    echo "   Branch: $(git branch --show-current 2>/dev/null || echo 'N/A')"
    echo "   Last commit: $(git log -1 --format='%h %s' 2>/dev/null || echo 'N/A')"
else
    echo -e "${YELLOW}⚠${NC} Not a git repository"
fi
echo ""

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Check Complete${NC}"
echo -e "${BLUE}========================================${NC}"
