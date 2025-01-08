import { cookies, headers } from 'next/headers';

export const getCookie = async (key: string): Promise<string> => {
  const cookie = await cookies();
  return cookie.get(key)?.value as string;
};

export const setCookie = async (key: string, value: string): Promise<void> => {
  const cookie = await cookies();
  cookie.set(key, value);
};
