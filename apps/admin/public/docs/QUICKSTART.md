# Quickstart Guide for Contabo VPS Deployment

This guide assumes you have a fresh Ubuntu 22.04 VPS from Contabo.

## 1. Initial Server Setup

SSH into your server as root:
```bash
ssh root@<your_vps_ip>
```

Update and install dependencies:
```bash
apt update && apt upgrade -y
apt install -y curl git nginx unzip certbot python3-certbot-nginx
```

Install Node.js 20:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm install -g pnpm pm2
```

Install PostgreSQL:
```bash
apt install -y postgresql postgresql-contrib
systemctl start postgresql
systemctl enable postgresql
```

## 2. Database Setup

Switch to postgres user and create DB:
```bash
sudo -u postgres psql
```

Inside psql shell:
```sql
CREATE DATABASE myinsurancebuddy;
CREATE USER myuser WITH ENCRYPTED PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE myinsurancebuddy TO myuser;
ALTER USER myuser CREATEDB;
\q
```

## 3. Application Setup

Create directory and clone repo:
```bash
mkdir -p /var/www/myinsurancebuddy
chown -R $USER:$USER /var/www/myinsurancebuddy
git clone <your_repo_url> /var/www/myinsurancebuddy
cd /var/www/myinsurancebuddy
```

Create `.env` file:
```bash
cp env.example .env
nano .env
```
Update `DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/myinsurancebuddy?schema=public"` and other secrets.

## 4. Deployment

Run the deployment script:
```bash
chmod +x scripts/build_and_deploy.sh
./scripts/build_and_deploy.sh
```

## 5. Nginx Setup

Copy the Nginx config:
```bash
cp infra/nginx/site.conf /etc/nginx/sites-available/myinsurancebuddy
ln -s /etc/nginx/sites-available/myinsurancebuddy /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

## 6. SSL Setup

Run Certbot:
```bash
certbot --nginx -d myinsurancebuddies.com -d www.myinsurancebuddies.com
```

Your site should now be live!
