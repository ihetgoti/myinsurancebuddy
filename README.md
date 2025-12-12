# MyInsuranceBuddies - Production-Ready Insurance Guide Platform

> Tips & tricks to buy the best and cheapest insurance

## Quick Deploy to Contabo VPS

**TL;DR**: Clone repo, copy `.env`, run `./scripts/build_and_deploy.sh`, access at https://myinsurancebuddies.com

### First Time Deployment

```bash
# 1. SSH into your Contabo VPS
ssh root@YOUR_VPS_IP

# 2. Prerequisites (if not installed)
apt update && apt install -y postgresql nginx certbot python3-certbot-nginx
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
npm install -g pnpm pm2

# 3. Create database
sudo -u postgres psql
CREATE DATABASE myinsurancebuddy;
CREATE USER myuser WITH PASSWORD 'yourpassword';
GRANT ALL ON DATABASE myinsurancebuddy TO myuser;
\c myinsurancebuddy
GRANT ALL ON SCHEMA public TO myuser;
ALTER SCHEMA public OWNER TO myuser;
\q

# 4. Clone and deploy
cd /var/www
git clone https://github.com/ihetgoti/myinsurancebuddy.git myinsurancebuddies.com
cd myinsurancebuddies.com
cp env.example .env
nano .env  # Update DATABASE_URL, NEXTAUTH_SECRET
chmod 600 .env
./scripts/build_and_deploy.sh

# 5. Verify
curl https://myinsurancebuddies.com/api/health
```

See [docs/QUICKSTART.md](./docs/QUICKSTART.md) for complete setup.

## Architecture

### Tech Stack
- **Framework**: Next.js 14 (TypeScript, App Router)
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js (JWT, bcrypt)
- **UI**: React + Tailwind CSS
- **Templates**: Handlebars (programmatic pages)
- **Media**: sharp (image processing)
- **Process Manager**: PM2
- **Web Server**: Nginx + Certbot SSL

### Project Structure
```
myinsurancebuddy/
├── apps/
│   ├── web/              # Public site (port 3000)
│   └── admin/            # Admin portal (port 3001)
├── packages/
│   └── db/               # Prisma schema & seeds
├── scripts/              # Deployment & backup
├── docs/                 # Documentation
└── infra/                # Nginx configs
```

## Features

### ✅ Implemented
- **Authentication**: NextAuth.js with RBAC (SUPER_ADMIN, BLOG_ADMIN, EDITOR)
- **Blog System**: Full CRUD API with draft/scheduled/published states
- **Programmatic Pages**: Template-based generation for 50 states + 20 cities
- **SEO**: JSON-LD, sitemaps, RSS, meta tags, robots.txt
- **Media Upload**: Sharp processing (5 sizes + webp)
- **Backup/Restore**: Automated PostgreSQL dumps
- **Security**: Input validation, XSS/SQL injection prevention, audit logs
- **Monitoring**: Health check endpoint, PM2 integration

### 🚧 Needs Implementation
- **Admin UI**: Blog editor, template manager, media library, user management
- **Tests**: Unit, integration, E2E tests
- **Rate Limiting**: API throttling
- **Email**: Notifications, password reset
- **Search**: Full-text search for blog/pages

## API Endpoints

- `POST /api/auth/signin` - Login
- `GET/POST /api/posts` - Blog posts
- `GET/POST /api/templates` - Programmatic templates
- `POST /api/templates/[id]/generate` - Generate pages
- `GET/POST /api/regions` - States/cities
- `POST /api/media` - Upload files
- `GET /api/health` - Health check
- `GET /rss.xml` - RSS feed

See full API docs in [docs/API.md](./docs/API.md) (TODO).

## Default Credentials

⚠️ **CHANGE IMMEDIATELY**

- Email: `admin@myinsurancebuddies.com`
- Password: `changeme123`

## Operations

```bash
# Deploy updates
cd /var/www/myinsurancebuddies.com
git pull origin main
./scripts/build_and_deploy.sh

# Backup
./scripts/backup.sh

# Restore
./scripts/restore.sh /path/to/backup.dump.gz

# View logs
pm2 logs
```

See [docs/RUNBOOK.md](./docs/RUNBOOK.md) for complete operations guide.

## Documentation

- [QUICKSTART.md](./docs/QUICKSTART.md) - VPS deployment
- [RUNBOOK.md](./docs/RUNBOOK.md) - Operations manual
- [SECURITY.md](./docs/SECURITY.md) - Security guide

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.
# CI/CD Active
