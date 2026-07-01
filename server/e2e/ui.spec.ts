import { test, expect } from '@playwright/test';
import { Config } from '../config';

const baseUrl = Config.testing.uiBaseUrl;

test('has title', async ({ page }) => {
  await page.goto(`${baseUrl}/`);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/DiamondHacks/);
});

test('get started link', async ({ page }) => {
  await page.goto(`${baseUrl}/`);

  const usernameField = page.getByLabel('Email Address');
  const passwordField = page.getByLabel('Password');
  const loginButton = page.getByRole('button', { name: 'Login' });
  const emptyEmailInputError = page.getByText('Enter your email');
  const emptyPasswordInputError = page.getByText('Enter your password');


  // Expect the fields to exist.
  await expect(usernameField).toBeVisible();
  await expect(passwordField).toBeVisible();

  // Test No errors
  await expect(emptyEmailInputError).not.toBeVisible();
  await expect(emptyPasswordInputError).not.toBeVisible();

  await loginButton.click();

  // Expects error for submitting without filling in.
  await expect(emptyEmailInputError).toBeVisible();
  await expect(emptyPasswordInputError).toBeVisible();
});


// We should add more tests for ui for a full end to end ui test, but we should
// do this after the new UI for hackathon portal.