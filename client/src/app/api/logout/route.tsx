import { auth } from '@/lib/clients/firebase';
import { deleteUserCookies } from '@/lib/services/CookieService';
import { signOut } from 'firebase/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// server invoked logout

export async function GET() {
  //await signOut(auth).catch(() => undefined);
  await deleteUserCookies();
  revalidatePath('/', 'layout');
  redirect('/login');
}
