import { test, expect } from '@playwright/test';

// ─── Dashboard Tests ──────────────────────────────────────────────────────────
test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/dashboard');
    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');
  });

  test('page loads and shows greeting', async ({ page }) => {
    // Check that the page title contains FitAgent
    await expect(page).toHaveTitle(/FitAgent/i);
  });

  test('calorie ring SVG renders', async ({ page }) => {
    // CalorieRing renders an SVG element
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();
  });

  test('macro cards are visible (Protein / Carbs / Fat)', async ({ page }) => {
    // Each macro label should appear on the dashboard
    await expect(page.getByText(/protein/i).first()).toBeVisible();
    await expect(page.getByText(/carbs/i).first()).toBeVisible();
    await expect(page.getByText(/fat/i).first()).toBeVisible();
  });

  test('hydration section is visible', async ({ page }) => {
    await expect(page.getByText(/hydration|water/i).first()).toBeVisible();
  });

  test('readiness card is present', async ({ page }) => {
    await expect(page.getByText(/readiness|recovery/i).first()).toBeVisible();
  });
});

// ─── Bottom Navigation Tests ──────────────────────────────────────────────────
test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/dashboard');
    await page.waitForLoadState('networkidle');
  });

  test('bottom nav is visible', async ({ page }) => {
    // BottomNav renders nav links
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
  });

  test('navigate to Meals page', async ({ page }) => {
    // Click Meals link in bottom nav
    await page.getByRole('link', { name: /meals/i }).first().click();
    await page.waitForURL(/\/meals/);
    await expect(page).toHaveURL(/\/meals/);
    // Meals page should show a log food or meal input area
    await expect(page.getByText(/meal|food|log/i).first()).toBeVisible();
  });

  test('navigate to Coach page', async ({ page }) => {
    await page.getByRole('link', { name: /coach/i }).first().click();
    await page.waitForURL(/\/coach/);
    await expect(page).toHaveURL(/\/coach/);
    // Coach page should have a chat input
    const input = page.locator('input[type="text"], textarea').first();
    await expect(input).toBeVisible();
  });

  test('navigate to Progress page', async ({ page }) => {
    // Nav label is 'Stats' (links to /progress)
    await page.getByRole('link', { name: /stats/i }).first().click();
    await page.waitForURL(/\/progress/);
    await expect(page).toHaveURL(/\/progress/);
  });

  test('navigate back to Dashboard from another page', async ({ page }) => {
    // Go to meals first
    await page.getByRole('link', { name: /meals/i }).first().click();
    await page.waitForURL(/\/meals/);
    // Come back to dashboard
    await page.getByRole('link', { name: /home|dashboard/i }).first().click();
    await page.waitForURL(/\/dashboard/);
    await expect(page).toHaveURL(/\/dashboard/);
  });
});

// ─── Meals Page Tests ─────────────────────────────────────────────────────────
test.describe('Meals Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/meals');
    await page.waitForLoadState('networkidle');
  });

  test('meal logger page loads', async ({ page }) => {
    // Should have a heading or section title
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('meal input or add button is visible', async ({ page }) => {
    // Should have some form of food input or a button to log a meal
    const inputOrButton = page.locator('input, button').first();
    await expect(inputOrButton).toBeVisible();
  });
});

// ─── Coach Page Tests ─────────────────────────────────────────────────────────
test.describe('Coach Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/coach');
    await page.waitForLoadState('networkidle');
  });

  test('coach page loads', async ({ page }) => {
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('chat input is present', async ({ page }) => {
    const input = page.locator('input[type="text"], textarea').first();
    await expect(input).toBeVisible();
  });

  test('can type a message in chat input', async ({ page }) => {
    const input = page.locator('input[type="text"], textarea').first();
    await input.fill('What should I eat today?');
    await expect(input).toHaveValue('What should I eat today?');
  });
});

// ─── Visual / Screenshot Tests ────────────────────────────────────────────────
test.describe('Visual Snapshots', () => {
  test('dashboard screenshot', async ({ page }) => {
    await page.goto('http://localhost:5173/dashboard');
    await page.waitForLoadState('networkidle');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: 'tests/screenshots/dashboard.png', fullPage: true });
  });

  test('meals page screenshot', async ({ page }) => {
    await page.goto('http://localhost:5173/meals');
    await page.waitForLoadState('networkidle');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: 'tests/screenshots/meals.png', fullPage: true });
  });

  test('coach page screenshot', async ({ page }) => {
    await page.goto('http://localhost:5173/coach');
    await page.waitForLoadState('networkidle');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: 'tests/screenshots/coach.png', fullPage: true });
  });
});
