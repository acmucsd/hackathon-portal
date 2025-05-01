import { deleteUserCookies } from '@/lib/services/CookieService';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  await deleteUserCookies();
  redirect('/closed');
}
