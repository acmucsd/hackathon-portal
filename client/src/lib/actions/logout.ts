'use server';

import { revalidatePath } from 'next/cache';
import { deleteUserCookies } from '../services/CookieService';
import { redirect } from 'next/navigation';

export const logoutAction = async () => {
  await deleteUserCookies();
  revalidatePath('/', 'layout');
  redirect('/login');
};
