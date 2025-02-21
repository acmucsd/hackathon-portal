import Typography from '@/components/Typography';
import UsersDashboard from '@/components/admin/UsersDashboard';
import { UserAPI, AdminAPI } from '@/lib/api';
import { redirect } from 'next/navigation';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';
import styles from './page.module.scss';

export default async function ManageUsers() {
  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);

  if (!accessToken) {
    console.log('Dashboard broke: access token undefined');
    redirect('/login');
  }

  try {
    const fetchedUser = await UserAPI.getCurrentUser(accessToken);
    const accessType = fetchedUser.accessType;
    const users = accessType === 'ADMIN' ? await AdminAPI.getUsers(accessToken) : [];

    return (
      <main className={styles.main}>
        <Typography variant="headline/heavy/small">Manage Users</Typography>
        <UsersDashboard users={users} />
      </main>
    );
  } catch (error) {
    console.log('Dashboard broke: error in fetching');
    redirect('/login');
  }
}
