import Typography from '@/components/Typography';
import UsersDashboard from '@/components/admin/UsersDashboard';
import { AdminAPI } from '@/lib/api';
import { redirect } from 'next/navigation';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';
import styles from './page.module.scss';

export default async function ManageEvents() {
  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);

  if (!accessToken) {
    redirect('/login');
  }

  try {
    const users = await AdminAPI.getUsers(accessToken);

    return (
      <main className={styles.main}>
      </main>
    );
  } catch (error) {
    redirect('/api/logout');
  }
}
