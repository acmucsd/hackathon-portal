'use server';

import { cookies } from 'next/headers';
import { CookieType } from '../types/enums';

const isProduction = process.env.NODE_ENV === 'production';
const SESSION_MAX_AGE_SECONDS = 30;

const authCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_MAX_AGE_SECONDS,
};

export const getCookie = async (key: string): Promise<string | null> => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(key)?.value as string;
  if (cookie == '' || !cookie) return null;
  return cookie;
};

export const setCookie = async (key: string, value: string): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set(key, value, authCookieOptions);
};

export const deleteUserCookies = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set(CookieType.ACCESS_TOKEN, '', { ...authCookieOptions, maxAge: 0 });
  cookieStore.set(CookieType.USER, '', { ...authCookieOptions, maxAge: 0 });
};
