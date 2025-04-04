import { UserAPI } from '@/lib/api';
import { redirect } from 'next/navigation';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';
import EventForm from '@/components/admin/EventForm';
import styles from './page.module.scss';

export default async function CreateEvent() {
  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);

  if (!accessToken) {
    redirect('/api/logout');
  }

  let fetchedUser;
  try {
    fetchedUser = await UserAPI.getCurrentUser(accessToken);
  } catch (error) {
    redirect('/api/logout');
  }

  // Only allow admins to access page
  if (fetchedUser.accessType !== 'ADMIN') {
    redirect('/');
  }

  return (
    <main className={styles.main}>
      <EventForm accessToken={accessToken} />
    </main>
  );
}
