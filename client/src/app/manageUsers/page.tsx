import Typography from '@/components/Typography';
import UsersDashboard from '@/components/admin/UsersDashboard';
import { AdminAPI, UserAPI } from '@/lib/api';
import styles from './page.module.scss';
import { RevieweeProfile } from '@/lib/types/apiResponses';
import { headers } from 'next/headers';
import config from '@/lib/config';
import { onlyAllowAdmins } from '@/lib/services/PermissionsService';
import { redirect } from 'next/navigation';

export default async function ManageUsers() {
  const headersList = await headers();
  const accessToken = headersList.get(config.header.accessToken)!;

  let user;
  try {
    user = await UserAPI.getCurrentUser(accessToken);
  } catch (error) {
    console.error(error);
    redirect('/api/logout');
  }
  onlyAllowAdmins(user);

  try {
    const accessType = user.accessType;
    const isSuperAdmin = accessType === 'SUPER_ADMIN';

    const users: RevieweeProfile[] = isSuperAdmin
      ? (await AdminAPI.getAllAssignments(accessToken)).map(a => ({
          ...a.applicant,
          reviewer: a.reviewer,
        }))
      : [];

    const reviewAssignments = await AdminAPI.getAssignmentsByReviewer(accessToken, user.id);
    const assignedUsers: RevieweeProfile[] = reviewAssignments.map(a => ({
      ...a.applicant,
      reviewer: a.reviewer,
    }));

    return (
      <main className={styles.main}>
        <Typography variant="headline/heavy/small">Manage Users</Typography>
        <UsersDashboard users={users} assignedUsers={assignedUsers} superAdmin={isSuperAdmin} />
      </main>
    );
  } catch (error) {
    console.error(error);
    redirect('/');
  }
}
