'use server';

import { deleteUserCookies, getCookie, setCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';
import type { PrivateProfile } from '@/lib/types/apiResponses';
import { verifyToken } from '../api/AuthAPI';
import { signOut } from 'firebase/auth';
import { auth } from '../clients/firebase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// for logins and client-invoked logouts (redirect to /api/logout if from the server)

export async function getSession(): Promise<{
  authenticated: boolean;
  user?: PrivateProfile;
}> {
  const token = await getCookie(CookieType.ACCESS_TOKEN);
  if (!token) {
    return { authenticated: false };
  }

  const verifyResponse = await verifyToken(token);
  if (!verifyResponse) {
    await deleteUserCookies();
    return { authenticated: false };
  }

  return { authenticated: true, user: verifyResponse };
}

export async function setSession(token: string): Promise<{
  error: string | null;
  user?: PrivateProfile;
}> {
  if (!token || typeof token !== 'string') {
    return { error: 'Missing token.' };
  }

  const verifyResponse = await verifyToken(token);
  if (!verifyResponse) {
    await deleteUserCookies();
    return { error: 'Invalid authentication token.' };
  }

  const user = verifyResponse as PrivateProfile;

  await setCookie(CookieType.ACCESS_TOKEN, token);
  await setCookie(CookieType.USER, JSON.stringify(user));

  return { error: null, user };
}

export async function logout() {
  await signOut(auth).catch(() => undefined);
  await deleteUserCookies();
  revalidatePath('/', 'layout');
  redirect('/login');
}
