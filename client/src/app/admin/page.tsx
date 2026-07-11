import { TIMELINE } from '@/config';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { UserAPI, AdminAPI } from '@/lib/api';
import styles from './page.module.scss';
import { onlyAllowAdmins } from '@/lib/services/PermissionsService';
import { redirect } from 'next/navigation';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';

export default async function Admin() {
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
    const applications = await AdminAPI.getUsers(accessToken);

    return (
      <main className={styles.main}>
        <AdminDashboard timeline={TIMELINE} user={fetchedUser} applications={applications} />
      </main>
    );
  } catch (error) {
    console.error(error);
    redirect('/');
  }
}
