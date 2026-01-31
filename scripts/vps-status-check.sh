#!/bin/bash
# VPS Status Check Script for MyInsuranceBuddy
# Run this on your VPS to check deployment status

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  MyInsuranceBuddy VPS Status Check${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${YELLOW}Note: Some checks may require sudo${NC}"
    echo ""
fi

# 1. System Resources
echo -e "${CYAN}📊 System Resources${NC}"
echo "-------------------"
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')
DISK_USAGE=$(df -h / | tail -1 | awk '{print $5}' | cut -d'%' -f1)

echo -e "CPU Usage: ${YELLOW}${CPU_USAGE}%${NC}"
echo -e "Memory Usage: ${YELLOW}${MEMORY_USAGE}%${NC}"
echo -e "Disk Usage: ${YELLOW}${DISK_USAGE}%${NC}"
echo ""

# 2. Service Status
echo -e "${CYAN}🔧 Service Status${NC}"
echo "-----------------"

# Check PM2
if command -v pm2 &> /dev/null; then
    echo -e "${GREEN}✓ PM2 installed${NC}"
    pm2 list 2>/dev/null || echo -e "${YELLOW}⚠ No PM2 processes running${NC}"
else
    echo -e "${RED}✗ PM2 not installed${NC}"
fi

# Check Docker
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓ Docker installed${NC}"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null | grep -E "(mib-|NAMES)" || echo -e "${YELLOW}⚠ No MIB containers running${NC}"
else
    echo -e "${RED}✗ Docker not installed${NC}"
fi

# Check Nginx
if systemctl is-active --quiet nginx 2>/dev/null; then
    echo -e "${GREEN}✓ Nginx running${NC}"
elif service nginx status &>/dev/null; then
    echo -e "${GREEN}✓ Nginx running${NC}"
else
    echo -e "${RED}✗ Nginx not running${NC}"
fi

# Check PostgreSQL
if systemctl is-active --quiet postgresql 2>/dev/null; then
    echo -e "${GREEN}✓ PostgreSQL running${NC}"
elif service postgresql status &>/dev/null; then
    echo -e "${GREEN}✓ PostgreSQL running${NC}"
else
    echo -e "${RED}✗ PostgreSQL not running${NC}"
fi

# Check Redis
if systemctl is-active --quiet redis 2>/dev/null; then
    echo -e "${GREEN}✓ Redis running${NC}"
elif service redis-server status &>/dev/null; then
    echo -e "${GREEN}✓ Redis running${NC}"
else
    echo -e "${RED}✗ Redis not running${NC}"
fi
echo ""

# 3. Application Status
echo -e "${CYAN}🚀 Application Status${NC}"
echo "--------------------"

# Check ports
if netstat -tuln 2>/dev/null | grep -q ":3000 "; then
    echo -e "${GREEN}✓ Web app (port 3000) listening${NC}"
else
    echo -e "${RED}✗ Web app (port 3000) not listening${NC}"
fi

if netstat -tuln 2>/dev/null | grep -q ":3002 "; then
    echo -e "${GREEN}✓ Admin app (port 3002) listening${NC}"
else
    echo -e "${YELLOW}⚠ Admin app (port 3002) not listening${NC}"
fi

# Check application directories
if [ -d "/opt/myinsurancebuddy" ]; then
    echo -e "${GREEN}✓ App directory exists (/opt/myinsurancebuddy)${NC}"
    cd /opt/myinsurancebuddy 2>/dev/null && echo -e "  Branch: ${CYAN}$(git branch --show-current 2>/dev/null || echo 'N/A')${NC}" || true
    echo -e "  Last commit: ${CYAN}$(git log -1 --format='%h %s' 2>/dev/null || echo 'N/A')${NC}" || true
else
    echo -e "${RED}✗ App directory not found${NC}"
fi
echo ""

# 4. Database Status
echo -e "${CYAN}🗄️  Database Status${NC}"
echo "------------------"
if sudo -u postgres psql -c "\l" 2>/dev/null | grep -q "myinsurancebuddy"; then
    echo -e "${GREEN}✓ Database 'myinsurancebuddy' exists${NC}"
    
    # Check connection count
    CONN_COUNT=$(sudo -u postgres psql -d myinsurancebuddy -t -c "SELECT count(*) FROM pg_stat_activity WHERE datname = 'myinsurancebuddy';" 2>/dev/null | xargs)
    echo -e "  Active connections: ${CYAN}${CONN_COUNT}${NC}"
    
    # Check table count
    TABLE_COUNT=$(sudo -u postgres psql -d myinsurancebuddy -t -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | xargs)
    echo -e "  Tables: ${CYAN}${TABLE_COUNT}${NC}"
else
    echo -e "${RED}✗ Database 'myinsurancebuddy' not found${NC}"
fi
echo ""

# 5. SSL Certificate Status
echo -e "${CYAN}🔒 SSL Certificate Status${NC}"
echo "-------------------------"
if command -v certbot &> /dev/null; then
    certbot certificates 2>/dev/null | grep -E "(Certificate Name|Domains|Expiry Date)" || echo -e "${YELLOW}⚠ No certificates found${NC}"
else
    echo -e "${YELLOW}⚠ Certbot not installed${NC}"
fi
echo ""

# 6. Recent Logs
echo -e "${CYAN}📝 Recent Errors (last 5)${NC}"
echo "------------------------"
if [ -d "/opt/myinsurancebuddy" ]; then
    # Check PM2 logs
    if command -v pm2 &> /dev/null; then
        pm2 logs --lines 5 2>/dev/null | tail -20 || echo -e "${YELLOW}No PM2 logs available${NC}"
    fi
    
    # Check Nginx error logs
    if [ -f "/var/log/nginx/error.log" ]; then
        echo -e "${CYAN}Nginx errors:${NC}"
        tail -5 /var/log/nginx/error.log 2>/dev/null | grep -E "(error|Error)" || echo -e "${GREEN}No recent nginx errors${NC}"
    fi
else
    echo -e "${YELLOW}App not deployed yet${NC}"
fi
echo ""

# 7. Network Status
echo -e "${CYAN}🌐 Network Status${NC}"
echo "-----------------"
IP_ADDR=$(curl -s ifconfig.me 2>/dev/null || echo "N/A")
echo -e "Server IP: ${CYAN}${IP_ADDR}${NC}"

# Check HTTP response
echo -e "\nHTTP Health Checks:"
for url in "http://localhost:3000" "http://localhost:3000/api/health"; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" ${url} 2>/dev/null || echo "000")
    if [ "$STATUS" = "200" ]; then
        echo -e "  ${GREEN}✓${NC} ${url} (${STATUS})"
    else
        echo -e "  ${RED}✗${NC} ${url} (${STATUS})"
    fi
done
echo ""

# 8. Quick Diagnostics
echo -e "${CYAN}🔍 Quick Diagnostics${NC}"
echo "--------------------"

# Check Node version
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "Node.js: ${GREEN}${NODE_VERSION}${NC}"
else
    echo -e "Node.js: ${RED}Not installed${NC}"
fi

# Check pnpm
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm --version)
    echo -e "pnpm: ${GREEN}${PNPM_VERSION}${NC}"
