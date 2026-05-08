# Testing Rules
# BuildFlow Pro — Production Test Quality Standards
# Version: 2.0.0 — Phase 1 Integration (Code-Kit-Ultra TestCoverageGate)

All production features must be tested. Untested code does not ship.

---

## 1. Test Gate

Follow the **Green-to-Proceed** gate:

```
1. Implement feature
2. Write unit tests
3. Write integration tests
4. Write E2E tests (for critical paths)
5. Run all tests
6. If any test fails → Fix → Re-run
7. Only proceed to next phase when 100% green
```

---

## 2. Coverage Floor (TestCoverageGate)

Coverage requirements are enforced as part of the governance gate model.

| Layer | Minimum Coverage | Gate |
|---|---|---|
| Service functions | 80% | TestCoverageGate FAIL if below |
| API route handlers | 70% | TestCoverageGate FAIL if below |
| Utility functions | 90% | TestCoverageGate FAIL if below |
| Zod validation schemas | 100% | Must cover valid + invalid cases |

**TestCoverageGate FAIL conditions:**
- Any service function with less than 80% line coverage
- Tenant isolation test not present
- Happy path test not present
- Auth bypass test not present
- Coverage dropped below threshold since last release

A TestCoverageGate FAIL blocks deployment regardless of whether the feature "appears to work."

---

## 3. Required Test Categories

Every production feature must have tests for:

| Category | Description |
|---|---|
| Happy path | Normal, expected usage |
| Empty state | Zero items, fresh account |
| Error state | API failure, network error |
| Permission denied | Unauthorized access attempt |
| Invalid input | Bad data, missing fields |
| Network failure | Timeout, connection error |
| Unauthorized access | Unauthenticated request |
| Tenant isolation | User cannot see other tenant's data |
| Mobile responsiveness | Layout works on small screens |
| Regression | Previously broken behavior stays fixed |

---

## 4. Unit Testing Standards

- Test files co-located with source: `Component.test.tsx`
- Use **Vitest** or **Jest** depending on framework
- Coverage target: **80% minimum** for production features
- Mock external dependencies (DB, APIs, auth)
- Test pure functions exhaustively — they're cheap to test

### Unit Test Structure
```typescript
describe('ServiceName', () => {
  describe('methodName', () => {
    it('should do expected behavior when condition', async () => {
      // Arrange
      const input = { ... };
      
      // Act
      const result = await service.method(input);
      
      // Assert
      expect(result.data).toBeDefined();
      expect(result.error).toBeNull();
    });

    it('should return error when input is invalid', async () => {
      // ...
    });
  });
});
```

---

## 5. Integration Testing Standards

- Test the API layer with real database (use test database)
- Test that auth is enforced
- Test that tenant isolation works
- Use **Supertest** for API route testing
- Reset database state between tests

---

## 6. E2E Testing Standards

- Use **Playwright** for E2E tests
- Cover all critical user journeys:
  - Sign up / login flow
  - Main dashboard render
  - Core feature CRUD operations
  - Permission-based visibility
- Run against staging environment
- Screenshot on failure for debugging

### E2E Test Template
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'testpassword');
    await page.click('[data-testid="login-submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should display feature correctly', async ({ page }) => {
    await page.goto('/feature');
    await expect(page.getByRole('heading', { name: 'Feature Name' })).toBeVisible();
  });
});
```

---

## 7. Performance Test Requirements (PerformanceGate)

For any feature that involves database queries or API calls:

- [ ] No N+1 query patterns (verify with query log or test)
- [ ] API route responds within 1 second under normal load (p95)
- [ ] Database queries execute within 500ms (p95)
- [ ] No new synchronous blocking operations added to the critical path
- [ ] Bundle size increase per PR does not exceed 50KB gzipped

If any performance threshold is breached, it is a **PerformanceGate FAIL** and must be resolved before deployment.

---

## 8. Test Data Rules

- Never use production data in tests
- Use factories or fixtures for test data generation
- Seed a test database with realistic but anonymized data
- Clean up test data after each test run

---

## 9. CI/CD Test Requirements

Tests must run automatically on:
- Every pull request
- Every push to `main`/`master`
- Before every production deployment

If tests fail in CI → block the merge or deployment.

---

## 10. QA Checklist

Before marking any feature complete:

- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] E2E tests written and passing (for critical paths)
- [ ] Happy path tested manually
- [ ] Error path tested manually
- [ ] Mobile layout tested (Chrome DevTools at 375px)
- [ ] Accessibility basics checked (keyboard nav, ARIA labels)
- [ ] Performance verified (no obvious N+1 queries, no blocking renders)
- [ ] Security: does the feature respect permissions?
- [ ] Tenant isolation: can user A see user B's data? (Must be NO)
- [ ] Coverage threshold met (80% on service layer)

---

*A feature with no tests is not complete. Period.*
