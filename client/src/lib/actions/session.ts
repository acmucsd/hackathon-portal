'use server';

import config from '@/lib/config';
import { deleteUserCookies, getCookie, setCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';
import type { PrivateProfile, VerifyTokenResponse } from '@/lib/types/apiResponses';

export async function getSession(): Promise<{
  authenticated: boolean;
  user?: PrivateProfile;
}> {
  const token = getCookie(CookieType.ACCESS_TOKEN);

  if (!token) {
    return { authenticated: false };
  }

  const verifyTokenUrl = `${config.api.baseUrl}${config.api.endpoints.auth.verifyToken}`;
  const verifyResponse = await fetch(verifyTokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
    cache: 'no-store',
  });

  if (!verifyResponse.ok) {
    await deleteUserCookies();
    return { authenticated: false };
  }

  const verifyBody = (await verifyResponse.json()) as VerifyTokenResponse;
  return { authenticated: true, user: verifyBody.user };
}

export async function setSession(token: string): Promise<{
  error: string | null;
  user?: PrivateProfile;
}> {
  if (!token || typeof token !== 'string') {
    return { error: 'Missing token.' };
  }

  const verifyTokenUrl = `${config.api.baseUrl}${config.api.endpoints.auth.verifyToken}`;
  const verifyResponse = await fetch(verifyTokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
    cache: 'no-store',
  });

  if (!verifyResponse.ok) {
    await deleteUserCookies();
    return { error: 'Invalid authentication token.' };
  }

  const verifyBody = (await verifyResponse.json()) as VerifyTokenResponse;
  const user = verifyBody.user as PrivateProfile;

  setCookie(CookieType.ACCESS_TOKEN, token);
  setCookie(CookieType.USER, JSON.stringify(user));

  return { error: null, user };
}