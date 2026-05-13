# Project Context

BuildFlow Pro — Project Memory

This file stores the current project context. Update it after each major phase.

---

## Development Mode

Production (Standard)

---

## App Name

TaskFlow

## App Purpose

Simple task management SaaS for remote teams. Create tasks, assign owners, track progress,
comment — without enterprise complexity.

## Target Users

- Team managers (2–20 person remote teams)
- Individual contributors (team members)
- Workspace admins

## User Roles

| Role | Permissions |
|---|---|
| `admin` | Full workspace control, member management |
| `manager` | Create/manage projects, assign any task |
| `member` | Create tasks, manage own tasks, comment |
| `viewer` | Read-only access to assigned projects |

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript |
| UI Library | Tailwind CSS + shadcn/ui |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| Storage | Supabase Storage (planned Phase 9) |
| Realtime | Supabase Realtime |
| Email | Resend + React Email |
| Hosting | Vercel |
| CI/CD | GitHub Actions |
| Monitoring | Sentry + PostHog |

## Deployment Target

Vercel (production: taskflow.app, staging: staging.taskflow.vercel.app)

## Authentication Required

Yes — Supabase Auth, email + password, httpOnly session cookies

## Payments Required

No (free beta) — Stripe planned for post-launch

## Multi-Tenant

Yes — workspace_id as tenant key, RLS on all tables

## Current Phase

Phase 6: Authentication

## Important Decisions

- Next.js App Router chosen over Pages Router (ADR-001)
- Supabase over custom Express backend (ADR-002)
- Multi-workspace deferred to v2 to reduce MVP scope
- Resend chosen over Sendgrid for email (better DX)

## Known Risks

- Real-time sync under concurrent users — test with 10+ users before launch
- Email deliverability — verify SPF/DKIM before notifications go live

## Notes

- `design-tokens.css` generated from DESIGN_SYSTEM.md — do not edit manually
- `database.types.ts` is auto-generated — run `npx supabase gen types` after migrations
- All services use `Result<T, E>` — never `throw` in service functions
