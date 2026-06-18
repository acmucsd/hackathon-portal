import { EventAPI, UserAPI } from '@/lib/api';
import styles from './page.module.scss';
import EventDashboard from '@/components/admin/EventDashboard';
import { headers } from 'next/headers';
import config from '@/lib/config';
import { onlyAllowAdmins } from '@/lib/services/PermissionsService';
import { redirect } from 'next/navigation';

export default async function ManageEvents() {
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
    const events = await EventAPI.getEvents(accessToken);

    return (
      <main className={styles.main}>
        <EventDashboard events={events} />
      </main>
    );
  } catch (error) {
    console.error(error);
    redirect('/');
  }
}