else
    echo -e "pnpm: ${RED}Not installed${NC}"
fi

# Check Git
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version | awk '{print $3}')
    echo -e "Git: ${GREEN}${GIT_VERSION}${NC}"
else
    echo -e "Git: ${RED}Not installed${NC}"
fi
echo ""

# Summary
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Summary${NC}"
echo -e "${BLUE}========================================${NC}"

# Count issues
ISSUES=0
if ! systemctl is-active --quiet nginx 2>/dev/null; then ((ISSUES++)); fi
if ! systemctl is-active --quiet postgresql 2>/dev/null; then ((ISSUES++)); fi
if ! netstat -tuln 2>/dev/null | grep -q ":3000 "; then ((ISSUES++)); fi

if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}✅ All systems operational!${NC}"
else
    echo -e "${YELLOW}⚠ ${ISSUES} issue(s) detected${NC}"
    echo -e "Run: ${CYAN}sudo ./scripts/fresh-vps-deploy.sh${NC} to fix"
fi

echo ""
echo -e "${CYAN}Useful commands:${NC}"
echo -e "  ${YELLOW}pm2 status${NC}          - Check PM2 processes"
echo -e "  ${YELLOW}pm2 logs${NC}            - View application logs"
echo -e "  ${YELLOW}docker ps${NC}           - Check Docker containers"
echo -e "  ${YELLOW}sudo nginx -t${NC}       - Test nginx config"
echo -e "  ${YELLOW}sudo systemctl status postgresql${NC} - Check database"
