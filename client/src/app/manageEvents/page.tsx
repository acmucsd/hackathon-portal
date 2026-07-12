import { EventAPI, UserAPI } from '@/lib/api';
import styles from './page.module.scss';
import EventDashboard from '@/components/admin/EventDashboard';
import { onlyAllowAdmins } from '@/lib/services/PermissionsService';
import { redirect } from 'next/navigation';
import { CookieType } from '@/lib/types/enums';
import { getCookie } from '@/lib/services/CookieService';

export default async function ManageEvents() {
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
