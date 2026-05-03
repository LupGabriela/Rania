import { test, expect } from '@playwright/test';

test.describe('Feature 1 — Login & Register Flow', () => {

  test('homepage loads with RANIA branding and Sign In button', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: /RANIA/i }).first()).toBeVisible();
    await expect(page.getByText(/Dressed to be you/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Sign In/i }).first()).toBeVisible();
  });

  test('clicking Sign In navigates to /login', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: /Sign In/i }).first().click();

    await expect(page).toHaveURL('/login');
    await expect(page.getByText(/Welcome back/i)).toBeVisible();
  });

  test('login form submits and redirects to homepage', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.getByPlaceholder('your@email.com').fill('test@rania.ro');
    await page.getByPlaceholder('••••••••').fill('password123');
    await page.getByRole('button', { name: /Login/i }).click();

    await expect(page).toHaveURL('/');
  });

  test('login page has link to register page', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.getByRole('link', { name: /Register/i }).click();

    await expect(page).toHaveURL('/register');
    await expect(page.getByText(/Create your account/i)).toBeVisible();
  });

  test('register page has link back to login', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    await page.getByRole('link', { name: /Login/i }).click();

    await expect(page).toHaveURL('/login');
  });

  test('register form requires all fields', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: /Create Account/i }).click();

    // Should stay on /register — HTML5 validation blocks submission
    await expect(page).toHaveURL('/register');
  });

  test('password visibility toggle works on login page', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    const passwordInput = page.getByPlaceholder('••••••••');
    await expect(passwordInput).toHaveAttribute('type', 'password');

    await page.locator("button[type='button']").first().click();

    await expect(passwordInput).toHaveAttribute('type', 'text');
  });
});