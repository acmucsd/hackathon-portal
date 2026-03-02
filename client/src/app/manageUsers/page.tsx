import Typography from '@/components/Typography';
import UsersDashboard from '@/components/admin/UsersDashboard';
import { AdminAPI, UserAPI } from '@/lib/api';

import { redirect } from 'next/navigation';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';
import styles from './page.module.scss';
import { FullProfile, ReviewAssignment, RevieweeProfile } from '@/lib/types/apiResponses';

export default async function ManageUsers() {
  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);
  const userCookie = await getCookie(CookieType.USER);

  if (!accessToken || !userCookie) {
    redirect('/login');
  }

  try {
    const users = await AdminAPI.getUsers(accessToken);
    const fetchedUser = await UserAPI.getCurrentUser(accessToken);
    const accessType = fetchedUser.accessType;
    const user = JSON.parse(userCookie);

    const reviewAssignments = await AdminAPI.getAssignmentsByReviewer(accessToken, user.id);

    const assignedUsers: RevieweeProfile[] = reviewAssignments.map(
      assignment => assignment.applicant
    );

    return (
      <main className={styles.main}>
        <Typography variant="headline/heavy/small">Manage Users</Typography>
        <UsersDashboard users={users} assignedUsers={assignedUsers} superAdmin={accessType === 'SUPER_ADMIN'} />
      </main>
    );
  } catch (error) {
    redirect('/api/logout');
  }
}
