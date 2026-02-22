import { TIMELINE } from '@/config';
import AdminDashboard from '@/components/admin/AdminDashboard';
import SuperAdminDashboard from '@/components/admin/SuperAdminDashboard';
import { UserAPI, AdminAPI } from '@/lib/api';
import { redirect } from 'next/navigation';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';
import styles from './style.module.scss';

export default async function superAdmin() {
  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);

  if (!accessToken) {
    redirect('/api/logout');
  }

  try {
    const fetchedUser = await UserAPI.getCurrentUser(accessToken);
    const accessType = fetchedUser.accessType;
    const applications =
      accessType === 'SUPER_ADMIN'
        ? await AdminAPI.getUsers(accessToken)
        : [];

    return (
      <main className={styles.main}>
        <SuperAdminDashboard timeline={TIMELINE} user={fetchedUser} applications={applications} />
      </main>
    );
  } catch (error) {
    redirect('/api/logout');
  }
}
