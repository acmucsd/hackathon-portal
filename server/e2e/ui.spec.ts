import { test, expect } from '@playwright/test';
import { Config } from '../config';

const baseUrl = Config.testing.uiBaseUrl;


test('has title', async ({ page }) => {
  await page.goto(`${baseUrl}/`);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/DiamondHacks/);
});

test('has correct dashboard headings', async ({ page }) => {
  await page.goto(`${baseUrl}/`);


  const applicationStatusHeading = page.getByRole('heading', { name: 'Application Status' });
  const faqHeading = page.getByRole('heading', { name: 'Frequently Asked Questions' });

  // Expect the headings to be visible.
  await expect(applicationStatusHeading).toBeVisible();
  await expect(faqHeading).toBeVisible();

});


// We should add more tests for ui for a full end to end ui test, but we should
// do this after the new UI for hackathon portal.