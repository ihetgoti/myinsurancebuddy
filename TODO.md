# TODO - MyInsuranceBuddies Remaining Tasks

## ⚠️ URGENT ACTION REQUIRED (Environment)
To enable the new 1M-page scalable content pipeline, set these secrets in `.env.local`:

**`apps/web/.env`**:
`REVALIDATION_SECRET="[secure-random-string]"`

**`apps/admin/.env`**:
`REVALIDATION_SECRET="[same-string-as-web]"`
`WEB_URL="http://localhost:3000"` (or production URL)

---

## Current Status: Scalability Phase 1 Complete

**Recently Completed**:
- [x] Template Manager (with HTML/Handlebars)
- [x] Page Generation UI & Bulk API
- [x] Shared Config Workspace (`packages/config`)
- [x] Shared UI Workspace (`packages/ui`)
- [x] On-Demand ISR Pipeline

## Priority 1: Architecture Scaling (Billion Dollar Roadmap)
- [ ] **Infrastructure**: Move to Cloudflare + Docker/Serverless (Phase 2)
- [x] **Shared UI**: Extract generic components to `packages/ui` (Phase 1 Part 2)
- [ ] **Auth**: Unified SSO between Admin and Web

## Priority 2: Admin Features
- [ ] Blog Admin (TipTap Editor, Media Library)
- [ ] Region Import/Export
- [ ] Audit Log Viewer

## Priority 3: Security & Tests
- [ ] CSRF protection
- [ ] Rate limiting
- [ ] E2E tests (Playwright recommended over Cypress)

## Priority 4: Content
- [ ] Generate all state/city pages (using Bulk Gen)
- [ ] Blog Content
