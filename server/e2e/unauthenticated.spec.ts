import { test, expect } from '@playwright/test';
import { Config } from '../config';

const baseUrl = Config.testing.apiBaseUrl;

// Test to ensure that unauthenticated users cannot view any information

test('unauthenticated user is not able to log in', async ({ request })=>{
  const response = await request.get(`${baseUrl}/user/`);
  expect(response.status()).not.toBe(200);
  expect(response.status()).toBe(401);

  const data = await response.json();
  expect(data).toBeTruthy();
  expect(data.error).toBeTruthy();

});


// We can add more tests as needed