import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Courses Platform/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Capacitación empresarial');
  });

  test('should show dev banner in development mode', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Modo desarrollo')).toBeVisible();
  });
});

test.describe('Login', () => {
  test('should load login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { level: 2 })).toContainText('Inicia sesión');
  });
});
