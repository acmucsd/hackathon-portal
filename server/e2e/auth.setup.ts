import { request } from '@playwright/test';
import fs from 'fs';
import 'dotenv/config';
import { Config } from '../config';
import { seedTestUser } from '../seed';
import { UserAccessType } from '../types/Enums';

const baseUrl = Config.testing.apiBaseUrl;
const authPath = Config.testing.authPath;
const testEmail = Config.testing.testUserEmail;
const testPassword = Config.testing.testUserPassword;



export default async () => {

// Logs in normal user
  const api = await request.newContext();

  const response = await api.post(`${baseUrl}/user/login`, {
    data: {
      email: testEmail,
      password: testPassword,
    },
  });

  const { token } = await response.json();
  fs.writeFileSync(authPath, JSON.stringify({ token: token }));

};

// todo: Setup auth for other types of test users (admin and super-admin)