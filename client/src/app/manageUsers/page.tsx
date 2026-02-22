import Typography from '@/components/Typography';
import UsersDashboard from '@/components/admin/UsersDashboard';
import { AdminAPI, UserAPI } from '@/lib/api';

import { redirect } from 'next/navigation';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';
import styles from './page.module.scss';

export default async function ManageUsers() {
  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);

  if (!accessToken) {
    redirect('/login');
  }

  try {
    const users = await AdminAPI.getUsers(accessToken);
    const fetchedUser = await UserAPI.getCurrentUser(accessToken);
    const accessType = fetchedUser.accessType;

    return (
      <main className={styles.main}>
        <Typography variant="headline/heavy/small">Manage Users</Typography>
        <UsersDashboard users={users} superAdmin={accessType === 'SUPER_ADMIN'} />
      </main>
    );
  } catch (error) {
    redirect('/api/logout');
  }
}
