# Claude Prompts for MyInsuranceBuddies

> Ready-to-use prompts for the new monorepo structure

## Quick Start

1. **Choose a prompt** from the list below
2. **Fill in the variables** ({{LIKE_THIS}})
3. **Copy to Claude** and generate

## Available Prompts

| Prompt | Use For | File |
|--------|---------|------|
| **Component** | New UI components in `packages/ui` | [component.md](./component.md) |
| **API Route** | New API endpoints | [api-route.md](./api-route.md) |
| **Page** | Next.js pages | [page.md](./page.md) |
| **Migration** | Database schema changes | [migration.md](./migration.md) |
| **AI Section** | New AI content types | [ai-section.md](./ai-section.md) |
| **Test** | Unit/integration tests | [test.md](./test.md) |

## Quick Reference

### Generate a Component
```
Component: PricingCard
Type: molecule
Props: title, price, features[], ctaText
Features: Highlight badge, feature checklist
```

### Generate an API Route
```
Route: /api/leads
Methods: GET, POST
Auth: true
Model: Lead
Features: Pagination, status filter
```

### Generate a Page
```
Path: /leads/[id]
Type: dynamic
Data: Lead by ID, activity history
Features: Detail view, status updates
```

### Generate a Migration
```
Type: create
Model: Lead
Fields: email, phone, state, city, status
Relations: belongs to User
```

### Generate an AI Section
```
Section: weatherRisks
Purpose: Weather-related insurance risks
Fields: riskType, severity, preventionTips
```

### Generate Tests
```
Target: components/PricingCard.tsx
Type: unit
Features: Rendering, interaction, loading
```

## Workspace Structure

```
myinsurancebuddies.com/
├── apps/
│   ├── web/           # Public site (port 3000)
│   └── admin/         # Admin portal (port 3002)
├── packages/
│   ├── db/            # Prisma schema & client
│   ├── ui/            # Shared UI components
│   └── config/        # Shared config
└── .claude/prompts/   # This directory
```

## Commands

```bash
# Dev (both apps)
pnpm dev

# Build
pnpm build

# Test
pnpm test

# DB operations
cd packages/db
pnpm db:migrate    # Create migration
pnpm db:generate   # Regenerate client
pnpm db:seed       # Run seeds
```

## Conventions

| Aspect | Convention |
|--------|------------|
| Components | PascalCase, in `packages/ui/src/components/` |
| API Routes | `route.ts` in `app/api/[name]/` |
| Pages | `page.tsx` in `app/[path]/` |
| Models | PascalCase in Prisma schema |
| Tables | snake_case in database |
