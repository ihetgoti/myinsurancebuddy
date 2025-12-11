# CI/CD Setup Guide - Contabo VPS Deployment

## Prerequisites

1. **Contabo VPS** with SSH access
2. **GitHub Repository** (already set up: myinsurancebuddy)
3. **Git** installed on your VPS
4. **SSH Key** for GitHub Actions to access your VPS

## Setup Instructions

### 1. Generate SSH Key Pair for GitHub Actions

On your local machine or VPS, generate a new SSH key:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy
```

This creates two files:
- `~/.ssh/github_actions_deploy` (private key)
- `~/.ssh/github_actions_deploy.pub` (public key)

### 2. Configure Your Contabo VPS

#### a. Add the public key to authorized_keys

SSH into your Contabo VPS and run:

```bash
# Add the public key to authorized_keys
cat >> ~/.ssh/authorized_keys << 'EOF'
[PASTE YOUR PUBLIC KEY HERE from github_actions_deploy.pub]
EOF

# Set correct permissions
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

#### b. Set up your project directory on VPS

```bash
# Create project directory
sudo mkdir -p /var/www/myinsurancebuddy
sudo chown $USER:$USER /var/www/myinsurancebuddy

# Clone your repository
cd /var/www/myinsurancebuddy
git clone https://github.com/ihetgoti/myinsurancebuddy.git .

# Configure git to allow the directory
git config --global --add safe.directory /var/www/myinsurancebuddy
```

### 3. Configure GitHub Secrets

Add the following secrets to your GitHub repository:

1. Go to: `https://github.com/ihetgoti/myinsurancebuddy/settings/secrets/actions`
2. Click "New repository secret" for each:

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `VPS_HOST` | Your Contabo VPS IP address or hostname | `123.45.67.89` |
| `VPS_USERNAME` | SSH username (usually 'root' or your user) | `root` or `username` |
| `VPS_SSH_KEY` | Private key content (github_actions_deploy) | Copy entire private key file |
| `VPS_PORT` | SSH port (default: 22) | `22` |
| `VPS_PROJECT_PATH` | Project path on VPS | `/var/www/myinsurancebuddy` |

#### How to copy the private key:

```bash
cat ~/.ssh/github_actions_deploy
# Copy the entire output including:
# -----BEGIN OPENSSH PRIVATE KEY-----
# ... key content ...
# -----END OPENSSH PRIVATE KEY-----
```

### 4. VPS Setup Based on Your Stack

Choose the appropriate setup for your application:

#### For Node.js Applications:

```bash
# Install Node.js (on VPS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Start your app
cd /var/www/myinsurancebuddy
npm install
pm2 start npm --name "myinsurancebuddy" -- start
pm2 save
pm2 startup
```

#### For Python Applications:

```bash
# Install Python and pip (on VPS)
sudo apt-get update
sudo apt-get install -y python3 python3-pip python3-venv

# Create virtual environment
cd /var/www/myinsurancebuddy
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Set up systemd service (create /etc/systemd/system/myinsurancebuddy.service)
```

#### For Docker Applications:

```bash
# Install Docker (on VPS)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Start containers
cd /var/www/myinsurancebuddy
docker-compose up -d
```

### 5. Update the Workflow File

Edit [.github/workflows/deploy.yml](.github/workflows/deploy.yml) and uncomment the appropriate deployment commands for your stack.

### 6. Test the Deployment

1. Make a change to your code
2. Commit and push to the `main` branch:
   ```bash
   git add .
   git commit -m "Test CI/CD deployment"
   git push origin main
   ```
3. Go to: `https://github.com/ihetgoti/myinsurancebuddy/actions`
4. Watch the deployment workflow run

### 7. Manual Deployment Trigger

You can also trigger deployment manually:
- Go to Actions tab in GitHub
- Select "Deploy to Contabo VPS" workflow
- Click "Run workflow"

## Troubleshooting

### SSH Connection Issues

```bash
# Test SSH connection from your local machine
ssh -i ~/.ssh/github_actions_deploy VPS_USERNAME@VPS_HOST

# Check VPS SSH logs
sudo tail -f /var/log/auth.log
```

### Permission Issues

```bash
# On VPS, ensure correct ownership
sudo chown -R $USER:$USER /var/www/myinsurancebuddy
```

### Git Pull Fails

```bash
# On VPS, reset git to clean state
cd /var/www/myinsurancebuddy
git fetch origin
git reset --hard origin/main
```

## Security Best Practices

1. **Use a dedicated deployment user** instead of root
2. **Restrict SSH key permissions** to only necessary directories
3. **Use firewall** to limit access (UFW or iptables)
4. **Enable fail2ban** to prevent brute force attacks
5. **Keep VPS updated**: `sudo apt update && sudo apt upgrade`

## Additional Features

### Add Build & Test Steps

You can add build and test steps before deployment:

```yaml
- name: Set up Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'

- name: Install dependencies
  run: npm install

- name: Run tests
  run: npm test

- name: Build
  run: npm run build
```

### Deployment Notifications

Add Slack/Discord notifications on deployment success/failure by adding notification steps to the workflow.

### Environment Variables

Store environment variables as GitHub secrets and copy them during deployment:

```yaml
- name: Create .env file
  run: |
    echo "DATABASE_URL=${{ secrets.DATABASE_URL }}" >> .env
    echo "API_KEY=${{ secrets.API_KEY }}" >> .env
    scp .env ${{ secrets.VPS_USERNAME }}@${{ secrets.VPS_HOST }}:${{ secrets.VPS_PROJECT_PATH }}/.env
```

## Next Steps

1. Set up SSL/TLS with Let's Encrypt
2. Configure Nginx as reverse proxy
3. Set up database backups
4. Implement monitoring and logging
5. Set up staging environment

---

For issues or questions, check the [GitHub Actions documentation](https://docs.github.com/en/actions).
