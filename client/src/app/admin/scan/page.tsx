import { redirect } from 'next/navigation';
import styles from './page.module.scss';
import CheckIn from '@/components/admin/CheckIn';
import { AdminAPI, EventAPI, UserAPI } from '@/lib/api';
import { onlyAllowAdmins } from '@/lib/services/PermissionsService';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';

export default async function EventScan() {
  const accessToken = (await getCookie(CookieType.ACCESS_TOKEN))!;

  let fetchedUser;
  try {
    fetchedUser = await UserAPI.getCurrentUser(accessToken);
  } catch (error) {
    console.error(error);
    redirect('/api/logout');
  }
  onlyAllowAdmins(fetchedUser);

  try {
    const events = await EventAPI.getEvents(accessToken);
    const users = await AdminAPI.getUsers(accessToken);

    return (
      <div className={styles.main}>
        <CheckIn token={accessToken} events={events} users={users} />
      </div>
    );
  } catch (error) {
    console.error(error);
    redirect('/');
  }
}
