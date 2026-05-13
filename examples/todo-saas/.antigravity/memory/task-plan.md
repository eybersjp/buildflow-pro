# Task Plan

BuildFlow Pro — Active Task Plan

**Project:** TaskFlow
**Phase:** 6 — Authentication
**Last Updated:** 2026-05-13
**Read this at every session start.**

---

## Current Status

```
Phase 6: Auth — IN PROGRESS
Gates cleared: ScopeGate ✅ | ArchitectureGate ✅ | DataIntegrityGate ✅
Next gate: SecurityGate (Phase 6 completion)
```

---

## Active Tasks

| # | Task | Status | Priority | Owner |
|---|---|---|---|---|
| 1 | `lib/supabase/middleware.ts` — session refresh | 🚧 In Progress | P0 | Frontend |
| 2 | `app/(auth)/login/page.tsx` — login UI | 🚧 In Progress | P0 | Frontend |
| 3 | `app/(auth)/signup/page.tsx` — signup UI | ⏳ Todo | P0 | Frontend |
| 4 | `app/(auth)/reset-password/page.tsx` — reset UI | ⏳ Todo | P1 | Frontend |
| 5 | `lib/services/auth.service.ts` — auth service | ⏳ Todo | P0 | Backend |
| 6 | Unit tests — auth.service.ts | ⏳ Todo | P0 | QA |
| 7 | E2E test — login / signup / logout flow | ⏳ Todo | P0 | QA |

---

## Open Questions

| # | Question | Raised | Blocking |
|---|---|---|---|
| Q1 | Should we implement Google OAuth in v1? | 2026-05-13 | Task 5 |
| Q2 | Session TTL — 7 days or 30 days? | 2026-05-13 | Task 1 |

---

## Blockers

None currently.

---

## Completed This Phase

- [x] `database/migrations/002_users_and_auth.sql` — schema migration
- [x] `lib/supabase/client.ts` — browser Supabase client
- [x] `lib/supabase/server.ts` — server Supabase client (service role)

---

## Next Phase Preview

**Phase 7: Task CRUD**

After auth is complete and SecurityGate is cleared:

1. `lib/services/task.service.ts` — createTask, listTasks, updateTask, deleteTask
2. `app/api/tasks/route.ts` — REST endpoints
3. `app/(dashboard)/page.tsx` — My Tasks view
4. Unit tests — task.service.ts
5. E2E — create task, update status, delete task

---

## Learned Patterns (Session Notes)

- Supabase `createServerClient` requires `cookies()` from `next/headers` — NOT `request.cookies`
- RLS helper functions (`get_user_workspace_id()`) must be `SECURITY DEFINER` to bypass RLS on
  the `workspace_members` table when called from within an RLS policy
- Use `@supabase/ssr` package, NOT the deprecated `@supabase/auth-helpers-nextjs`

---

*Archive completed tasks to `task-archive.md` when this file exceeds 100 lines.*
