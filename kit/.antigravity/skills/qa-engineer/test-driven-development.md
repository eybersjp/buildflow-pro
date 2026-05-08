---
name: test-driven-development
description: A TDD workflow for BuildFlow Pro that writes failing tests first, then implements the minimum code to make them pass, then refactors. Produces a test specification before implementation begins, ensuring every feature is built against a verified contract. Activate when building any new feature or service function.
version: 1.0.0
triggers:
  - "TDD"
  - "test-first"
  - "write tests before implementation"
  - "test-driven"
lifecycle: build
---

# Test-Driven Development (TDD)
# BuildFlow Pro — QA Intelligence Layer
# Source: awesome-claude-skills / test-driven-development pattern

## Overview

TDD in BuildFlow Pro means: **Red → Green → Refactor**. Every feature starts with a failing test, not a blank service file.

This skill changes the order of operations in the feature build workflow:
1. Write the test specification (what the code should do)
2. Write a failing test (Red)
3. Write the minimum implementation to pass the test (Green)
4. Refactor for quality (Refactor)
5. Repeat per acceptance criterion

---

## When to Activate

- User says "TDD" or "test-first"
- User says "write tests before implementation"
- A new service function is being built where correctness is critical
- A bug is being fixed (regression test first, then fix)

---

## The TDD Loop

### Phase 1 — Test Specification

Before writing any test code, produce a **Test Specification** document:

```markdown
## Test Specification: [Feature/Service Name]

**Function:** `functionName(input, context)`
**Purpose:** [One sentence]

### Test Cases

| ID | Category | Input | Context | Expected Output | Priority |
|---|---|---|---|---|---|
| T-001 | Happy path | Valid input | Admin role | Returns created record | Must-pass |
| T-002 | Validation | Empty name | Admin role | Returns validation error | Must-pass |
| T-003 | Auth | Valid input | No session | Returns 401 | Must-pass |
| T-004 | Authorization | Valid input | Viewer role | Returns permission error | Must-pass |
| T-005 | Tenant isolation | Valid input, tenant A | Admin of tenant B | Returns no data | Must-pass |
| T-006 | DB error | Valid input | Admin role | Returns safe error, logs internally | Should-pass |
| T-007 | Idempotency | Duplicate request | Admin role | Returns existing record | Nice-to-have |
| T-008 | Edge case | Max-length name (100 chars) | Admin role | Returns created record | Should-pass |
```

**Gate:** Show the Test Specification to the user before writing any code. Get explicit confirmation that the test cases cover all acceptance criteria from the PRD.

### Phase 2 — Red (Failing Tests)

Write ALL tests from the specification as failing tests. Run them to confirm they fail.

```typescript
// src/services/__tests__/project.service.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createProject } from '../project.service';
import { mockSupabaseClient } from '@/tests/mocks/supabase';

// ── Mocks ──────────────────────────────────────────────────────
vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: () => mockSupabaseClient,
}));

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

// ── Test Suite ─────────────────────────────────────────────────
describe('createProject', () => {
  const adminContext = { tenantId: 'tenant-aaa', userId: 'user-111', userRole: 'admin' };
  const viewerContext = { ...adminContext, userRole: 'viewer' };
  const validInput = { name: 'Test Project', description: 'A project for testing' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // T-001: Happy path
  it('T-001: creates a project successfully for an admin', async () => {
    mockSupabaseClient.from.mockReturnValueOnce({
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: 'proj-001', ...validInput }, error: null }),
    });

    const result = await createProject(validInput, adminContext);
    expect(result.error).toBeNull();
    expect(result.data).toBeDefined();
    expect(result.data?.name).toBe('Test Project');
  });

  // T-002: Validation
  it('T-002: rejects empty project name', async () => {
    const result = await createProject({ name: '', description: 'desc' }, adminContext);
    expect(result.data).toBeNull();
    expect(result.error).toContain('Invalid input');
  });

  // T-003: Unauthorized (no session)
  it('T-003: returns error when context is missing tenantId', async () => {
    const result = await createProject(validInput, { tenantId: '', userId: '', userRole: '' });
    expect(result.data).toBeNull();
    expect(result.error).toBeTruthy();
  });

  // T-004: Authorization
  it('T-004: rejects viewer role from creating projects', async () => {
    const result = await createProject(validInput, viewerContext);
    expect(result.data).toBeNull();
    expect(result.error).toBe('Insufficient permissions');
  });

  // T-005: Tenant isolation
  it('T-005: inserts with the correct tenant_id', async () => {
    const insertSpy = vi.fn().mockReturnThis();
    mockSupabaseClient.from.mockReturnValueOnce({
      insert: insertSpy,
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: 'proj-002', ...validInput }, error: null }),
    });

    await createProject(validInput, adminContext);
    expect(insertSpy).toHaveBeenCalledWith(
      expect.objectContaining({ tenant_id: 'tenant-aaa' })
    );
  });

  // T-006: DB error
  it('T-006: returns safe error message when DB fails', async () => {
    mockSupabaseClient.from.mockReturnValueOnce({
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: new Error('DB connection lost') }),
    });

    const result = await createProject(validInput, adminContext);
    expect(result.data).toBeNull();
    expect(result.error).toBe('Failed to create project. Please try again.');
    // Internal error must NOT be exposed to user
    expect(result.error).not.toContain('DB connection lost');
  });

  // T-007: Idempotency
  it('T-007: audit log is written on successful creation', async () => {
    const auditSpy = vi.fn().mockResolvedValue(undefined);
    vi.mock('@/services/audit.service', () => ({ logAuditEvent: auditSpy }));

    mockSupabaseClient.from.mockReturnValueOnce({
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: 'proj-003', ...validInput }, error: null }),
    });

    await createProject(validInput, adminContext);
    expect(auditSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        tenantId: 'tenant-aaa',
        entityType: 'project',
        action: 'create',
      })
    );
  });
});
```

