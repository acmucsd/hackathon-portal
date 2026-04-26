'use server'

import { deleteUserCookies } from '@/lib/services/CookieService';
import { redirect } from 'next/navigation';

export async function logout() {
  await deleteUserCookies();
  redirect('/login');
}
