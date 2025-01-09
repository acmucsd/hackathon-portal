import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';

export const getCookie = (key: string): string => {
  const cookie = cookies();
  return cookie.get(key)?.value as string;
};

export const serializeCookie = (key: string, value: string): string => {
  const cookieOptions = {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  return `${key}=${value}; ${Object.entries(cookieOptions)
    .map(([optionKey, optionValue]) =>
      optionValue === true ? optionKey : `${optionKey}=${optionValue}`
    )
    .join('; ')}`;
};
