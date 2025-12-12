# Admin Portal

Complete admin interface for MyInsuranceBuddies platform with role-based access control.

## Features

### 🔐 Authentication
- NextAuth.js with JWT sessions
- Role-based access (ADMIN, SUPER_ADMIN)
- Secure password hashing with bcrypt
- Session persistence (30 days)

### 📝 Blog Post Management
- **List Posts**: View all blog posts with filtering by status (Draft, Published, Archived)
- **Create Post**: Rich editor with SEO metadata fields
- **Edit Post**: Update existing posts
- **Delete Post**: Remove posts with confirmation
- Auto-slug generation from title
- Tag management
- Status control (Draft/Published/Archived)

### 📄 Template Manager
- **List Templates**: View all programmatic page templates
- **Create Template**: Design templates with Handlebars syntax
- **Edit Template**: Update template content and variables
- **Activate/Deactivate**: Toggle template status
- **Delete Template**: Remove templates (with page count warning)
- Variable definition and default values
- Template type selection (State, City, Custom)

### 👥 User Management (SUPER_ADMIN only)
- **List Users**: View all admin users
- **Create User**: Add new admins
- **Activate/Deactivate**: Control user access
- **Delete User**: Remove users (cannot delete self)
- Role assignment (ADMIN, SUPER_ADMIN)

### 📋 Audit Logs (SUPER_ADMIN only)
- Complete audit trail of all admin actions
- Filter by entity type (Post, Template, User, Media)
- View detailed change history
- Track user actions and timestamps

### 📊 Dashboard
- System statistics (posts, templates, regions, media counts)
- Quick action cards
- System status indicators
- Recent activity overview

## Default Credentials

```
Email: admin@myinsurancebuddies.com
Password: changeme123
```

⚠️ **CRITICAL**: Change this password immediately after first login!

## Access Levels

### ADMIN
- Dashboard access
- Blog post management
- Template management
- Media management
- Region viewing

### SUPER_ADMIN
- All ADMIN permissions
- User management
- Audit log access
- System configuration

## Navigation

```
Dashboard (/)
├── Blog Posts (/dashboard/posts)
│   ├── New Post (/dashboard/posts/new)
│   └── Edit Post (/dashboard/posts/[id])
│
├── Templates (/dashboard/templates)
│   ├── New Template (/dashboard/templates/new)
│   └── Edit Template (/dashboard/templates/[id])
│
├── Media (/dashboard/media)
├── Regions (/dashboard/regions)
│
└── [SUPER_ADMIN ONLY]
    ├── Users (/dashboard/users)
    └── Audit Logs (/dashboard/audit)
```

## API Integration

The admin app proxies requests to the main web app's API:

- `/api/posts` → Main app API
- `/api/templates` → Main app API
- `/api/regions` → Main app API
- `/api/media` → Main app API

Admin-specific APIs:
- `/api/users` - User management
- `/api/audit` - Audit logs

## Environment Variables

```env
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-key
WEB_API_URL=http://localhost:3000
```

## Development

```bash
cd apps/admin
pnpm dev
```

Access at: http://localhost:3001

## Production

```bash
pnpm build
pnpm start
```

Access at: https://yourdomain.com:3001

## Security Features

- ✅ JWT-based authentication
- ✅ Role-based authorization
- ✅ Password hashing (bcrypt)
- ✅ Session expiration
- ✅ CSRF protection (NextAuth)
- ✅ Audit logging for all actions
- ✅ Prevent self-deletion
- ✅ Admin-only role restriction

## UI Components

Built with:
- **Next.js 14** - App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **NextAuth.js** - Authentication
- **Prisma** - Database ORM

## Workflow Examples

### Creating a Blog Post

1. Navigate to Dashboard → Blog Posts
2. Click "+ New Post"
3. Fill in:
   - Title (auto-generates slug)
   - Slug (customize if needed)
   - Excerpt (for SEO and previews)
   - Content (HTML or Markdown)
   - Tags (comma-separated)
   - Meta Title & Description (optional)
   - Status (Draft/Published/Archived)
4. Click "Create Post"
5. Post appears in list and is accessible at `/blog/[slug]`

### Creating a Template

1. Navigate to Dashboard → Templates
2. Click "+ New Template"
3. Define:
   - Template Name
   - Template Type (State/City/Custom)
   - HTML Content with Handlebars syntax `{{variable}}`
   - Variables array `["state", "population"]`
   - Default values `{"population": "N/A"}`
4. Click "Create Template"
5. Use template to generate pages programmatically

### Managing Users (SUPER_ADMIN)

1. Navigate to Dashboard → Users
2. Click "+ New User"
3. Enter email, name, password, role
4. User can now sign in
5. Toggle Active/Inactive to control access
6. Cannot delete yourself (safety measure)

## Audit Trail

All actions are logged:
- CREATE: New entity created
- UPDATE: Entity modified
- DELETE: Entity removed

Logs include:
- Timestamp
- User who performed action
- Entity type and ID
- Changes made (full JSON diff)

## Troubleshooting

### Cannot Sign In
- Check credentials match database
- Verify user `isActive = true`
- Ensure user role is ADMIN or SUPER_ADMIN
- Check NEXTAUTH_SECRET is set

### API Proxy Not Working
- Verify WEB_API_URL points to web app
- Check web app is running on port 3000
- Ensure cookies are forwarded correctly

### Missing Pages After Template Generation
- Check template `isActive = true`
- Verify template has valid Handlebars syntax
- Run generation endpoint manually
- Check audit logs for errors

## Future Enhancements

- [ ] Media library browser
- [ ] Bulk post actions
- [ ] Template preview
- [ ] Draft auto-save
- [ ] Rich text WYSIWYG editor
- [ ] Analytics dashboard
- [ ] Export/import content
- [ ] Multi-language support
- [ ] Advanced user permissions
- [ ] API rate limiting dashboard

## Support

For issues or questions, check:
- [RUNBOOK.md](../../docs/RUNBOOK.md) - Operational procedures
- [SECURITY.md](../../docs/SECURITY.md) - Security guidelines
- [README.md](../../README.md) - Main project documentation
