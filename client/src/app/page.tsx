import { FAQ_QUESTIONS, TIMELINE } from '@/config';
import styles from './page.module.scss';
import Dashboard from '@/components/Dashboard';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { UserAPI } from '@/lib/api';
import { redirect } from 'next/navigation';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';

export default async function Home() {
  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);

  if (!accessToken) {
    console.log('Dashboard broke: access token undefined');
    redirect('/login');
  }

  // Check if user is admin, display admin_dashboard if true
  const isAdmin = true;

  try {
    const fetchedUser = await UserAPI.getCurrentUser(accessToken);
    return (
      <main className={styles.main}>
        {isAdmin ? (
          <AdminDashboard timeline={TIMELINE} user={fetchedUser} />
        ) : (
          <Dashboard faq={FAQ_QUESTIONS} timeline={TIMELINE} user={fetchedUser} />
        )}
      </main>
    );
  } catch (error) {
    console.log('Dashboard broke: error in fetching');
    redirect('/login');
  }
}
