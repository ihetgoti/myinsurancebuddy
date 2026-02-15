# SECURITY - MyInsuranceBuddies Security Guide

## Overview

This document outlines security measures implemented in MyInsuranceBuddies and best practices for maintaining a secure application.

## Security Features Implemented

### Authentication & Authorization

#### NextAuth.js Integration
- **Session Management**: JWT-based sessions with 30-day expiration
- **Secure Cookies**: HttpOnly, Secure, SameSite=Strict flags enabled
- **Password Hashing**: bcrypt with salt rounds = 10
- **Role-Based Access Control (RBAC)**: Three roles (SUPER_ADMIN, BLOG_ADMIN, EDITOR)

#### Login Security
- Credentials validated on every request
- Failed login attempts logged (implement rate limiting - see TODO)
- Inactive users blocked from authentication

### API Security

#### Request Validation
- **Zod Schemas**: All API inputs validated with Zod
- **Type Safety**: TypeScript enforces type checking
- **SQL Injection Protection**: Prisma ORM uses parameterized queries
- **XSS Protection**: React automatically escapes outputs; DOMPurify sanitizes HTML

#### Authorization Checks
```typescript
// Example: Super Admin only endpoints
if (session.user.role !== "SUPER_ADMIN") {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
```

### File Upload Security

#### Media Upload Validation
- **File Type Whitelist**: Only jpeg, png, webp, gif allowed
- **Size Limit**: 10MB maximum
- **Filename Sanitization**: UUIDs prevent path traversal
- **MIME Type Verification**: Checked before processing
- **Image Processing**: sharp library re-encodes images (removes malicious content)

#### Storage Security
- Uploads stored outside web root initially, served via Nginx location block
- File permissions: 644 for files, 755 for directories
- Owner: www-data:www-data

### Database Security

#### PostgreSQL Configuration
- **Least Privilege**: Database user has only necessary permissions
- **Network Access**: PostgreSQL listens only on localhost (no external access)
- **Connection Pooling**: Prisma manages connections securely
- **Prepared Statements**: All queries use parameterized inputs

#### Sensitive Data
- Passwords hashed with bcrypt (never stored plaintext)
- Environment variables in `.env` with 600 permissions
- No credentials in Git repository (use `.gitignore`)

### HTTPS & Network Security

#### SSL/TLS
- **Let's Encrypt**: Free SSL certificates via Certbot
- **Auto-Renewal**: Configured cron job renews certificates
- **HTTPS Redirect**: Nginx redirects all HTTP to HTTPS
- **HSTS Header**: Recommended (see TODO)

#### Nginx Security Headers
Add to Nginx configuration:
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### Audit Logging

#### AuditLog Model
All critical actions logged:
- User authentication
- Post creation/updates/deletion
- Template creation/updates
- Page generation
- Region management

#### Log Fields
- userId: Who performed the action
- action: What was done
- objectType & objectId: What was affected
- beforeState & afterState: Changes made
- createdAt: When it happened

### Input Sanitization

#### HTML Content
```typescript
import DOMPurify from "isomorphic-dompurify";

// Sanitize user-generated HTML
const clean = DOMPurify.sanitize(dirtyHtml, {
  ALLOWED_TAGS: ["p", "br", "strong", "em", "u", "h1", "h2", "h3", "ul", "ol", "li", "a", "img"],
  ALLOWED_ATTR: ["href", "src", "alt", "title", "class"],
});
```

#### Template Rendering
- Handlebars escapes variables by default
- Triple-braces `{{{html}}}` only used for trusted, sanitized content
- Admin-created templates reviewed before deployment

## Security Best Practices

### Environment Variables

#### Required Environment Variables
```bash
# Strong secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="<long-random-string>"

# Database credentials (change defaults)
DATABASE_URL="postgresql://USER:STRONG_PASSWORD@localhost:5432/DB"
```

#### File Permissions
```bash
chmod 600 /var/www/myinsurancebuddies.com/.env
chown www-data:www-data /var/www/myinsurancebuddies.com/.env
```

### Regular Updates

#### Dependency Updates
```bash
# Check for outdated packages
pnpm outdated

# Update to latest compatible versions
pnpm update

# Audit for vulnerabilities
pnpm audit

# Fix vulnerabilities
pnpm audit --fix
```

#### System Updates
```bash
# Update Ubuntu packages
apt update && apt upgrade -y

# Update Node.js (via nvm)
nvm install 20 --latest-npm
```

### Backup Security

#### Backup Encryption
Backups contain sensitive data. Consider encrypting:
```bash
# Encrypt backup
gpg --symmetric --cipher-algo AES256 db_backup.dump.gz

# Decrypt backup
gpg db_backup.dump.gz.gpg
```

#### Backup Access
- Store backups on separate disk/server
- Restrict access: `chmod 600 backups/*`
- Regularly test restore procedures

### User Management

#### Password Policy
- Minimum 8 characters (enforce in registration)
- Require: uppercase, lowercase, number, special character
- Password reset via email with time-limited tokens

