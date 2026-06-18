'use server';

import { deleteUserCookies } from '@/lib/services/CookieService';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function logout() {
  await deleteUserCookies();
  revalidatePath('/', 'layout');
  redirect('/login');
}
