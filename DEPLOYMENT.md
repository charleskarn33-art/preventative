# TelcoCare PM — Deployment Guide

## Prerequisites

- Node.js 18+
- Supabase account (supabase.com)
- Vercel account (recommended) or any Node.js hosting

---

## 1. Supabase Setup

### Create Project

1. Go to supabase.com → New Project
2. Note: Project URL and anon key from Settings → API

### Run SQL Scripts (in order)

In the Supabase SQL editor:

```
1. supabase/schema.sql     — Creates all tables, indexes, triggers
2. supabase/rls_policies.sql  — Row Level Security policies
3. supabase/seed.sql       — Demo data
```

### Configure Auth

In Supabase → Authentication → Settings:
- Enable Email/Password auth
- Set site URL to your deployment URL

Create demo users in Supabase Auth dashboard:
- admin@telcocare.com / password
- manager@telcocare.com / password
- supervisor@telcocare.com / password
- tech@telcocare.com / password

### Storage Buckets

Create in Supabase Storage:
- `pm-photos` (public)
- `site-documents` (authenticated)

---

## 2. Environment Variables

Copy `.env.local` and fill in values:

```bash
cp .env.local .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...
```

---

## 3. Local Development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## 4. Production Deployment (Vercel)

```bash
npm install -g vercel
vercel login
vercel --prod
```

Set environment variables in Vercel Dashboard → Settings → Environment Variables.

---

## 5. Database ERD Summary

```
users (1) ──── (N) tower_sites
users (1) ──── (N) work_orders (as technician)
users (1) ──── (N) work_orders (as supervisor)
tower_sites (1) ──── (N) pm_schedules
tower_sites (1) ──── (N) work_orders
pm_schedules (1) ──── (N) work_orders
work_orders (1) ──── (N) checklist_responses
work_orders (1) ──── (N) pm_measurements
work_orders (1) ──── (N) attachments
work_orders (1) ──── (N) maintenance_logs
users (1) ──── (N) notifications
```

---

## 6. User Role Access Matrix

| Feature              | Super Admin | Manager | Supervisor | Technician |
|----------------------|-------------|---------|------------|------------|
| All Sites            | ✓ | ✓ | Region only | Assigned only |
| PM Schedules         | ✓ | ✓ | View | — |
| All Work Orders      | ✓ | ✓ | Region only | Own only |
| Complete Checklist   | ✓ | ✓ | — | ✓ |
| Approve PM           | ✓ | ✓ | ✓ | — |
| Reports              | ✓ | ✓ | Regional | — |
| User Management      | ✓ | — | — | — |
| Settings             | ✓ | ✓ | — | — |

---

## 7. PM Compliance Rules

- **YES** = Passed (counts toward compliance)
- **NO** = Failed (requires comment + photo + corrective action)
- **N/A** = Excluded from compliance calculation
- Compliance % = YES / (YES + NO) × 100

---

## 8. Checklist Categories by PM Type

| Category   | Daily | Weekly | Monthly |
|------------|-------|--------|---------|
| Generator  | ✓     | ✓      | ✓       |
| DC System  | ✓     | ✓      | ✓       |
| Battery    | ✓     | ✓      | ✓       |
| Solar      | —     | ✓      | ✓       |
| Cleaning   | —     | ✓      | ✓       |
| RMS        | —     | —      | ✓       |
