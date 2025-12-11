#!/bin/bash

# VPS Setup Script for myinsurancebuddies.com
# Run this script on your Contabo VPS to set up everything automatically

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="myinsurancebuddies.com"
WWW_DOMAIN="www.myinsurancebuddies.com"
PROJECT_DIR="/var/www/myinsurancebuddies.com"
REPO_URL="https://github.com/ihetgoti/myinsurancebuddy.git"
EMAIL="your-email@example.com"  # CHANGE THIS!

echo -e "${BLUE}"
echo "========================================="
echo "  VPS Setup for myinsurancebuddies.com"
echo "========================================="
echo -e "${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root (use sudo)${NC}"
    exit 1
fi

# Get the actual user (not root)
ACTUAL_USER=${SUDO_USER:-$USER}
if [ "$ACTUAL_USER" = "root" ]; then
    read -p "Enter the username to own the project files: " ACTUAL_USER
fi

echo -e "${YELLOW}Configuration:${NC}"
echo "  Domain: $DOMAIN"
echo "  Project Directory: $PROJECT_DIR"
echo "  Repository: $REPO_URL"
echo "  User: $ACTUAL_USER"
echo ""
read -p "Continue with this configuration? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
fi

# Update system
echo -e "${YELLOW}[1/10] Updating system packages...${NC}"
apt-get update
apt-get upgrade -y

# Install essential packages
echo -e "${YELLOW}[2/10] Installing essential packages...${NC}"
apt-get install -y curl wget git ufw

# Install Nginx
echo -e "${YELLOW}[3/10] Installing Nginx...${NC}"
apt-get install -y nginx
systemctl enable nginx

# Install Certbot for SSL
echo -e "${YELLOW}[4/10] Installing Certbot for SSL...${NC}"
apt-get install -y certbot python3-certbot-nginx

# Setup firewall
echo -e "${YELLOW}[5/10] Configuring firewall...${NC}"
ufw --force enable
ufw allow 22/tcp      # SSH
ufw allow 80/tcp      # HTTP
ufw allow 443/tcp     # HTTPS
ufw status

# Create project directory
echo -e "${YELLOW}[6/10] Creating project directory...${NC}"
mkdir -p $PROJECT_DIR
chown -R $ACTUAL_USER:$ACTUAL_USER $PROJECT_DIR

# Clone repository
echo -e "${YELLOW}[7/10] Cloning repository...${NC}"
if [ -d "$PROJECT_DIR/.git" ]; then
    echo "Repository already exists. Pulling latest changes..."
    cd $PROJECT_DIR
    sudo -u $ACTUAL_USER git pull origin main
else
    sudo -u $ACTUAL_USER git clone $REPO_URL $PROJECT_DIR
fi

cd $PROJECT_DIR
sudo -u $ACTUAL_USER git config --global --add safe.directory $PROJECT_DIR

# Detect project type and install dependencies
echo -e "${YELLOW}[8/10] Detecting project type and installing dependencies...${NC}"

if [ -f "$PROJECT_DIR/package.json" ]; then
    echo "Node.js project detected. Installing Node.js and dependencies..."
    
    # Install Node.js
    if ! command -v node &> /dev/null; then
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
        apt-get install -y nodejs
    fi
    
    # Install dependencies
    cd $PROJECT_DIR
    sudo -u $ACTUAL_USER npm install
    
    # Install PM2 for process management
    npm install -g pm2
    
    # Build if build script exists
    if grep -q '"build"' package.json; then
        sudo -u $ACTUAL_USER npm run build
    fi
    
    # Start application with PM2
    if grep -q '"start"' package.json; then
        sudo -u $ACTUAL_USER pm2 delete myinsurancebuddies 2>/dev/null || true
        sudo -u $ACTUAL_USER pm2 start npm --name "myinsurancebuddies" -- start
        sudo -u $ACTUAL_USER pm2 save
        
        # Setup PM2 to start on boot
        env PATH=$PATH:/usr/bin pm2 startup systemd -u $ACTUAL_USER --hp /home/$ACTUAL_USER
    fi
    
elif [ -f "$PROJECT_DIR/requirements.txt" ]; then
    echo "Python project detected. Installing Python and dependencies..."
    
    # Install Python
    apt-get install -y python3 python3-pip python3-venv
    
    # Create virtual environment
    cd $PROJECT_DIR
    sudo -u $ACTUAL_USER python3 -m venv venv
    sudo -u $ACTUAL_USER ./venv/bin/pip install -r requirements.txt
    
elif [ -f "$PROJECT_DIR/docker-compose.yml" ] || [ -f "$PROJECT_DIR/Dockerfile" ]; then
    echo "Docker project detected. Installing Docker..."
    
    # Install Docker
    if ! command -v docker &> /dev/null; then
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
        usermod -aG docker $ACTUAL_USER
    fi
    
    # Install Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
    fi
    
    # Start containers
    cd $PROJECT_DIR
    docker-compose down || true
    docker-compose up -d --build
    
else
    echo "No specific project type detected (package.json, requirements.txt, or docker-compose.yml not found)."
    echo "Assuming static website or manual setup required."
fi

# Configure Nginx
echo -e "${YELLOW}[9/10] Configuring Nginx...${NC}"

