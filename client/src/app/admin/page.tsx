import { TIMELINE } from '@/config';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { UserAPI, AdminAPI } from '@/lib/api';
import { redirect } from 'next/navigation';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';
import styles from './page.module.scss';

export default async function Admin() {
  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);

  if (!accessToken) {
    console.log('Dashboard broke: access token undefined');
    redirect('/login');
  }

  try {
    const fetchedUser = await UserAPI.getCurrentUser(accessToken);
    const accessType = fetchedUser.accessType;
    const applications = accessType === 'ADMIN' ? await AdminAPI.getApplications(accessToken) : [];

    return (
      <main className={styles.main}>
        <AdminDashboard timeline={TIMELINE} user={fetchedUser} applications={applications} />
      </main>
    );
  } catch (error) {
    console.log('Dashboard broke: error in fetching');
    redirect('/login');
  }
}
