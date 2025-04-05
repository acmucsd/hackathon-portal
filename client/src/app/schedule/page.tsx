import { EventAPI } from '@/lib/api';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';
import Schedule from '@/components/Schedule';
import { redirect } from 'next/navigation';
import styles from './page.module.scss';

export default async function SchedulePage() {
  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);

  try {
    const fetchedEvents = await EventAPI.getPublishedEvents(accessToken);
    return (
      <main className={styles.main}>
        <Schedule events={fetchedEvents} />
      </main>
    );
  } catch (error) {
    redirect('/api/logout');
  }
}
