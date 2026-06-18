import VerifyEmailDashboard from '@/components/admin/VerifyEmailDashboard';
import { UserAPI } from '@/lib/api';
import styles from './page.module.scss';
import { headers } from 'next/headers';
import config from '@/lib/config';
import { onlyAllowAdmins } from '@/lib/services/PermissionsService';
import { redirect } from 'next/navigation';

export default async function VerifyEmail() {
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
      <VerifyEmailDashboard accessToken={accessToken} />
    </div>
  );
}
