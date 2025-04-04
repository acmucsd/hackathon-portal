import { EventAPI } from '@/lib/api';
import EventForm from '@/components/admin/EventForm';
import { redirect } from 'next/navigation';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';
import styles from './page.module.scss';

interface ModifyEventProps {
  params: Promise<{ uuid: string }>;
}

export default async function ModifyEvent({ params }: ModifyEventProps) {
  const event = (await params).uuid;
  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);

  if (!accessToken) {
    redirect('/api/logout');
  }

  try {
    const fetchedEvent = await EventAPI.getEvent(accessToken, event);

    return (
      <main className={styles.main}>
        <EventForm accessToken={accessToken} event={fetchedEvent} />
      </main>
    );
  } catch (error) {
    redirect('/api/logout');
  }
}
