import { EventAPI, UserAPI } from '@/lib/api';
import EventForm from '@/components/admin/EventForm';
import { redirect } from 'next/navigation';
import styles from './page.module.scss';
import { headers } from 'next/headers';
import config from '@/lib/config';
import { onlyAllowAdmins } from '@/lib/services/PermissionsService';

interface ModifyEventProps {
  params: Promise<{ uuid: string }>;
}

export default async function ModifyEvent({ params }: ModifyEventProps) {
  const event = (await params).uuid;

  const headersList = await headers();
  const accessToken = headersList.get(config.header.accessToken)!;

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
