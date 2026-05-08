# Learned Patterns
# BuildFlow Pro — Persistent Agent Learning Memory
# Source: everything-claude-code pattern (PostToolUse hook)
# Last Updated: [DATE]

> This file captures patterns, lessons, and heuristics learned from real project work.
> It is read at SessionStart and written to after significant debugging, refactoring, or problem-solving sessions.
> Do NOT hand-edit — entries are written by the agent after PostToolUse events.

---

## How to Use This File

**Reading:** At the start of each session, scan this file for patterns relevant to the current task.
**Writing:** After resolving a bug, discovering an unexpected behaviour, or finding a better approach, add an entry under the correct category.

**Entry format:**
```
### [Short Title]
**Context:** What project/feature/language this applies to
**Problem:** What went wrong or what was surprising
**Solution:** What worked
**Apply when:** Trigger condition — when to apply this pattern
**Risk:** What to watch out for
**Date:** [DATE]
```

---

## Category: TypeScript & Type Safety

### Supabase Type Generation Out-of-Date
**Context:** Next.js + Supabase projects  
**Problem:** TypeScript errors claiming a column doesn't exist on a table, even though the SQL migration has been applied  
**Solution:** Re-run `npx supabase gen types typescript --project-id [id] > src/types/supabase.ts` to regenerate types from the live schema  
**Apply when:** After any database migration is applied, before continuing frontend/backend work  
**Risk:** Stale types cause phantom errors that waste debugging time — always regenerate first  
**Date:** [initial]

### Zod + react-hook-form Resolver Mismatch
**Context:** Next.js forms using react-hook-form + zodResolver  
**Problem:** Form submits without triggering Zod validation errors, even with invalid input  
**Solution:** Ensure `zodResolver(schema)` is passed as the `resolver` prop to `useForm()`, NOT to the `<form>` element directly. Also ensure the Zod schema uses `.min(1)` not just `.nonempty()` for string fields  
**Apply when:** Whenever setting up a new form with react-hook-form + Zod  
**Risk:** Silent validation bypass if resolver is wired incorrectly  
**Date:** [initial]

---

## Category: Database & RLS

### RLS Policy Doesn't Apply to Service Role Client
**Context:** Supabase with service role key  
**Problem:** RLS policy was set up correctly but users could still see other tenants' data  
**Solution:** Service role key bypasses RLS by design. Any query using the service role client ignores RLS policies. Only the anon/user-role client respects RLS. For tenant isolation, use the user-scoped client, not the service role client, for user-facing queries  
**Apply when:** Any time a Supabase client is created for user-facing data fetching  
**Risk:** Using service role client for user queries = no tenant isolation. Critical security flaw.  
**Date:** [initial]

### Migration Column Type Change Locks Table
**Context:** PostgreSQL / Supabase migrations  
**Problem:** `ALTER COLUMN type` on a large table causes a full table lock, blocking all reads/writes  
**Solution:** For production tables with data: (1) add a new column with the new type, (2) backfill data, (3) rename the old column to `_deprecated_[name]`, (4) rename new column. Never use direct `ALTER COLUMN TYPE` on production tables that cannot tolerate downtime  
**Apply when:** Any migration that changes a column's data type on a table with > 1000 rows  
**Risk:** Table lock can cause production outage  
**Date:** [initial]

### Missing Updated_At Trigger
**Context:** Supabase PostgreSQL  
**Problem:** `updated_at` column not auto-updating when records are modified — manual `UPDATE` sets the value but ORM/Supabase SDK updates do not  
**Solution:** Create a trigger: `CREATE TRIGGER set_updated_at BEFORE UPDATE ON [table] FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();` with the corresponding function  
**Apply when:** Any table that has an `updated_at` column managed by the database (not the application)  
**Risk:** Stale `updated_at` values break cache invalidation and audit reporting  
**Date:** [initial]

---

## Category: Next.js & React

### Server Component Can't Use Client Hooks
**Context:** Next.js App Router  
**Problem:** `useState`, `useEffect`, `useRouter` throwing error "You're importing a component that needs X. This only works in a Client Component..."  
**Solution:** Add `'use client'` directive at the top of the file. Alternatively, extract the hook-dependent logic into a separate client component and import it into the server component  
**Apply when:** Any component that uses React hooks, browser APIs, or event handlers  
**Risk:** Forgetting `'use client'` causes cryptic hydration errors that are hard to trace  
**Date:** [initial]

### TanStack Query + Server Components Conflict
**Context:** Next.js App Router with TanStack Query  
**Problem:** TanStack Query `useQuery` throws in server components  
**Solution:** Server components should fetch data directly (using `async/await` + Supabase server client). TanStack Query is for client components that need reactive data or caching. Do not mix patterns — pick one per component  
**Apply when:** When deciding where to put data fetching logic  
**Risk:** Using TanStack Query in server contexts causes hydration mismatches  
**Date:** [initial]

### Dynamic Route Params Are Strings
**Context:** Next.js App Router dynamic routes  
**Problem:** `params.id` used directly in a Supabase query — TypeScript error because UUID is being compared to a string that might be `undefined`  
**Solution:** Always await params in Next.js 15+: `const { id } = await params`. Always validate the param before use: `if (!id || !isValidUUID(id)) return notFound()`  
**Apply when:** Any dynamic route that reads `params.id` or similar  
**Risk:** Unvalidated params can cause unhandled errors or SQL injection if not sanitized  
**Date:** [initial]

---

## Category: Authentication & Sessions

