import { TIMELINE } from '@/config';
import SuperAdminDashboard from '@/components/admin/SuperAdminDashboard';
import { UserAPI, AdminAPI } from '@/lib/api';
import { redirect } from 'next/navigation';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';
import styles from './style.module.scss';
import { logout } from '@/lib/actions/logout';

export default async function superAdmin() {
  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);

  if (!accessToken) {
    logout();
  }

  const fetchedUser = await UserAPI.getCurrentUser(accessToken);
  if (fetchedUser.accessType !== 'SUPER_ADMIN') {
    if (fetchedUser.accessType === 'ADMIN') {
      redirect('/admin');
    } else {
      redirect('/');
    }
  }
  try {
    const assignments = await AdminAPI.getAllAssignments(accessToken);
    const applications = assignments.map(a => ({ ...a.applicant, reviewer: a.reviewer }));

    return (
      <main className={styles.main}>
        <SuperAdminDashboard
          timeline={TIMELINE}
          user={fetchedUser}
          applications={applications}
          assignments={assignments}
          token={accessToken}
        />
      </main>
    );
  } catch (error) {
    logout();
  }
}
