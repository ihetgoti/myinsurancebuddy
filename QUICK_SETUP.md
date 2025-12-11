# Quick Setup Guide for myinsurancebuddies.com

## Automated Setup (Recommended)

### One-Command Setup on VPS

```bash
# Download and run the automated setup script
curl -fsSL https://raw.githubusercontent.com/ihetgoti/myinsurancebuddy/main/setup-vps.sh | sudo bash
```

Or manually:

```bash
# SSH into your VPS
ssh root@YOUR_VPS_IP

# Clone the repository temporarily
git clone https://github.com/ihetgoti/myinsurancebuddy.git /tmp/setup
cd /tmp/setup

# Edit the email in setup-vps.sh
nano setup-vps.sh  # Change EMAIL="your-email@example.com" to your actual email

# Run the setup script
chmod +x setup-vps.sh
sudo ./setup-vps.sh
```

The script will automatically:
- ✅ Update system packages
- ✅ Install Nginx, Certbot, and dependencies
- ✅ Configure firewall
- ✅ Clone your repository
- ✅ Detect project type (Node.js/Python/Docker) and install dependencies
- ✅ Configure Nginx for your domain
- ✅ Set up SSL certificate with auto-renewal
- ✅ Start your application

---

## Manual Setup (Alternative)

### 1. Initial Setup (One-time)

```bash
# Create project directory
sudo mkdir -p /var/www/myinsurancebuddies.com
sudo chown $USER:$USER /var/www/myinsurancebuddies.com

# Clone repository
cd /var/www/myinsurancebuddies.com
git clone https://github.com/ihetgoti/myinsurancebuddy.git .
git config --global --add safe.directory /var/www/myinsurancebuddies.com

# Install dependencies (choose your stack)
# Node.js: npm install
# Python: python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt
```

### 2. Configure DNS

Point your domain to the VPS:
- **A Record**: `myinsurancebuddies.com` → `YOUR_VPS_IP`
- **A Record**: `www.myinsurancebuddies.com` → `YOUR_VPS_IP`

Wait 5-10 minutes for DNS propagation.

### 3. Setup Nginx

```bash
cd /var/www/myinsurancebuddies.com

# Copy Nginx config
sudo cp nginx.conf /etc/nginx/sites-available/myinsurancebuddies.com
sudo ln -s /etc/nginx/sites-available/myinsurancebuddies.com /etc/nginx/sites-enabled/

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Setup SSL (Free Let's Encrypt)

```bash
cd /var/www/myinsurancebuddies.com

# Make script executable
chmod +x setup-ssl.sh

# Edit to add your email
nano setup-ssl.sh
# Change: your-email@example.com to your actual email

# Run the script
sudo ./setup-ssl.sh
```

That's it! Your site will be live at:
- ✅ https://myinsurancebuddies.com
- ✅ https://www.myinsurancebuddies.com

SSL will auto-renew every 90 days.

## On GitHub

### Setup Secrets

Go to: https://github.com/ihetgoti/myinsurancebuddy/settings/secrets/actions

Add these secrets:
- `VPS_HOST` - Your VPS IP address
- `VPS_USERNAME` - Your SSH username (usually `root`)
- `VPS_SSH_KEY` - Your private SSH key (see DEPLOYMENT.md for details)
- `VPS_PORT` - SSH port (usually `22`)

## Future Deployments

Just push to main branch:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

GitHub Actions will automatically deploy to your VPS!

---

**Full Documentation:** See [DEPLOYMENT.md](DEPLOYMENT.md)
