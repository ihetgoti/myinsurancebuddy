#!/bin/bash

# SSL Setup Script for myinsurancebuddies.com
# This script sets up Let's Encrypt SSL certificate with auto-renewal

set -e

echo "========================================="
echo "SSL Setup for myinsurancebuddies.com"
echo "========================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root (use sudo)${NC}"
    exit 1
fi

# Update package list
echo -e "${YELLOW}Updating package list...${NC}"
apt-get update

# Install Certbot and Nginx plugin
echo -e "${YELLOW}Installing Certbot and Nginx plugin...${NC}"
apt-get install -y certbot python3-certbot-nginx

# Check if Nginx is installed
if ! command -v nginx &> /dev/null; then
    echo -e "${RED}Nginx is not installed. Installing...${NC}"
    apt-get install -y nginx
fi

# Stop Nginx temporarily
echo -e "${YELLOW}Stopping Nginx...${NC}"
systemctl stop nginx

# Obtain SSL certificate
echo -e "${YELLOW}Obtaining SSL certificate from Let's Encrypt...${NC}"
echo -e "${GREEN}This will prompt for your email and agreement to terms.${NC}"

certbot certonly --standalone \
    -d myinsurancebuddies.com \
    -d www.myinsurancebuddies.com \
    --non-interactive \
    --agree-tos \
    --email your-email@example.com \
    --no-eff-email || {
        echo -e "${RED}Certificate generation failed. Please check:${NC}"
        echo "1. DNS records are pointing to this server"
        echo "2. Ports 80 and 443 are open"
        echo "3. No other service is using port 80/443"
        exit 1
    }

# Update Nginx configuration with SSL
echo -e "${YELLOW}Updating Nginx configuration...${NC}"

# Create SSL-enabled Nginx config
cat > /etc/nginx/sites-available/myinsurancebuddies.com << 'EOF'
# HTTP - redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    
    server_name myinsurancebuddies.com www.myinsurancebuddies.com;
    
    # Redirect all HTTP traffic to HTTPS
    return 301 https://$server_name$request_uri;
}

# HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    
    server_name myinsurancebuddies.com www.myinsurancebuddies.com;
    
    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/myinsurancebuddies.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/myinsurancebuddies.com/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # HSTS (optional but recommended)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Root directory
    root /var/www/myinsurancebuddies.com;
    index index.html index.htm;
    
    # Logging
    access_log /var/log/nginx/myinsurancebuddies.com-access.log;
    error_log /var/log/nginx/myinsurancebuddies.com-error.log;
    
    # For static sites or built frontend apps
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # For Node.js/Express apps (uncomment if needed)
    # location / {
    #     proxy_pass http://localhost:3000;
    #     proxy_http_version 1.1;
    #     proxy_set_header Upgrade $http_upgrade;
    #     proxy_set_header Connection 'upgrade';
    #     proxy_set_header Host $host;
    #     proxy_set_header X-Real-IP $remote_addr;
    #     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    #     proxy_set_header X-Forwarded-Proto $scheme;
    #     proxy_cache_bypass $http_upgrade;
    # }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
    
    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/myinsurancebuddies.com /etc/nginx/sites-enabled/

# Test Nginx configuration
echo -e "${YELLOW}Testing Nginx configuration...${NC}"
nginx -t || {
    echo -e "${RED}Nginx configuration test failed!${NC}"
    exit 1
}

# Start Nginx
echo -e "${YELLOW}Starting Nginx...${NC}"
systemctl start nginx
systemctl enable nginx

# Set up auto-renewal
echo -e "${YELLOW}Setting up automatic SSL renewal...${NC}"

# Create renewal hook script to reload Nginx
mkdir -p /etc/letsencrypt/renewal-hooks/deploy
cat > /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh << 'EOF'
#!/bin/bash
systemctl reload nginx
EOF
chmod +x /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh

# Test renewal process
echo -e "${YELLOW}Testing renewal process (dry run)...${NC}"
certbot renew --dry-run || {
    echo -e "${YELLOW}Warning: Renewal test failed, but certificate is installed.${NC}"
}

# Add cron job for automatic renewal (certbot usually adds this automatically)
if ! crontab -l 2>/dev/null | grep -q "certbot renew"; then
    (crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet --deploy-hook 'systemctl reload nginx'") | crontab -
    echo -e "${GREEN}Added cron job for automatic renewal${NC}"
fi

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}SSL Setup Complete!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "Certificate details:"
echo -e "  Domain: myinsurancebuddies.com"
echo -e "  Certificate: /etc/letsencrypt/live/myinsurancebuddies.com/fullchain.pem"
echo -e "  Private Key: /etc/letsencrypt/live/myinsurancebuddies.com/privkey.pem"
echo ""
echo -e "Auto-renewal:"
echo -e "  Certbot will automatically renew certificates before they expire"
echo -e "  Cron job runs daily at 3 AM"
echo -e "  Nginx will reload automatically after renewal"
echo ""
echo -e "Your site should now be accessible at:"
echo -e "  ${GREEN}https://myinsurancebuddies.com${NC}"
echo -e "  ${GREEN}https://www.myinsurancebuddies.com${NC}"
echo ""
echo -e "To check certificate status: ${YELLOW}certbot certificates${NC}"
echo -e "To renew manually: ${YELLOW}sudo certbot renew${NC}"
echo -e "To test renewal: ${YELLOW}sudo certbot renew --dry-run${NC}"
echo ""
