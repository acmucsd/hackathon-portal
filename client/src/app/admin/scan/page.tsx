import { redirect } from 'next/navigation';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';
import styles from './page.module.scss';
import CheckIn from '@/components/admin/CheckIn';
import { AdminAPI, EventAPI } from '@/lib/api';

export default async function EventScan() {
  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);

  if (!accessToken) {
    redirect('/login');
  }

  let events, users;
  try {
    events = await EventAPI.getEvents(accessToken);
    users = await AdminAPI.getUsers(accessToken);
  } catch (error) {
    console.error('Failed to fetch events and users:', error);
    redirect('/login');
  }

  return (
    <div className={styles.main}>
      <CheckIn token={accessToken} events={events} users={users} />
    </div>
  );
}
