import { FAQ_QUESTIONS, TIMELINE } from '@/config';
import styles from './page.module.scss';
import Dashboard from '@/components/Dashboard';
import { UserAPI } from '@/lib/api';
import { redirect } from 'next/navigation';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';
import { getCurrentUser } from './api/getCurrentUser/route';

export default async function Home() {
  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);

  try {
    const response = await getCurrentUser(accessToken);
    const fetchedUser = response.user;
    return (
      <main className={styles.main}>
        <Dashboard faq={FAQ_QUESTIONS} timeline={TIMELINE} user={fetchedUser} />
      </main>
    );
  } catch (error) {
    console.error(error);
    redirect('/login');
  }
}
