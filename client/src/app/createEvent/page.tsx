import { UserAPI } from '@/lib/api';
import { redirect } from 'next/navigation';
import EventForm from '@/components/admin/EventForm';
import styles from './page.module.scss';
import { onlyAllowAdmins } from '@/lib/services/PermissionsService';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';

export default async function CreateEvent() {
  const accessToken = (await getCookie(CookieType.ACCESS_TOKEN))!;

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
