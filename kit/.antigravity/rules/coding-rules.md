# Coding Rules
# BuildFlow Pro — Production Code Quality Standards
# Version: 2.0.0 — Phase 1 Integration (Code-Kit-Ultra + context-mode)

These rules define how code must be written in every BuildFlow Pro project.

---

## 1. Language Standards

### TypeScript
- **Strict mode required:** `"strict": true` in `tsconfig.json`
- No `any` types in production code. Use `unknown` + type guards.
- No `@ts-ignore` without an explanation comment
- All exported functions must have explicit return types
- Interfaces preferred over `type` aliases for object shapes

### JavaScript (if TypeScript unavailable)
- JSDoc type annotations required for all functions
- ESLint with `eslint:recommended` enabled
- No `eval()` usage

---

## 2. Architecture Rules

- **No business logic in UI components.** Move it to service layers.
- **Service layer required** for all database operations.
- **Repository pattern** preferred for complex data access.
- **Dependency injection** over hard-coded imports for testability.
- **No circular imports.** Use barrel files carefully.
- **Feature-based folder structure** preferred over type-based.

### Preferred Structure
```
src/
  features/
    auth/
      components/
      hooks/
      services/
      types.ts
    dashboard/
      ...
  lib/
    supabase/
    utils/
  types/
    global.d.ts
```

---

## 3. Architecture Invariants (ArchitectureGate)

These invariants must never be violated. Any change that breaks them is an automatic **ArchitectureGate FAIL**:

1. **Service boundary** — Business logic lives in `src/services/`. It must not live in API routes, components, or hooks.
2. **Validation boundary** — Zod schemas live in `src/lib/validations/`. They must not be defined inline inside components or routes.
3. **Database boundary** — All database access goes through the service layer. No direct Supabase calls from components.
4. **Auth boundary** — Session retrieval happens in server components or API routes only. Never in client components.
5. **Tenant boundary** — Every database write includes `tenant_id`. Every database read filters by `tenant_id`. No exceptions.
6. **Secret boundary** — `process.env.SUPABASE_SERVICE_ROLE_KEY` and other server-only secrets must never appear in client-accessible code.

If a proposed change would violate any of the above invariants, it must be rejected and an ADR written to propose a structured change to the invariant.

---

## 4. API Design Rules

- REST: Use proper HTTP verbs (GET, POST, PUT, PATCH, DELETE)
- All routes return consistent response shapes:
  ```typescript
  type ApiResponse<T> = {
    data: T | null;
    error: string | null;
    meta?: Record<string, unknown>;
  }
  ```
- Paginated endpoints must include: `page`, `pageSize`, `total`, `hasMore`
- Never return sensitive data (passwords, keys, full internal errors)
- Status codes must be semantically correct (200, 201, 400, 401, 403, 404, 409, 422, 500)

---

## 5. API Contract Safety (APIContractGate)

Any change to an existing API endpoint that modifies its response shape is a **breaking change** and must:

1. Be discussed and approved before implementation
2. Be versioned if existing consumers cannot be updated simultaneously
3. Be documented with a migration guide for API consumers
4. Be flagged in the release report as an APIContractGate risk item

**Breaking changes include:**
- Removing a field from a response
- Renaming a field
- Changing a field's type
- Changing the HTTP status code of a success response
- Removing an endpoint

**Non-breaking changes** (safe to ship without versioning):
- Adding a new optional field to a response
- Adding a new endpoint
- Adding a new optional query parameter

---

## 6. Validation Rules

- **All inputs must be validated** at the API/service boundary
- Use **Zod** for schema validation in TypeScript projects
- Client-side validation is UX — server-side validation is security
- Validation errors must return field-level details for forms
- File uploads: validate MIME type, file size, and scan for malicious content

---

## 7. Error Handling Rules

- Never catch an error and do nothing (no empty catch blocks)
- Never expose internal error messages to end users
- Log the full error internally (server-side)
- Return a safe, user-friendly message externally
- Use error boundaries in React for UI error containment
- Every async function must handle promise rejections

### Error Response Pattern
```typescript
// Good
try {
  const result = await service.doThing(input);
  return { data: result, error: null };
} catch (err) {
  logger.error('doThing failed', { err, input });
  return { data: null, error: 'Operation failed. Please try again.' };
}

// Bad
try {
  const result = await service.doThing(input);
  return result;
} catch (err) {
  return { error: err.message }; // leaks internal details
}
```

