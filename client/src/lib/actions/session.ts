'use server';

import config from '@/lib/config';
import { deleteUserCookies, getCookie, setCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';
import type { PrivateProfile, VerifyTokenResponse } from '@/lib/types/apiResponses';
import { redirect } from 'next/navigation';
import { verifyToken } from '../api/AuthAPI';

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
