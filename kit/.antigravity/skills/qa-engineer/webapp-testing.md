---
name: webapp-testing
description: A comprehensive web application testing skill using Playwright for E2E, visual regression, network interception, accessibility auditing, and cross-viewport testing. Covers the full test pyramid for production web applications. Activate when any user-facing feature needs E2E test coverage.
version: 1.0.0
triggers:
  - "E2E tests"
  - "Playwright tests"
  - "webapp testing"
  - "user journey tests"
  - "visual regression"
  - "accessibility testing"
lifecycle: test
---

# Web Application Testing
# BuildFlow Pro — QA Intelligence Layer
# Source: awesome-claude-skills / webapp-testing pattern

## Overview

This skill implements the complete web application test pyramid for BuildFlow Pro projects using Playwright. It covers:
- **User Journey Tests** — complete flows from the user's perspective
- **Component State Tests** — all 5 UI states verified in browser context
- **API Contract Tests** — browser-level API interception and assertion
- **Accessibility Audits** — axe-core automated accessibility scanning
- **Cross-Viewport Tests** — mobile (375px), tablet (768px), desktop (1280px)
- **Visual Regression Tests** — screenshot-based regression detection

---

## Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    },
    {
      name: 'Tablet',
      use: {
        viewport: { width: 768, height: 1024 },
        ...devices['Desktop Chrome'],
      },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

---

## Test Utilities & Fixtures

```typescript
// tests/e2e/fixtures/auth.fixture.ts
import { test as base, expect, Page } from '@playwright/test';

type AuthFixtures = {
  adminPage: Page;
  memberPage: Page;
  viewerPage: Page;
};

export const test = base.extend<AuthFixtures>({
  adminPage: async ({ page }, use) => {
    await authenticateAs(page, {
      email: process.env.E2E_ADMIN_EMAIL!,
      password: process.env.E2E_ADMIN_PASSWORD!,
    });
    await use(page);
  },
  memberPage: async ({ page }, use) => {
    await authenticateAs(page, {
      email: process.env.E2E_MEMBER_EMAIL!,
      password: process.env.E2E_MEMBER_PASSWORD!,
    });
    await use(page);
  },
  viewerPage: async ({ page }, use) => {
    await authenticateAs(page, {
      email: process.env.E2E_VIEWER_EMAIL!,
      password: process.env.E2E_VIEWER_PASSWORD!,
    });
    await use(page);
  },
});

async function authenticateAs(page: Page, credentials: { email: string; password: string }) {
  await page.goto('/login');
  await page.getByTestId('email-input').fill(credentials.email);
  await page.getByTestId('password-input').fill(credentials.password);
  await page.getByTestId('login-submit').click();
  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByTestId('dashboard-heading')).toBeVisible();
}

export { expect };
```

```typescript
// tests/e2e/helpers/api-helpers.ts
import { Page, Route } from '@playwright/test';

/** Intercept an API route and return mock data */
export async function mockApiRoute(
  page: Page,
  path: string,
  response: { status?: number; body: unknown }
) {
  await page.route(`**/api/${path}`, (route: Route) => {
    route.fulfill({
      status: response.status ?? 200,
      contentType: 'application/json',
      body: JSON.stringify(response.body),
    });
  });
}

/** Intercept an API route and assert the request body */
export async function assertApiRequest(
  page: Page,
  path: string,
  assertion: (body: unknown) => void
): Promise<void> {
  return new Promise((resolve) => {
    page.route(`**/api/${path}`, async (route) => {
      const body = JSON.parse(route.request().postData() ?? '{}');
      assertion(body);
      await route.continue();
      resolve();
    });
  });
}

/** Wait for and assert a network request */
export async function waitForApiCall(page: Page, method: string, path: string) {
  return page.waitForRequest(
    (req) => req.method() === method && req.url().includes(path)
  );
}
```

---

## User Journey Test Templates

### Standard CRUD Feature Test

```typescript
// tests/e2e/features/projects.spec.ts
import { test, expect } from '../fixtures/auth.fixture';
import { mockApiRoute } from '../helpers/api-helpers';

test.describe('Projects Feature', () => {

  // ── Happy Path ────────────────────────────────────────────────
  test('admin can create, view, edit, and delete a project', async ({ adminPage: page }) => {
    await page.goto('/projects');

    // Create
    await page.getByTestId('create-project-btn').click();
    await expect(page.getByRole('dialog', { name: 'Create Project' })).toBeVisible();
    await page.getByTestId('project-name-input').fill('E2E Test Project');
    await page.getByTestId('project-description-input').fill('Created by Playwright');
    await page.getByTestId('submit-project-btn').click();

    // Confirm creation
    await expect(page.getByText('Project created successfully')).toBeVisible();
    await expect(page.getByText('E2E Test Project')).toBeVisible();

    // View detail
    await page.getByText('E2E Test Project').click();
    await expect(page).toHaveURL(/\/projects\/.+/);
    await expect(page.getByRole('heading', { name: 'E2E Test Project' })).toBeVisible();

    // Edit
    await page.getByTestId('edit-project-btn').click();
    await page.getByTestId('project-name-input').fill('Updated Project Name');
    await page.getByTestId('submit-project-btn').click();
    await expect(page.getByText('Project updated successfully')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Updated Project Name' })).toBeVisible();

    // Delete
    await page.getByTestId('delete-project-btn').click();
    await expect(page.getByRole('dialog', { name: /Confirm/ })).toBeVisible();
    await page.getByTestId('confirm-delete-btn').click();
    await expect(page.getByText('Project deleted successfully')).toBeVisible();
    await expect(page).toHaveURL('/projects');
    await expect(page.getByText('Updated Project Name')).not.toBeVisible();
  });

  // ── Empty State ───────────────────────────────────────────────
  test('shows empty state for a fresh tenant with no projects', async ({ adminPage: page }) => {
    await mockApiRoute(page, 'projects', {
      body: { data: [], error: null },
    });

    await page.goto('/projects');
    await expect(page.getByTestId('empty-state')).toBeVisible();
    await expect(page.getByText('No projects yet')).toBeVisible();
    await expect(page.getByTestId('create-project-btn')).toBeVisible();
  });

  // ── Error State ───────────────────────────────────────────────
  test('shows error state and retry button when API fails', async ({ adminPage: page }) => {
    await mockApiRoute(page, 'projects', {
      status: 500,
      body: { data: null, error: 'Internal server error' },
    });

    await page.goto('/projects');
    await expect(page.getByTestId('error-state')).toBeVisible();
    await expect(page.getByText(/something went wrong/i)).toBeVisible();
    await expect(page.getByTestId('retry-btn')).toBeVisible();
  });

  // ── Permission Denied ─────────────────────────────────────────
  test('viewer cannot see create button', async ({ viewerPage: page }) => {
    await page.goto('/projects');
    await expect(page.getByTestId('create-project-btn')).not.toBeVisible();
  });

  test('member cannot delete projects', async ({ memberPage: page }) => {
    await page.goto('/projects');
    if (await page.getByText('E2E Test Project').isVisible()) {
      await page.getByText('E2E Test Project').click();
      await expect(page.getByTestId('delete-project-btn')).not.toBeVisible();
    }
  });

  // ── Validation ────────────────────────────────────────────────
  test('shows field-level validation error for empty project name', async ({ adminPage: page }) => {
    await page.goto('/projects');
    await page.getByTestId('create-project-btn').click();
    await page.getByTestId('submit-project-btn').click(); // Submit without filling

    await expect(page.getByTestId('project-name-error')).toBeVisible();
    await expect(page.getByText('Name is required')).toBeVisible();
    // Dialog must remain open
    await expect(page.getByRole('dialog', { name: 'Create Project' })).toBeVisible();
  });

  // ── Loading State ─────────────────────────────────────────────
  test('shows loading skeleton while fetching projects', async ({ adminPage: page }) => {
    // Delay the API response to catch the loading state
    await page.route('**/api/projects', async (route) => {
      await new Promise((r) => setTimeout(r, 500));
      await route.continue();
    });

    await page.goto('/projects');
    await expect(page.getByTestId('projects-skeleton')).toBeVisible();
    await expect(page.getByTestId('projects-list')).toBeVisible({ timeout: 5000 });
  });

  // ── Tenant Isolation ──────────────────────────────────────────
  test('cannot access another tenant project by direct URL', async ({ memberPage: page }) => {
    // Try to access a project ID that belongs to a different tenant
    await page.goto('/projects/proj-other-tenant-id');
    await expect(page).toHaveURL(/\/404|\/projects/);
    // Must NOT see the other tenant's project data
    await expect(page.getByText('Other Tenant Secret Data')).not.toBeVisible();
  });
});
```

---

## Accessibility Testing

```typescript
// tests/e2e/accessibility/a11y.spec.ts
import { test, expect } from '../fixtures/auth.fixture';
import AxeBuilder from '@axe-core/playwright';

const CORE_PAGES = [
  { path: '/login', name: 'Login Page', auth: false },
  { path: '/dashboard', name: 'Dashboard', auth: true },
  { path: '/projects', name: 'Projects List', auth: true },
];

test.describe('Accessibility Audit', () => {
  for (const { path, name, auth } of CORE_PAGES) {
    test(`${name} has no critical accessibility violations`, async ({ adminPage: page, page: unauthPage }) => {
      const activePage = auth ? adminPage : unauthPage;
      await activePage.goto(path);

      const results = await new AxeBuilder({ page: activePage })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .exclude('#third-party-widget') // exclude known external widgets
        .analyze();

      // Fail on critical and serious violations
      const violations = results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      );

      if (violations.length > 0) {
        console.error('Accessibility violations found:');
        violations.forEach((v) => {
          console.error(`  [${v.impact}] ${v.id}: ${v.description}`);
          v.nodes.forEach((n) => console.error(`    Element: ${n.html}`));
        });
      }

      expect(violations).toHaveLength(0);
    });
  }
});
```

---

## Cross-Viewport Tests

```typescript
// tests/e2e/responsive/viewports.spec.ts
import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: 'Mobile', width: 375, height: 812 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1280, height: 800 },
  { name: 'Wide', width: 1920, height: 1080 },
];

for (const viewport of VIEWPORTS) {
  test(`Dashboard renders correctly at ${viewport.name} (${viewport.width}px)`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    // Auth
    await page.goto('/login');
    await page.getByTestId('email-input').fill(process.env.E2E_ADMIN_EMAIL!);
    await page.getByTestId('password-input').fill(process.env.E2E_ADMIN_PASSWORD!);
    await page.getByTestId('login-submit').click();
    await page.waitForURL('/dashboard');

    // No horizontal scrollbar
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const windowWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyScrollWidth).toBeLessThanOrEqual(windowWidth + 1); // +1 for rounding

    // Core content visible
    await expect(page.getByTestId('dashboard-heading')).toBeVisible();
    await expect(page.getByTestId('main-nav')).toBeVisible();

    // Screenshot for visual review
    await page.screenshot({
      path: `test-results/screenshots/dashboard-${viewport.name.toLowerCase()}.png`,
      fullPage: false,
    });
  });
}
```

---

## Visual Regression Tests

```typescript
// tests/e2e/visual/regression.spec.ts
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Visual Regression', () => {
  test('Dashboard layout matches snapshot', async ({ adminPage: page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Hide dynamic content that changes between runs
    await page.evaluate(() => {
      document.querySelectorAll('[data-testid="timestamp"]').forEach((el) => {
        (el as HTMLElement).textContent = '2026-01-01T00:00:00Z';
      });
      document.querySelectorAll('[data-testid="chart"]').forEach((el) => {
        (el as HTMLElement).style.visibility = 'hidden';
      });
    });

    await expect(page).toHaveScreenshot('dashboard.png', {
      maxDiffPixelRatio: 0.02, // Allow 2% pixel difference
      animations: 'disabled',
    });
  });
});
```

---

## Test Environment Setup

```
# .env.test (git-ignored)
E2E_BASE_URL=http://localhost:3000
E2E_ADMIN_EMAIL=e2e-admin@buildflow-test.internal
E2E_ADMIN_PASSWORD=[test-only password]
E2E_MEMBER_EMAIL=e2e-member@buildflow-test.internal
E2E_MEMBER_PASSWORD=[test-only password]
E2E_VIEWER_EMAIL=e2e-viewer@buildflow-test.internal
E2E_VIEWER_PASSWORD=[test-only password]
```

Test accounts must:
- Exist only in the test environment / staging database
- Have empty or seeded data (not production data)
- Be reset before each test run (use `beforeEach` with API calls or database seeds)

---

## CI Integration

```yaml
# .github/workflows/e2e.yml (add to existing CI)
e2e:
  runs-on: ubuntu-latest
  needs: [quality]
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    - run: npm ci
    - run: npx playwright install --with-deps chromium
    - run: npm run build
    - run: npx playwright test
      env:
        E2E_BASE_URL: ${{ vars.E2E_BASE_URL }}
        E2E_ADMIN_EMAIL: ${{ secrets.E2E_ADMIN_EMAIL }}
        E2E_ADMIN_PASSWORD: ${{ secrets.E2E_ADMIN_PASSWORD }}
        E2E_MEMBER_EMAIL: ${{ secrets.E2E_MEMBER_EMAIL }}
        E2E_MEMBER_PASSWORD: ${{ secrets.E2E_MEMBER_PASSWORD }}
        E2E_VIEWER_EMAIL: ${{ secrets.E2E_VIEWER_EMAIL }}
        E2E_VIEWER_PASSWORD: ${{ secrets.E2E_VIEWER_PASSWORD }}
    - uses: actions/upload-artifact@v4
      if: failure()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 7
```

---

## Verification

Before marking webapp testing complete:

- [ ] Playwright config covers Desktop, Mobile, and Tablet viewports
- [ ] Auth fixtures exist for all user roles (admin, member, viewer)
- [ ] CRUD happy path is tested end-to-end
- [ ] Empty state, error state, loading state, and permission-denied state are tested
- [ ] Validation errors are tested at the browser level
- [ ] Tenant isolation is tested by direct URL access
- [ ] Accessibility audit passes with zero critical/serious violations
- [ ] No horizontal scroll at any viewport
- [ ] E2E tests run in CI against a staging environment
- [ ] Screenshots are captured for any visual regression tests
- [ ] Test environment uses isolated test accounts, never production data

---

## Red Flags

- Tests use production email/password credentials
- Tests have hard-coded `page.waitForTimeout(3000)` — use `waitForSelector` or `waitForURL` instead
- Tests rely on text matching that can change (use `data-testid` attributes)
- All tests run as admin only — no role-based testing
- No CI integration — tests only run locally

---

## Anti-Rationalisations

- ❌ "The unit tests are enough" — Unit tests don't catch integration failures between components, routing, and auth.
- ❌ "E2E tests are flaky, we don't use them" — Flakiness is caused by bad test design, not by Playwright. Fix the test design.
- ❌ "We only test on desktop" — Mobile users are not second-class users. Test on mobile.
- ❌ "Accessibility is for later" — Axe-core adds 30 seconds to your test run. Retrofitting accessibility to a complete app takes weeks.
