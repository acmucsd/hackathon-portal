import ResetPasswordDashboard from '@/components/admin/ResetPasswordDashboard';
import { redirect } from 'next/navigation';
import { UserAPI } from '@/lib/api';
import styles from './page.module.scss';
import { headers } from 'next/headers';
import config from '@/lib/config';
import { onlyAllowAdmins } from '@/lib/services/PermissionsService';

export default async function ResetPassword() {
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

  return (
    <div className={styles.main}>
      <ResetPasswordDashboard accessToken={accessToken} />
    </div>
  );
}
