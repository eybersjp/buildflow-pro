# Workflow: Feature Build
# BuildFlow Pro — Workflow 07

## Purpose

Build one production feature safely, with planning, tests, security review, and a completion report — every time.

## Trigger

Run this workflow when the user says:
- `/build-feature`
- "build feature"
- "add module"
- "implement this"
- "add [feature name]"

---

## Required Input

Feature name and description.

If missing, ask:
```
What feature would you like to build?

Please provide:
1. Feature name
2. What it does (1-2 sentences)
3. Who uses it (which user role)
4. Any specific requirements

If you're unsure, I'll ask the right questions.
```

---

## Step 1: Feature Understanding

**Activate:** `product-manager` skill

Produce a feature brief:

```markdown
## Feature Brief: [Feature Name]

**Goal:** What this feature achieves for the user

**User Story:**
As a [role], I want to [action] so that [benefit].

**Acceptance Criteria:**
- [ ] Given [context], when [action], then [expected result]
- [ ] Given [context], when [action], then [expected result]

**User Roles:**
- Who can create/read/update/delete?

**Edge Cases:**
- What happens when [edge case]?

**Data Required:**
- Fields needed
- Validation rules

**Dependencies:**
- What must exist before this feature works?
```

Display and ask: "Does this match what you want? (yes/edit/clarify)"

---

## Step 2: Technical Design

**Activate:** `software-architect` skill

For complex/multi-domain features, also consult:
- `skills/software-architect/subagent-driven-development.md` — if the feature needs parallel workstreams
- `skills/software-architect/software-architecture.md` — if a pattern decision is required

Produce:

```markdown
## Technical Design: [Feature Name]

**Files to Create:**
- `src/app/(dashboard)/[feature]/page.tsx`
- `src/components/[feature]/[FeatureName]Card.tsx`
- `src/services/[feature].service.ts`
- `src/lib/validations/[feature].ts`

**Files to Modify:**
- `src/lib/navigation.ts` — add nav link

**Component Pattern Selected:**
(Reference `skills/frontend-engineer/component-patterns.md`)
- Simple functional: [simple components]
- Compound: [multi-part flexible components]
- Controlled/Uncontrolled: [inputs and forms]
- Polymorphic: [buttons/links rendered as different elements]

**Database Changes Needed:** YES / NO
- If yes → activate database-engineer skill (Step 3)

**API/Service Design:**
- `GET /api/[feature]` — list items
- `POST /api/[feature]` — create item
- `PUT /api/[feature]/[id]` — update item
- `DELETE /api/[feature]/[id]` — delete item

**State Management:**
- Server state: TanStack Query
- UI state: local useState

**Test Requirements:**
- Unit tests: service functions (TDD — write spec first)
- Integration tests: API routes
- E2E tests: create + list flow (Playwright)
```

---

## Step 3: Database Design (if needed)

**Activate:** `database-engineer` skill (only if schema changes required)

Produce:
- New table definition (if needed)
- New columns (if modifying existing table)
- RLS policy updates
- New migration file: `database/migrations/[NNN]_[feature].sql`

⚠️ **GATE:** Do not apply migration without user approval.

Display:
```
The following migration will be created:
[migration content]

This is for review only. I will NOT run it until you approve.
```

---

## Step 4: Frontend Build

**Activate:** `frontend-engineer` skill

Build:
- Page component with all required states
- Feature components (card, list, detail view)
- Create/edit form with Zod validation
- Loading skeleton
- Empty state
- Error state
- Success notifications

Every component must handle:
- [ ] Loading state
- [ ] Empty state
- [ ] Error state
- [ ] Success state
- [ ] Permission-based rendering

---

## Step 5: Backend Build

**Activate:** `backend-engineer` skill

Also reference:
- `skills/backend-engineer/error-handling-patterns.md` — use `Result<T>` pattern and typed error classes

Build:
- Service function(s) using `Result<T>` return type (never throw)
- Typed error classes (`ValidationError`, `ForbiddenError`, `DatabaseError`, etc.)
- API route or server action
- Authorization check (role-based)
- Error handling with `logger.error()` for all DB errors
- Audit log entry on all mutations

Every backend function must:
- [ ] Validate input with Zod (before any DB access)
- [ ] Authorize the requesting user (before any DB access)
- [ ] Return `Result<T>` using `ok()` / `err()` — never throw
- [ ] Filter by `tenant_id` if multi-tenant
- [ ] Log errors server-side with `logger.error()` + context
- [ ] Write audit log for mutations
- [ ] Return client-safe error messages only (no DB internals)

---

## Step 6: Tests

**Activate:** `qa-engineer` skill

For this step, use the TDD approach (reference `skills/qa-engineer/test-driven-development.md`):
1. Write the **Test Specification** first (8-category table)
2. Write **failing tests** for all service functions (Red)
3. Verify tests fail for the right reason
4. Implementation is complete when all tests pass (Green)
5. Refactor with tests staying green

For E2E tests, use the templates in `skills/qa-engineer/webapp-testing.md`:
- Auth fixture for the required role
- CRUD journey test (create → view → edit → delete)
- Empty state, error state, loading state, permission-denied tests
- Cross-viewport verification (375px, 768px, 1280px)

Run checks (safe commands — do NOT run without approval):
```
npm run lint
npm run typecheck
npm run test
npm run test:coverage
```

Report results:
```
Lint:       ✅ 0 errors / ❌ [n] errors
TypeCheck:  ✅ 0 errors / ❌ [n] errors
Tests:      ✅ [n] passing / ❌ [n] failing
Coverage:   ✅ [%] (service layer ≥80%) / ❌ [%] below threshold
```

---

## Step 7: Security Review

**Activate:** `security-engineer` skill

Review:
- Auth is enforced on all new routes
- RBAC is enforced at service level
- Tenant isolation is maintained
- No secrets exposed
- Input validation is complete
- File access is restricted (if applicable)

---

## Step 8: Completion Report

Produce this report when the feature is done:

```markdown
## Feature Complete: [Feature Name]

**Status:** ✅ Complete / ⚠️ Complete with warnings / ❌ Blocked

**Summary:**
[One paragraph describing what was built]

**Files Created:**
- `path/to/file.ts` — [description]

**Files Modified:**
- `path/to/file.ts` — [what changed]

**Tests:**
- Unit: [n] tests, [n] passing
- Integration: [n] tests, [n] passing
- E2E: [n] tests, [n] passing

**Security Review:**
- Auth enforced: ✅ / ❌
- Tenant isolation: ✅ / ❌
- Input validation: ✅ / ❌

**Risks:**
- [any outstanding risks]

**GO / NO-GO Status:** ✅ GO / ⚠️ GO WITH RISKS / ❌ NO-GO

**Next Recommended Action:**
[What to build or do next]
```

Update:
- `.antigravity/memory/changelog.md`
- `.antigravity/memory/project-state.md`
- `docs/BUILD_ROADMAP.md`
- `.antigravity/memory/task-plan.md` — mark task complete
- `.antigravity/memory/debug-log.md` — if any non-trivial bugs were encountered during this build
- `.antigravity/memory/learned-patterns.md` — if any new patterns were discovered
