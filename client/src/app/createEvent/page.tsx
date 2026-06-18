import { UserAPI } from '@/lib/api';
import { redirect } from 'next/navigation';
import EventForm from '@/components/admin/EventForm';
import styles from './page.module.scss';
import { headers } from 'next/headers';
import config from '@/lib/config';
import { onlyAllowAdmins } from '@/lib/services/PermissionsService';

export default async function CreateEvent() {
  const headersList = await headers();
  const accessToken = headersList.get(config.header.accessToken)!;

  let fetchedUser;
  try {
    fetchedUser = await UserAPI.getCurrentUser(accessToken);
  } catch (error) {
    console.error(error);
    redirect('/api/logout');
  }
  onlyAllowAdmins(fetchedUser);

  return (
    <main className={styles.main}>
      <EventForm accessToken={accessToken} />
    </main>
  );
}
