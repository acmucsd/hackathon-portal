import { request } from '@playwright/test';
import fs from "fs";
import 'dotenv/config';
import { Config } from '../config';

const baseUrl = Config.testing.apiBaseUrl;
const authPath = Config.testing.authPath;
const testEmail = Config.testing.testUserEmail;
const testPassword = Config.testing.testUserPassword;

// Logs in normal user
export default async () => {
  const api = await request.newContext();

  const response = await api.post(`${baseUrl}/user/login`, {
    data: {
      email: testEmail,
      password: testPassword,
    },
  });

  const { token } = await response.json();
  fs.writeFileSync(authPath, JSON.stringify({token: token}));

};

// todo: Setup auth for other types of test users (admin and super-admin)