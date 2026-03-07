import VerifyEmailDashboard from '@/components/admin/VerifyEmailDashboard';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';
import { redirect } from 'next/navigation';
import { UserAPI } from '@/lib/api';
import styles from './page.module.scss';

export default async function VerifyEmail() {
  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);

  if (!accessToken) {
    redirect('/api/logout');
  }

  try {
    const fetchedUser = await UserAPI.getCurrentUser(accessToken);

    if (fetchedUser.accessType !== 'ADMIN' && fetchedUser.accessType !== 'SUPER_ADMIN') {
      redirect('/');
    }

    return (
      <div className={styles.main}>
        <VerifyEmailDashboard accessToken={accessToken} />
      </div>
    );
  } catch (error) {
    redirect('/api/logout');
  }
}
