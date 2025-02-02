'use server';

import { login as apiLogin } from '@/lib/api/UserAPI';
import { setCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';
import { getErrorMessage } from '@/lib/utils';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCookie } from 'cookies-next';

export async function login(email: string, password: string): Promise<string> {
  let response;
  try {
    response = await apiLogin(email, password);
  } catch (error) {
    const cookieStore = await cookies();
    cookieStore.delete(CookieType.ACCESS_TOKEN);
    cookieStore.delete(CookieType.USER);
    return getErrorMessage(error);
  }
  await setCookie(CookieType.ACCESS_TOKEN, response.token);
  await setCookie(CookieType.USER, JSON.stringify(response.user));

  redirect('/');
}
