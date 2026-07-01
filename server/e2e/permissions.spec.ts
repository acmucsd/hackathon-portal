import {test, expect} from "@playwright/test"
import fs from "fs"
import { Config } from "../config";

const baseUrl = Config.testing.apiBaseUrl;
const testEmail = Config.testing.testUserEmail;
const authPath = Config.testing.authPath;
const { token } = JSON.parse(fs.readFileSync(authPath, 'utf8'));

// Tests to ensure that normal user is not able to access admin and super admin stuff
test('normal user is not able to access email verification', async ({request})=>{
  const response = await request.get(`${baseUrl}/admin/email-verification-link?email=${testEmail}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  expect(response.status()).not.toBe(200)
  expect(response.status()).toBe(403)

  const data = await response.json();
  expect(data).toBeTruthy();
  expect(data.error).toBeTruthy();

});

test('normal user is not able to access password reset', async ({request})=>{
  const response = await request.get(`${baseUrl}/admin/password-reset-link?email=${testEmail}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  expect(response.status()).not.toBe(200)
  expect(response.status()).toBe(403)

  const data = await response.json();
  expect(data).toBeTruthy();
  expect(data.error).toBeTruthy();

});

test('normal user is not able to view all users', async ({request})=>{
  const response = await request.get(`${baseUrl}/admin/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  expect(response.status()).not.toBe(200)
  expect(response.status()).toBe(403)

  const data = await response.json();

  expect(data).toBeTruthy();
  expect(data.error).toBeTruthy();

});

// todo: Tests to ensure that admin is not able to access super admin stuff (will setup later after auth.setup)


