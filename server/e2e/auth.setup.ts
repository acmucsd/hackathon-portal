import { chromium, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import { Config } from '../config';

const baseUrl = Config.testing.uiBaseUrl;
const authPath = Config.testing.authPath;
const tokenPath = Config.testing.tokenPath;
const testEmail = Config.testing.testUserEmail;
const testPassword = Config.testing.testUserPassword;

export default async () => {
  const browser = await chromium.launch();

  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(`${baseUrl}/login`);

  await page.getByLabel(/email/i).fill(testEmail);
  await page.getByLabel(/password/i).fill(testPassword);

  await page.getByRole('button', { name: 'Login', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Application Status' })).toBeVisible();


  const cookies = await context.cookies();

  const accessToken = cookies.find(cookie => cookie.name === 'ACCESS_TOKEN');

  if (!accessToken) {
    throw new Error('ACCESS_TOKEN cookie not found');
  }


  fs.mkdirSync(path.dirname(authPath), { recursive: true });

  fs.writeFileSync(
    tokenPath,
    JSON.stringify({
      token: accessToken.value,
    }),
  );
  await context.storageState({
    path: authPath,
  });
  await browser.close();
};


// // todo: Setup auth for other types of test users (admin and super-admin)
