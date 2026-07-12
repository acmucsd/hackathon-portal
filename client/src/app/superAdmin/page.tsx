import { TIMELINE } from '@/config';
import SuperAdminDashboard from '@/components/admin/SuperAdminDashboard';
import { UserAPI, AdminAPI } from '@/lib/api';
import { redirect } from 'next/navigation';
import styles from './style.module.scss';
import { onlyAllowSuperAdmins } from '@/lib/services/PermissionsService';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';

export default async function superAdmin() {
  const accessToken = (await getCookie(CookieType.ACCESS_TOKEN))!;

  let fetchedUser;
  try {
    fetchedUser = await UserAPI.getCurrentUser(accessToken);
  } catch (error) {
    console.error(error);
    return redirect('/api/logout');
  }
  onlyAllowSuperAdmins(fetchedUser);

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
    console.error(error);
    redirect('/');
  }
}
