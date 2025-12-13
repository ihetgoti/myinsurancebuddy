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

# 2. Remove the default Nginx site (this is often the cause of showing wrong websites)
echo "Removing default Nginx site..."
sudo rm -f /etc/nginx/sites-enabled/default

# 3. Update Nginx Configuration
echo "Updating Nginx config file..."
sudo cp nginx.conf $NGINX_AVAILABLE

# 4. Enable the site (remove old symlink first to avoid issues)
echo "Enabling site..."
sudo rm -f $NGINX_ENABLED
sudo ln -sf $NGINX_AVAILABLE $NGINX_ENABLED

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
