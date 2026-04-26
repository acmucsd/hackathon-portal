import { TIMELINE } from '@/config';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { logout } from '@/lib/actions/logout';
import { UserAPI, AdminAPI } from '@/lib/api';
import { redirect } from 'next/navigation';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';
import styles from './page.module.scss';

export default async function Admin() {
  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);

  if (!accessToken) {
    logout();
  }
  const fetchedUser = await UserAPI.getCurrentUser(accessToken);
  if (fetchedUser.accessType !== 'ADMIN' && fetchedUser.accessType !== 'SUPER_ADMIN') {
    redirect('/');
  }

  try {
    const applications = await AdminAPI.getUsers(accessToken);

    return (
      <main className={styles.main}>
        <AdminDashboard timeline={TIMELINE} user={fetchedUser} applications={applications} />
      </main>
    );
  } catch (error) {
    logout();
  }
}
