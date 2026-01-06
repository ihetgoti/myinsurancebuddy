# TODO - MyInsuranceBuddies Remaining Tasks

## ✅ Environment Setup (COMPLETED)
The ISR pipeline is working. Environment variables are configured on VPS.

---

## Current Status: Phase 2 Complete ✅

**Recently Completed (This Session)**:
- [x] Template Manager (with HTML/Handlebars)
- [x] Page Generation UI & Bulk API
- [x] Shared Config Workspace (`packages/config`)
- [x] Shared UI Workspace (`packages/ui`)
- [x] On-Demand ISR Pipeline
- [x] Public Blog Section (`/blog`, `/blog/[slug]`)
- [x] Ad Unit Integration (placeholders ready for AdSense)
- [x] Bridge Page System (Lead Gen for Paid Traffic)
- [x] Affiliate Link Injection (`{{primary_offer_link}}`, `{{primary_offer_cta}}`)
- [x] All API routes use `dynamic = 'force-dynamic'` (clean builds)
- [x] VPS Deployment Pipeline (GitHub Actions → PM2)

---

## Priority 1: Content Generation (ACTIONABLE NOW)
- [ ] **Generate All State Pages**: Use Bulk Gen to create pages for all 50 states
- [ ] **Generate Top City Pages**: Use Bulk Gen for top 100 cities per state
- [ ] **Blog Content**: Create initial blog posts via Admin

## Priority 2: Monetization Setup
- [ ] **Google AdSense**: Replace `AdUnit` placeholders with real ad code
- [ ] **Affiliate Partners**: Add real affiliate links in Admin → Affiliates

## Priority 3: Infrastructure Improvements
- [ ] **Docker Compose**: Containerize for easier deployment
- [ ] **Cloudflare**: Full CDN + WAF integration
- [ ] **Unified SSO**: Single login between Admin and Web

## Priority 4: Security & Quality
- [ ] CSRF protection
- [ ] Rate limiting on API routes
- [ ] E2E tests (Playwright)

---

## Quick Commands

**Generate Pages via CLI:**
```bash
curl -X POST http://localhost:3002/api/bulk-generate \
  -H "Content-Type: application/json" \
  -d '{"templateId": "...", "data": [...]}'
```

**Trigger ISR Revalidation:**
```bash
curl "http://localhost:3000/api/revalidate?secret=YOUR_SECRET&path=/car-insurance/texas"
```
