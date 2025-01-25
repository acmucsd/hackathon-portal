'use server';

import { CookieType } from '@/lib/types/enums';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(CookieType.ACCESS_TOKEN);
  cookieStore.delete(CookieType.USER);
  redirect('/login');
}
