import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  initializeApp as initializeAdminApp,
  applicationDefault,
} from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { Config } from './config';

const app = initializeApp(Config.firebase);
export const auth = getAuth(app);

const adminApp = initializeAdminApp({
  credential: applicationDefault(),
});
export const adminAuth = getAdminAuth(adminApp);