#### Account Security
```sql
-- Disable compromised user
UPDATE "User" SET "isActive" = false WHERE email = 'user@example.com';

-- List active admins
SELECT id, email, name, role, "createdAt" 
FROM "User" 
WHERE role IN ('SUPER_ADMIN', 'BLOG_ADMIN') AND "isActive" = true;
```

### Monitoring & Alerting

#### Log Monitoring
```bash
# Monitor nginx access logs for suspicious activity
tail -f /var/log/nginx/access.log | grep -E "(admin|api)"

# Monitor nginx error logs
tail -f /var/log/nginx/error.log

# Monitor PM2 logs
pm2 logs --err
```

#### Failed Login Monitoring
Implement rate limiting and monitoring:
```typescript
// TODO: Implement with Redis or in-memory store
// Track failed attempts by IP
// Block after 5 failed attempts in 15 minutes
// Send alert email to admins
```

### Incident Response

#### Security Incident Procedure
1. **Identify**: Detect the security issue
2. **Contain**: Isolate affected systems
3. **Investigate**: Review audit logs and system logs
4. **Remediate**: Fix the vulnerability
5. **Document**: Record what happened and how it was fixed
6. **Review**: Update security measures to prevent recurrence

#### Emergency Actions
```bash
# Immediately disable user account
psql -U myuser -d myinsurancebuddy -c "UPDATE \"User\" SET \"isActive\" = false WHERE email = 'compromised@example.com';"

# Rotate all secrets
# 1. Generate new NEXTAUTH_SECRET
openssl rand -base64 32

# 2. Update .env
nano /var/www/myinsurancebuddies.com/.env

# 3. Force all users to re-login
# (Sessions expire automatically or clear session store)

# 4. Restart application
pm2 restart all
```

## Security Checklist

### Initial Setup
- [ ] Change default database password
- [ ] Generate strong NEXTAUTH_SECRET
- [ ] Set file permissions (`.env` = 600, `uploads/` = 755)
- [ ] Configure firewall (ufw allow 22,80,443)
- [ ] Enable SSL with Certbot
- [ ] Add Nginx security headers
- [ ] Set up automated backups

### Regular Maintenance
- [ ] Update dependencies monthly (`pnpm update`)
- [ ] Run security audits (`pnpm audit`)
- [ ] Review audit logs weekly
- [ ] Test backup restore procedures monthly
- [ ] Review user accounts quarterly
- [ ] Rotate secrets annually

### Before Each Deployment
- [ ] Review code changes for security issues
- [ ] Run `pnpm audit` and fix critical issues
- [ ] Test in staging environment
- [ ] Backup database before deployment
- [ ] Review audit logs after deployment

## Common Vulnerabilities & Mitigations

### SQL Injection
**Mitigation**: Prisma ORM uses parameterized queries. Never use raw SQL with user input.
```typescript
// ❌ NEVER DO THIS
prisma.$queryRawUnsafe(`SELECT * FROM User WHERE email = '${userInput}'`);

// ✅ DO THIS
prisma.user.findUnique({ where: { email: userInput } });
```

### Cross-Site Scripting (XSS)
**Mitigation**: React escapes outputs. Sanitize HTML with DOMPurify.
```typescript
// ❌ Dangerous
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Safe
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

### Cross-Site Request Forgery (CSRF)
**Mitigation**: NextAuth includes CSRF protection. SameSite cookies prevent CSRF.
```typescript
// Cookies automatically set with:
// SameSite=Strict, HttpOnly=true, Secure=true
```

### Path Traversal
**Mitigation**: Use UUIDs for filenames. Validate and sanitize paths.
```typescript
// ✅ Safe - uses UUID
const filename = `${uuid()}.${ext}`;
const path = join(UPLOAD_DIR, year, month, filename);
```

### Denial of Service (DoS)
**Mitigation**: Implement rate limiting (TODO), set file size limits, use PM2 cluster mode.
```bash
# PM2 cluster mode (use all CPU cores)
pm2 start ecosystem.config.js --instances max
```

## TODO: Additional Security Improvements

1. **Rate Limiting**: Implement with `express-rate-limit` or Nginx
2. **CAPTCHA**: Add to login and registration forms
3. **2FA**: Implement two-factor authentication for admins
4. **Security Headers**: Add CSP, Feature-Policy headers
5. **WAF**: Consider Cloudflare or AWS WAF
6. **Intrusion Detection**: Set up fail2ban
7. **Vulnerability Scanning**: Automated tools like Snyk
8. **Penetration Testing**: Annual security audit
9. **Bug Bounty**: Public responsible disclosure program

## Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** create a public GitHub issue
2. Email: security@myinsurancebuddies.com (TODO: set up)
3. Include: Description, steps to reproduce, potential impact
4. We will respond within 48 hours
5. We will credit you in our security acknowledgments

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/security)
- [Prisma Security](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/connection-management#preventing-sql-injection)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

---

**Last Updated**: December 2024
**Security Contact**: [TODO: Add contact]
