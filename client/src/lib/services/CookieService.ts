'use server';

import { cookies } from 'next/headers';
import { CookieType } from '../types/enums';

const isProduction = process.env.NODE_ENV === 'production';
const SESSION_MAX_AGE_SECONDS = 20;

const authCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_MAX_AGE_SECONDS,
};

export const getCookie = async (key: string): Promise<string | null> => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(key)?.value;
  if (!cookie) return null;
  return cookie;
};

// can only be called from components with 'use client'
export const setCookie = async (key: string, value: string): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set(key, value, authCookieOptions);
};

// can only be called from components with 'use client'
export const deleteUserCookies = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete(CookieType.ACCESS_TOKEN);
  cookieStore.delete(CookieType.USER);
};
