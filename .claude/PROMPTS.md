# Claude Prompts for MyInsuranceBuddies New Structure

> Optimized prompts for the monorepo architecture: `apps/*` + `packages/*`

---

## Quick Reference

| Task | Prompt File | Use Case |
|------|-------------|----------|
| Generate Component | `prompts/component.md` | New UI component in packages/ui |
| Generate API Route | `prompts/api-route.md` | New API endpoint in apps/web or apps/admin |
| Generate Page | `prompts/page.md` | New Next.js page with data fetching |
| Database Migration | `prompts/migration.md` | Prisma schema changes |
| AI Content Section | `prompts/ai-section.md` | New AI content section type |
| Integration Test | `prompts/test.md` | Vitest tests for components/APIs |

---

## Repository Structure

```
myinsurancebuddies.com/
├── apps/
│   ├── web/                 # Public site (port 3000)
│   │   ├── app/             # Next.js App Router
│   │   ├── components/      # App-specific components
│   │   └── lib/             # Utils, hooks
│   └── admin/               # Admin portal (port 3002)
│       ├── app/
│       ├── components/
│       └── lib/
├── packages/
│   ├── db/                  # Prisma schema & client
│   │   ├── prisma/schema.prisma
│   │   └── index.ts
│   ├── ui/                  # Shared UI components
│   │   └── src/
│   │       ├── components/
│   │       └── index.ts
│   └── config/              # Shared config
│       ├── tsconfig.base.json
│       └── tailwind.config.ts
└── .claude/
    └── prompts/             # This directory
```

---

## Usage Instructions

### 1. Copy-Paste Method
Copy the relevant prompt from `prompts/` directory and replace the `{{VARIABLES}}` with your specific needs.

### 2. Claude Projects Method
Add these prompts to your Claude Project instructions for contextual awareness.

### 3. slash commands (if configured)
```bash
/component Button    # Generate new UI component
/api posts          # Generate CRUD API route
/page blog/[slug]   # Generate dynamic page
```

---

## Common Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `{{COMPONENT_NAME}}` | PascalCase component name | `PricingCard`, `UserProfile` |
| `{{ROUTE_NAME}}` | API route path | `posts`, `templates` |
| `{{MODEL_NAME}}` | Prisma model name | `Post`, `Template` |
| `{{PAGE_PATH}}` | Next.js page path | `/blog/[slug]`, `/dashboard` |
| `{{SECTION_NAME}}` | AI content section | `comparison`, `discounts` |

---

## Workspace Dependencies

```
@myinsurancebuddy/db      → packages/db
@myinsurancebuddy/ui      → packages/ui
@myinsurancebuddy/app-config → packages/config
```

---

## Key Conventions

### Component Structure
- Use **TypeScript** for all components
- Import from `@myinsurancebuddy/ui` for shared components
- Use `clsx` + `tailwind-merge` for class merging
- Props interface named `{ComponentName}Props`

### API Routes
- Use `dynamic = 'force-dynamic'` for dynamic routes
- Import Prisma client from `@myinsurancebuddy/db`
- Return consistent JSON: `{ success: true, data: ... }`
- Handle errors with try/catch and proper status codes

### Database
- Use Prisma for all database operations
- Run `pnpm db:generate` after schema changes
- Use transactions for multi-table operations
- Add indexes for frequently queried fields

### Styling
- Tailwind CSS for all styling
- Use `packages/config/tailwind.config.ts` as base
- Color palette: primary (blue), success (green), warning (amber), error (red)
- Mobile-first responsive design

---

## Testing

```bash
# Run all tests
pnpm test

# Run specific app tests
cd apps/web && pnpm test

# Coverage report
pnpm test:coverage
```

---

## Build & Deploy

```bash
# Development
pnpm dev          # Starts web (3000) + admin (3002)

# Production build
pnpm build        # Builds all apps and packages

# Deploy to VPS
./scripts/build_and_deploy.sh
```
