import {test, expect} from "@playwright/test"
import fs from "fs"
import 'dotenv/config';
import { Config } from "../config";

const baseUrl = Config.testing.apiBaseUrl;
const authPath = Config.testing.authPath;
const testEmail = Config.testing.testUserEmail;

const { token } = JSON.parse(fs.readFileSync(authPath, 'utf8'));

// Tests user login
test('user is able to log in', async ({request})=>{
  const response = await request.get(`${baseUrl}/user/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  expect(response.status()).toBe(200);


  const data = await response.json();

  expect(data).toBeTruthy();
  expect(data.error).toBeFalsy();
  expect(data.user).toBeTruthy();

});

// We can add more tests that user should or should not be able to do