**Gate:** Run the tests. Every test must fail with a meaningful error (not a syntax error or import error). A "failing correctly" test confirms the test is wired properly.

```bash
npm run test -- --reporter=verbose
```

Expected output: All tests FAIL (red). If a test PASSES before implementation, the test is wrong.

### Phase 3 — Green (Minimum Implementation)

Write the minimum code needed to make the failing tests pass. No more, no less.

Rules during the Green phase:
- Do not optimize
- Do not add features not required by a test
- Do not write tests for code you haven't written yet
- Write just enough to turn red to green

### Phase 4 — Refactor

Once all tests are green:
- Improve code clarity (naming, structure, comments)
- Remove duplication
- Ensure error handling is production-grade
- Ensure logging is meaningful
- Run tests again after every refactor step to confirm green

```bash
npm run test -- --reporter=verbose
# Must still be all green after every refactor step
```

### Phase 5 — Coverage Report

After green + refactor:

```bash
npm run test:coverage
```

Required output:
```
Service layer coverage: ≥ 80% (TestCoverageGate threshold)
Statements: [%]
Branches:   [%]
Functions:  [%]
Lines:      [%]
```

If coverage is below 80% on the service layer, add tests until the threshold is met.

---

## TDD for Bug Fixes — Regression Test Protocol

When fixing a bug, ALWAYS write the regression test before touching the code:

1. **Reproduce** — confirm you can reproduce the bug
2. **Write a failing test** — write a test that fails because of the bug
3. **Confirm the test fails** — run it; it must fail for the right reason
4. **Fix the bug** — minimal change to make the test pass
5. **Confirm the test passes** — run it; it must now be green
6. **Run the full suite** — confirm no regressions were introduced

```typescript
// Example regression test format
it('REGRESSION [BUG-ID]: [what was broken]', async () => {
  // Specific conditions that triggered the bug
  const result = await service.method(bugTriggerInput, bugTriggerContext);
  
  // What the correct behavior should be
  expect(result.error).toBeNull();
  expect(result.data).toBeDefined();
});
```

---

## Verification

Before marking TDD complete for a feature:

- [ ] Test Specification was written and approved before any implementation
- [ ] All tests were written BEFORE the implementation (Red phase confirmed)
- [ ] All tests pass (Green phase confirmed)
- [ ] Code has been refactored for clarity without breaking tests
- [ ] Coverage ≥ 80% on all service functions
- [ ] All 8 test categories from the QA skill are represented in the test specification
- [ ] No `it.skip()` or `it.todo()` tests exist without a documented reason

---

## Red Flags

- Tests are written AFTER the implementation (this is not TDD — it is after-the-fact testing)
- Tests are written to match the implementation rather than the requirements (circular testing)
- `it.skip()` is used for failing tests instead of fixing the implementation
- Coverage threshold is met by testing private helper functions rather than business logic
- A test passes before any implementation exists (test is not testing the right thing)

---

## Anti-Rationalisations

- ❌ "Writing tests first slows us down" — TDD reduces total time by eliminating debugging cycles and rework.
- ❌ "We'll write tests after the feature is built" — Tests written after implementation test the implementation, not the requirements.
- ❌ "The tests would just test the code I'm about to write" — Tests must test the *requirement*, not the implementation detail.
- ❌ "Coverage is at 80%, we're done" — 80% coverage on code that only tests the happy path is misleading. Cover all 8 test categories.
