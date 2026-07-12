import {
  initializeApp as initializeAdminApp,
} from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { Config } from './config';
import { credential } from 'firebase-admin';

const adminApp = initializeAdminApp({
  credential: credential.cert(Config.firebaseAdmin),
});
export const adminAuth = getAdminAuth(adminApp);