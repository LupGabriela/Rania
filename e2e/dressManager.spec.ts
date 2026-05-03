import { test, expect } from '@playwright/test';

test.describe('Feature 2 — Dress Manager CRUD', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/dress-manager');
    await page.waitForLoadState('networkidle');
  });

  test('table loads with seed dresses visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Dress Manager/i })).toBeVisible();
    await expect(page.getByText('Florentine Bloom')).toBeVisible();
  });

  test('clicking a dress name opens the detail view', async ({ page }) => {
  // Use exact:false to handle any whitespace differences
  await page.getByRole('button', { name: 'Florentine Bloom', exact: false }).first().click();

  await expect(page).toHaveURL(/\/dress-manager\/1/);
  await expect(page.getByRole('heading', { name: 'Florentine Bloom', exact: false })).toBeVisible();
  await expect(page.getByText('Chiffon', { exact: true }).first()).toBeVisible();
});

  test('detail view has Edit and Delete buttons', async ({ page }) => {
    await page.goto('/dress-manager/1');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('button', { name: /Edit/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Delete/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Back to Manager/i })).toBeVisible();
  });

  test('clicking Edit navigates to the edit form pre-filled', async ({ page }) => {
    await page.goto('/dress-manager/1');
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: /Edit/i }).click();

    await expect(page).toHaveURL('/dress-manager/1/edit');
    await expect(page.getByRole('heading', { name: /Edit Dress/i })).toBeVisible();
    await expect(page.getByPlaceholder('e.g. Florentine Bloom')).toHaveValue('Florentine Bloom');
  });

  test('adds a new dress successfully', async ({ page }) => {
  await page.goto('/dress-manager/new');
  await page.waitForLoadState('networkidle');

  await page.getByPlaceholder('e.g. Florentine Bloom').fill('Playwright Test Gown');
  await page.getByPlaceholder('e.g. 1350').fill('1999');
  await page.getByPlaceholder('e.g. 10').fill('5');
  await page.getByRole('combobox').selectOption('Silk');
  await page.getByLabel('M').check();
  await page.getByPlaceholder('Describe the dress — fabric feel, silhouette, occasions…')
    .fill('A stunning test gown created by Playwright automation.');

  // Wait for the button to become enabled
  const saveBtn = page.getByRole('button', { name: /Add Dress/i });
  await expect(saveBtn).toBeEnabled({ timeout: 5000 });
  await saveBtn.click();

  await expect(page).toHaveURL('/dress-manager', { timeout: 10000 });
});

  test('form validation: save button disabled when name is too short', async ({ page }) => {
    await page.goto('/dress-manager/new');
    await page.waitForLoadState('networkidle');

    await page.getByPlaceholder('e.g. Florentine Bloom').fill('AB');
    await page.getByPlaceholder('e.g. Florentine Bloom').blur();

    await expect(page.getByText(/at least 3 characters/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Add Dress/i })).toBeDisabled();
  });

  test('pagination shows up with more than 5 dresses', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Next/i })).toBeVisible();
    await expect(page.getByText(/Showing 1–5 of/)).toBeVisible();
  });

  test('navigating to page 2 shows different dresses', async ({ page }) => {
    await page.getByRole('button', { name: '2' }).click();
    await expect(page.getByText(/Showing 6–10 of/)).toBeVisible();
  });
});