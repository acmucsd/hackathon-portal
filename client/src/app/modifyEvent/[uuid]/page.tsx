import { EventAPI, UserAPI } from '@/lib/api';
import EventForm from '@/components/admin/EventForm';
import { redirect } from 'next/navigation';
import styles from './page.module.scss';
import { onlyAllowAdmins } from '@/lib/services/PermissionsService';
import { CookieType } from '@/lib/types/enums';
import { getCookie } from '@/lib/services/CookieService';

interface ModifyEventProps {
  params: Promise<{ uuid: string }>;
}

export default async function ModifyEvent({ params }: ModifyEventProps) {
  const event = (await params).uuid;

  const accessToken = (await getCookie(CookieType.ACCESS_TOKEN))!;

  let user;
  try {
    user = await UserAPI.getCurrentUser(accessToken);
  } catch (error) {
    console.error(error);
    redirect('/api/logout');
  }
  onlyAllowAdmins(user);

  try {
    const fetchedEvent = await EventAPI.getEvent(accessToken, event);

    return (
      <main className={styles.main}>
        <EventForm accessToken={accessToken} event={fetchedEvent} />
      </main>
    );
  } catch (error) {
    console.error(error);
    redirect('/');
  }
}
