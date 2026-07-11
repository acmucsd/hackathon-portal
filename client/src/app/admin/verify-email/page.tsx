import VerifyEmailDashboard from '@/components/admin/VerifyEmailDashboard';
import { UserAPI } from '@/lib/api';
import styles from './page.module.scss';
import { onlyAllowAdmins } from '@/lib/services/PermissionsService';
import { redirect } from 'next/navigation';
import { CookieType } from '@/lib/types/enums';
import { getCookie } from '@/lib/services/CookieService';

export default async function VerifyEmail() {
  const accessToken = (await getCookie(CookieType.ACCESS_TOKEN))!;

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
