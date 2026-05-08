import { test, expect, Page } from '@playwright/test';

// ═══════════════════════════════════════════
// TEST CONFIGURATION
// ═══════════════════════════════════════════
const TEST_USER = {
  email: process.env.TEST_USER_EMAIL ?? 'test@example.com',
  password: process.env.TEST_USER_PASSWORD ?? 'testpassword123',
};

// ═══════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════
async function loginAs(page: Page, role: 'admin' | 'member' | 'viewer' = 'admin') {
  await page.goto('/login');
  await page.fill('[data-testid="email-input"]', TEST_USER.email);
  await page.fill('[data-testid="password-input"]', TEST_USER.password);
  await page.click('[data-testid="login-submit"]');
  await expect(page).toHaveURL('/dashboard');
}

// ═══════════════════════════════════════════
// [FEATURE NAME] TEST SUITE
// ═══════════════════════════════════════════
test.describe('[Feature Name]', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'admin');
  });

  // ─── Happy Path ───────────────────────────
  test('should display [feature] page', async ({ page }) => {
    await page.goto('/[feature]');
    await expect(page.getByRole('heading', { name: '[Feature Title]' })).toBeVisible();
  });

  test('should create a [feature]', async ({ page }) => {
    await page.goto('/[feature]');
    await page.click('[data-testid="create-[feature]-btn"]');
    
    // Fill form
    await page.fill('[data-testid="[feature]-name"]', 'Test [Feature]');
    await page.fill('[data-testid="[feature]-description"]', 'Test description');
    
    // Submit
    await page.click('[data-testid="submit-[feature]"]');
    
    // Verify success
    await expect(page.getByText('Test [Feature]')).toBeVisible();
    await expect(page.getByText('[Feature] created successfully')).toBeVisible();
  });

  // ─── Empty State ──────────────────────────
  test('should show empty state when no [feature]s exist', async ({ page }) => {
    await page.goto('/[feature]');
    // Assumes fresh test account with no data
    await expect(page.getByText('No [feature]s yet')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create [Feature]' })).toBeVisible();
  });

  // ─── Validation ───────────────────────────
  test('should show validation error for empty name', async ({ page }) => {
    await page.goto('/[feature]');
    await page.click('[data-testid="create-[feature]-btn"]');
    await page.click('[data-testid="submit-[feature]"]');
    
    await expect(page.getByText('Name is required')).toBeVisible();
  });

  // ─── Permission ───────────────────────────
  test('should not show create button for viewer role', async ({ page }) => {
    await loginAs(page, 'viewer');
    await page.goto('/[feature]');
    
    await expect(page.getByTestId('create-[feature]-btn')).not.toBeVisible();
  });

  // ─── Tenant Isolation ─────────────────────
  test('should not display [feature]s from another tenant', async ({ page }) => {
    // This test verifies that User A cannot see User B's data
    // Implement with a second test account from a different tenant
    // await loginAs(page, 'different-tenant-user');
    // await page.goto('/[feature]');
    // await expect(page.getByText('Tenant A Data')).not.toBeVisible();
    test.todo('Implement tenant isolation test with second tenant account');
  });

});
