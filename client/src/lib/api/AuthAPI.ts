import config from '@/lib/config';
import type { ForgotPasswordRequest, UserRegistration } from '@/lib/types/apiRequests';
import type {
  PrivateProfile,
  CreateUserResponse,
  ForgotPasswordResponse,
  VerifyTokenResponse,
} from '@/lib/types/apiResponses';
import { auth } from '@/lib/clients/firebase';
import axios from '@/lib/clients/axios';
import {
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { deleteUserCookies, setCookie } from '../services/CookieService';
import { CookieType } from '../types/enums';
import { logoutAction } from '../actions/logout';

export const verifyToken = async (token: string): Promise<PrivateProfile | null> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.auth.verifyToken}`;

  try {
    const response = await axios.post<VerifyTokenResponse>(requestUrl, { token });
    return response.data.user;
  } catch {
    return null;
  }
};

/***
 *
 * The following methods can only be called from client rendered components (anything with 'use client').
 * Firebase methods cannot be called from a server (any page.tsx)
 *
 * For server invoked logouts, redirect to /api/logout
 *
 */

export const register = async (user: UserRegistration): Promise<PrivateProfile> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.auth.register}`;

  const response = await axios.post<CreateUserResponse>(requestUrl, { user: user });
  const userCredential = await signInWithEmailAndPassword(auth, user.email, user.password);

  await sendEmailVerification(userCredential.user);
  await signOut(auth);

  return response.data.user;
};

export const login = async (email: string, password: string): Promise<PrivateProfile> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();

    if (!token || typeof token !== 'string') {
      throw new Error('Missing token.');
    }

    const verifyResponse = await verifyToken(token);
    if (!verifyResponse) {
      await deleteUserCookies();
      throw new Error('Invalid authentication token.');
    }

    const user = verifyResponse as PrivateProfile;

    await setCookie(CookieType.ACCESS_TOKEN, token);
    await setCookie(CookieType.USER, JSON.stringify(user));

    return user;
  } catch (e) {
    if (e instanceof FirebaseError) {
      if (
        e.code === 'auth/invalid-credential' ||
        e.code === 'auth/wrong-password' ||
        e.code === 'auth/user-not-found'
      ) {
        throw new Error('Incorrect email or password.');
      }
    }
    throw e;
  } finally {
    await signOut(auth).catch(() => undefined);
  }
};

export const loginWithGoogle = async (): Promise<PrivateProfile> => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const token = await userCredential.user.getIdToken();

    if (!token || typeof token !== 'string') {
      throw new Error('Missing token.');
    }

    const verifyResponse = await verifyToken(token);
    if (!verifyResponse) {
      await deleteUserCookies();
      throw new Error('Invalid authentication token.');
    }

    const user = verifyResponse as PrivateProfile;

    await setCookie(CookieType.ACCESS_TOKEN, token);
    await setCookie(CookieType.USER, JSON.stringify(user));

    return user;
  } catch (e) {
    if (e instanceof FirebaseError) {
      if (e.message.includes('auth/admin-restricted-operation')) {
        throw new Error('No account associated with that email.');
      } else {
        throw new Error('Try a different login method.');
      }
    }
    throw e;
  } finally {
    await signOut(auth).catch(() => undefined);
  }
};

export async function logout() {
  await signOut(auth).catch(() => undefined); // client call, manual log out
  logoutAction();
}

export const forgotPassword = async (
  forgotReq: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
  await sendPasswordResetEmail(auth, forgotReq.email);
  return { error: null };
};
