#!/bin/bash

# Fix Nginx Configuration for myinsurancebuddies.com

DOMAIN="myinsurancebuddies.com"
NGINX_AVAILABLE="/etc/nginx/sites-available/$DOMAIN"
NGINX_ENABLED="/etc/nginx/sites-enabled/$DOMAIN"
PROJECT_DIR="/var/www/$DOMAIN"

echo "Fixing Nginx configuration..."

# Ensure we are in the project directory
cd $PROJECT_DIR

# 1. Remove the static index.html if it exists (it conflicts with the proxy)
if [ -f "index.html" ]; then
    echo "Removing static index.html..."
    rm -f index.html
fi

# 2. Update Nginx Configuration
echo "Updating Nginx config file..."
sudo cp nginx.conf $NGINX_AVAILABLE

# 3. Check for SSL Certificates and enable SSL if present
if [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then
    echo "SSL certificates found. Enabling SSL..."
    # Add SSL configuration to the file
    sudo sed -i '/server_name/a \
    listen 443 ssl; \
    ssl_certificate /etc/letsencrypt/live/'$DOMAIN'/fullchain.pem; \
    ssl_certificate_key /etc/letsencrypt/live/'$DOMAIN'/privkey.pem; \
    include /etc/letsencrypt/options-ssl-nginx.conf; \
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;' $NGINX_AVAILABLE
fi

# 4. Enable the site
if [ ! -L "$NGINX_ENABLED" ]; then
    echo "Enabling site..."
    sudo ln -sf $NGINX_AVAILABLE $NGINX_ENABLED
fi

# 5. Test and Reload Nginx
echo "Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "Reloading Nginx..."
    sudo systemctl reload nginx
    echo "✅ Nginx fixed and reloaded!"
else
    echo "❌ Nginx configuration test failed!"
    exit 1
fi