# Check if nginx.conf exists in repo
if [ -f "$PROJECT_DIR/nginx.conf" ]; then
    cp $PROJECT_DIR/nginx.conf /etc/nginx/sites-available/$DOMAIN
else
    # Create basic Nginx configuration
    cat > /etc/nginx/sites-available/$DOMAIN << EOF
server {
    listen 80;
    listen [::]:80;
    
    server_name $DOMAIN $WWW_DOMAIN;
    
    root $PROJECT_DIR;
    index index.html index.htm;
    
    access_log /var/log/nginx/${DOMAIN}-access.log;
    error_log /var/log/nginx/${DOMAIN}-error.log;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
}
EOF
fi

# Enable site
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/

# Remove default site if exists
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Reload Nginx
systemctl reload nginx

# Setup SSL with Let's Encrypt
echo -e "${YELLOW}[10/10] Setting up SSL certificate...${NC}"

# Check if email is still default
if [ "$EMAIL" = "your-email@example.com" ]; then
    read -p "Enter your email for SSL certificate: " EMAIL
fi

echo "Obtaining SSL certificate for $DOMAIN and $WWW_DOMAIN..."
echo "Make sure DNS records are pointing to this server!"
echo ""
read -p "Are DNS records configured? (y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Stop Nginx temporarily for standalone verification
    systemctl stop nginx
    
    # Obtain certificate
    certbot certonly --standalone \
        -d $DOMAIN \
        -d $WWW_DOMAIN \
        --non-interactive \
        --agree-tos \
        --email $EMAIL \
        --no-eff-email || {
            echo -e "${YELLOW}Certificate generation failed. You can run it manually later:${NC}"
            echo "sudo certbot --nginx -d $DOMAIN -d $WWW_DOMAIN"
            systemctl start nginx
        }
    
    if [ $? -eq 0 ]; then
        # Update Nginx config with SSL
        cat > /etc/nginx/sites-available/$DOMAIN << EOF
# HTTP - redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN $WWW_DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

# HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    
    server_name $DOMAIN $WWW_DOMAIN;
    
    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    root $PROJECT_DIR;
    index index.html index.htm;
    
    access_log /var/log/nginx/${DOMAIN}-access.log;
    error_log /var/log/nginx/${DOMAIN}-error.log;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # For Node.js apps (uncomment if needed)
    # location / {
    #     proxy_pass http://localhost:3000;
    #     proxy_http_version 1.1;
    #     proxy_set_header Upgrade \$http_upgrade;
    #     proxy_set_header Connection 'upgrade';
    #     proxy_set_header Host \$host;
    #     proxy_set_header X-Real-IP \$remote_addr;
    #     proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    #     proxy_set_header X-Forwarded-Proto \$scheme;
    #     proxy_cache_bypass \$http_upgrade;
    # }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
}
EOF
        
        # Setup auto-renewal
        mkdir -p /etc/letsencrypt/renewal-hooks/deploy
        cat > /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh << 'EOF'
#!/bin/bash
systemctl reload nginx
EOF
        chmod +x /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh
        
        # Add cron job if not exists
        if ! crontab -l 2>/dev/null | grep -q "certbot renew"; then
            (crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet --deploy-hook 'systemctl reload nginx'") | crontab -
        fi
        
        # Test renewal
        certbot renew --dry-run || echo -e "${YELLOW}Renewal test failed, but certificate is installed${NC}"
    fi
    
    # Start Nginx
    systemctl start nginx
else
    echo -e "${YELLOW}Skipping SSL setup. You can run it later with:${NC}"
    echo "sudo certbot --nginx -d $DOMAIN -d $WWW_DOMAIN"
fi

# Final status check
echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}     Setup Complete!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "✅ System updated"
echo -e "✅ Nginx installed and configured"
echo -e "✅ Firewall configured"
echo -e "✅ Project cloned to: $PROJECT_DIR"
echo -e "✅ Dependencies installed"

if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    echo -e "✅ SSL certificate installed"
    echo -e "✅ Auto-renewal configured"
    echo ""
    echo -e "Your site is live at:"
    echo -e "  ${GREEN}https://$DOMAIN${NC}"
    echo -e "  ${GREEN}https://$WWW_DOMAIN${NC}"
else
    echo -e "⚠️  SSL certificate not installed"
    echo ""
    echo -e "Your site is live at:"
    echo -e "  ${YELLOW}http://$DOMAIN${NC}"
    echo ""
    echo -e "To add SSL, run:"
    echo -e "  ${YELLOW}sudo certbot --nginx -d $DOMAIN -d $WWW_DOMAIN${NC}"
fi

echo ""
echo -e "Useful commands:"
echo -e "  Check Nginx status:  ${BLUE}sudo systemctl status nginx${NC}"
echo -e "  Check SSL status:    ${BLUE}sudo certbot certificates${NC}"
echo -e "  View Nginx logs:     ${BLUE}sudo tail -f /var/log/nginx/${DOMAIN}-error.log${NC}"

if command -v pm2 &> /dev/null; then
    echo -e "  View app logs:       ${BLUE}pm2 logs myinsurancebuddies${NC}"
    echo -e "  Restart app:         ${BLUE}pm2 restart myinsurancebuddies${NC}"
fi

echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "1. Configure GitHub Actions secrets (see DEPLOYMENT.md)"
echo "2. Push code changes to trigger auto-deployment"
echo "3. Monitor logs for any issues"
echo ""
