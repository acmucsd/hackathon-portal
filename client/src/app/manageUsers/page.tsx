import Typography from '@/components/Typography';
import UserTable from '@/components/admin/UserTable';
import UserList from '@/components/admin/UserList';
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
        <Typography variant='headline/heavy/small'>Manage Users</Typography>
        <div className={styles.isMobile}>
          <UserList users={users} />
        </div>
        <div className={styles.isDesktop}>
          <UserTable users={users} />
        </div>
      </main>
    );
  } catch (error) {
    console.log('Dashboard broke: error in fetching');
    redirect('/login');
  }
}