---

## 8. Logging Rules

- **Structured JSON logging required** in production
- Log levels: `debug`, `info`, `warn`, `error`
- Every log entry must include: `timestamp`, `level`, `message`, `context`
- Sensitive fields must be redacted before logging
- Log meaningful events: auth, mutations, errors, performance issues
- Do not log inside hot paths (tight loops) — sample instead

---

## 9. Database Query Rules

- Never write raw SQL strings with interpolated user input
- Always use parameterized queries or query builders
- Supabase: always chain `.eq('tenant_id', tenantId)` on tenant tables
- Add `LIMIT` to all list queries (default 50, max 200 unless paginated)
- Prefer indexed columns in `WHERE` clauses
- Use transactions for multi-step writes

---

## 10. Schema Safety (DataIntegrityGate)

All database schema changes must satisfy:

1. **Additive by default** — prefer adding new columns over modifying existing ones
2. **Non-destructive** — never `DROP COLUMN` or `ALTER COLUMN TYPE` without a migration plan
3. **Reversible** — every migration must have a rollback script in `database/rollback/`
4. **Safe defaults** — new columns on existing tables must have a `DEFAULT` or be nullable to avoid locking
5. **Constraint-safe** — adding a `NOT NULL` constraint to an existing table requires backfilling first
6. **Index-complete** — any column used in a `WHERE` clause in application code must have a corresponding index

A schema change that does not satisfy these criteria is a **DataIntegrityGate FAIL** and must not be deployed.

---

## 11. Component Rules (React/Next.js)

- Components must be small and focused (single responsibility)
- Props interfaces must be explicitly typed
- Use `React.memo` only when profiling shows it helps
- Loading states: every async operation must show a loading indicator
- Empty states: every list must handle the zero-item case
- Error states: every async operation must handle failure gracefully
- Mobile-first responsive design required

### Required UI States for Every Feature
```
[ ] Loading state
[ ] Empty state
[ ] Error state
[ ] Success state
[ ] Permission denied state
```

---

## 12. UI Anti-Patterns (Prohibited)

The following patterns must never appear in production UI code:

- **God components** — Components over 200 lines that do multiple unrelated things
- **Prop drilling > 2 levels** — Use context or state management instead
- **Direct database calls from components** — Use service layers
- **Business logic in render functions** — Extract to hooks or service functions
- **Hardcoded user-facing strings in component logic** — Use constants or i18n
- **Inline styles on production components** — Use Tailwind or CSS modules
- **Unguarded async calls** — All async component code must handle loading and error states
- **Missing `key` props on lists** — Every list item must have a stable, unique key

---

## 13. Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Files (React) | PascalCase | `UserCard.tsx` |
| Files (utils) | camelCase | `formatDate.ts` |
| Components | PascalCase | `UserCard` |
| Functions | camelCase | `getUserById` |
| Constants | UPPER_SNAKE | `MAX_FILE_SIZE` |
| Types/Interfaces | PascalCase | `UserProfile` |
| Database tables | snake_case | `project_members` |
| Database columns | snake_case | `created_at` |
| Environment vars | UPPER_SNAKE | `NEXT_PUBLIC_SUPABASE_URL` |

---

## 14. Import Rules

- Absolute imports preferred over relative where configured
- Group imports: 1) external packages, 2) internal modules, 3) local files
- No unused imports (enforce with ESLint)
- No circular dependencies

---

## 15. Performance Thresholds (PerformanceGate)

These thresholds define a **PerformanceGate FAIL**:

| Metric | Threshold | Tool |
|---|---|---|
| Largest Contentful Paint (LCP) | > 2.5 seconds | Lighthouse / Vercel Analytics |
| API response time (p95) | > 1 second | Sentry Performance |
| Database query time (p95) | > 500ms | Supabase query analysis |
| Bundle size increase | > 50KB gzipped per PR | Bundleanalyzer |
| N+1 queries introduced | Any | Code review / query log |

If any threshold is breached by a change, the change must be optimised before shipping.

---

*Code that violates these rules must be flagged and fixed before the phase is marked complete.*