### Session Not Available on First Load After Redirect
**Context:** Supabase Auth + Next.js  
**Problem:** User logs in, gets redirected to dashboard, but `getSession()` returns null on first render  
**Solution:** Use `supabase.auth.getUser()` (server-side, validates JWT with Supabase server) not `getSession()` (which reads from local storage, not reliable in SSR). Configure the `@supabase/ssr` package correctly with cookie-based session storage  
**Apply when:** Any server component or API route that needs the authenticated user  
**Risk:** `getSession()` returning stale data causes intermittent auth bugs that are hard to reproduce  
**Date:** [initial]

### Auth State Not Syncing Across Tabs
**Context:** Supabase Auth in browser  
**Problem:** User logs out in one tab but stays logged in in another tab  
**Solution:** Subscribe to `supabase.auth.onAuthStateChange()` in a global auth listener. When a `SIGNED_OUT` event fires, redirect all tabs to the login page using `window.location.href`  
**Apply when:** Multi-tab applications where auth state changes must propagate  
**Risk:** Users accessing protected data after logout in another tab  
**Date:** [initial]

---

## Category: Performance

### N+1 Query in List Rendering
**Context:** Any ORM / Supabase SDK  
**Problem:** Fetching a list of projects, then fetching each project's owner name in a loop — O(n) database calls  
**Solution:** Use `select('*, created_by(id, name)')` in Supabase to join the related record in a single query. Or use a `WITH` CTE in raw SQL to batch-fetch related data  
**Apply when:** Rendering a list where each item needs data from a related table  
**Risk:** N+1 queries are invisible in development (small data) but catastrophic in production (large data)  
**Date:** [initial]

### Unbounded List Queries
**Context:** Any database query that fetches a list  
**Problem:** `select * from projects where tenant_id = X` returns 50,000 rows — crashes the API and the browser  
**Solution:** Always add `.limit(50)` to list queries. Add pagination with `range(from, to)` for large datasets. Never fetch unbounded lists in production  
**Apply when:** Every list query, without exception  
**Risk:** Memory exhaustion, timeout, and denial of service from legitimate tenants with large datasets  
**Date:** [initial]

---

## Category: Deployment & CI/CD

### Build Passes Locally but Fails in CI
**Context:** Next.js + GitHub Actions  
**Problem:** `npm run build` passes locally but fails in GitHub Actions with TypeScript errors  
**Solution:** Local build may be using cached types or using lenient tsconfig settings. CI uses a clean install. Common causes: (1) type errors in files not imported in development, (2) `process.env` types not declared, (3) different Node.js version in CI  
**Apply when:** Before every PR, run `npm run typecheck` explicitly (not just `npm run build`) to catch type errors that the build might suppress  
**Risk:** Broken CI blocks all merges  
**Date:** [initial]

### Vercel Environment Variables Not Available at Build Time
**Context:** Next.js deployed to Vercel  
**Problem:** `process.env.NEXT_PUBLIC_*` is undefined in production despite being set in Vercel dashboard  
**Solution:** `NEXT_PUBLIC_*` variables must be available at **build time**, not just runtime. In Vercel, they must be set in the "Production" environment BEFORE triggering a build. Redeployment required after adding a new `NEXT_PUBLIC_*` variable  
**Apply when:** Adding new `NEXT_PUBLIC_*` environment variables to any Vercel-deployed project  
**Risk:** Silent undefined values in production that are not caught by tests running with local `.env`  
**Date:** [initial]

---

## Category: Security

### CORS Wildcard in Development Becomes Production
**Context:** Express / Next.js API middleware  
**Problem:** `cors({ origin: '*' })` set for development convenience, shipped to production  
**Solution:** Use an environment variable for allowed origins: `cors({ origin: process.env.ALLOWED_ORIGIN })`. Set to specific domain in production, wildcard only in development  
**Apply when:** Any API server with CORS configuration  
**Risk:** Allows cross-origin requests from any domain in production — significant security risk  
**Date:** [initial]

### Webhook Signature Not Verified
**Context:** Stripe / third-party webhooks  
**Problem:** Webhook endpoint processes events without verifying the signature — any request claiming to be a webhook is processed  
**Solution:** Always verify the signature using the provider's SDK: `stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)`. Return 400 immediately if verification fails  
**Apply when:** Every webhook endpoint  
**Risk:** Malicious actors can send fake webhook events to trigger business logic (e.g., fake payment confirmations)  
**Date:** [initial]

---

## Category: Agent Behaviour

### Context Compaction Mid-Feature
**Context:** Long BuildFlow Pro sessions  
**Problem:** Agent context compacts mid-way through a feature build, losing the feature design and partially-written files  
**Solution:** Read `.antigravity/memory/task-plan.md` immediately. Check the "Current Task" and "Files of Record". Look at git diff to see what was written before compaction. Resume from the last checkpoint  
**Apply when:** At the start of any session where context may have compacted  
**Risk:** Duplicate work or contradictory implementations if compaction is not detected  
**Date:** [initial]

### Scope Creep During Build
**Context:** Feature build sessions  
**Problem:** Small "just while we're here" changes accumulate into large, untested, unreviewed modifications  
**Solution:** Flag scope creep immediately. Create a new task in `task-plan.md` for the adjacent work. Complete the current task first. Never commit adjacent changes in the same PR as the planned feature  
**Apply when:** Any time a change is proposed to a file not in the current task's scope  
**Risk:** Untested changes in production, complicated rollback, reviewer confusion  
**Date:** [initial]

---

*This file grows with every project. The more patterns recorded, the smarter every subsequent session becomes.*
