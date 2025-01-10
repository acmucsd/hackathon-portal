import { cookies, headers } from 'next/headers';

export const getCookie = (key: string): string => {
  const cookie = cookies();
  return cookie.get(key)?.value as string;
};

export const setCookie = (key: string, value: string) => {
  const cookie = cookies();
  cookie.set(key, value);
};
