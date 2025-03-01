import Typography from '@/components/Typography';
import { AdminAPI } from '@/lib/api';
import { redirect } from 'next/navigation';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';
import styles from './page.module.scss';
import ReviewDashboard from '@/components/admin/ReviewDashboard';

export default async function Review() {
  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);

  if (!accessToken) {
    redirect('/login');
  }

  let users;
  try {
    users = await AdminAPI.getUsers(accessToken);
  } catch (error) {
    redirect('/login');
  }

  return (
    <main className={styles.main}>
      <Typography variant="headline/heavy/small" component="h1">
        Application Review
      </Typography>
      <ReviewDashboard users={users} />
    </main>
  );
}
