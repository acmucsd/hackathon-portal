import { TIMELINE } from '@/config';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { UserAPI, AdminAPI } from '@/lib/api';
import styles from './page.module.scss';
import { headers } from 'next/headers';
import config from '@/lib/config';
import { onlyAllowAdmins } from '@/lib/services/PermissionsService';
import { redirect } from 'next/navigation';

export default async function Admin() {
  const headersList = await headers();
  const accessToken = headersList.get(config.header.accessToken)!;

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
