import { EventAPI } from '@/lib/api';
import { redirect } from 'next/navigation';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';
import styles from './page.module.scss';
import EventDashboard from '@/components/admin/EventDashboard';
import { logout } from '@/lib/actions/logout';

export default async function ManageEvents() {
  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);

  if (!accessToken) {
    logout();
  }

  try {
    const events = await EventAPI.getEvents(accessToken);

    return (
      <main className={styles.main}>
        <EventDashboard events={events} />
      </main>
    );
  } catch (error) {
    logout();
  }
}
