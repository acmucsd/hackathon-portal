import { cookies, headers } from 'next/headers';
import { CookieType } from '../types/enums';

export const getCookie = async (key: string): Promise<string> => {
  const cookie = await cookies();
  return cookie.get(key)?.value as string;
};

export const setCookie = async (key: string, value: string): Promise<void> => {
  const cookie = await cookies();
  cookie.set(key, value);
};

export const deleteUserCookies = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete(CookieType.ACCESS_TOKEN);
  cookieStore.delete(CookieType.USER);
};
