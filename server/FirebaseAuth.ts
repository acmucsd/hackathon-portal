import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  initializeApp as initializeAdminApp,
} from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { Config } from './config';
import { credential } from 'firebase-admin';

const app = initializeApp(Config.firebase);
export const auth = getAuth(app);

const adminApp = initializeAdminApp({
  credential: credential.cert(Config.firebaseAdmin),
});
export const adminAuth = getAdminAuth(adminApp);
